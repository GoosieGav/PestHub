# PEST-Hub: AI-Powered Agricultural Pest Detection

PEST-Hub is an advanced web application that uses deep learning to identify and provide management recommendations for agricultural pests. Built with PyTorch and Flask, it offers real-time pest detection and comprehensive pest management information.

## Overview
<img src="readMeImages/PestHubPhoto.png" alt="PestHub Home Page" width="800"/>

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

