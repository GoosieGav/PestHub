import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Animated,
  ImageBackground,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, GRADIENTS, SHADOWS, SPACING, FONTS } from '../theme';

const { width, height } = Dimensions.get('window');

// Animated Floating Particles Component
const FloatingParticle = ({ delay, duration, startX, startY }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: -100,
              duration: duration,
              delay: delay,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(opacity, {
                toValue: 0.8,
                duration: duration / 2,
                delay: delay,
                useNativeDriver: true,
              }),
              Animated.timing(opacity, {
                toValue: 0,
                duration: duration / 2,
                useNativeDriver: true,
              }),
            ]),
          ]),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    animate();
  }, []);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: startX,
          top: startY,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <LinearGradient
        colors={['rgba(74, 222, 128, 0.8)', 'rgba(74, 222, 128, 0)']}
        style={styles.particleGradient}
      />
    </Animated.View>
  );
};

// Glass Card Component
const GlassCard = ({ children, style, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
        <BlurView intensity={20} tint="dark" style={[styles.glassCard, style]}>
          <LinearGradient
            colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.04)']}
            style={styles.glassGradient}
          >
            {children}
          </LinearGradient>
        </BlurView>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous logo animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const logoScale = logoRotate.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.1, 1],
  });

  const features = [
    {
      icon: 'scan',
      title: 'AI Detection',
      description: 'Instant pest identification',
      color: '#4ade80',
      bgColor: 'rgba(74, 222, 128, 0.15)',
    },
    {
      icon: 'library',
      title: 'Pest Library',
      description: 'Comprehensive database',
      color: '#60a5fa',
      bgColor: 'rgba(96, 165, 250, 0.15)',
    },
    {
      icon: 'search',
      title: 'Smart Search',
      description: 'Find any pest instantly',
      color: '#fbbf24',
      bgColor: 'rgba(251, 191, 36, 0.15)',
    },
    {
      icon: 'leaf',
      title: 'Treatment',
      description: 'Organic solutions',
      color: '#34d399',
      bgColor: 'rgba(52, 211, 153, 0.15)',
    },
  ];

  const steps = [
    { icon: 'camera', title: 'Capture', desc: 'Take a photo' },
    { icon: 'flash', title: 'Analyze', desc: 'AI processes' },
    { icon: 'checkmark-circle', title: 'Results', desc: 'Get treatment' },
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

      {/* Floating Particles */}
      <View style={styles.particlesContainer}>
        <FloatingParticle delay={0} duration={4000} startX={width * 0.1} startY={height * 0.3} />
        <FloatingParticle delay={500} duration={5000} startX={width * 0.8} startY={height * 0.5} />
        <FloatingParticle delay={1000} duration={4500} startX={width * 0.5} startY={height * 0.7} />
        <FloatingParticle delay={1500} duration={5500} startX={width * 0.3} startY={height * 0.4} />
        <FloatingParticle delay={2000} duration={4000} startX={width * 0.7} startY={height * 0.6} />
      </View>

      {/* Glow Effects */}
      <View style={styles.glowContainer}>
        <View style={[styles.glow, styles.glowTop]} />
        <View style={[styles.glow, styles.glowBottom]} />
      </View>

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
          <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
            <LinearGradient
              colors={['rgba(74, 222, 128, 0.3)', 'rgba(74, 222, 128, 0.1)']}
              style={styles.logoGlow}
            />
            <View style={styles.logoInner}>
              <Image 
                source={require('../assets/logo.png')} 
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>
          </Animated.View>
          
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.titleText}>PEST-Hub</Text>
          <Text style={styles.subtitleText}>
            AI-powered pest detection for modern agriculture
          </Text>
        </Animated.View>

        {/* Stats Section */}
        <Animated.View
          style={[
            styles.statsContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <GlassCard style={styles.statsCard}>
            <View style={styles.statsContent}>
              {[
                { value: '12+', label: 'Pest Types' },
                { value: '100%', label: 'AI Powered' },
                { value: '∞', label: 'Searches' },
              ].map((stat, index) => (
                <View key={index} style={styles.statItem}>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </GlassCard>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View
          style={[
            styles.actionSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Classify')}
          >
            <LinearGradient
              colors={GRADIENTS.button}
              style={styles.primaryButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="scan" size={24} color="#fff" />
              <Text style={styles.primaryButtonText}>Start Detection</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Directory')}
          >
            <BlurView intensity={20} tint="dark" style={styles.secondaryButtonBlur}>
              <LinearGradient
                colors={GRADIENTS.buttonSecondary}
                style={styles.secondaryButtonGradient}
              >
                <Ionicons name="library" size={22} color={COLORS.primary} />
                <Text style={styles.secondaryButtonText}>Browse Library</Text>
              </LinearGradient>
            </BlurView>
          </TouchableOpacity>
        </Animated.View>

        {/* Features Grid */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Key Features</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <GlassCard key={index} style={styles.featureCard}>
                <View style={[styles.featureIcon, { backgroundColor: feature.bgColor }]}>
                  <Ionicons name={feature.icon} size={28} color={feature.color} />
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </GlassCard>
            ))}
          </View>
        </Animated.View>

        {/* How It Works */}
        <Animated.View
          style={[
            styles.section,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={styles.sectionTitle}>How It Works</Text>
          <GlassCard style={styles.stepsCard}>
            <View style={styles.stepsContainer}>
              {steps.map((step, index) => (
                <View key={index} style={styles.stepItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.stepIconContainer}>
                    <Ionicons name={step.icon} size={28} color={COLORS.primary} />
                  </View>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                  {index < steps.length - 1 && (
                    <View style={styles.stepConnector}>
                      <Ionicons name="arrow-forward" size={16} color={COLORS.textMuted} />
                    </View>
                  )}
                </View>
              ))}
            </View>
          </GlassCard>
        </Animated.View>

        {/* CTA Section */}
        <Animated.View style={[styles.ctaSection, { opacity: fadeAnim }]}>
          <GlassCard style={styles.ctaCard}>
            <View style={styles.ctaIconContainer}>
              <Image 
                source={require('../assets/logo.png')} 
                style={{ width: 40, height: 40 }}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.ctaTitle}>Ready to Identify Pests?</Text>
            <Text style={styles.ctaDescription}>
              Start protecting your crops with AI-powered detection
            </Text>
            <TouchableOpacity
              style={styles.ctaButton}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Classify')}
            >
              <LinearGradient
                colors={GRADIENTS.button}
                style={styles.ctaButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="sparkles" size={18} color="#fff" />
                <Text style={styles.ctaButtonText}>Get Started</Text>
              </LinearGradient>
            </TouchableOpacity>
          </GlassCard>
        </Animated.View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>PEST-Hub Mobile • AI-Powered Detection</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  particlesContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  particleGradient: {
    flex: 1,
    borderRadius: 4,
  },
  glowContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
  },
  glowTop: {
    top: -100,
    right: -50,
  },
  glowBottom: {
    bottom: 100,
    left: -100,
    backgroundColor: 'rgba(96, 165, 250, 0.1)',
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
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  logoGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 50,
  },
  logoInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 48,
    height: 48,
  },
  logoImage: {
    width: 48,
    height: 48,
  },
  welcomeText: {
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  titleText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    letterSpacing: -1,
  },
  subtitleText: {
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 24,
  },
  statsContainer: {
    marginBottom: SPACING.xl,
  },
  statsCard: {
    borderRadius: 24,
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  glassCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  glassGradient: {
    padding: SPACING.md,
  },
  actionSection: {
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  primaryButton: {
    borderRadius: 20,
    overflow: 'hidden',
    ...SHADOWS.glow,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  primaryButtonText: {
    fontSize: FONTS.h4,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  secondaryButton: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  secondaryButtonBlur: {
    borderRadius: 20,
  },
  secondaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  secondaryButtonText: {
    fontSize: FONTS.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  featureCard: {
    width: (width - SPACING.lg * 2 - SPACING.md) / 2,
    borderRadius: 20,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  featureTitle: {
    fontSize: FONTS.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  featureDescription: {
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  stepsCard: {
    borderRadius: 24,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
  },
  stepItem: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  stepNumberText: {
    fontSize: FONTS.caption,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  stepIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  stepTitle: {
    fontSize: FONTS.bodySmall,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  stepDesc: {
    fontSize: FONTS.tiny,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  stepConnector: {
    position: 'absolute',
    right: -5,
    top: 60,
  },
  ctaSection: {
    marginBottom: SPACING.xl,
  },
  ctaCard: {
    alignItems: 'center',
    borderRadius: 28,
  },
  ctaIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  ctaTitle: {
    fontSize: FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  ctaDescription: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  ctaButton: {
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.small,
  },
  ctaButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 28,
    gap: SPACING.sm,
  },
  ctaButtonText: {
    fontSize: FONTS.body,
    fontWeight: '600',
    color: '#fff',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  footerText: {
    fontSize: FONTS.caption,
    color: COLORS.textMuted,
  },
});
