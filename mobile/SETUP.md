# PestHub Mobile - Quick Setup Guide

## Step-by-Step Installation

### 1. Install Node.js and Expo CLI

```bash
# Install Node.js (if not already installed)
# Download from: https://nodejs.org/

# Install Expo CLI globally
npm install -g expo-cli
```

### 2. Install Project Dependencies

```bash
cd /Users/zainsaquer/Desktop/PestHub/mobile
npm install
```

This will install all required packages including:
- React Native
- Expo SDK 54
- Expo Camera
- Expo Image Picker
- React Navigation
- Axios

### 3. Configure Backend Connection

Before running the app, you need to configure the API URL based on your setup:

#### Option A: Testing on Simulator/Emulator

Edit `services/api.js`:

```javascript
// For iOS Simulator
const API_BASE_URL = 'http://localhost:8000';

// For Android Emulator
const API_BASE_URL = 'http://10.0.2.2:8000';
```

#### Option B: Testing on Physical Device

1. Find your computer's local IP address:
   
   **Mac/Linux:**
   ```bash
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```
   
   **Windows:**
   ```bash
   ipconfig
   ```
   Look for "IPv4 Address" (e.g., 192.168.1.100)

2. Edit `services/api.js`:
   ```javascript
   const API_BASE_URL = 'http://192.168.1.100:8000';
   // Replace with your actual IP
   ```

3. Make sure your phone and computer are on the same WiFi network

### 4. Start the Backend Server

In a separate terminal, start the Flask backend:

```bash
cd /Users/zainsaquer/Desktop/PestHub
source venv/bin/activate  # On Windows: venv\Scripts\activate
python app.py
```

Verify it's running by visiting: http://localhost:8000

### 5. Create App Icons (Optional)

The app expects these icon files in the `assets/` folder:
- `icon.png` (1024x1024) - App icon
- `splash.png` (1284x2778) - Splash screen
- `adaptive-icon.png` (1024x1024) - Android adaptive icon
- `favicon.png` (48x48) - Web favicon

You can use the existing PestHub logo or create new ones. If missing, default Expo icons will be used.

### 6. Start the Mobile App

```bash
cd /Users/zainsaquer/Desktop/PestHub/mobile
npm start
```

This will:
- Start the Metro Bundler
- Display a QR code
- Open in your browser

### 7. Run on Device/Simulator

Choose one of these options:

#### iOS Simulator (Mac only)
```bash
npm run ios
```
Or press `i` in the terminal

#### Android Emulator
```bash
npm run android
```
Or press `a` in the terminal

#### Physical Device
1. Install **Expo Go** from App Store (iOS) or Play Store (Android)
2. Scan the QR code shown in the terminal
3. The app will load automatically

## Testing the App

### Test Camera Functionality
1. Open the app
2. Navigate to "Classify" tab
3. Tap "Take Photo"
4. Grant camera permission
5. Take a photo of a pest or plant
6. Tap "Analyze Image"

### Test Custom Search
1. Navigate to "Directory" tab
2. Tap "Custom Search"
3. Enter a pest name (e.g., "mosquitoes")
4. View the AI-generated results

### Test Image Upload
1. Navigate to "Classify" tab
2. Tap "Choose from Gallery"
3. Select an existing image
4. Analyze the image

## Common Issues & Solutions

### Issue: "Cannot connect to server"

**Solution:**
1. Verify backend is running: `curl http://localhost:8000`
2. Check API_BASE_URL in `services/api.js`
3. For physical device, verify same WiFi network
4. Disable VPN on your device

### Issue: "Camera permission denied"

**Solution:**
1. Go to device Settings
2. Find PestHub or Expo Go
3. Enable Camera permission
4. Restart the app

### Issue: "Metro Bundler not starting"

**Solution:**
```bash
# Clear cache and restart
rm -rf node_modules
npm install
npm start --clear
```

### Issue: "Expo Go not connecting"

**Solution:**
1. Ensure phone and computer are on same WiFi
2. Disable firewall temporarily
3. Try manually entering the URL in Expo Go
4. Restart Metro Bundler

## Development Tips

### Hot Reloading
- Changes to JS files reload automatically
- Shake device or press `r` to manually reload

### Debugging
- Shake device and select "Debug JS Remotely"
- Use Chrome DevTools for debugging
- View logs in Metro Bundler terminal

### Clear Cache
```bash
npm start --clear
```

### Update Expo
```bash
npm install expo@latest
```

## File Structure Quick Reference

```
mobile/
├── App.js                    # Main app entry
├── app.json                  # Expo config
├── package.json              # Dependencies
├── screens/                  # All screens
│   ├── HomeScreen.js        # Landing page
│   ├── ClassifyScreen.js    # Image classification
│   ├── CameraScreen.js      # Camera interface
│   ├── DirectoryScreen.js   # Pest directory
│   ├── AboutScreen.js       # About page
│   └── PestDetailScreen.js  # Pest details
├── services/
│   └── api.js               # Backend API calls
└── data/
    └── pests.js             # Pest data
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure backend URL
3. ✅ Start backend server
4. ✅ Start mobile app
5. ✅ Test on simulator/device
6. ✅ Test camera functionality
7. ✅ Test pest classification
8. ✅ Test custom search

## Building for Production

When ready to create production builds:

### Install EAS CLI
```bash
npm install -g eas-cli
```

### Configure EAS
```bash
eas login
eas build:configure
```

### Build iOS
```bash
eas build --platform ios
```

### Build Android
```bash
eas build --platform android
```

## Support

If you encounter any issues:
1. Check this guide
2. Review the main README.md
3. Check Expo documentation: https://docs.expo.dev/
4. Review backend logs for API errors

Happy pest detecting! 🐛📱

