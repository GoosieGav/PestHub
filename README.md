# PEST-Hub: AI-Powered Agricultural Pest Detection

PEST-Hub is an advanced web application that uses deep learning to identify and provide management recommendations for agricultural pests. Built with PyTorch and Flask, it offers real-time pest detection and comprehensive pest management information.

## Installation and Setup

Follow these steps to set up and run PEST-Hub on your local machine:

### Prerequisites
- Python 3.9+ installed
- Git
- Pip package manager

### Setup Instructions

1. **Clone the repository**
   ```
   git clone https://github.com/yourusername/PestHub.git
   cd PestHub
   ```

2. **Directory Structure**
   
   The repository includes the following important directories:
   
   ```
   PestHub/
   ├── public_assets/          # Public static assets (included in repository)
   │   ├── images/
   │   │   ├── pests/          # Images of pests used in UI
   │   │   ├── ui/             # UI elements and diagrams
   │   │   └── damage/         # Pest damage images
   ├── templates/              # HTML templates
   ├── app.py                  # Main Flask application
   ├── cnn_model.py            # CNN model definition
   └── requirements.txt        # Python dependencies
   ```
   
   You will need to create the following directories that are excluded from the repository:
   
   ```
   PestHub/
   ├── data/                   # Training data (excluded from repository)
   │   ├── Ants/               # Images of ants for training
   │   ├── Bees/               # Images of bees for training
   │   ├── Beetles/            # Images of beetles for training
   │   ├── Caterpillars/       # Images of caterpillars for training
   │   ├── Earthworms/         # Images of earthworms for training
   │   ├── Earwigs/            # Images of earwigs for training
   │   ├── Grasshoppers/       # Images of grasshoppers for training
   │   ├── Moths/              # Images of moths for training
   │   ├── Slugs/              # Images of slugs for training
   │   ├── Snails/             # Images of snails for training
   │   ├── Wasps/              # Images of wasps for training
   │   └── Weevils/            # Images of weevils for training
   ├── static/                 # Static files (excluded from repository)
   ```

   Create the necessary directories:
   ```
   mkdir -p data static/images
   ```

3. **Set up the data directory structure**
   
   The application requires a specific dataset structure for the CNN model:

   The data can be downloaded [here](https://www.kaggle.com/datasets/vencerlanz09/agricultural-pests-image-dataset).
   
   ```
   data/
   ├── Ants/          # Images of ants
   ├── Bees/          # Images of bees
   ├── Beetles/       # Images of beetles
   ├── Caterpillars/  # Images of caterpillars
   ├── Earthworms/    # Images of earthworms
   ├── Earwigs/       # Images of earwigs
   ├── Grasshoppers/  # Images of grasshoppers
   ├── Moths/         # Images of moths
   ├── Slugs/         # Images of slugs
   ├── Snails/        # Images of snails
   ├── Wasps/         # Images of wasps
   └── Weevils/       # Images of weevils
   ```

   Each directory should contain images of the corresponding pest type (.jpg or .png format).

4. **Download or train the model**

   The model file `best_model.pth` is needed but not included in the repository due to its size.
   
   Option A: **Train your own model**
   - Populate the data directory with images as described above
   - Run the training notebook:
     ```
     jupyter notebook cnn_model.ipynb
     ```
   - Execute all cells to train the model and generate `best_model.pth`
   
   Option B: **Download a pre-trained model**
   - Download a pre-trained model 
   - Place the downloaded `best_model.pth` in the project root directory

5. **Set up virtual environment and install dependencies**
   ```
   # Run the setup script (Unix/Mac)
   chmod +x setup.sh
   ./setup.sh
   
   # OR set up manually (Windows/Other)
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

6. **Run the application**
   ```
   source venv/bin/activate  # Activate virtual environment if not already active
   python app.py
   ```

7. **Access the application**
   Open your browser and navigate to `http://127.0.0.1:8000`

### Troubleshooting

- If you encounter a "Model not found" error, ensure `best_model.pth` is in the root directory
- For image processing issues, check that you have Pillow installed correctly
- If the static files aren't loading, make sure the `static` directory exists and has proper permissions
- If port 5000 is in use (common on macOS with AirPlay), the app now runs on port 8000

## Application Pages

### Home Page
<img src="readMeImages/PestHubPhoto.png" alt="PestHub Home Page" width="800"/>

### Classification Tool
<img src="readMeImages/ClassificationDemo.png" alt="Classification Interface" width="800"/>

### Classification Demo
<img src="readMeImages/DetectionExample.png" alt="Pest Classification Example" width="800"/>

### Pest Directory
<img src="readMeImages/PestDirectory.png" alt="Pest Directory" width="800"/>

### Individual Pest Information
<img src="readMeImages/PestInfo.png" alt="Pest Information Page" width="800"/>

## Technical Architecture

### About Page
<img src="readMeImages/AboutPage.png" alt="Model Accuracy Graph" width="600"/>

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
   - Integration with PyTorch model backend
   - Treatment recommendations based on detection

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
   - PyTorch model integration
   - Image processing pipeline
   - RESTful API endpoints
   - Error handling middleware

3. **Model Architecture**
   - Convolutional Neural Network (CNN)
   - Real-time classification
   - Transfer learning implementation
   - High-accuracy predictions
   - Continuous learning capabilities

### Key Features Implementation

- **Image Processing Pipeline**
  - Client-side image preview
  - Server-side validation
  - PyTorch model inference
  - Result caching system

- **Dynamic UI Components**
  - Responsive navigation
  - Loading animations
  - Error handling
  - Success notifications

## Technology Stack

- **Backend**: Python, Flask
- **ML Framework**: PyTorch
- **Frontend**: HTML, CSS, JavaScript
- **Model Architecture**: CNN

## Authors

- Gavin Luo (@GoosieGav), Zain Saquer (@ZAJMS1)

## Achievement
This project won first place at the Missouri Technology Student Association competition in the "Software Development" event.

