# PEST-Hub: AI-Powered Agricultural Pest Detection

PEST-Hub is an advanced web application that uses deep learning to identify and provide management recommendations for agricultural pests. Built with PyTorch and Flask, it offers real-time pest detection and comprehensive pest management information.

![PEST-Hub Interface](static/PestHubPhoto.png)

## Demo Images
![Pest Detection Demo](static/demo1.png)
![Treatment Recommendations](static/demo2.png)
![Mobile Interface](static/mobile-demo.png)

## Features

- 🔍 Real-time pest detection using CNN
  ![Detection Example](static/detection-demo.png)
- 📚 Comprehensive pest information database
  ![Database Example](static/database-demo.png)
- 🌿 Organic and chemical treatment recommendations
- 📱 Responsive web interface
- 🤖 High-accuracy classification model

## Getting Started

### Prerequisites

- Python 3.13+
- pip package manager
- Virtual environment (recommended)
- Git LFS (for handling large files)
- At least 2GB free disk space

### Installation

1. Clone the repository (without downloading LFS files yet)
```bash
git clone --filter=blob:none https://github.com/YOUR_USERNAME/PEST-Hub.git
cd PEST-Hub
```

2. Selectively download only the required LFS files
```bash
git lfs install
git lfs pull --include "best_model.pth"
git lfs pull --include "static/images/*"
```

3. Set up the virtual environment and install dependencies
```bash
chmod +x setup.sh
./setup.sh
```

4. Run the application
```bash
flask run
```

The application will be available at `http://localhost:5000`

### Model Training

To train the pest detection model:

1. Download the training dataset (if not already included):
```bash
# Option 1: Download from our releases page
wget https://github.com/YOUR_USERNAME/PEST-Hub/releases/download/v1.0/training_data.zip
unzip training_data.zip -d data/

# Option 2: Use your own dataset
# Place your images in data/[pest_name]/ directories
```

2. Run the Jupyter notebook:
```bash
jupyter notebook cnn_model.ipynb
```

> Note: The training dataset is split into multiple smaller archives on the releases page to facilitate easier downloading and version control.

## Git Setup and Deployment

1. Initialize Git LFS (if not already done):
```bash
git lfs install
```

2. Configure your remote repository:
```bash
git remote add origin https://github.com/YOUR_USERNAME/PEST-Hub.git
```

3. Verify Git LFS is tracking the correct files:
```bash
git lfs status
```

4. Push to remote:
```bash
git push -u origin main
```

Note: Ensure you have [Git LFS](https://git-lfs.com) installed before pushing.

## Project Structure

```
PEST-Hub/
├── static/              # Static assets
├── templates/           # HTML templates
├── docs/               # Documentation
├── app.py              # Flask application
├── cnn_model.py        # CNN model definition
├── requirements.txt    # Python dependencies
└── setup.sh           # Setup script
```

## Technology Stack

- **Backend**: Python, Flask
- **ML Framework**: PyTorch
- **Frontend**: HTML, CSS, JavaScript
- **Model Architecture**: Convolutional Neural Network (CNN)

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Authors

- YOUR_NAME (@YOUR_USERNAME)

## Acknowledgments

- Advanced AI technology for pest identification
- PyTorch team for the deep learning framework
- Flask team for the web framework
