import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
// import { useI18n } from '../../hooks/useI18n';
import { useTutorialStore } from '../../store/tutorialStore';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  action: string;
  buttonText: string;
}

interface DemoPoint {
  id: string;
  x: number;
  y: number;
  timestamp: number;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: '1',
    title: 'Start GPS Tracking',
    description: 'Tap the "Start Scan" button to begin recording your field boundary.',
    icon: 'play-circle',
    color: '#2E7D32',
    action: 'start',
    buttonText: 'Start Scan',
  },
  {
    id: '2',
    title: 'Add Boundary Points',
    description: 'Keep tapping "Add Point" to place GPS markers around your field. You need at least 3 points to create a boundary.',
    icon: 'add-circle',
    color: '#1976D2',
    action: 'add_points',
    buttonText: 'Add Point',
  },
  {
    id: '3',
    title: 'Watch Live Area Calculation',
    description: 'See the field area calculated in real-time as you add points. The polygon forms automatically.',
    icon: 'calculator',
    color: '#7B1FA2',
    action: 'calculate',
    buttonText: 'Calculate Area',
  },
  {
    id: '4',
    title: 'Complete and Save',
    description: 'When you have enough points, tap "Complete Scan" to finish and save your field.',
    icon: 'checkmark-circle',
    color: '#D32F2F',
    action: 'complete',
    buttonText: 'Complete Scan',
  },
];

export default function TutorialGPSScreen() {
  // ALL HOOKS MUST BE CALLED UNCONDITIONALLY AT THE TOP
  const [currentStep, setCurrentStep] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const [demoPoints, setDemoPoints] = useState<DemoPoint[]>([]);
  const [calculatedArea, setCalculatedArea] = useState(0);
  const [isPolygonComplete, setIsPolygonComplete] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Navigation and store access - always call hooks
  const navigation = useNavigation();
  const tutorialStore = useTutorialStore();
  const setGPSCompleted = tutorialStore?.setGPSCompleted;

  // Animation values
  const pointAnimation = useRef(new Animated.Value(0)).current;
  const polygonAnimation = useRef(new Animated.Value(0)).current;
  const areaAnimation = useRef(new Animated.Value(0)).current;

  // Initialization effect
  useEffect(() => {
    try {
      setIsInitialized(true);
    } catch (err) {
      console.warn('Component initialization failed:', err);
      setError('Failed to initialize component');
    }
  }, []);

  // Current step data - must be called unconditionally
  const currentStepData = tutorialSteps[currentStep];

  // Predefined demo points for a realistic field shape
  const predefinedPoints = [
    { x: 80, y: 180 },
    { x: 180, y: 140 },
    { x: 280, y: 160 },
    { x: 320, y: 220 },
    { x: 300, y: 320 },
    { x: 220, y: 360 },
    { x: 140, y: 340 },
    { x: 100, y: 280 },
  ];

  // Calculate area using shoelace formula
  const calculatePolygonArea = (points: DemoPoint[]) => {
    if (points.length < 3) return 0;
    
    let area = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      area += points[i].x * points[j].y;
      area -= points[j].x * points[i].y;
    }
    return Math.abs(area) / 2;
  };

  // Convert area to acres (assuming 1 unit = 1 meter)
  const convertToAcres = (areaInSquareMeters: number) => {
    return (areaInSquareMeters / 4046.86).toFixed(2);
  };

  const handleStartScan = useCallback(() => {
    try {
      setIsScanning(true);
      setDemoPoints([]);
      setCalculatedArea(0);
      setIsPolygonComplete(false);
      
      // Animate the start
      Animated.timing(pointAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } catch (err) {
      console.warn('Failed to start scan:', err);
      setError('Failed to start scan');
    }
  }, [pointAnimation]);

  const handleAddPoint = useCallback(() => {
    try {
      if (!isScanning || demoPoints.length >= predefinedPoints.length) return;
      
      const nextPoint = predefinedPoints[demoPoints.length];
      const newPoint: DemoPoint = {
        id: `point_${Date.now()}`,
        x: nextPoint.x,
        y: nextPoint.y,
        timestamp: Date.now(),
      };
      
      const newPoints = [...demoPoints, newPoint];
      setDemoPoints(newPoints);
      
      // Animate point appearance
      Animated.sequence([
        Animated.timing(pointAnimation, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(pointAnimation, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Calculate area if we have enough points
      if (newPoints.length >= 2) {
        const area = calculatePolygonArea(newPoints);
        setCalculatedArea(area);
        
        // Animate area calculation
        Animated.timing(areaAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      }
      
      // Check if polygon is complete
      if (newPoints.length >= 7) {
        setIsPolygonComplete(true);
        Animated.timing(polygonAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }).start();
        
        // Auto-advance to next step when polygon is complete
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
        }, 2000);
      }
    } catch (err) {
      console.warn('Failed to add point:', err);
      setError('Failed to add point');
    }
  }, [isScanning, demoPoints, predefinedPoints, pointAnimation, areaAnimation, polygonAnimation, calculatePolygonArea]);

  const handleCalculateArea = useCallback(() => {
    try {
      if (demoPoints.length < 3) return;
      
      const area = calculatePolygonArea(demoPoints);
      setCalculatedArea(area);
      
      Animated.timing(areaAnimation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    } catch (err) {
      console.warn('Failed to calculate area:', err);
      setError('Failed to calculate area');
    }
  }, [demoPoints, calculatePolygonArea, areaAnimation]);

  const handleCompleteScan = useCallback(() => {
    try {
      if (demoPoints.length < 3) {
        Alert.alert('Not Enough Points', 'Add at least 3 points to create a field boundary.');
        return;
      }
      
      setIsScanning(false);
      Alert.alert(
        'Field Saved!',
        `Your field has been saved with an area of ${convertToAcres(calculatedArea)} acres.`,
        [{ text: 'OK', onPress: () => setCurrentStep(prev => prev + 1) }]
      );
    } catch (err) {
      console.warn('Failed to complete scan:', err);
      setError('Failed to complete scan');
    }
  }, [demoPoints.length, calculatedArea, convertToAcres]);

  const handleNext = useCallback(() => {
    try {
      const currentStepData = tutorialSteps[currentStep];
      if (!currentStepData) return;
      
      // Handle step-specific actions
      switch (currentStepData.action) {
        case 'start':
          handleStartScan();
          // Advance to next step after starting
          setTimeout(() => {
            setCurrentStep(prev => prev + 1);
          }, 500);
          break;
        case 'add_points':
          handleAddPoint();
          // Don't advance step automatically - let user add multiple points
          // The step will advance when they have enough points (handled in handleAddPoint)
          break;
        case 'calculate':
          handleCalculateArea();
          // Advance to next step after calculating
          setTimeout(() => {
            setCurrentStep(prev => prev + 1);
          }, 1000);
          break;
        case 'complete':
          handleCompleteScan();
          // Don't advance step, let complete handler do it
          break;
      }
    } catch (err) {
      console.warn('Failed to handle next step:', err);
      setError('Failed to handle next step');
    }
  }, [currentStep, handleStartScan, handleAddPoint, handleCalculateArea, handleCompleteScan]);

  const handlePrevious = useCallback(() => {
    try {
      if (currentStep > 0) {
        setCurrentStep(prev => prev - 1);
      }
    } catch (err) {
      console.warn('Failed to go to previous step:', err);
      setError('Failed to go to previous step');
    }
  }, [currentStep]);

  const handleComplete = useCallback(() => {
    try {
      if (setGPSCompleted) {
        setGPSCompleted(true);
      }
      if (navigation?.navigate) {
        navigation.navigate('MainTabs' as never);
      }
    } catch (err) {
      console.warn('Failed to complete tutorial:', err);
      setError('Failed to complete tutorial');
    }
  }, [setGPSCompleted, navigation]);

  const handleSkip = useCallback(() => {
    try {
      Alert.alert(
        'Skip Tutorial',
        'Are you sure you want to skip the GPS tutorial? You can always access it later from settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Skip', onPress: handleComplete },
        ]
      );
    } catch (err) {
      console.warn('Failed to skip tutorial:', err);
      setError('Failed to skip tutorial');
    }
  }, [handleComplete]);

  const renderMapDemo = () => {
    return (
      <View style={styles.mapContainer}>
        {/* Mock Map Background */}
        <View style={styles.mapBackground}>
          {/* Grid Lines */}
          <View style={styles.grid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <View key={i} style={styles.gridLine} />
            ))}
          </View>
          
          {/* Demo Points */}
          {demoPoints.map((point, index) => (
            <Animated.View
              key={point.id}
              style={[
                styles.demoPoint,
                {
                  left: point.x - 12,
                  top: point.y - 12,
                  transform: [
                    {
                      scale: pointAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Ionicons name="location" size={24} color="#2E7D32" />
              <View style={styles.pointNumber}>
                <Text style={styles.pointNumberText}>{index + 1}</Text>
              </View>
            </Animated.View>
          ))}

          {/* Polygon Lines */}
          {demoPoints.length >= 2 && (
            <Animated.View
              style={[
                styles.polygonContainer,
                {
                  opacity: polygonAnimation,
                },
              ]}
            >
              {demoPoints.map((point, index) => {
                const nextPoint = demoPoints[(index + 1) % demoPoints.length];
                if (index === demoPoints.length - 1 && !isPolygonComplete) return null;
                
                const angle = Math.atan2(
                  nextPoint.y - point.y,
                  nextPoint.x - point.x
                );
                const distance = Math.sqrt(
                  Math.pow(nextPoint.x - point.x, 2) + Math.pow(nextPoint.y - point.y, 2)
                );
                
                return (
                  <View
                    key={`line-${index}`}
                    style={[
                      styles.polygonLine,
                      {
                        left: point.x,
                        top: point.y,
                        width: distance,
                        transform: [{ rotate: `${angle}rad` }],
                      },
                    ]}
                  />
                );
              })}
            </Animated.View>
          )}

          {/* Area Display */}
          {calculatedArea > 0 && (
            <Animated.View
              style={[
                styles.areaDisplay,
                {
                  opacity: areaAnimation,
                  transform: [
                    {
                      scale: areaAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.areaText}>{convertToAcres(calculatedArea)} acres</Text>
              <Text style={styles.areaLabel}>Field Area</Text>
            </Animated.View>
          )}

          {/* Scanning Indicator */}
          {isScanning && (
            <View style={styles.scanningIndicator}>
              <Animated.View
                style={[
                  styles.scanningDot,
                  {
                    transform: [
                      {
                        scale: pointAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.5],
                        }),
                      },
                    ],
                  },
                ]}
              />
              <Text style={styles.scanningText}>GPS Tracking Active</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handlePrevious}>
          <Ionicons name="chevron-back" size={24} color="#6c757d" />
        </TouchableOpacity>
        
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentStep + 1) / tutorialSteps.length) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {currentStep + 1} of {tutorialSteps.length}
          </Text>
        </View>
        
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Step Info */}
        <View style={styles.stepInfo}>
          <View style={[styles.stepIcon, { backgroundColor: currentStepData.color + '20' }]}>
            <Ionicons name={currentStepData.icon} size={40} color={currentStepData.color} />
          </View>
          
          <Text style={styles.stepTitle}>{currentStepData.title}</Text>
          <Text style={styles.stepDescription}>{currentStepData.description}</Text>
          
          {/* Progress indicator for add points step */}
          {currentStepData.action === 'add_points' && (
            <View style={styles.progressInfo}>
              <Text style={styles.progressText}>
                Points: {demoPoints.length}/8 • Need at least 3 for boundary
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${(demoPoints.length / 8) * 100}%` }
                  ]} 
                />
              </View>
            </View>
          )}
        </View>

        {/* Map Demo */}
        {renderMapDemo()}

        {/* Interactive Demo Stats */}
        <View style={styles.demoStats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{demoPoints.length}</Text>
            <Text style={styles.statLabel}>Points Added</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {calculatedArea > 0 ? convertToAcres(calculatedArea) : '0.00'}
            </Text>
            <Text style={styles.statLabel}>Acres</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {isPolygonComplete ? 'Yes' : 'No'}
            </Text>
            <Text style={styles.statLabel}>Complete</Text>
          </View>
        </View>

        {/* Action Buttons Demo */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.demoButton,
              { 
                backgroundColor: currentStepData.color,
                opacity: (isScanning || currentStep === 0) ? 1 : 0.5,
              }
            ]}
            onPress={handleNext}
            disabled={!isScanning && currentStep > 0}
          >
            <Ionicons 
              name={
                currentStepData.action === 'start' ? 'play' :
                currentStepData.action === 'add_points' ? 'add' :
                currentStepData.action === 'calculate' ? 'calculator' :
                'checkmark'
              } 
              size={20} 
              color="#fff" 
            />
            <Text style={styles.demoButtonText}>{currentStepData.buttonText}</Text>
          </TouchableOpacity>
          
          {isScanning && currentStep > 0 && (
            <TouchableOpacity
              style={[styles.demoButton, styles.stopButton]}
              onPress={() => {
                setIsScanning(false);
                Alert.alert('Scan Stopped', 'GPS tracking has been stopped.');
              }}
            >
              <Ionicons name="stop" size={20} color="#fff" />
              <Text style={styles.demoButtonText}>Stop Scan</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Navigation */}
      <View style={styles.navigation}>
        <TouchableOpacity
          style={[
            styles.navButton,
            styles.nextButton,
            { backgroundColor: currentStepData.color }
          ]}
          onPress={handleNext}
        >
          <Text style={styles.navButtonText}>
            {currentStep === tutorialSteps.length - 1 
              ? 'Complete' 
              : 'Next'
            }
          </Text>
          <Ionicons 
            name={currentStep === tutorialSteps.length - 1 ? 'checkmark' : 'chevron-forward'} 
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
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  backButton: {
    padding: 8,
  },
  progressContainer: {
    flex: 1,
    marginHorizontal: 20,
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
    textAlign: 'center',
  },
  skipButton: {
    padding: 8,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  stepInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  stepIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212529',
    textAlign: 'center',
    marginBottom: 12,
  },
  stepDescription: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  progressInfo: {
    marginTop: 16,
    width: '100%',
    maxWidth: 300,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 18,
    color: '#6c757d',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  mapBackground: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    position: 'relative',
  },
  grid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gridLine: {
    position: 'absolute',
    backgroundColor: '#e9ecef',
    opacity: 0.3,
  },
  demoPoint: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  pointNumber: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointNumberText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  scanningIndicator: {
    position: 'absolute',
    top: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 125, 50, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  scanningDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 8,
  },
  scanningText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  polygonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  polygonPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2E7D32',
  },
  polygonLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#2E7D32',
  },
  areaDisplay: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  areaText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
  },
  areaLabel: {
    fontSize: 12,
    color: '#6c757d',
  },
  demoStats: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6c757d',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  demoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  startButton: {
    // Styled via backgroundColor
  },
  stopButton: {
    // Styled via backgroundColor
  },
  demoButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
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
    // Styled via backgroundColor
  },
  navButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
