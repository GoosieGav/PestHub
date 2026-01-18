import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Alert,
  ActivityIndicator,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PESTS, getThreatColor, getThreatLabel } from '../pests';
import { pestAPI } from '../services/api';
import { COLORS, GRADIENTS, SHADOWS, SPACING, FONTS } from '../theme';

const { width } = Dimensions.get('window');

// Glass Card Component
const GlassCard = ({ children, style, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!onPress) return;
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    if (!onPress) return;
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  const content = (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <BlurView intensity={15} tint="dark" style={[styles.glassCard, style]}>
        <LinearGradient
          colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.02)']}
          style={styles.glassGradient}
        >
          {children}
        </LinearGradient>
      </BlurView>
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

// Pest Card Component
const PestCard = ({ pest, onPress, index }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 50,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const threatColor = getThreatColor(pest.threatLevel);

  return (
    <Animated.View
      style={[
        styles.pestCardContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <GlassCard style={styles.pestCard} onPress={onPress}>
        <View style={styles.pestImageContainer}>
          <Image
            source={{ uri: pest.image }}
            style={styles.pestImage}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            style={styles.imageOverlay}
          />
          <View style={[styles.threatBadge, { backgroundColor: threatColor }]}>
            <Ionicons name="warning" size={10} color="#fff" />
            <Text style={styles.threatText}>
              {pest.threatLevel.charAt(0).toUpperCase() + pest.threatLevel.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.pestContent}>
          <Text style={styles.pestName} numberOfLines={1}>{pest.name}</Text>
          <Text style={styles.pestScientific} numberOfLines={1}>
            {pest.scientificName}
          </Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{pest.category}</Text>
          </View>
          <Text style={styles.pestDescription} numberOfLines={2}>
            {pest.description}
          </Text>
        </View>
      </GlassCard>
    </Animated.View>
  );
};

export default function DirectoryScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [customSearchModal, setCustomSearchModal] = useState(false);
  const [customSearchQuery, setCustomSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [customResult, setCustomResult] = useState(null);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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
  }, []);

  const filterPests = () => {
    return PESTS.filter(pest => {
      const matchesSearch = pest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pest.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  };

  const filteredPests = filterPests();

  const handleCustomSearch = async () => {
    if (!customSearchQuery.trim()) {
      Alert.alert('Empty Query', 'Please enter a pest name to search.');
      return;
    }

    setIsSearching(true);
    setCustomResult(null);

    try {
      const response = await pestAPI.searchPest(customSearchQuery);
      
      if (response.success && response.data) {
        if (response.data.is_pest) {
          setCustomResult(response.data.pest_data);
        } else {
          Alert.alert(
            'Not Found',
            'This doesn\'t appear to be a pest or insect. Please try another search.'
          );
        }
      } else {
        Alert.alert('Error', response.error || 'Failed to search. Please try again.');
      }
    } catch (error) {
      console.error('Error searching:', error);
      Alert.alert('Error', 'Failed to connect to the server.');
    } finally {
      setIsSearching(false);
    }
  };

  const closeCustomSearchModal = () => {
    setCustomSearchModal(false);
    setCustomSearchQuery('');
    setCustomResult(null);
  };

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

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 20,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Ionicons name="library" size={28} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>Pest Library</Text>
          <Text style={styles.subtitle}>
            Browse our database or search for any pest
          </Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{PESTS.length}</Text>
              <Text style={styles.statLabel}>Curated</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>100%</Text>
              <Text style={styles.statLabel}>AI Powered</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>∞</Text>
              <Text style={styles.statLabel}>Custom</Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <BlurView intensity={20} tint="dark" style={styles.searchBar}>
            <LinearGradient
              colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.03)']}
              style={styles.searchGradient}
            >
              <Ionicons name="search" size={20} color={COLORS.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search pests..."
                placeholderTextColor={COLORS.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
                </TouchableOpacity>
              )}
            </LinearGradient>
          </BlurView>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.customSearchButton}
              activeOpacity={0.8}
              onPress={() => setCustomSearchModal(true)}
            >
              <LinearGradient
                colors={GRADIENTS.button}
                style={styles.customSearchGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Ionicons name="sparkles" size={16} color="#fff" />
                <Text style={styles.customSearchText}>AI Search</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resetButton}
              activeOpacity={0.8}
              onPress={() => setSearchQuery('')}
            >
              <Ionicons name="refresh" size={16} color={COLORS.danger} />
              <Text style={styles.resetText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            Showing {filteredPests.length} pest{filteredPests.length !== 1 ? 's' : ''}
          </Text>
        </View>
      </Animated.View>

      {/* Pest Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pestGrid}>
          {filteredPests.map((pest, index) => (
            <PestCard
              key={pest.id}
              pest={pest}
              index={index}
              onPress={() => navigation.navigate('PestDetail', { pest })}
            />
          ))}
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Custom Search Modal */}
      <Modal
        visible={customSearchModal}
        transparent
        animationType="fade"
        onRequestClose={closeCustomSearchModal}
      >
        <View style={styles.modalOverlay}>
          <BlurView intensity={40} tint="dark" style={styles.modalBlur}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={styles.modalHeaderLeft}>
                  <Ionicons name="sparkles" size={24} color={COLORS.primary} />
                  <Text style={styles.modalTitle}>AI Search</Text>
                </View>
                <TouchableOpacity onPress={closeCustomSearchModal}>
                  <Ionicons name="close-circle" size={28} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalDescription}>
                Search for any pest by name - agricultural, household, or garden.
              </Text>

              <View style={styles.modalInputContainer}>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter pest name (e.g., 'Mosquitoes')..."
                  placeholderTextColor={COLORS.textMuted}
                  value={customSearchQuery}
                  onChangeText={setCustomSearchQuery}
                  autoFocus
                />
                <TouchableOpacity
                  style={styles.modalSearchButton}
                  onPress={handleCustomSearch}
                  disabled={isSearching}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={GRADIENTS.button}
                    style={styles.modalSearchGradient}
                  >
                    {isSearching ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <Ionicons name="search" size={20} color="#fff" />
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              {customResult && (
                <GlassCard style={styles.customResultCard}>
                  <View style={styles.customResultHeader}>
                    <Ionicons name="checkmark-circle" size={32} color={COLORS.success} />
                    <Text style={styles.customResultTitle}>Pest Found!</Text>
                  </View>

                  <Text style={styles.customResultName}>{customResult.name}</Text>
                  <Text style={styles.customResultScientific}>
                    {customResult.scientific_name}
                  </Text>
                  <Text style={styles.customResultDescription} numberOfLines={3}>
                    {customResult.description}
                  </Text>

                  <View style={styles.customResultBadges}>
                    <View style={[styles.badge, { backgroundColor: getThreatColor(customResult.threat_level) }]}>
                      <Text style={styles.badgeText}>
                        {getThreatLabel(customResult.threat_level)}
                      </Text>
                    </View>
                    <View style={styles.badgeOutline}>
                      <Text style={styles.badgeTextOutline}>{customResult.category}</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.viewDetailsButton}
                    activeOpacity={0.8}
                    onPress={() => {
                      closeCustomSearchModal();
                      navigation.navigate('PestDetail', {
                        customPest: customResult,
                        infoUrl: customResult.info_url,
                      });
                    }}
                  >
                    <LinearGradient
                      colors={GRADIENTS.button}
                      style={styles.viewDetailsGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={styles.viewDetailsText}>View Full Information</Text>
                      <Ionicons name="arrow-forward" size={18} color="#fff" />
                    </LinearGradient>
                  </TouchableOpacity>
                </GlassCard>
              )}
            </View>
          </BlurView>
        </View>
      </Modal>
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
  header: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  headerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONTS.h2,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.lg,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONTS.tiny,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: SPACING.md,
  },
  searchContainer: {
    gap: SPACING.md,
  },
  searchBar: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  searchGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
    gap: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FONTS.body,
    color: COLORS.textPrimary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  customSearchButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  customSearchGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: SPACING.xs,
  },
  customSearchText: {
    fontSize: FONTS.bodySmall,
    fontWeight: '600',
    color: '#fff',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.3)',
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    gap: SPACING.xs,
  },
  resetText: {
    fontSize: FONTS.bodySmall,
    fontWeight: '600',
    color: COLORS.danger,
  },
  resultsHeader: {
    marginTop: SPACING.md,
  },
  resultsCount: {
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
  },
  pestGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  pestCardContainer: {
    width: (width - SPACING.lg * 2 - SPACING.md) / 2,
  },
  glassCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  glassGradient: {
    padding: 0,
  },
  pestCard: {
    borderRadius: 20,
  },
  pestImageContainer: {
    height: 120,
    position: 'relative',
  },
  pestImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  threatBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 3,
  },
  threatText: {
    fontSize: 9,
    fontWeight: '600',
    color: '#fff',
  },
  pestContent: {
    padding: SPACING.md,
  },
  pestName: {
    fontSize: FONTS.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  pestScientific: {
    fontSize: FONTS.tiny,
    fontStyle: 'italic',
    color: COLORS.textMuted,
    marginTop: 2,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: SPACING.sm,
  },
  categoryText: {
    fontSize: 9,
    fontWeight: '600',
    color: COLORS.primary,
    textTransform: 'uppercase',
  },
  pestDescription: {
    fontSize: FONTS.tiny,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
    lineHeight: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBlur: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  modalContent: {
    padding: SPACING.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  modalTitle: {
    fontSize: FONTS.h4,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  modalDescription: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
  modalInputContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  modalInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    borderRadius: 14,
    paddingHorizontal: SPACING.md,
    paddingVertical: 14,
    fontSize: FONTS.bodySmall,
    color: COLORS.textPrimary,
  },
  modalSearchButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  modalSearchGradient: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  customResultCard: {
    borderRadius: 20,
    marginTop: SPACING.md,
  },
  customResultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  customResultTitle: {
    fontSize: FONTS.h4,
    fontWeight: 'bold',
    color: COLORS.success,
  },
  customResultName: {
    fontSize: FONTS.h4,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  customResultScientific: {
    fontSize: FONTS.caption,
    fontStyle: 'italic',
    color: COLORS.textMuted,
    marginTop: 2,
  },
  customResultDescription: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    lineHeight: 20,
  },
  customResultBadges: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: FONTS.caption,
    fontWeight: '600',
    color: '#fff',
  },
  badgeOutline: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  badgeTextOutline: {
    fontSize: FONTS.caption,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  viewDetailsButton: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: SPACING.lg,
  },
  viewDetailsGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: SPACING.sm,
  },
  viewDetailsText: {
    fontSize: FONTS.bodySmall,
    fontWeight: '600',
    color: '#fff',
  },
});
