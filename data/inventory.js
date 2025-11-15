/**
 * Inventory Data Management - AsyncStorage Persistence Support
 */
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@ai_reuse_inventory';

// Default initial data
const defaultInventory = [
  {
    id: '1',
    name: "Children's Teddy Bear",
    category: 'Toys > Stuffed Animals',
    condition: 'Good',
    summary: 'Brown teddy bear, approximately 30cm tall, soft and comfortable, normal appearance',
    keywords: ['toys', 'children', 'teddy', 'plush', 'brown'],
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    name: "Children's Building Block Set",
    category: 'Toys > Educational Toys',
    condition: 'Good',
    summary: 'Compatible building block set, contains about 200 pieces, various colors, some parts have slight wear',
    keywords: ['toys', 'blocks', 'children', 'educational', 'building'],
    imageUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400',
    createdAt: '2024-01-14T14:20:00Z',
  },
  {
    id: '3',
    name: "Children's Picture Book",
    category: 'Books > Children\'s Books',
    condition: 'Good',
    summary: 'Hardcover picture book with clear color illustrations, complete pages with no damage',
    keywords: ['books', 'children', 'picture', 'reading', 'education'],
    imageUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    createdAt: '2024-01-13T09:15:00Z',
  },
  {
    id: '4',
    name: 'LED Desk Lamp',
    category: 'Home > Lighting',
    condition: 'Good',
    summary: 'White dimmable desk lamp, LED light source working normally, supports USB power',
    keywords: ['home', 'lamp', 'led', 'desk', 'study'],
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400',
    createdAt: '2024-01-12T16:45:00Z',
  },
  {
    id: '5',
    name: 'Student Backpack',
    category: 'School Supplies > Backpacks',
    condition: 'Fair',
    summary: 'Blue double-shoulder backpack, multiple compartments, slight signs of use, zippers working normally',
    keywords: ['backpack', 'school', 'student', 'blue', 'bag'],
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
    createdAt: '2024-01-11T11:00:00Z',
  },
];

/**
 * Load inventory data from AsyncStorage
 */
export async function loadInventory() {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
    // If no data exists, return default data and save it
    await saveInventory(defaultInventory);
    return defaultInventory;
  } catch (error) {
    console.error('Load inventory data failed:', error);
    return defaultInventory;
  }
}

/**
 * Save inventory data to AsyncStorage
 */
export async function saveInventory(inventory) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(inventory));
    return true;
  } catch (error) {
    console.error('Save inventory data failed:', error);
    return false;
  }
}

/**
 * Get all items
 */
export async function getAllItems() {
  return await loadInventory();
}

/**
 * Get item by ID
 */
export async function getItemById(id) {
  const inventory = await loadInventory();
  return inventory.find((item) => item.id === id);
}

/**
 * Get items by category
 */
export async function getItemsByCategory(category) {
  const inventory = await loadInventory();
  return inventory.filter((item) => item.category === category);
}

/**
 * Add new item to inventory
 */
export async function addItem(newItem) {
  const inventory = await loadInventory();
  const item = {
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    ...newItem,
  };
  inventory.push(item);
  await saveInventory(inventory);
  return item;
}

/**
 * Update item information
 */
export async function updateItem(id, updates) {
  const inventory = await loadInventory();
  const index = inventory.findIndex((item) => item.id === id);
  if (index !== -1) {
    inventory[index] = {
      ...inventory[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    await saveInventory(inventory);
    return inventory[index];
  }
  return null;
}

/**
 * Delete item
 */
export async function deleteItem(id) {
  const inventory = await loadInventory();
  const filtered = inventory.filter((item) => item.id !== id);
  await saveInventory(filtered);
  return filtered.length < inventory.length; // Return whether deletion was successful
}

/**
 * Get all categories
 */
export async function getAllCategories() {
  const inventory = await loadInventory();
  const categories = [...new Set(inventory.map((item) => item.category))];
  return categories;
}

/**
 * Clear all data (reset to default)
 */
export async function resetInventory() {
  await saveInventory(defaultInventory);
  return defaultInventory;
}

// Export default data for backwards compatibility (not recommended for direct use)
export default defaultInventory;
