# PestHub Mobile

React Native mobile application for AI-powered pest detection with camera integration.

## Features

- 📷 **Camera Integration**: Take photos directly with your device camera
- 🖼️ **Gallery Support**: Select existing images from your photo library
- 🤖 **AI Detection**: Real-time pest identification using Gemini AI
- 📚 **Pest Directory**: Browse comprehensive pest information
- 🔍 **Custom Search**: Search for any pest by name
- 📱 **Native Mobile Experience**: Optimized for iOS and Android
- ⚡ **Expo SDK 54**: Built with the latest Expo framework

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator
- For physical devices: Expo Go app

## Installation

### 1. Install Dependencies

```bash
cd mobile
npm install
```

or with yarn:

```bash
cd mobile
yarn install
```

### 2. Configure Backend URL

Edit `services/api.js` and update the `API_BASE_URL`:

```javascript
// For iOS Simulator
const API_BASE_URL = 'http://localhost:8000';

// For Android Emulator
const API_BASE_URL = 'http://10.0.2.2:8000';

// For Physical Device (replace with your computer's local IP)
const API_BASE_URL = 'http://YOUR_COMPUTER_IP:8000';
```

To find your computer's IP:
- **Mac/Linux**: Run `ifconfig | grep "inet " | grep -v 127.0.0.1`
- **Windows**: Run `ipconfig` and look for IPv4 Address

### 3. Start Backend Server

Make sure the Flask backend is running on your computer:

```bash
cd ..
source venv/bin/activate  # On Windows: venv\Scripts\activate
python app.py
```

The backend should be running on `http://127.0.0.1:8000`

### 4. Start Metro Bundler

```bash
npm start
```

## Running the App

### iOS Simulator (Mac only)

```bash
npm run ios
```

Or press `i` in the Metro Bundler terminal

### Android Emulator

```bash
npm run android
```

Or press `a` in the Metro Bundler terminal

### Physical Device

1. Install [Expo Go](https://expo.dev/client) on your device
2. Scan the QR code displayed in the terminal or Metro Bundler
3. Make sure your device is on the same WiFi network as your computer

## Project Structure

```
mobile/
├── App.js                 # Main app entry with navigation
├── app.json              # Expo configuration
├── package.json          # Dependencies
│
├── screens/              # All app screens
│   ├── HomeScreen.js
│   ├── ClassifyScreen.js
│   ├── CameraScreen.js
│   ├── DirectoryScreen.js
│   ├── AboutScreen.js
│   └── PestDetailScreen.js
│
├── services/             # API services
│   └── api.js           # Backend API integration
│
└── data/                # Static data
    └── pests.js        # Pest information
```

## Key Components

### Camera Integration

The app uses `expo-camera` for native camera access:
- Real-time photo capture
- Front/back camera switching
- Visual guides for optimal pest photos
- Permission handling

### Image Classification

Images are sent to the Flask backend for processing:
1. User captures/selects image
2. Image is sent to `/predict` endpoint
3. Backend uses Gemini AI for identification
4. Results displayed with confidence scores

### Custom Pest Search

Text-based search for any pest:
- Connects to `/search_pest` endpoint
- Gemini AI verifies if input is a pest
- Generates complete information pages
- Works for agricultural, household, and garden pests

## Permissions

The app requires the following permissions:

**iOS:**
- Camera access (NSCameraUsageDescription)
- Photo library access (NSPhotoLibraryUsageDescription)

**Android:**
- CAMERA
- READ_EXTERNAL_STORAGE
- WRITE_EXTERNAL_STORAGE

Permissions are requested at runtime when needed.

## API Endpoints

The mobile app connects to these Flask backend endpoints:

- `POST /predict` - Classify pest from image
- `POST /search_pest` - Search for pest by name
- `GET /pest/{pest_name}` - Get pest details

## Troubleshooting

### Cannot connect to backend

1. Verify backend is running: `curl http://localhost:8000`
2. Check firewall settings
3. Ensure correct IP address in `services/api.js`
4. For physical devices, disable VPN

### Camera not working

1. Check app permissions in device settings
2. Restart the Expo Go app
3. Try rebuilding with `npm start --clear`

### Metro Bundler issues

```bash
# Clear cache and restart
npm start --clear
```

## Building for Production

### iOS (requires Apple Developer account)

```bash
eas build --platform ios
```

### Android

```bash
eas build --platform android
```

## Technology Stack

- **React Native**: Cross-platform mobile framework
- **Expo SDK 54**: Development platform
- **Expo Camera**: Native camera integration
- **Expo Image Picker**: Photo library access
- **React Navigation**: Navigation library
- **Axios**: HTTP client for API calls
- **Vector Icons**: Icon library

## Development

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web (limited functionality)
npm run web
```

## Notes

- Camera features are mobile-exclusive (not available on web)
- Backend must be accessible from the device
- First launch may take longer for dependency installation
- Physical devices provide better camera quality than simulators

## Support

For issues or questions:
1. Check that backend is running
2. Verify API URL configuration
3. Review permissions in device settings
4. Check Expo logs for errors

## License

Same as PestHub main project


