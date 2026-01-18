import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, GRADIENTS, SPACING, FONTS } from '../theme';

const { width } = Dimensions.get('window');

// Glass Card Component
const GlassCard = ({ children, style }) => (
  <BlurView intensity={15} tint="dark" style={[styles.glassCard, style]}>
    <LinearGradient
      colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.03)']}
      style={styles.glassGradient}
    >
      {children}
    </LinearGradient>
  </BlurView>
);

// Animated Feature Card
const FeatureCard = ({ icon, title, description, color, bgColor, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.featureCardContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <GlassCard style={styles.featureCard}>
        <View style={[styles.featureIcon, { backgroundColor: bgColor }]}>
          <Ionicons name={icon} size={28} color={color} />
        </View>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </GlassCard>
    </Animated.View>
  );
};

export default function AboutScreen() {
  const insets = useSafeAreaInsets();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

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
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const features = [
    {
      icon: 'camera',
      title: 'Mobile Camera',
      description: 'Take photos directly with your device',
      color: '#4ade80',
      bgColor: 'rgba(74, 222, 128, 0.15)',
    },
    {
      icon: 'flash',
      title: 'Instant AI',
      description: 'Real-time pest identification',
      color: '#fbbf24',
      bgColor: 'rgba(251, 191, 36, 0.15)',
    },
    {
      icon: 'leaf',
      title: 'Treatment',
      description: 'Organic and chemical solutions',
      color: '#34d399',
      bgColor: 'rgba(52, 211, 153, 0.15)',
    },
  ];

  const workflow = [
    { icon: 'camera', title: 'Image Capture', desc: 'Take or upload a pest image' },
    { icon: 'hardware-chip', title: 'AI Processing', desc: 'Gemini AI analyzes the image' },
    { icon: 'bug', title: 'Identification', desc: 'System identifies the pest' },
    { icon: 'document-text', title: 'Information', desc: 'Fetches details and treatments' },
    { icon: 'checkmark-circle', title: 'Results', desc: 'Shows recommendations' },
  ];

  const benefits = [
    { icon: 'infinite', title: 'Unlimited Data', desc: 'Built on massive datasets' },
    { icon: 'flash', title: 'No Training', desc: 'Ready to use immediately' },
    { icon: 'eye', title: 'Multimodal', desc: 'Understands images & context' },
    { icon: 'globe', title: 'Global', desc: 'Identifies pests worldwide' },
    { icon: 'sync', title: 'Updated', desc: 'Latest AI capabilities' },
    { icon: 'cash', title: 'Cost Effective', desc: 'No infrastructure needed' },
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
          <Animated.View style={[styles.logoContainer, { transform: [{ scale: logoScale }] }]}>
            <LinearGradient
              colors={['rgba(74, 222, 128, 0.3)', 'rgba(74, 222, 128, 0.1)']}
              style={styles.logoGlow}
            />
            <View style={styles.logoInner}>
              <Ionicons name="leaf" size={40} color={COLORS.primary} />
            </View>
          </Animated.View>
          <Text style={styles.title}>About PestHub</Text>
          <Text style={styles.subtitle}>AI-powered pest detection for modern agriculture</Text>
        </Animated.View>

        {/* Intro Card */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <GlassCard style={styles.introCard}>
            <Text style={styles.introText}>
              PestHub Mobile uses Google's Gemini AI to provide instant, accurate pest identification 
              directly from your smartphone. Our advanced system analyzes images in real-time to help 
              farmers, gardeners, and agricultural professionals protect their crops.
            </Text>
          </GlassCard>
        </Animated.View>

        {/* Mobile Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mobile Features</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} index={index} />
            ))}
          </View>
        </View>

        {/* AI Architecture */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>AI Architecture</Text>
          <GlassCard style={styles.architectureCard}>
            {[
              { icon: 'hardware-chip', title: 'Model', value: 'Google Gemini 2.0 Flash' },
              { icon: 'flash', title: 'Processing', value: 'Real-time multimodal' },
              { icon: 'shield-checkmark', title: 'Accuracy', value: 'High-confidence predictions' },
              { icon: 'sparkles', title: 'Dynamic', value: 'Auto info pages for new pests' },
            ].map((item, index) => (
              <View key={index} style={styles.architectureItem}>
                <View style={styles.architectureIcon}>
                  <Ionicons name={item.icon} size={22} color={COLORS.primary} />
                </View>
                <View style={styles.architectureText}>
                  <Text style={styles.architectureTitle}>{item.title}</Text>
                  <Text style={styles.architectureValue}>{item.value}</Text>
                </View>
              </View>
            ))}
          </GlassCard>
        </Animated.View>

        {/* How It Works */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <GlassCard style={styles.workflowCard}>
            {workflow.map((step, index) => (
              <View key={index} style={styles.workflowStep}>
                <View style={styles.stepNumberContainer}>
                  <LinearGradient
                    colors={GRADIENTS.button}
                    style={styles.stepNumber}
                  >
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </LinearGradient>
                  {index < workflow.length - 1 && (
                    <View style={styles.stepLine} />
                  )}
                </View>
                <View style={styles.stepContent}>
                  <View style={styles.stepHeader}>
                    <Ionicons name={step.icon} size={20} color={COLORS.primary} />
                    <Text style={styles.stepTitle}>{step.title}</Text>
                  </View>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                </View>
              </View>
            ))}
          </GlassCard>
        </Animated.View>

        {/* Why Pretrained AI */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Why Pretrained AI?</Text>
          <Text style={styles.sectionSubtitle}>Advantages over custom CNN models</Text>
          <View style={styles.benefitsGrid}>
            {benefits.map((benefit, index) => (
              <GlassCard key={index} style={styles.benefitCard}>
                <Ionicons name={benefit.icon} size={28} color={COLORS.primary} />
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text style={styles.benefitDesc}>{benefit.desc}</Text>
              </GlassCard>
            ))}
          </View>
        </Animated.View>

        {/* Tech Stack */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>Technology Stack</Text>
          <GlassCard style={styles.techCard}>
            {[
              { icon: 'logo-react', color: '#61dafb', text: 'React Native + Expo SDK 54' },
              { icon: 'hardware-chip', color: COLORS.primary, text: 'Google Gemini AI' },
              { icon: 'server', color: '#f59e0b', text: 'Flask Backend' },
              { icon: 'camera', color: '#60a5fa', text: 'Expo Camera & Image Picker' },
            ].map((tech, index) => (
              <View key={index} style={styles.techItem}>
                <View style={[styles.techIcon, { backgroundColor: `${tech.color}20` }]}>
                  <Ionicons name={tech.icon} size={20} color={tech.color} />
                </View>
                <Text style={styles.techText}>{tech.text}</Text>
              </View>
            ))}
          </GlassCard>
        </Animated.View>

        {/* Footer */}
        <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
          <View style={styles.footerLogo}>
            <Ionicons name="leaf-outline" size={32} color={COLORS.textMuted} />
          </View>
          <Text style={styles.footerTitle}>PestHub Mobile</Text>
          <Text style={styles.footerSubtitle}>AI-Powered Pest Detection</Text>
          <Text style={styles.footerVersion}>Version 1.0.0</Text>
        </Animated.View>
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
    right: -50,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(74, 222, 128, 0.12)',
  },
  glowBottom: {
    position: 'absolute',
    bottom: 200,
    left: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
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
  logoContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  logoGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 44,
  },
  logoInner: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  sectionSubtitle: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    marginTop: -SPACING.sm,
  },
  glassCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  glassGradient: {
    padding: SPACING.lg,
  },
  introCard: {
    borderRadius: 24,
  },
  introText: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  featuresGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  featureCardContainer: {
    flex: 1,
  },
  featureCard: {
    alignItems: 'center',
    borderRadius: 20,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  featureTitle: {
    fontSize: FONTS.caption,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  featureDescription: {
    fontSize: FONTS.tiny,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 14,
  },
  architectureCard: {
    borderRadius: 24,
  },
  architectureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  architectureIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  architectureText: {
    flex: 1,
  },
  architectureTitle: {
    fontSize: FONTS.bodySmall,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  architectureValue: {
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  workflowCard: {
    borderRadius: 24,
  },
  workflowStep: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  stepNumberContainer: {
    alignItems: 'center',
    width: 32,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: FONTS.caption,
    fontWeight: 'bold',
    color: '#fff',
  },
  stepLine: {
    width: 2,
    flex: 1,
    backgroundColor: 'rgba(74, 222, 128, 0.3)',
    marginVertical: 4,
  },
  stepContent: {
    flex: 1,
    paddingBottom: SPACING.lg,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  stepTitle: {
    fontSize: FONTS.bodySmall,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  stepDesc: {
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  benefitCard: {
    width: (width - SPACING.lg * 2 - SPACING.md) / 2,
    borderRadius: 18,
  },
  benefitTitle: {
    fontSize: FONTS.bodySmall,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  benefitDesc: {
    fontSize: FONTS.tiny,
    color: COLORS.textMuted,
    lineHeight: 15,
  },
  techCard: {
    borderRadius: 24,
  },
  techItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  techIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  techText: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  footerLogo: {
    marginBottom: SPACING.md,
  },
  footerTitle: {
    fontSize: FONTS.h4,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  footerSubtitle: {
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  footerVersion: {
    fontSize: FONTS.tiny,
    color: COLORS.textMuted,
  },
});
