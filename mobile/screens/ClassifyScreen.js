import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { pestAPI } from '../services/api';
import { COLORS, GRADIENTS, SHADOWS, SPACING, FONTS } from '../theme';

const { width, height } = Dimensions.get('window');

// Animated Scanner Line
const ScannerLine = ({ isActive }) => {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isActive) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: 260,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <Animated.View style={[styles.scannerLine, { transform: [{ translateY }] }]}>
      <LinearGradient
        colors={['transparent', COLORS.primary, 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.scannerLineGradient}
      />
    </Animated.View>
  );
};

// Glass Card Component
const GlassCard = ({ children, style }) => (
  <BlurView intensity={20} tint="dark" style={[styles.glassCard, style]}>
    <LinearGradient
      colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.03)']}
      style={styles.glassGradient}
    >
      {children}
    </LinearGradient>
  </BlurView>
);

export default function ClassifyScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for upload area
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

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
      navigation.navigate('PestDetail', {
        pestName: result.class_name,
        infoUrl: result.info_url,
      });
    }
  };

  const tips = [
    { icon: 'sunny', text: 'Good lighting' },
    { icon: 'resize', text: 'Close-up shot' },
    { icon: 'eye', text: 'Clear focus' },
    { icon: 'camera', text: 'Steady hand' },
  ];

  return (
    <View style={styles.container}>
      {/* Background */}
      <LinearGradient
        colors={GRADIENTS.primary}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Glow Effects */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 20, paddingBottom: 120 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animated.View
          style={[
            styles.header,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.headerIcon}>
            <Ionicons name="scan" size={32} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>AI Pest Detection</Text>
          <Text style={styles.subtitle}>
            Identify pests instantly using advanced AI technology
          </Text>
        </Animated.View>

        {/* Tips Section */}
        <Animated.View
          style={[
            styles.tipsContainer,
            { opacity: fadeAnim },
          ]}
        >
          <Text style={styles.tipsTitle}>Tips for Best Results</Text>
          <View style={styles.tipsGrid}>
            {tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <View style={styles.tipIcon}>
                  <Ionicons name={tip.icon} size={18} color={COLORS.primary} />
                </View>
                <Text style={styles.tipText}>{tip.text}</Text>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Image Selection / Preview */}
        {!selectedImage ? (
          <Animated.View
            style={[
              styles.uploadSection,
              {
                opacity: fadeAnim,
                transform: [{ scale: pulseAnim }],
              },
            ]}
          >
            <GlassCard style={styles.uploadCard}>
              <View style={styles.uploadContent}>
                <View style={styles.uploadIconContainer}>
                  <LinearGradient
                    colors={['rgba(74, 222, 128, 0.2)', 'rgba(74, 222, 128, 0.05)']}
                    style={styles.uploadIconGlow}
                  />
                  <Ionicons name="cloud-upload" size={64} color={COLORS.textMuted} />
                </View>
                <Text style={styles.uploadTitle}>Select or Capture Image</Text>
                <Text style={styles.uploadDescription}>
                  Choose from your gallery or take a new photo
                </Text>

                <View style={styles.uploadButtons}>
                  <TouchableOpacity
                    style={styles.cameraButton}
                    activeOpacity={0.8}
                    onPress={handleCameraCapture}
                  >
                    <LinearGradient
                      colors={GRADIENTS.button}
                      style={styles.cameraButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Ionicons name="camera" size={24} color="#fff" />
                      <Text style={styles.cameraButtonText}>Take Photo</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.galleryButton}
                    activeOpacity={0.8}
                    onPress={handleGalleryPick}
                  >
                    <View style={styles.galleryButtonInner}>
                      <Ionicons name="images" size={22} color={COLORS.primary} />
                      <Text style={styles.galleryButtonText}>Choose from Gallery</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </GlassCard>
          </Animated.View>
        ) : (
          <Animated.View
            style={[
              styles.imageSection,
              { opacity: fadeAnim },
            ]}
          >
            <GlassCard style={styles.imageCard}>
              <View style={styles.imageWrapper}>
                <Image source={{ uri: selectedImage }} style={styles.previewImage} />
                <ScannerLine isActive={isAnalyzing} />
                
                {/* Corner decorations */}
                <View style={[styles.corner, styles.cornerTL]} />
                <View style={[styles.corner, styles.cornerTR]} />
                <View style={[styles.corner, styles.cornerBL]} />
                <View style={[styles.corner, styles.cornerBR]} />
              </View>

              {!result && !isAnalyzing && (
                <View style={styles.imageActions}>
                  <TouchableOpacity
                    style={styles.analyzeButton}
                    activeOpacity={0.8}
                    onPress={analyzeImage}
                  >
                    <LinearGradient
                      colors={GRADIENTS.button}
                      style={styles.analyzeButtonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Ionicons name="flash" size={22} color="#fff" />
                      <Text style={styles.analyzeButtonText}>Analyze Image</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.removeButton}
                    activeOpacity={0.8}
                    onPress={resetAnalysis}
                  >
                    <Ionicons name="trash-outline" size={22} color={COLORS.danger} />
                  </TouchableOpacity>
                </View>
              )}
            </GlassCard>
          </Animated.View>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <Animated.View style={[styles.loadingSection, { opacity: fadeAnim }]}>
            <GlassCard style={styles.loadingCard}>
              <View style={styles.loadingSpinner}>
                <ActivityIndicator size="large" color={COLORS.primary} />
              </View>
              <Text style={styles.loadingTitle}>Analyzing with AI...</Text>
              <Text style={styles.loadingSubtext}>
                Our advanced AI is identifying the pest
              </Text>
              <View style={styles.loadingDots}>
                {[0, 1, 2].map((i) => (
                  <View key={i} style={styles.loadingDot} />
                ))}
              </View>
            </GlassCard>
          </Animated.View>
        )}

        {/* Results */}
        {result && result.is_pest && (
          <Animated.View style={[styles.resultSection, { opacity: fadeAnim }]}>
            <GlassCard style={styles.resultCard}>
              <View style={styles.resultHeader}>
                <View style={styles.successIcon}>
                  <Ionicons name="checkmark-circle" size={48} color={COLORS.success} />
                </View>
                <Text style={styles.resultTitle}>Pest Detected!</Text>
              </View>

              <View style={styles.resultContent}>
                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Pest Name</Text>
                  <Text style={styles.resultValue}>{result.class_name}</Text>
                </View>

                <View style={styles.resultRow}>
                  <Text style={styles.resultLabel}>Confidence</Text>
                  <View style={styles.confidenceBadge}>
                    <Text style={styles.confidenceText}>{result.confidence}</Text>
                  </View>
                </View>

                {result.is_new && (
                  <View style={styles.newPestBadge}>
                    <Ionicons name="sparkles" size={16} color="#fbbf24" />
                    <Text style={styles.newPestText}>AI-Generated Information</Text>
                  </View>
                )}

                <Text style={styles.resultMessage}>{result.message}</Text>
              </View>

              <View style={styles.resultActions}>
                <TouchableOpacity
                  style={styles.detailButton}
                  activeOpacity={0.8}
                  onPress={viewPestDetails}
                >
                  <LinearGradient
                    colors={GRADIENTS.button}
                    style={styles.detailButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.detailButtonText}>View Full Information</Text>
                    <Ionicons name="arrow-forward" size={20} color="#fff" />
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.retryButton}
                  activeOpacity={0.8}
                  onPress={resetAnalysis}
                >
                  <Ionicons name="camera-outline" size={20} color={COLORS.primary} />
                  <Text style={styles.retryButtonText}>Scan Another</Text>
                </TouchableOpacity>
              </View>
            </GlassCard>
          </Animated.View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  glowTop: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
  },
  glowBottom: {
    position: 'absolute',
    bottom: 100,
    left: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(96, 165, 250, 0.08)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONTS.h2,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 22,
  },
  tipsContainer: {
    marginBottom: SPACING.xl,
  },
  tipsTitle: {
    fontSize: FONTS.bodySmall,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  tipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    gap: SPACING.xs,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.2)',
  },
  tipIcon: {
    opacity: 0.9,
  },
  tipText: {
    fontSize: FONTS.caption,
    color: COLORS.primary,
    fontWeight: '500',
  },
  glassCard: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  glassGradient: {
    padding: SPACING.lg,
  },
  uploadSection: {
    marginBottom: SPACING.xl,
  },
  uploadCard: {
    borderRadius: 28,
    borderStyle: 'dashed',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  uploadContent: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  uploadIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
    position: 'relative',
  },
  uploadIconGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 60,
  },
  uploadTitle: {
    fontSize: FONTS.h4,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  uploadDescription: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  uploadButtons: {
    width: '100%',
    gap: SPACING.md,
  },
  cameraButton: {
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.glow,
  },
  cameraButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: SPACING.sm,
  },
  cameraButtonText: {
    fontSize: FONTS.body,
    fontWeight: '600',
    color: '#fff',
  },
  galleryButton: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
  },
  galleryButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: SPACING.sm,
  },
  galleryButtonText: {
    fontSize: FONTS.body,
    fontWeight: '600',
    color: COLORS.primary,
  },
  imageSection: {
    marginBottom: SPACING.xl,
  },
  imageCard: {
    borderRadius: 28,
  },
  imageWrapper: {
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 280,
    borderRadius: 20,
  },
  scannerLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
    top: 0,
  },
  scannerLineGradient: {
    flex: 1,
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: COLORS.primary,
  },
  cornerTL: {
    top: 12,
    left: 12,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 8,
  },
  cornerTR: {
    top: 12,
    right: 12,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 8,
  },
  cornerBL: {
    bottom: 12,
    left: 12,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 8,
  },
  cornerBR: {
    bottom: 12,
    right: 12,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 8,
  },
  imageActions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  analyzeButton: {
    flex: 1,
    borderRadius: 14,
    overflow: 'hidden',
    ...SHADOWS.glow,
  },
  analyzeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: SPACING.sm,
  },
  analyzeButtonText: {
    fontSize: FONTS.body,
    fontWeight: '600',
    color: '#fff',
  },
  removeButton: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(248, 113, 113, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingSection: {
    marginBottom: SPACING.xl,
  },
  loadingCard: {
    alignItems: 'center',
    borderRadius: 28,
  },
  loadingSpinner: {
    marginBottom: SPACING.md,
  },
  loadingTitle: {
    fontSize: FONTS.h4,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  loadingSubtext: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  loadingDots: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    opacity: 0.5,
  },
  resultSection: {
    marginBottom: SPACING.xl,
  },
  resultCard: {
    borderRadius: 28,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  successIcon: {
    marginBottom: SPACING.sm,
  },
  resultTitle: {
    fontSize: FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  resultContent: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  resultLabel: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
  },
  resultValue: {
    fontSize: FONTS.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  confidenceBadge: {
    backgroundColor: 'rgba(74, 222, 128, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  confidenceText: {
    fontSize: FONTS.bodySmall,
    fontWeight: '600',
    color: COLORS.primary,
  },
  newPestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  newPestText: {
    fontSize: FONTS.caption,
    fontWeight: '600',
    color: '#fbbf24',
  },
  resultMessage: {
    fontSize: FONTS.bodySmall,
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: SPACING.md,
    fontWeight: '500',
  },
  resultActions: {
    gap: SPACING.md,
  },
  detailButton: {
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.glow,
  },
  detailButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: SPACING.sm,
  },
  detailButtonText: {
    fontSize: FONTS.body,
    fontWeight: '600',
    color: '#fff',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: SPACING.sm,
  },
  retryButtonText: {
    fontSize: FONTS.body,
    fontWeight: '600',
    color: COLORS.primary,
  },
});
