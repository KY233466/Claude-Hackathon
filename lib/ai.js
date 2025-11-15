/**
 * AI Module - Gemini API Integration
 * Includes image recognition and semantic search functionality
 */

import {
  GEMINI_API_KEY,
  GEMINI_API_BASE,
  MODEL_VISION,
  MODEL_TEXT,
} from './config.js';

/**
 * Fetch function with retry mechanism
 * @param {string} url - Request URL
 * @param {Object} options - fetch options
 * @param {number} maxRetries - Maximum retry attempts, default 3
 * @returns {Promise<Response>}
 */
async function fetchWithRetry(url, options, maxRetries = 3) {
  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // Don't retry on client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        return response;
      }

      // Return response if successful or max retries reached
      if (response.ok || attempt === maxRetries) {
        return response;
      }

      // Server error (5xx), log and retry
      console.warn(`Request failed (${response.status}), retry attempt ${attempt + 1}...`);
      lastError = new Error(`Server error: ${response.status}`);

    } catch (error) {
      // Network error, log and retry
      console.warn(`Network error, retry attempt ${attempt + 1}:`, error.message);
      lastError = error;

      // Throw error if max retries reached
      if (attempt === maxRetries) {
        throw error;
      }
    }

    // Exponential backoff: wait 2^attempt seconds
    if (attempt < maxRetries) {
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Request failed');
}

/**
 * Analyze item image
 * @param {string} base64Image - base64 encoded image data
 * @param {string} mimeType - Image type, e.g., 'image/jpeg' or 'image/png'
 * @param {string} note - User note (optional)
 * @returns {Promise<Object>} Item information object
 */
export async function analyzeItem(base64Image, mimeType = 'image/jpeg', note = '') {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API Key not configured');
  }

  try {
    const url = `${GEMINI_API_BASE}/${MODEL_VISION}:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `You are an inventory intake assistant. Identify the item in the image and generate a structured record.

Output strictly in the following JSON format (no prices, donor information, or marketing language):

{
  "name": "Item name (e.g., Laptop Computer)",
  "category": "Category > Subcategory (e.g., Electronics > Computers)",
  "condition": "Good / Fair / Worn",
  "summary": "Objective description (1-2 sentences)",
  "keywords": ["search", "keywords", "in", "english"]
}

Note: ${note || 'None'}`;

    const response = await fetchWithRetry(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
              {
                inline_data: {
                  mime_type: mimeType,
                  data: base64Image,
                },
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 8192,
        },
      }),
    }, 2); // Image recognition: retry 2 times

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message || `Image recognition failed (${response.status})`
      );
    }

    const data = await response.json();

    // Detailed logging: view response structure
    console.log('📦 Gemini API full response:', JSON.stringify(data, null, 2));

    // Gemini response format: data.candidates[0].content.parts[0].text
    if (!data.candidates || data.candidates.length === 0) {
      console.error('❌ No candidates:', data);
      throw new Error('Gemini API response format error: no candidates');
    }

    const candidate = data.candidates[0];
    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      console.error('❌ Candidate structure error:', candidate);
      throw new Error('Gemini API response format error: candidate missing content.parts');
    }

    const resultText = candidate.content.parts[0].text;
    if (!resultText) {
      console.error('❌ No text field:', candidate.content.parts[0]);
      throw new Error('Gemini API response format error: no text content');
    }

    console.log('✅ Extracted text:', resultText);

    // Extract JSON object (handle potential markdown code blocks)
    let jsonText = resultText.trim();
    if (jsonText.includes('```json')) {
      jsonText = jsonText.split('```json')[1].split('```')[0].trim();
    } else if (jsonText.includes('```')) {
      jsonText = jsonText.split('```')[1].split('```')[0].trim();
    }

    const itemData = JSON.parse(jsonText);

    // Add timestamp and ID
    return {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...itemData,
    };
  } catch (error) {
    console.error('analyzeItem error:', error);
    throw error;
  }
}

/**
 * Semantic search for items
 * @param {string} query - User's natural language query
 * @param {Array} inventory - Inventory items array
 * @returns {Promise<Array>} Matched items list (sorted by relevance)
 */
export async function semanticSearch(query, inventory) {
  if (!GEMINI_API_KEY) {
    throw new Error('Gemini API Key not configured');
  }

  if (!query || !query.trim()) {
    throw new Error('Search query cannot be empty');
  }

  if (!inventory || inventory.length === 0) {
    return [];
  }

  try {
    const url = `${GEMINI_API_BASE}/${MODEL_TEXT}:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `You are an inventory search assistant for Ithaca ReUse Center (Semantic Search).

This is an internal tool for a community sustainability project, not an e-commerce platform.

⚠️ Strictly prohibited:
- Any prices, valuations, or transaction information
- Donor/buyer information or contact details
- Match percentages, recommendation algorithm language (e.g., "hot sale", "for you", "related items")
- Creating items that don't exist in inventory
- Commercial recommendation language or e-commerce marketing copy

【Task】
Users (customers/volunteers) describe their needs in natural language. You need to find the most relevant items from inventory.
Provide an independent match reason for each matched item.

【Output Format】
Output strictly in the following JSON format:

{
  "matches": [
    {
      "id": "ID of best matching item (from inventory)",
      "reason": "Specific match reason for this item (1-2 sentences in English)",
      "isTopMatch": true
    },
    {
      "id": "Alternative item ID 1",
      "reason": "Specific match reason for this item (1-2 sentences in English)",
      "isTopMatch": false
    },
    {
      "id": "Alternative item ID 2",
      "reason": "Specific match reason for this item (1-2 sentences in English)",
      "isTopMatch": false
    }
  ]
}

【Reason Style Examples】
"This stuffed bear is soft and comfortable, suitable for children ages 3-6, matching your search for kids' toys."
"This building block set can develop children's hands-on skills and is also great for young kids to play with."
(Natural, friendly, community-oriented style - each item has a unique match explanation)

【Available Inventory】
${JSON.stringify(inventory)}

【User Search】
${query}`;

    const response = await fetchWithRetry(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 8192,
        },
      }),
    }, 3); // Search: retry 3 times

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error?.message || `Search failed (${response.status})`
      );
    }

    const data = await response.json();

    // Detailed logging: view response structure
    console.log('📦 Gemini Search API response:', JSON.stringify(data, null, 2));

    // Gemini response format
    if (!data.candidates || data.candidates.length === 0) {
      console.error('❌ Search has no candidates:', data);
      throw new Error('Gemini API response format error: no candidates');
    }

    const candidate = data.candidates[0];
    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
      console.error('❌ Search candidate structure error:', candidate);
      throw new Error('Gemini API response format error: candidate missing content.parts');
    }

    const resultText = candidate.content.parts[0].text;
    if (!resultText) {
      console.error('❌ Search has no text field:', candidate.content.parts[0]);
      throw new Error('Gemini API response format error: no text content');
    }

    console.log('✅ Search extracted text:', resultText);

    // Extract JSON array
    let jsonText = resultText.trim();
    if (jsonText.includes('```json')) {
      jsonText = jsonText.split('```json')[1].split('```')[0].trim();
    } else if (jsonText.includes('```')) {
      jsonText = jsonText.split('```')[1].split('```')[0].trim();
    }

    const searchResult = JSON.parse(jsonText);

    // Build results array: based on new matches format
    const results = [];

    // Process matches array (each item has independent reason)
    if (searchResult.matches && Array.isArray(searchResult.matches)) {
      searchResult.matches.forEach(match => {
        const item = inventory.find((i) => i.id === match.id);
        if (item) {
          results.push({
            ...item,
            matchReason: match.reason, // Each item's independent match reason
            isTopMatch: match.isTopMatch || false,
          });
        }
      });
    }

    return results;
  } catch (error) {
    console.error('semanticSearch error:', error);
    throw error;
  }
}

/**
 * Test function - Check if API Key is configured correctly
 * @returns {Promise<boolean>}
 */
export async function testAPIKey() {
  if (!GEMINI_API_KEY) {
    return false;
  }

  try {
    const url = `${GEMINI_API_BASE}/${MODEL_TEXT}:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetchWithRetry(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: 'Hi',
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 10,
        },
      }),
    }, 2); // API Key test: retry 2 times

    return response.ok;
  } catch (error) {
    console.error('API Key test failed:', error);
    return false;
  }
}
