import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getThreatColor, getThreatLabel } from '../pests';
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

// Section Component
const Section = ({ icon, title, color, children, delay = 0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.section,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.sectionHeader}>
        <View style={[styles.sectionIcon, { backgroundColor: `${color}20` }]}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <GlassCard style={styles.sectionContent}>
        {children}
      </GlassCard>
    </Animated.View>
  );
};

// List Item Component
const ListItem = ({ text }) => (
  <View style={styles.listItem}>
    <View style={styles.bulletPoint}>
      <LinearGradient
        colors={GRADIENTS.button}
        style={styles.bulletGradient}
      />
    </View>
    <Text style={styles.listText}>{text}</Text>
  </View>
);

export default function PestDetailScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { pest, customPest } = route.params || {};
  const pestData = pest || customPest;

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

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
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (!pestData) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={GRADIENTS.primary}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.errorContainer}>
          <View style={styles.errorIcon}>
            <Ionicons name="bug-outline" size={64} color={COLORS.textMuted} />
          </View>
          <Text style={styles.errorText}>Pest information not available</Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <LinearGradient
              colors={GRADIENTS.button}
              style={styles.backButtonGradient}
            >
              <Ionicons name="arrow-back" size={20} color="#fff" />
              <Text style={styles.backButtonText}>Go Back</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const threatLevel = pestData.threatLevel || pestData.threat_level;
  const threatColor = getThreatColor(threatLevel);

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

      {/* Back Button */}
      <View style={[styles.headerBar, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          style={styles.headerBackButton}
          onPress={() => navigation.goBack()}
        >
          <BlurView intensity={20} tint="dark" style={styles.headerBackBlur}>
            <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
            <Text style={styles.headerBackText}>Back</Text>
          </BlurView>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 60, paddingBottom: 40 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <Animated.View
          style={[
            styles.heroSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}
        >
          {/* Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: pestData.image }}
              style={styles.pestImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(13, 40, 24, 0.8)']}
              style={styles.imageGradient}
            />
            
            {/* AI Badge */}
            {customPest && (
              <View style={styles.aiBadge}>
                <LinearGradient
                  colors={GRADIENTS.button}
                  style={styles.aiBadgeGradient}
                >
                  <Ionicons name="sparkles" size={14} color="#fff" />
                  <Text style={styles.aiBadgeText}>AI Generated</Text>
                </LinearGradient>
              </View>
            )}
          </View>

          {/* Info */}
          <View style={styles.heroContent}>
            <Text style={styles.pestName}>{pestData.name}</Text>
            <Text style={styles.scientificName}>
              {pestData.scientificName || pestData.scientific_name}
            </Text>

            {/* Badges */}
            <View style={styles.badgesRow}>
              <View style={[styles.threatBadge, { backgroundColor: threatColor }]}>
                <Ionicons name="warning" size={16} color="#fff" />
                <Text style={styles.threatBadgeText}>
                  {getThreatLabel(threatLevel)}
                </Text>
              </View>
              <View style={styles.categoryBadge}>
                <Ionicons name="pricetag" size={16} color={COLORS.primary} />
                <Text style={styles.categoryBadgeText}>{pestData.category}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Description */}
        <Section
          icon="information-circle"
          title="Description"
          color={COLORS.primary}
          delay={100}
        >
          <Text style={styles.descriptionText}>{pestData.description}</Text>
        </Section>

        {/* Common Species */}
        {pestData.common_species && pestData.common_species.length > 0 && (
          <Section
            icon="git-network"
            title="Common Species"
            color="#60a5fa"
            delay={200}
          >
            {pestData.common_species.map((species, index) => (
              <View key={index} style={styles.speciesItem}>
                <Text style={styles.speciesName}>{species.name}</Text>
                <Text style={styles.speciesDescription}>{species.description}</Text>
              </View>
            ))}
          </Section>
        )}

        {/* Damage Symptoms */}
        {pestData.symptoms && pestData.symptoms.length > 0 && (
          <Section
            icon="warning"
            title="Damage Symptoms"
            color={COLORS.danger}
            delay={300}
          >
            {pestData.symptoms.map((symptom, index) => (
              <ListItem key={index} text={symptom} />
            ))}
          </Section>
        )}

        {/* Organic Treatment */}
        {pestData.organic_treatment && pestData.organic_treatment.length > 0 && (
          <Section
            icon="leaf"
            title="Organic Treatment"
            color="#34d399"
            delay={400}
          >
            {pestData.organic_treatment.map((treatment, index) => (
              <ListItem key={index} text={treatment} />
            ))}
          </Section>
        )}

        {/* Chemical Treatment */}
        {pestData.chemical_treatment && pestData.chemical_treatment.length > 0 && (
          <Section
            icon="flask"
            title="Chemical Treatment"
            color="#fbbf24"
            delay={500}
          >
            {pestData.chemical_treatment.map((treatment, index) => (
              <ListItem key={index} text={treatment} />
            ))}
          </Section>
        )}

        {/* Prevention */}
        {pestData.prevention && pestData.prevention.length > 0 && (
          <Section
            icon="shield-checkmark"
            title="Prevention Strategies"
            color="#60a5fa"
            delay={600}
          >
            {pestData.prevention.map((strategy, index) => (
              <ListItem key={index} text={strategy} />
            ))}
          </Section>
        )}

        {/* Footer */}
        <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
          <Ionicons name="leaf-outline" size={24} color={COLORS.textMuted} />
          <Text style={styles.footerText}>PestHub • AI-Powered Detection</Text>
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
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(74, 222, 128, 0.12)',
  },
  glowBottom: {
    position: 'absolute',
    bottom: 150,
    left: -80,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(96, 165, 250, 0.08)',
  },
  headerBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: SPACING.lg,
  },
  headerBackButton: {
    alignSelf: 'flex-start',
  },
  headerBackBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  headerBackText: {
    fontSize: FONTS.body,
    color: COLORS.textPrimary,
    marginLeft: SPACING.xs,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  errorIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  errorText: {
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
  },
  backButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  backButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: SPACING.sm,
  },
  backButtonText: {
    fontSize: FONTS.body,
    fontWeight: '600',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
  },
  heroSection: {
    marginBottom: SPACING.xl,
  },
  imageContainer: {
    height: 280,
    borderRadius: 28,
    overflow: 'hidden',
    position: 'relative',
  },
  pestImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  aiBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    borderRadius: 12,
    overflow: 'hidden',
  },
  aiBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: SPACING.xs,
  },
  aiBadgeText: {
    fontSize: FONTS.caption,
    fontWeight: '600',
    color: '#fff',
  },
  heroContent: {
    alignItems: 'center',
    marginTop: -60,
    paddingHorizontal: SPACING.lg,
  },
  pestName: {
    fontSize: FONTS.h1,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  scientificName: {
    fontSize: FONTS.body,
    fontStyle: 'italic',
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.lg,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  threatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: SPACING.xs,
  },
  threatBadgeText: {
    fontSize: FONTS.caption,
    fontWeight: '600',
    color: '#fff',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.3)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    gap: SPACING.xs,
  },
  categoryBadgeText: {
    fontSize: FONTS.caption,
    fontWeight: '600',
    color: COLORS.primary,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: FONTS.h4,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
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
  sectionContent: {
    borderRadius: 20,
  },
  descriptionText: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 24,
  },
  speciesItem: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  speciesName: {
    fontSize: FONTS.body,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: SPACING.xs,
  },
  speciesDescription: {
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    overflow: 'hidden',
  },
  bulletGradient: {
    flex: 1,
  },
  listText: {
    flex: 1,
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    gap: SPACING.sm,
  },
  footerText: {
    fontSize: FONTS.caption,
    color: COLORS.textMuted,
  },
});
