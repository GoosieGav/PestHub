#!/bin/bash

# Create virtual environment
python3.13 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Upgrade pip
pip install --upgrade pip

# Install requirements
pip install -r requirements.txt

# Add virtual environment to Jupyter kernels
pip install ipykernel
python -m ipykernel install --user --name=pest_classification
