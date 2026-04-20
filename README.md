# PEST-Hub: AI-Powered Creature & Pest Detection

PEST-Hub is a full-stack application that uses a locally-running Ollama vision model to identify agricultural pests, insects, animals, and other living creatures from images. It provides real-time classification with threat-level assessment and automatically generates detailed information profiles for any detected organism.

No API keys or internet connection required — all AI runs locally via Ollama.

## Platforms

- **Web Application**: Full-featured web interface (Flask + HTML/CSS/JS)
- **Mobile Application**: Native iOS/Android app with camera integration (React Native + Expo)
  - See the [`mobile/`](mobile/) directory

---

## Web App Setup

### Prerequisites

- Python 3.9+
- [Ollama](https://ollama.com) installed and running locally
- A vision-capable Ollama model pulled (e.g. `qwen2.5vl:7b`)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/GoosieGav/PestHub.git
   cd PestHub
   ```

2. **Pull the Ollama model**
   ```bash
   ollama pull qwen2.5vl:7b
   ```

3. **Create a virtual environment and install dependencies**
   ```bash
   python -m venv venv
   venv\Scripts\activate      # Windows
   # source venv/bin/activate  # Mac/Linux
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Open in browser**
   ```
   http://127.0.0.1:8000
   ```

### Troubleshooting

- Ensure Ollama is running (`ollama serve`) before starting the app
- The model name is set near the top of `app.py` — update `OLLAMA_MODEL` if you use a different model
- The app runs on port 8000 by default
- Supported image formats: JPG, PNG, WEBP, GIF, BMP (AVIF and other formats are rejected)

---

## Mobile App Setup

The mobile app connects to the Flask backend over your local network.

### Prerequisites

- Flask backend running (see above)
- Node.js installed
- [Expo Go](https://expo.dev/go) installed on your mobile device

### Steps

1. **Start the Flask backend first**
   ```bash
   python app.py
   ```

2. **Navigate to the mobile directory**
   ```bash
   cd mobile
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Configure the backend URL**

   Create `mobile/.env`:
   ```
   EXPO_PUBLIC_API_BASE_URL=http://YOUR_LOCAL_IP:8000
   ```

   Find your IP:
   - **Windows**: `ipconfig` → IPv4 Address
   - **Mac/Linux**: `ifconfig | grep "inet " | grep -v 127.0.0.1`

   Your computer and phone must be on the same Wi-Fi network.

5. **Start the Expo dev server**
   ```bash
   npx expo start
   ```

6. **Open on device**: Scan the QR code with Expo Go

---

## Features

### Detection

- **12 default agricultural pests** identified instantly with pre-loaded profiles: Ants, Bees, Beetles, Caterpillars, Earthworms, Earwigs, Grasshoppers, Moths, Slugs, Snails, Wasps, Weevils
- **Any other living creature** — insects, animals, birds, reptiles, humans — detected and classified via AI
- **Threat level assessment** for every detection: High / Medium / Low / None, based on agricultural impact
- **Three result types**: Pest Detected, Creature Detected (non-pest), No Creature Detected

### AI-Generated Profiles

When an organism outside the default 12 is detected, the app:
- Immediately returns the classification result
- Generates a full information profile in the background (name, scientific name, description, species, damage/concerns, treatment strategies, prevention tips)
- Shows a skeleton loading page that auto-refreshes when the profile is ready
- Stores the uploaded image alongside the generated profile

### Web Interface

- Drag-and-drop or file-picker image upload
- File type validation (blocks unsupported formats)
- Confidence score badge on results
- Skeleton loading UI during profile generation
- Pending page shows the uploaded image and known metadata immediately while the rest loads

### Mobile App

- Native camera capture and gallery picker
- Real-time AI classification via local backend
- Threat level display on results card
- Pest directory with offline browsing
- Cross-platform (iOS and Android)

---

## Project Structure

```
PestHub/
├── app.py                  # Flask application & Ollama integration
├── requirements.txt
├── templates/
│   ├── base.html
│   ├── index.html          # Classify page
│   ├── pest_info.html      # Pest/creature detail page (with skeleton loader)
│   ├── pest_directory.html
│   └── ...
├── assets/css/             # Stylesheets
├── public_assets/
│   └── images/
│       ├── pests/          # Default pest images
│       ├── damage/         # Damage example images
│       └── dynamic_pests/  # AI-generated organism images (gitignored)
└── mobile/                 # React Native app
    ├── screens/
    ├── services/api.js
    ├── pests.js
    └── .env                # EXPO_PUBLIC_API_BASE_URL (create locally)
```

---

## Technology Stack

| Layer | Technology |
|---|---|
| Backend | Python, Flask |
| AI / Vision | Ollama (local), qwen2.5vl:7b |
| Image Processing | Pillow (PIL) |
| Web Frontend | HTML, CSS, JavaScript |
| Mobile | React Native, Expo SDK 54 |

---

## Authors

Gavin Luo ([@GoosieGav](https://github.com/GoosieGav)), Zain Saquer ([@ZAJMS1](https://github.com/ZAJMS1))
