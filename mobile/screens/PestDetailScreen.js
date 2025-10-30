import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getThreatColor, getThreatLabel } from '../data/pests';

export default function PestDetailScreen({ route }) {
  const { pest, customPest } = route.params || {};
  const pestData = pest || customPest;

  if (!pestData) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="bug-outline" size={64} color="#9ca3af" />
        <Text style={styles.errorText}>Pest information not available</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.imageSection}>
          <View style={styles.placeholderImage}>
            <Ionicons name="bug" size={60} color="#9ca3af" />
          </View>
          {customPest && (
            <View style={styles.aiBadge}>
              <Ionicons name="sparkles" size={14} color="#ffffff" />
              <Text style={styles.aiBadgeText}>AI Generated</Text>
            </View>
          )}
        </View>
        
        <View style={styles.headerContent}>
          <Text style={styles.pestName}>{pestData.name}</Text>
          <Text style={styles.scientificName}>{pestData.scientificName || pestData.scientific_name}</Text>
          
          <View style={styles.badgesRow}>
            <View style={[styles.threatBadge, { backgroundColor: getThreatColor(pestData.threatLevel || pestData.threat_level) }]}>
              <Ionicons name="warning" size={16} color="#ffffff" />
              <Text style={styles.badgeText}>
                {getThreatLabel(pestData.threatLevel || pestData.threat_level)}
              </Text>
            </View>
            <View style={styles.categoryBadge}>
              <Ionicons name="pricetag" size={16} color="#059669" />
              <Text style={styles.categoryText}>{pestData.category}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Description */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="information-circle" size={24} color="#059669" />
          <Text style={styles.sectionTitle}>Description</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.descriptionText}>{pestData.description}</Text>
        </View>
      </View>

      {/* Common Species */}
      {pestData.common_species && pestData.common_species.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="git-network" size={24} color="#059669" />
            <Text style={styles.sectionTitle}>Common Species</Text>
          </View>
          {pestData.common_species.map((species, index) => (
            <View key={index} style={styles.speciesCard}>
              <Text style={styles.speciesName}>{species.name}</Text>
              <Text style={styles.speciesDescription}>{species.description}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Damage Symptoms */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="warning" size={24} color="#ef4444" />
          <Text style={styles.sectionTitle}>Damage Symptoms</Text>
        </View>
        <View style={styles.card}>
          {(pestData.symptoms || []).map((symptom, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.bullet} />
              <Text style={styles.listText}>{symptom}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Organic Treatment */}
      {pestData.organic_treatment && pestData.organic_treatment.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="leaf" size={24} color="#10b981" />
            <Text style={styles.sectionTitle}>Organic Treatment</Text>
          </View>
          <View style={styles.card}>
            {pestData.organic_treatment.map((treatment, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>{treatment}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Chemical Treatment */}
      {pestData.chemical_treatment && pestData.chemical_treatment.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="flask" size={24} color="#f59e0b" />
            <Text style={styles.sectionTitle}>Chemical Treatment</Text>
          </View>
          <View style={styles.card}>
            {pestData.chemical_treatment.map((treatment, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>{treatment}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Prevention */}
      {pestData.prevention && pestData.prevention.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="shield-checkmark" size={24} color="#2563eb" />
            <Text style={styles.sectionTitle}>Prevention Strategies</Text>
          </View>
          <View style={styles.card}>
            {pestData.prevention.map((strategy, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>{strategy}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.footer}>
        <Ionicons name="leaf-outline" size={24} color="#9ca3af" />
        <Text style={styles.footerText}>PestHub • AI-Powered Detection</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 20,
  },
  headerCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  placeholderImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiBadge: {
    position: 'absolute',
    top: 10,
    right: '30%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  aiBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
  headerContent: {
    alignItems: 'center',
  },
  pestName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
  },
  scientificName: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#6b7280',
    marginTop: 6,
    textAlign: 'center',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  threatBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#047857',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  descriptionText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22,
  },
  speciesCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  speciesName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 8,
  },
  speciesDescription: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 20,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#059669',
    marginTop: 6,
  },
  listText: {
    flex: 1,
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 20,
  },
  footer: {
    padding: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
  },
});


