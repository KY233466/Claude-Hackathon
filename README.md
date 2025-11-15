# AI ReUse Assistant

An AI-powered donated item management app built with Expo + React Native.

## 🎯 Features

- **📸 Image Recognition** - Automatically identify donated items using Gemini Vision API and generate item cards
- **🔍 Semantic Search** - Use natural language to describe your needs, AI intelligently matches items
- **💾 Inventory Management** - Save recognition results to local inventory
- **🎨 Modern UI** - Clean card-based design with shadows and rounded corners

## 📦 Tech Stack

- **Framework**: Expo SDK 50 + React Native 0.73.6
- **Navigation**: React Navigation (Stack Navigator)
- **AI**: Google Gemini API (Vision + Semantic Search)
- **Image Picker**: expo-image-picker

## 🚀 Quick Start

### 1. 🔑 Configure API Key

**To protect API security, you need to configure your own Gemini API Key:**

1. Open `lib/config.js` file
2. Replace `YOUR_API_KEY_HERE` with your Gemini API Key
3. Get free API Key: https://makersuite.google.com/app/apikey

```javascript
// lib/config.js
export const GEMINI_API_KEY = 'YOUR_API_KEY_HERE'; // Replace with your API key
```

⚠️ **Important**: API Keys are not committed to Git, configure with confidence

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

**⚠️ Important**: Due to Node.js v24 compatibility issues, you need to:

**Option 1: Install Watchman (Recommended)**
```bash
brew install watchman
npm start
```

**Option 2: Use Node.js 20**
```bash
nvm install 20
nvm use 20
npm start
```

See [FINAL_SOLUTION.md](FINAL_SOLUTION.md) for detailed setup instructions.

### 4. Test on Your Phone

- Install **Expo Go** app (iOS/Android)
- Scan the QR code displayed in terminal
- App will open in Expo Go

## 📁 Project Structure

```
/
├── App.js                  # Navigation container configuration
├── screens/
│   ├── HomeScreen.js       # Home screen
│   ├── ImageScreen.js      # Image recognition screen
│   ├── SearchScreen.js     # Semantic search screen
│   └── ItemDetailScreen.js # Item detail screen
├── lib/
│   ├── ai.js              # Gemini API integration
│   └── config.js          # API configuration
├── data/
│   ├── inventory.js       # Static inventory data (sample items)
│   └── README.md          # Data documentation
├── assets/                # App icons and static resources
├── app.json               # Expo configuration
└── package.json           # Dependencies
```

## 🎮 Usage Flow

### Image Recognition Flow
1. Tap "📸 Scan Donation Item" on home screen
2. Select image or take photo
3. Tap "🤖 Start Recognition"
4. View AI-generated item card (name, category, condition, description, tags)
5. Tap "💾 Save to Inventory"

### Semantic Search Flow
1. Tap "🔍 Search Items" on home screen
2. Enter natural language query (e.g., "toys suitable for kids")
3. Tap "🔍 Smart Search"
4. View matching results (with images, match reasons, tags)
5. Tap item card to view details

## 📝 Dependencies

```json
{
  "@react-navigation/native": "^6.1.9",
  "@react-navigation/stack": "^6.3.20",
  "expo": "~50.0.17",
  "expo-image-picker": "~14.7.1",
  "react": "18.2.0",
  "react-native": "0.73.6"
}
```

## ⚠️ Important Notes

1. **API Key Configuration**: Configure your own Gemini API Key in `lib/config.js`
2. **Network Connection**: Internet connection required for Gemini API calls and loading inventory images
3. **Permissions**: Camera and photo library permissions required on first use
4. **Free Tier Limits**: Gemini API free tier has rate limits (15 requests per minute)

## 🐛 Troubleshooting

### Q: Image recognition fails
**A:** Check:
1. Gemini API Key is valid and configured in `lib/config.js`
2. Network connection is working
3. Image was selected successfully (check console for errors)
4. Not exceeding Gemini free tier limits (15 requests/minute)

### Q: Search returns no results
**A:**
1. Ensure inventory has item data (`data/inventory.js`)
2. Try different search terms
3. Check network connection

### Q: How to replace with my own Gemini API Key?
**A:**
1. Visit https://makersuite.google.com/app/apikey to get free API Key
2. Open `lib/config.js` file
3. Replace the value of `GEMINI_API_KEY`

### Q: EMFILE: too many open files error
**A:** This is a Node.js v24 compatibility issue. Solutions:
1. Install Watchman: `brew install watchman`
2. Or use Node.js 20: `nvm use 20`
3. See [FINAL_SOLUTION.md](FINAL_SOLUTION.md) for details

## 🔒 Security

- API keys are not committed to Git
- See [SECURITY.md](SECURITY.md) for detailed security information
- `.gitignore` configured to protect sensitive data

## 📄 License

MIT License

## 👨‍💻 Developer

Built with Claude Code and Expo

## 📚 Additional Documentation

- [FINAL_SOLUTION.md](FINAL_SOLUTION.md) - Expo Go setup guide
- [README_SETUP.md](README_SETUP.md) - Environment configuration
- [SECURITY.md](SECURITY.md) - Security best practices
