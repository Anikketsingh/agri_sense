import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useI18n } from '../../hooks/useI18n';
import { useTutorialStore } from '../../store/tutorialStore';

const { width: screenWidth } = Dimensions.get('window');

interface TutorialSlide {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  illustration?: string;
}

const tutorialSlides: TutorialSlide[] = [
  {
    id: '1',
    title: 'Welcome to AgriSense',
    description: 'Your smart farming companion that helps you make data-driven decisions for better crop yields.',
    icon: 'leaf',
    color: '#2E7D32',
  },
  {
    id: '2',
    title: 'Map Your Fields',
    description: 'Walk around your field boundaries to create accurate field maps with real-time area calculation.',
    icon: 'map',
    color: '#1976D2',
  },
  {
    id: '3',
    title: 'Analyze Soil Health',
    description: 'Connect soil sensors to get real-time readings of pH, nutrients, and moisture levels.',
    icon: 'analytics',
    color: '#7B1FA2',
  },
  {
    id: '4',
    title: 'Get Smart Suggestions',
    description: 'Receive AI-powered crop recommendations and farming advice based on your field data.',
    icon: 'bulb',
    color: '#F57C00',
  },
];

export default function TutorialIntroScreen() {
  const { t } = useI18n();
  const navigation = useNavigation();
  const { setIntroCompleted } = useTutorialStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleNext = () => {
    if (currentSlide < tutorialSlides.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      scrollViewRef.current?.scrollTo({
        x: nextSlide * screenWidth,
        animated: true,
      });
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    navigation.navigate('TutorialGPS' as never);
  };

  const handleGetStarted = () => {
    setIntroCompleted(true);
    navigation.navigate('TutorialGPS' as never);
  };

  const handleScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setCurrentSlide(slideIndex);
  };

  const renderSlide = (slide: TutorialSlide, index: number) => (
    <View key={slide.id} style={styles.slide}>
      <View style={styles.slideContent}>
        <View style={[styles.iconContainer, { backgroundColor: slide.color + '20' }]}>
          <Ionicons name={slide.icon} size={80} color={slide.color} />
        </View>
        
        <Text style={styles.slideTitle}>{slide.title}</Text>
        <Text style={styles.slideDescription}>{slide.description}</Text>
        
        {index === 0 && (
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />
              <Text style={styles.featureText}>GPS Field Mapping</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />
              <Text style={styles.featureText}>Soil Analysis</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />
              <Text style={styles.featureText}>Crop Recommendations</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />
              <Text style={styles.featureText}>Market Prices</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentSlide + 1) / tutorialSlides.length) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {currentSlide + 1} of {tutorialSlides.length}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>{t('tutorial.skip')}</Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={styles.scrollView}
      >
        {tutorialSlides.map((slide, index) => renderSlide(slide, index))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {tutorialSlides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentSlide && styles.activeDot,
            ]}
          />
        ))}
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[
            styles.navButton,
            styles.nextButton,
            { backgroundColor: tutorialSlides[currentSlide].color }
          ]}
          onPress={handleNext}
        >
          <Text style={styles.navButtonText}>
            {currentSlide === tutorialSlides.length - 1 
              ? t('tutorial.getStarted') 
              : t('tutorial.next')
            }
          </Text>
          <Ionicons 
            name={currentSlide === tutorialSlides.length - 1 ? 'arrow-forward' : 'chevron-forward'} 
            size={20} 
            color="#fff" 
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  progressContainer: {
    flex: 1,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: screenWidth,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  slideContent: {
    alignItems: 'center',
    maxWidth: 320,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#212529',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  slideDescription: {
    fontSize: 18,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 32,
  },
  featureList: {
    width: '100%',
    marginTop: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#495057',
    marginLeft: 12,
    fontWeight: '500',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#dee2e6',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#2E7D32',
    width: 24,
  },
  navigation: {
    padding: 20,
    paddingBottom: 30,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 8,
  },
  nextButton: {
    // Styled via backgroundColor in component
  },
  navButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
