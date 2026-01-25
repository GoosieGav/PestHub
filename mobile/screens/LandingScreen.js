import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, GRADIENTS, SPACING, FONTS } from '../theme';

const { width, height } = Dimensions.get('window');
const SLIDER_WIDTH = width - 80;
const THUMB_SIZE = 60;
const SLIDE_THRESHOLD = SLIDER_WIDTH - THUMB_SIZE - 16;

// Animated Leaf Component
const FloatingLeaf = ({ delay, startX, duration }) => {
  const translateY = useRef(new Animated.Value(-50)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      translateY.setValue(-50);
      translateX.setValue(0);
      rotate.setValue(0);
      opacity.setValue(0);

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: height + 100,
          duration: duration,
          delay: delay,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(translateX, {
            toValue: 30,
            duration: duration / 4,
            delay: delay,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: -30,
            duration: duration / 4,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: 20,
            duration: duration / 4,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: 0,
            duration: duration / 4,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(rotate, {
          toValue: 4,
          duration: duration,
          delay: delay,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.7,
            duration: 1000,
            delay: delay,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.7,
            duration: duration - 2000,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => animate());
    };
    animate();
  }, []);

  const spin = rotate.interpolate({
    inputRange: [0, 4],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.floatingLeaf,
        {
          left: startX,
          opacity,
          transform: [{ translateY }, { translateX }, { rotate: spin }],
        },
      ]}
    >
      <Ionicons name="leaf" size={24} color="rgba(74, 222, 128, 0.6)" />
    </Animated.View>
  );
};

// Slide to Unlock Button Component
const SlideButton = ({ onUnlock }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [isUnlocked, setIsUnlocked] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const arrowOpacity = useRef(new Animated.Value(1)).current;
  const progressScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation for the thumb
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Arrow hint animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(arrowOpacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(arrowOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx >= 0 && gestureState.dx <= SLIDE_THRESHOLD) {
          translateX.setValue(gestureState.dx);
          // Update progress scale based on position
          progressScale.setValue(gestureState.dx / SLIDE_THRESHOLD);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx >= SLIDE_THRESHOLD * 0.8) {
          // Success - slide to end and trigger unlock
          Animated.parallel([
            Animated.spring(translateX, {
              toValue: SLIDE_THRESHOLD,
              useNativeDriver: true,
            }),
            Animated.timing(progressScale, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(() => {
            setIsUnlocked(true);
            setTimeout(() => onUnlock(), 300);
          });
        } else {
          // Reset position
          Animated.parallel([
            Animated.spring(translateX, {
              toValue: 0,
              friction: 5,
              useNativeDriver: true,
            }),
            Animated.timing(progressScale, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    })
  ).current;

  const textOpacity = translateX.interpolate({
    inputRange: [0, SLIDE_THRESHOLD / 2],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.sliderContainer}>
      <BlurView intensity={30} tint="dark" style={styles.sliderBlur}>
        <LinearGradient
          colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.04)']}
          style={styles.sliderTrack}
        >
          {/* Progress Fill - Using scaleX instead of width */}
          <Animated.View
            style={[
              styles.progressFill,
              {
                transform: [{ scaleX: progressScale }],
              },
            ]}
          >
            <LinearGradient
              colors={['rgba(74, 222, 128, 0.5)', 'rgba(74, 222, 128, 0.2)']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </Animated.View>

          {/* Slide Text with animated arrows */}
          <Animated.View style={[styles.slideTextContainer, { opacity: textOpacity }]}>
            <Animated.View style={{ opacity: arrowOpacity }}>
              <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.3)" />
            </Animated.View>
            <Animated.View style={{ opacity: arrowOpacity, marginLeft: -10 }}>
              <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.5)" />
            </Animated.View>
            <Text style={styles.slideText}>Slide to explore</Text>
            <Animated.View style={{ opacity: arrowOpacity, marginRight: -10 }}>
              <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.5)" />
            </Animated.View>
            <Animated.View style={{ opacity: arrowOpacity }}>
              <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.3)" />
            </Animated.View>
          </Animated.View>

          {/* Thumb */}
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.sliderThumb,
              {
                transform: [
                  { translateX },
                  { scale: isUnlocked ? 1.15 : pulseAnim },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={isUnlocked ? ['#22c55e', '#16a34a'] : GRADIENTS.button}
              style={styles.thumbGradient}
            >
              <Ionicons
                name={isUnlocked ? 'checkmark' : 'arrow-forward'}
                size={26}
                color="#fff"
              />
            </LinearGradient>
          </Animated.View>
        </LinearGradient>
      </BlurView>
    </View>
  );
};

// Feature Pill Component
const FeaturePill = ({ icon, text, delay }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.featurePill,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <BlurView intensity={20} tint="dark" style={styles.featurePillBlur}>
        <Ionicons name={icon} size={16} color={COLORS.primary} />
        <Text style={styles.featurePillText}>{text}</Text>
      </BlurView>
    </Animated.View>
  );
};

export default function LandingScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const titleSlide = useRef(new Animated.Value(-30)).current;

  useEffect(() => {
    // Staggered entrance animations
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(titleSlide, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleUnlock = () => {
    navigation.replace('Main');
  };

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <ImageBackground
        source={{ uri: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80' }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {/* Dark Overlay */}
        <LinearGradient
          colors={[
            'rgba(10, 31, 18, 0.6)',
            'rgba(10, 31, 18, 0.8)',
            'rgba(10, 31, 18, 0.95)',
          ]}
          style={StyleSheet.absoluteFill}
        />

        {/* Floating Leaves */}
        <FloatingLeaf delay={0} startX={width * 0.1} duration={8000} />
        <FloatingLeaf delay={2000} startX={width * 0.85} duration={10000} />
        <FloatingLeaf delay={4000} startX={width * 0.5} duration={9000} />
        <FloatingLeaf delay={3000} startX={width * 0.7} duration={8500} />

        {/* Glow Effects */}
        <View style={styles.glowTop} />

        {/* Content */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[
            styles.content, 
            { 
              paddingTop: insets.top + 30,
              paddingBottom: insets.bottom + 20,
            }
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo Section */}
          <Animated.View
            style={[
              styles.logoSection,
              {
                opacity: fadeAnim,
                transform: [{ scale: logoScale }],
              },
            ]}
          >
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['rgba(74, 222, 128, 0.4)', 'rgba(74, 222, 128, 0.1)']}
                style={styles.logoGlow}
              />
              <View style={styles.logoBlur}>
                <View style={styles.logoInner}>
                  <Image 
                    source={require('../assets/logo.png')} 
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Title Section */}
          <Animated.View
            style={[
              styles.titleSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: titleSlide }],
              },
            ]}
          >
            <Text style={styles.appName}>PEST-Hub</Text>
            <View style={styles.taglineContainer}>
              <View style={styles.taglineLine} />
              <Text style={styles.tagline}>AI-Powered Protection</Text>
              <View style={styles.taglineLine} />
            </View>
          </Animated.View>

          {/* Hero Text */}
          <Animated.View
            style={[
              styles.heroSection,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.heroTitle}>
              Protect Your{'\n'}
              <Text style={styles.heroHighlight}>Crops</Text> Instantly
            </Text>
            <Text style={styles.heroDescription}>
              Identify agricultural pests in seconds{'\n'}using advanced AI technology
            </Text>
          </Animated.View>

          {/* Feature Pills */}
          <View style={styles.featuresRow}>
            <FeaturePill icon="scan" text="Instant Scan" delay={800} />
            <FeaturePill icon="sparkles" text="AI Powered" delay={1000} />
            <FeaturePill icon="leaf" text="Eco Solutions" delay={1200} />
          </View>

          {/* Stats Card */}
          <Animated.View style={[styles.statsCard, { opacity: fadeAnim }]}>
            <BlurView intensity={25} tint="dark" style={styles.statsBlur}>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>12+</Text>
                  <Text style={styles.statLabel}>Pest Types</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>95%</Text>
                  <Text style={styles.statLabel}>Accuracy</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>∞</Text>
                  <Text style={styles.statLabel}>Searches</Text>
                </View>
              </View>
            </BlurView>
          </Animated.View>

          {/* Spacer */}
          <View style={styles.spacer} />

          {/* Slide Button */}
          <Animated.View style={{ opacity: fadeAnim }}>
            <SlideButton onUnlock={handleUnlock} />
          </Animated.View>

          {/* Skip option */}
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleUnlock}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>or tap to skip</Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backgroundImage: {
    flex: 1,
  },
  glowTop: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(74, 222, 128, 0.12)',
  },
  floatingLeaf: {
    position: 'absolute',
    zIndex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  logoContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 55,
  },
  logoBlur: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 50,
    height: 50,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    letterSpacing: -1,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    gap: SPACING.md,
  },
  taglineLine: {
    width: 24,
    height: 1,
    backgroundColor: 'rgba(74, 222, 128, 0.5)',
  },
  tagline: {
    fontSize: 11,
    color: COLORS.primary,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 40,
  },
  heroHighlight: {
    color: COLORS.primary,
  },
  heroDescription: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.md,
    lineHeight: 22,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  featurePill: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  featurePillBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  featurePillText: {
    fontSize: 11,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  statsCard: {
    marginBottom: SPACING.xl,
    borderRadius: 20,
    overflow: 'hidden',
  },
  statsBlur: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  spacer: {
    flex: 1,
    minHeight: SPACING.lg,
  },
  sliderContainer: {
    borderRadius: 35,
    overflow: 'hidden',
    marginHorizontal: SPACING.sm,
  },
  sliderBlur: {
    borderRadius: 35,
    borderWidth: 2,
    borderColor: 'rgba(74, 222, 128, 0.25)',
  },
  sliderTrack: {
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    borderRadius: 35,
    overflow: 'hidden',
    transformOrigin: 'left',
  },
  slideTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  slideText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.6)',
    fontWeight: '500',
    marginHorizontal: SPACING.sm,
  },
  sliderThumb: {
    position: 'absolute',
    left: 5,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  thumbGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: SPACING.md,
    marginTop: SPACING.sm,
  },
  skipText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
