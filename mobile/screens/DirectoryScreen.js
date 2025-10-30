import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PESTS, getThreatColor, getThreatLabel } from '../pests';
import { pestAPI } from '../services/api';

export default function DirectoryScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedThreat, setSelectedThreat] = useState('');
  const [customSearchModal, setCustomSearchModal] = useState(false);
  const [customSearchQuery, setCustomSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [customResult, setCustomResult] = useState(null);

  const filterPests = () => {
    return PESTS.filter(pest => {
      const matchesSearch = pest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pest.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || 
                            pest.category.toLowerCase().includes(selectedCategory.toLowerCase());
      const matchesThreat = !selectedThreat || pest.threatLevel === selectedThreat;
      
      return matchesSearch && matchesCategory && matchesThreat;
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

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedThreat('');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Pest Directory</Text>
        <Text style={styles.subtitle}>
          Browse our curated database or search for any pest by name
        </Text>
        
        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{PESTS.length}</Text>
            <Text style={styles.statLabel}>Curated Pests</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>AI Powered</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>∞</Text>
            <Text style={styles.statLabel}>Custom Search</Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9ca3af" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search pests..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Buttons */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
        >
          <TouchableOpacity
            style={styles.customSearchButton}
            onPress={() => setCustomSearchModal(true)}
          >
            <Ionicons name="sparkles" size={16} color="#ffffff" />
            <Text style={styles.customSearchButtonText}>Custom Search</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetFilters}
          >
            <Ionicons name="refresh" size={16} color="#ef4444" />
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          Showing {filteredPests.length} pest{filteredPests.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Pest Grid */}
      <ScrollView 
        style={styles.pestList}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pestGrid}>
          {filteredPests.map((pest) => (
            <TouchableOpacity
              key={pest.id}
              style={styles.pestCard}
              onPress={() => navigation.navigate('PestDetail', { pest })}
            >
              <View style={styles.pestImageSection}>
                <Image 
                  source={{ uri: pest.image }}
                  style={styles.pestImage}
                  resizeMode="cover"
                />
                <View style={[styles.threatBadge, { backgroundColor: getThreatColor(pest.threatLevel) }]}>
                  <Ionicons name="warning" size={12} color="#ffffff" />
                  <Text style={styles.threatText}>
                    {pest.threatLevel.charAt(0).toUpperCase() + pest.threatLevel.slice(1)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.pestContent}>
                <Text style={styles.pestName}>{pest.name}</Text>
                <Text style={styles.pestScientific}>{pest.scientificName}</Text>
                <Text style={styles.pestCategory}>{pest.category}</Text>
                <Text style={styles.pestDescription} numberOfLines={2}>
                  {pest.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Custom Search Modal */}
      <Modal
        visible={customSearchModal}
        transparent
        animationType="fade"
        onRequestClose={closeCustomSearchModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                <Ionicons name="sparkles" size={20} color="#059669" /> Custom Pest Search
              </Text>
              <TouchableOpacity onPress={closeCustomSearchModal}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalDescription}>
              Search for any pest by name - agricultural, household, or garden.
            </Text>
            
            <View style={styles.modalInputContainer}>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter pest name (e.g., 'Mosquitoes', 'Silverfish')..."
                value={customSearchQuery}
                onChangeText={setCustomSearchQuery}
                autoFocus
              />
              <TouchableOpacity
                style={styles.modalSearchButton}
                onPress={handleCustomSearch}
                disabled={isSearching}
              >
                {isSearching ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <>
                    <Ionicons name="search" size={20} color="#ffffff" />
                    <Text style={styles.modalSearchButtonText}>Search</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
            
            {customResult && (
              <View style={styles.customResultCard}>
                <View style={styles.customResultHeader}>
                  <Ionicons name="checkmark-circle" size={32} color="#10b981" />
                  <Text style={styles.customResultTitle}>Pest Found!</Text>
                </View>
                
                <Text style={styles.customResultName}>{customResult.name}</Text>
                <Text style={styles.customResultScientific}>{customResult.scientific_name}</Text>
                <Text style={styles.customResultDescription}>{customResult.description}</Text>
                
                <View style={styles.customResultBadges}>
                  <View style={[styles.badge, { backgroundColor: getThreatColor(customResult.threat_level) }]}>
                    <Text style={styles.badgeText}>{getThreatLabel(customResult.threat_level)}</Text>
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{customResult.category}</Text>
                  </View>
                </View>
                
                <TouchableOpacity
                  style={styles.viewDetailsButton}
                  onPress={() => {
                    closeCustomSearchModal();
                    navigation.navigate('PestDetail', { 
                      customPest: customResult,
                      infoUrl: customResult.info_url,
                    });
                  }}
                >
                  <Text style={styles.viewDetailsButtonText}>View Full Information</Text>
                  <Ionicons name="arrow-forward" size={18} color="#ffffff" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 6,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#059669',
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 4,
  },
  searchSection: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1f2937',
  },
  filterScroll: {
    marginTop: 12,
  },
  customSearchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
    gap: 6,
  },
  customSearchButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ffffff',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  resetButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#ef4444',
  },
  resultsHeader: {
    padding: 15,
    backgroundColor: '#ffffff',
  },
  resultsCount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
  },
  pestList: {
    flex: 1,
  },
  pestGrid: {
    padding: 15,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  pestCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pestImageSection: {
    position: 'relative',
    height: 120,
    backgroundColor: '#f3f4f6',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pestImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  threatBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  threatText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  pestContent: {
    padding: 12,
  },
  pestName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  pestScientific: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#6b7280',
    marginTop: 2,
  },
  pestCategory: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '600',
    marginTop: 6,
    textTransform: 'uppercase',
  },
  pestDescription: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 6,
    lineHeight: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  modalDescription: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 20,
  },
  modalInputContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  modalInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
  },
  modalSearchButton: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 10,
    gap: 6,
  },
  modalSearchButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  customResultCard: {
    backgroundColor: '#f0fdf4',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  customResultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  customResultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#166534',
  },
  customResultName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  customResultScientific: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#6b7280',
    marginBottom: 12,
  },
  customResultDescription: {
    fontSize: 13,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 15,
  },
  customResultBadges: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 15,
  },
  badge: {
    backgroundColor: '#d1d5db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1f2937',
  },
  viewDetailsButton: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  viewDetailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
});


