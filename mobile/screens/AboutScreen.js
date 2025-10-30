import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function AboutScreen() {
  const highlights = [
    { icon: 'camera', title: 'Mobile Camera', description: 'Take photos directly with your device' },
    { icon: 'flash', title: 'Instant AI', description: 'Real-time pest identification' },
    { icon: 'leaf', title: 'Treatment Options', description: 'Organic and chemical solutions' },
  ];

  const workflow = [
    { title: 'Image Capture', description: 'User takes or uploads a pest image' },
    { title: 'AI Processing', description: 'Gemini AI analyzes the image' },
    { title: 'Pest Identification', description: 'System identifies the pest species' },
    { title: 'Information Retrieval', description: 'Fetches pest details and treatments' },
    { title: 'Results Display', description: 'Shows identification and recommendations' },
  ];

  const benefits = [
    { icon: 'infinite', title: 'Unlimited Training', description: 'Built on massive datasets' },
    { icon: 'flash', title: 'No Training Required', description: 'Ready to use immediately' },
    { icon: 'eye', title: 'Multimodal Intelligence', description: 'Understands images and context' },
    { icon: 'globe', title: 'Global Coverage', description: 'Identifies pests worldwide' },
    { icon: 'sync', title: 'Always Updated', description: 'Latest AI capabilities' },
    { icon: 'cash', title: 'Cost Effective', description: 'No training infrastructure needed' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="leaf" size={48} color="#059669" />
        <Text style={styles.title}>About PestHub Mobile</Text>
        <Text style={styles.subtitle}>
          AI-powered pest detection for modern agriculture
        </Text>
      </View>

      {/* Intro Card */}
      <View style={styles.section}>
        <View style={styles.card}>
          <Text style={styles.cardText}>
            PestHub Mobile uses Google's Gemini AI to provide instant, accurate pest identification 
            directly from your smartphone. Our advanced system analyzes images in real-time to help 
            farmers, gardeners, and agricultural professionals protect their crops.
          </Text>
        </View>
      </View>

      {/* Tech Highlights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mobile Features</Text>
        <View style={styles.highlightsGrid}>
          {highlights.map((item, index) => (
            <View key={index} style={styles.highlightCard}>
              <View style={styles.highlightIcon}>
                <Ionicons name={item.icon} size={32} color="#059669" />
              </View>
              <Text style={styles.highlightTitle}>{item.title}</Text>
              <Text style={styles.highlightDescription}>{item.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* AI Architecture */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI Architecture</Text>
        <View style={styles.card}>
          <View style={styles.architectureItem}>
            <Ionicons name="hardware-chip" size={24} color="#059669" />
            <View style={styles.architectureText}>
              <Text style={styles.architectureTitle}>Model</Text>
              <Text style={styles.architectureDescription}>Google Gemini 2.0 Flash</Text>
            </View>
          </View>
          
          <View style={styles.architectureItem}>
            <Ionicons name="flash" size={24} color="#059669" />
            <View style={styles.architectureText}>
              <Text style={styles.architectureTitle}>Processing</Text>
              <Text style={styles.architectureDescription}>Real-time multimodal classification</Text>
            </View>
          </View>
          
          <View style={styles.architectureItem}>
            <Ionicons name="shield-checkmark" size={24} color="#059669" />
            <View style={styles.architectureText}>
              <Text style={styles.architectureTitle}>Accuracy</Text>
              <Text style={styles.architectureDescription}>High-confidence predictions</Text>
            </View>
          </View>
          
          <View style={styles.architectureItem}>
            <Ionicons name="sparkles" size={24} color="#059669" />
            <View style={styles.architectureText}>
              <Text style={styles.architectureTitle}>Dynamic Generation</Text>
              <Text style={styles.architectureDescription}>Automatic info pages for new pests</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Workflow */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How It Works</Text>
        <View style={styles.card}>
          {workflow.map((step, index) => (
            <View key={index} style={styles.workflowStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>{step.title}</Text>
                <Text style={styles.stepDescription}>{step.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Pretrained AI Benefits */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Why Pretrained AI?</Text>
        <Text style={styles.sectionSubtitle}>
          Advantages over custom CNN models
        </Text>
        <View style={styles.benefitsGrid}>
          {benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitCard}>
              <Ionicons name={benefit.icon} size={28} color="#059669" />
              <Text style={styles.benefitTitle}>{benefit.title}</Text>
              <Text style={styles.benefitDescription}>{benefit.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Tech Stack */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Technology Stack</Text>
        <View style={styles.card}>
          <View style={styles.techItem}>
            <Ionicons name="logo-react" size={20} color="#61dafb" />
            <Text style={styles.techText}>React Native with Expo SDK 54</Text>
          </View>
          <View style={styles.techItem}>
            <Ionicons name="hardware-chip" size={20} color="#059669" />
            <Text style={styles.techText}>Google Gemini AI</Text>
          </View>
          <View style={styles.techItem}>
            <Ionicons name="server" size={20} color="#059669" />
            <Text style={styles.techText}>Flask Backend</Text>
          </View>
          <View style={styles.techItem}>
            <Ionicons name="camera" size={20} color="#059669" />
            <Text style={styles.techText}>Expo Camera & Image Picker</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Ionicons name="leaf-outline" size={32} color="#9ca3af" />
        <Text style={styles.footerText}>PestHub Mobile</Text>
        <Text style={styles.footerSubtext}>AI-Powered Pest Detection</Text>
        <Text style={styles.footerVersion}>Version 1.0.0</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 15,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 22,
  },
  highlightsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  highlightCard: {
    width: (width - 55) / 3,
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  highlightIcon: {
    marginBottom: 12,
  },
  highlightTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  highlightDescription: {
    fontSize: 10,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 14,
  },
  architectureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  architectureText: {
    flex: 1,
  },
  architectureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  architectureDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  workflowStep: {
    flexDirection: 'row',
    gap: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
  },
  benefitsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  benefitCard: {
    width: (width - 55) / 2,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 12,
    marginBottom: 6,
  },
  benefitDescription: {
    fontSize: 11,
    color: '#6b7280',
    lineHeight: 16,
  },
  techItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  techText: {
    fontSize: 13,
    color: '#4b5563',
  },
  footer: {
    padding: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 12,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  footerVersion: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 8,
  },
});


