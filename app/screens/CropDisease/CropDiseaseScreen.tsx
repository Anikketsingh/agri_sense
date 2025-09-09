import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../hooks/useI18n';

export default function CropDiseaseScreen() {
  const { t } = useI18n();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleCameraPress = () => {
    Alert.alert('Camera', 'Camera integration coming soon!');
  };

  const handleGalleryPress = () => {
    Alert.alert('Gallery', 'Gallery integration coming soon!');
  };

  const handleAnalyzePress = () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select an image first');
      return;
    }
    
    setIsAnalyzing(true);
    // Simulate analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      Alert.alert('Analysis Complete', 'Disease detection results will be shown here');
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('cropDisease.title')}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Instructions */}
        <View style={styles.instructionCard}>
          <Ionicons name="information-circle" size={24} color="#1976D2" />
          <View style={styles.instructionContent}>
            <Text style={styles.instructionTitle}>{t('cropDisease.instructionsTitle')}</Text>
            <Text style={styles.instructionText}>{t('cropDisease.instructionsText')}</Text>
          </View>
        </View>

        {/* Image Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('cropDisease.selectImage')}</Text>
          
          <View style={styles.imageContainer}>
            {selectedImage ? (
              <Image source={{ uri: selectedImage }} style={styles.previewImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="camera-outline" size={48} color="#ccc" />
                <Text style={styles.placeholderText}>{t('cropDisease.noImageSelected')}</Text>
              </View>
            )}
          </View>

          <View style={styles.imageButtons}>
            <TouchableOpacity style={styles.imageButton} onPress={handleCameraPress}>
              <Ionicons name="camera" size={20} color="#fff" />
              <Text style={styles.imageButtonText}>{t('cropDisease.takePhoto')}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.imageButton} onPress={handleGalleryPress}>
              <Ionicons name="images" size={20} color="#fff" />
              <Text style={styles.imageButtonText}>{t('cropDisease.selectFromGallery')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Analysis Button */}
        <TouchableOpacity 
          style={[styles.analyzeButton, (!selectedImage || isAnalyzing) && styles.analyzeButtonDisabled]}
          onPress={handleAnalyzePress}
          disabled={!selectedImage || isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <Ionicons name="hourglass-outline" size={20} color="#fff" />
              <Text style={styles.analyzeButtonText}>{t('cropDisease.analyzing')}</Text>
            </>
          ) : (
            <>
              <Ionicons name="search" size={20} color="#fff" />
              <Text style={styles.analyzeButtonText}>{t('cropDisease.analyzeImage')}</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Results Placeholder */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('cropDisease.results')}</Text>
          <View style={styles.resultsPlaceholder}>
            <Ionicons name="leaf-outline" size={48} color="#ccc" />
            <Text style={styles.resultsPlaceholderText}>{t('cropDisease.noResultsYet')}</Text>
          </View>
        </View>

        {/* Common Diseases Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('cropDisease.commonDiseases')}</Text>
          <View style={styles.diseaseList}>
            <View style={styles.diseaseItem}>
              <View style={styles.diseaseIcon}>
                <Ionicons name="warning" size={20} color="#D32F2F" />
              </View>
              <View style={styles.diseaseContent}>
                <Text style={styles.diseaseName}>Leaf Blight</Text>
                <Text style={styles.diseaseDescription}>Brown spots on leaves</Text>
              </View>
            </View>
            
            <View style={styles.diseaseItem}>
              <View style={styles.diseaseIcon}>
                <Ionicons name="warning" size={20} color="#F57C00" />
              </View>
              <View style={styles.diseaseContent}>
                <Text style={styles.diseaseName}>Powdery Mildew</Text>
                <Text style={styles.diseaseDescription}>White powdery coating</Text>
              </View>
            </View>
            
            <View style={styles.diseaseItem}>
              <View style={styles.diseaseIcon}>
                <Ionicons name="warning" size={20} color="#7B1FA2" />
              </View>
              <View style={styles.diseaseContent}>
                <Text style={styles.diseaseName}>Root Rot</Text>
                <Text style={styles.diseaseDescription}>Wilting and yellowing</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  instructionCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 24,
  },
  instructionContent: {
    flex: 1,
    marginLeft: 12,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 4,
  },
  instructionText: {
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 16,
  },
  imageContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  placeholderImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 8,
    textAlign: 'center',
  },
  imageButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  imageButton: {
    flex: 1,
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  analyzeButton: {
    backgroundColor: '#1976D2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    gap: 8,
  },
  analyzeButtonDisabled: {
    backgroundColor: '#ccc',
  },
  analyzeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsPlaceholder: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  resultsPlaceholderText: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 12,
    textAlign: 'center',
  },
  diseaseList: {
    gap: 12,
  },
  diseaseItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  diseaseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  diseaseContent: {
    flex: 1,
  },
  diseaseName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212529',
    marginBottom: 4,
  },
  diseaseDescription: {
    fontSize: 14,
    color: '#6c757d',
  },
});
