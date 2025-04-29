# PEST-Hub CNN Model Documentation

## Model Architecture

The pest detection model uses a Convolutional Neural Network (CNN) architecture designed for high-accuracy pest classification. The model consists of:

- 4 convolutional layers with increasing filter sizes
- Max pooling layers for dimension reduction
- Dropout layers for regularization
- Dense layers for classification

### Layer Details

```python
CNN Architecture:
1. Conv2d(3, 64, kernel_size=3, padding=1)
2. ReLU + MaxPool2d
3. Conv2d(64, 128, kernel_size=3, padding=1)
4. ReLU + MaxPool2d
5. Conv2d(128, 256, kernel_size=3, padding=1)
6. ReLU + MaxPool2d
7. Conv2d(256, 512, kernel_size=3, padding=1)
8. ReLU + MaxPool2d
9. Dropout(0.5)
10. Linear(512 * 18 * 18, 512)
11. ReLU
12. Dropout(0.5)
13. Linear(512, num_classes)
```

## Training

The model is trained using:
- Cross-entropy loss
- Adam optimizer
- Learning rate: 0.0001
- Batch size: 32
- Early stopping with patience of 5 epochs

### Data Preprocessing

Images are preprocessed using:
- Resize to 300x300 pixels
- Normalization using ImageNet means and stds
- Data augmentation techniques

## Performance

The model achieves:
- High classification accuracy across 12 pest classes
- Real-time inference capability
- Robust performance on varied image qualities

## Deployment

The model is deployed using Flask and can be easily integrated into other applications through a REST API.

## Future Improvements

Planned enhancements include:
1. Transfer learning with modern architectures
2. Additional data augmentation techniques
3. Model quantization for faster inference
4. Multi-model ensemble approach
