# PEST-Hub: AI-Powered Agricultural Pest Detection

PEST-Hub is an advanced application that uses Google's Gemini AI to identify and provide management recommendations for agricultural pests. Built with Flask and Gemini API, it offers real-time pest detection and comprehensive pest management information.

## 📱 Platforms

- **Web Application**: Full-featured web interface (Flask + HTML/CSS/JS)
- **Mobile Application**: Native mobile app with camera integration (React Native + Expo SDK 54)
  - See the [`mobile/`](mobile/) directory for the React Native mobile app

## Installation and Setup

Follow these steps to set up and run PEST-Hub on your local machine:

### Prerequisites
- Python 3.9+ installed
- Git
- Pip package manager

### Setup Instructions

1. **Clone the repository**
   ```
   git clone https://github.com/GoosieGav/PestHub.git
   cd PestHub
   ```

2. **Directory Structure**
   
   The repository includes the following important directories:
   
   ```
   PestHub/
   ├── public_assets/          # Public static assets (included in repository)
   │   ├── images/
   │   │   ├── pests/          # Images of pests used in UI
   │   │   └── ui/             # UI elements and diagrams
   ├── templates/              # HTML templates
   ├── assets/css/             # CSS stylesheets
   ├── mobile/                 # React Native mobile application
   │   ├── screens/            # Mobile app screens
   │   ├── services/           # API integration
   │   └── data/               # Static data
   ├── app.py                  # Main Flask application
   ├── .env                    # Environment variables (GEMINI_API_KEY)
   └── requirements.txt        # Python dependencies
   ```
   
3. **Set up environment variables**
   
   Create a `.env` file in the project root with your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```
   
   You can obtain a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

4. **Set up virtual environment and install dependencies**
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

5. **Run the application**
   ```
   source venv/bin/activate  # Activate virtual environment if not already active
   python app.py
   ```

6. **Access the application**
   Open your browser and navigate to `http://127.0.0.1:8000`

### Troubleshooting

- If you encounter API errors, ensure your `GEMINI_API_KEY` is set correctly in the `.env` file
- For image processing issues, check that you have Pillow installed correctly
- The app runs on port 8000 by default
- Ensure you have an active internet connection for Gemini API calls

## 📱 Mobile App Setup (Optional)

The mobile application provides native iOS and Android apps with camera integration for on-the-go pest detection.

### Prerequisites

**The Flask backend must be running before starting the mobile app.**

1. **First, start the web server** (see steps 1-5 above)
   ```
   python app.py
   ```
   The server should be running on `http://127.0.0.1:8000`

2. **Install Expo Go** on your mobile device
   - iOS: Download from [App Store](https://apps.apple.com/app/expo-go/id982107779)
   - Android: Download from [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

3. **Install Node.js** (if not already installed)
   - Download from [nodejs.org](https://nodejs.org/)
   - Required for npm package manager

### Mobile Setup Steps

1. **Navigate to mobile directory**
   ```bash
   cd mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API URL**
   
   Create a `.env` file in the `mobile/` directory:
   ```bash
   EXPO_PUBLIC_API_BASE_URL=http://YOUR_COMPUTER_IP:8000
   ```
   
   **Finding your computer's IP address:**
   - **Mac/Linux**: Run `ifconfig | grep "inet " | grep -v 127.0.0.1` in terminal
   - **Windows**: Run `ipconfig` in command prompt and look for IPv4 Address
   - **Common format**: `192.168.x.x` or `10.0.x.x`
   
   Example `.env` file:
   ```
   EXPO_PUBLIC_API_BASE_URL=http://192.168.1.255:8000
   ```
   
   **Note**: 
   - For **physical devices**, use your computer's local IP address
   - For **iOS Simulator**, use `http://localhost:8000`
   - For **Android Emulator**, use `http://10.0.2.2:8000`

4. **Ensure network connectivity**
   - Make sure your **computer and mobile device are on the same WiFi network**
   - Check that your firewall allows connections on port 8000

5. **Start the mobile app**
   ```bash
   npm start
   ```
   Or use the clear cache option:
   ```bash
   npx expo start --clear
   ```

6. **Launch on device**
   - **iOS Simulator** (Mac only): Press `i` in terminal
   - **Android Emulator**: Press `a` in terminal
   - **Physical Device**: 
     - Open Expo Go app
     - Scan the QR code shown in terminal/browser
     - Wait for app to load


### Features

- ✅ **Native Camera**: Take photos directly with device camera (mobile exclusive)
- ✅ **Photo Library**: Select existing images from gallery
- ✅ **Real-time AI**: Instant pest identification via Flask backend
- ✅ **Custom Search**: Search any pest by name
- ✅ **Offline Directory**: Browse pest information
- ✅ **Cross-platform**: Works on iOS and Android


## Key Features

### 🚀 Dynamic Pest Detection
PEST-Hub goes beyond a fixed database of pests. Using advanced Gemini AI capabilities:

- **Identifies 12+ Default Pests**: Instantly recognizes common agricultural pests with pre-loaded information
- **Discovers Unknown Pests**: When encountering pests outside the default set, Gemini AI automatically:
  - Identifies the pest species and scientific name
  - Generates comprehensive pest information on-the-fly
  - Creates detailed treatment and prevention recommendations
  - Provides damage symptoms and organic/chemical solutions
  - Lists common species variants

- **AI-Generated Information Pages**: New pests receive full information pages just like the default 12, complete with:
  - Scientific classification
  - Detailed descriptions
  - Damage symptoms
  - Treatment methods (organic and chemical)
  - Prevention strategies
  - Common species information

This means the system can identify and provide actionable information for virtually any agricultural pest, making it truly adaptive to diverse farming needs.

## Application Architecture

### Pages and Components

1. **Home Page** (`/templates/home.html`)
   - Welcome interface with animated background
   - Benefits grid showcasing key features
   - Quick navigation to core functionalities
   - Responsive design with custom CSS animations

2. **Pest Classification** (`/templates/index.html`)
   - Real-time image upload and processing
   - Dynamic result display with confidence scores
   - AJAX-powered predictions without page reload
   - Integration with Gemini AI backend
   - Treatment recommendations based on detection
   - Adaptive detection for both known and unknown pests
   - Automatic information page generation for new pests

3. **Pest Directory** (`/templates/pest_directory.html`)
   - Grid layout of common agricultural pests
   - Detailed information cards for each pest
   - Search and filter functionality
   - Responsive card design with hover effects
   - Links to treatment recommendations

4. **About Model** (`/templates/about.html`)
   - Model performance metrics and graphs
   - System architecture explanation
   - Feature diagrams and technical specifications
   - Training methodology information

### Technical Components

1. **Frontend Structure**
   - Base template (`base.html`) with consistent navigation
   - Custom CSS variables for theming
   - Responsive design breakpoints
   - Font Awesome integration for icons
   - Dynamic content loading

2. **Backend Architecture**
   - Flask routing system
   - Google Gemini AI integration
   - Image processing pipeline
   - RESTful API endpoints
   - Error handling middleware

3. **AI Architecture**
   - Google Gemini 2.0 Flash model
   - Real-time multimodal classification
   - Vision and language understanding
   - High-accuracy predictions
   - Cloud-based inference
   - Dynamic information generation for unknown pests
   - Adaptive learning from new pest types

### Key Features Implementation

- **Image Processing Pipeline**
  - Client-side image preview
  - Server-side validation
  - Gemini AI inference
  - Real-time API communication

- **Dynamic UI Components**
  - Responsive navigation
  - Loading animations
  - Error handling
  - Success notifications

## Technology Stack

- **Backend**: Python, Flask
- **AI**: Google Gemini 2.0 Flash
- **Frontend**: HTML, CSS, JavaScript
- **Image Processing**: Pillow (PIL)

## Authors

- Gavin Luo (@GoosieGav), Zain Saquer (@ZAJMS1)

