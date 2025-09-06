import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../hooks/useI18n';

interface CropSuggestion {
  id: string;
  name: string;
  confidence: number;
  reasoning: string;
  season: string;
  yield: string;
}

export default function SuggestionsScreen() {
  const { t } = useI18n();

  // Mock data - in real app, this would come from the suggestion service
  const suggestions: CropSuggestion[] = [
    {
      id: '1',
      name: 'Wheat',
      confidence: 92,
      reasoning: 'High nitrogen levels and optimal pH range make this field ideal for wheat cultivation.',
      season: 'Rabi (Oct-Mar)',
      yield: '4-5 tons/hectare',
    },
    {
      id: '2',
      name: 'Rice',
      confidence: 78,
      reasoning: 'Good moisture retention and moderate phosphorus levels support rice growth.',
      season: 'Kharif (Jun-Oct)',
      yield: '3-4 tons/hectare',
    },
    {
      id: '3',
      name: 'Sugarcane',
      confidence: 65,
      reasoning: 'Adequate potassium levels but may need additional irrigation support.',
      season: 'Year-round',
      yield: '80-100 tons/hectare',
    },
  ];

  const handleAcceptSuggestion = (suggestion: CropSuggestion) => {
    // TODO: Implement accept suggestion logic
    console.log('Accepted suggestion:', suggestion.name);
  };

  const renderSuggestion = (suggestion: CropSuggestion) => (
    <View key={suggestion.id} style={styles.suggestionCard}>
      <View style={styles.suggestionHeader}>
        <View style={styles.cropInfo}>
          <Text style={styles.cropName}>{suggestion.name}</Text>
          <Text style={styles.cropSeason}>{suggestion.season}</Text>
        </View>
        <View style={styles.confidenceContainer}>
          <Text style={styles.confidenceLabel}>{t('suggestions.confidence')}</Text>
          <Text style={styles.confidenceValue}>{suggestion.confidence}%</Text>
        </View>
      </View>

      <View style={styles.reasoningSection}>
        <Text style={styles.reasoningLabel}>{t('suggestions.reasoning')}</Text>
        <Text style={styles.reasoningText}>{suggestion.reasoning}</Text>
      </View>

      <View style={styles.yieldInfo}>
        <Ionicons name="trending-up" size={16} color="#4CAF50" />
        <Text style={styles.yieldText}>Expected yield: {suggestion.yield}</Text>
      </View>

      <TouchableOpacity
        style={styles.acceptButton}
        onPress={() => handleAcceptSuggestion(suggestion)}
      >
        <Text style={styles.acceptButtonText}>
          {t('suggestions.acceptSuggestion')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('suggestions.title')}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <Ionicons name="bulb-outline" size={48} color="#F57C00" />
          <Text style={styles.introTitle}>{t('suggestions.topCrops')}</Text>
          <Text style={styles.introText}>
            Based on your soil analysis and field conditions
          </Text>
        </View>

        <View style={styles.suggestionsList}>
          {suggestions.map(renderSuggestion)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  introSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  suggestionsList: {
    gap: 16,
  },
  suggestionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  suggestionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cropInfo: {
    flex: 1,
  },
  cropName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cropSeason: {
    fontSize: 14,
    color: '#666',
  },
  confidenceContainer: {
    alignItems: 'center',
  },
  confidenceLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  confidenceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  reasoningSection: {
    marginBottom: 16,
  },
  reasoningLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  reasoningText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  yieldInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  yieldText: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 8,
    fontWeight: '500',
  },
  acceptButton: {
    backgroundColor: '#2E7D32',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

