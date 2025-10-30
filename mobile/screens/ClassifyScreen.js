import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { pestAPI } from '../services/api';

export default function ClassifyScreen({ navigation }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleCameraCapture = () => {
    navigation.navigate('Camera', {
      onCapture: (uri) => {
        setSelectedImage(uri);
        setResult(null);
      },
    });
  };

  const handleGalleryPick = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permission.granted === false) {
        Alert.alert(
          'Permission Required',
          'Please grant permission to access your photo library.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setResult(null);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select or capture an image first.');
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await pestAPI.classifyPest(selectedImage);
      
      if (response.success && response.data) {
        setResult(response.data);
        
        if (!response.data.is_pest) {
          Alert.alert(
            'Not a Pest',
            response.data.message || 'This image does not appear to contain a pest.'
          );
        }
      } else {
        Alert.alert('Error', response.error || 'Failed to analyze image. Please try again.');
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      Alert.alert('Error', 'Failed to connect to the server. Please make sure the backend is running.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setResult(null);
  };

  const viewPestDetails = () => {
    if (result && result.is_pest) {
      // Navigate to pest detail screen
      navigation.navigate('PestDetail', {
        pestName: result.class_name,
        infoUrl: result.info_url,
      });
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>AI Pest Detection</Text>
        <Text style={styles.subtitle}>
          Identify pests instantly using your device's camera
        </Text>
      </View>

      {/* Tips */}
      <View style={styles.tipsSection}>
        <Text style={styles.tipsTitle}>Tips for Best Results:</Text>
        <View style={styles.tipsGrid}>
          {[
            { icon: 'sunny', text: 'Good lighting' },
            { icon: 'resize', text: 'Close-up photo' },
            { icon: 'eye', text: 'Clear focus' },
            { icon: 'camera', text: 'Steady shot' },
          ].map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <Ionicons name={tip.icon} size={20} color="#059669" />
              <Text style={styles.tipText}>{tip.text}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Image Selection */}
      {!selectedImage ? (
        <View style={styles.uploadSection}>
          <View style={styles.uploadCard}>
            <Ionicons name="cloud-upload-outline" size={80} color="#9ca3af" />
            <Text style={styles.uploadTitle}>Select or Capture Image</Text>
            <Text style={styles.uploadDescription}>
              Choose from your gallery or take a new photo
            </Text>
            
            <View style={styles.uploadButtons}>
              <TouchableOpacity
                style={styles.cameraButton}
                onPress={handleCameraCapture}
              >
                <Ionicons name="camera" size={24} color="#ffffff" />
                <Text style={styles.cameraButtonText}>Take Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.galleryButton}
                onPress={handleGalleryPick}
              >
                <Ionicons name="images" size={24} color="#059669" />
                <Text style={styles.galleryButtonText}>Choose from Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.imageSection}>
          <View style={styles.imageCard}>
            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            
            {!result && !isAnalyzing && (
              <View style={styles.imageActions}>
                <TouchableOpacity
                  style={styles.analyzeButton}
                  onPress={analyzeImage}
                >
                  <Ionicons name="flash" size={20} color="#ffffff" />
                  <Text style={styles.analyzeButtonText}>Analyze Image</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={resetAnalysis}
                >
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  <Text style={styles.resetButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Loading */}
      {isAnalyzing && (
        <View style={styles.loadingSection}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>Analyzing with AI...</Text>
          <Text style={styles.loadingSubtext}>This may take a moment</Text>
        </View>
      )}

      {/* Results */}
      {result && result.is_pest && (
        <View style={styles.resultSection}>
          <View style={styles.resultCard}>
            <View style={styles.resultHeader}>
              <Ionicons name="checkmark-circle" size={48} color="#10b981" />
              <Text style={styles.resultTitle}>Pest Detected!</Text>
            </View>
            
            <View style={styles.resultContent}>
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Pest Name:</Text>
                <Text style={styles.resultValue}>{result.class_name}</Text>
              </View>
              
              <View style={styles.resultRow}>
                <Text style={styles.resultLabel}>Confidence:</Text>
                <Text style={styles.resultValue}>{result.confidence}</Text>
              </View>
              
              {result.is_new && (
                <View style={styles.newPestBadge}>
                  <Ionicons name="sparkles" size={16} color="#f59e0b" />
                  <Text style={styles.newPestText}>AI-Generated Information</Text>
                </View>
              )}
              
              <Text style={styles.resultMessage}>{result.message}</Text>
            </View>
            
            <TouchableOpacity
              style={styles.detailButton}
              onPress={viewPestDetails}
            >
              <Text style={styles.detailButtonText}>View Full Information</Text>
              <Ionicons name="arrow-forward" size={20} color="#ffffff" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.analyzeAnotherButton}
              onPress={resetAnalysis}
            >
              <Ionicons name="camera-outline" size={20} color="#059669" />
              <Text style={styles.analyzeAnotherText}>Analyze Another</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  tipsSection: {
    padding: 20,
    backgroundColor: '#ffffff',
    marginTop: 10,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 15,
  },
  tipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
  },
  tipText: {
    fontSize: 13,
    color: '#047857',
    fontWeight: '500',
  },
  uploadSection: {
    padding: 20,
  },
  uploadCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
  },
  uploadTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 20,
  },
  uploadDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  uploadButtons: {
    width: '100%',
    marginTop: 30,
    gap: 12,
  },
  cameraButton: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
  },
  cameraButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  galleryButton: {
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
  },
  galleryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  imageSection: {
    padding: 20,
  },
  imageCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  previewImage: {
    width: '100%',
    height: 300,
    resizeMode: 'cover',
  },
  imageActions: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  analyzeButton: {
    flex: 1,
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
    gap: 8,
  },
  analyzeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ef4444',
    gap: 8,
  },
  resetButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ef4444',
  },
  loadingSection: {
    padding: 40,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 20,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  resultSection: {
    padding: 20,
  },
  resultCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  resultHeader: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 12,
  },
  resultContent: {
    marginTop: 20,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  resultLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  resultValue: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '600',
  },
  newPestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    marginTop: 15,
  },
  newPestText: {
    fontSize: 12,
    color: '#92400e',
    fontWeight: '600',
  },
  resultMessage: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '500',
    marginTop: 15,
    textAlign: 'center',
  },
  detailButton: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
    gap: 8,
  },
  detailButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  analyzeAnotherButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 12,
    gap: 8,
  },
  analyzeAnotherText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#059669',
  },
});


