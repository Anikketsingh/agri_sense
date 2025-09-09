import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTutorialStore } from '../../store/tutorialStore';

export default function TestScreen() {
  const [step, setStep] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  
  // Test useRef and useEffect
  const animationValue = useRef(new Animated.Value(0)).current;
  
  // Test navigation hook
  const navigation = useNavigation();
  
  // Test Zustand store
  const { isGPSCompleted, setGPSCompleted } = useTutorialStore();
  
  useEffect(() => {
    console.log('Component mounted, step:', step, 'GPS completed:', isGPSCompleted);
  }, [step, isGPSCompleted]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>GPS Tutorial Test</Text>
        <Text style={styles.subtitle}>Step {step + 1}</Text>
        <Text style={styles.description}>
          Testing hooks: {isScanning ? 'Scanning' : 'Not Scanning'}
        </Text>
        <Text style={styles.description}>
          GPS Completed: {isGPSCompleted ? 'Yes' : 'No'}
        </Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => setStep(step + 1)}
        >
          <Text style={styles.buttonText}>Next Step</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#2E7D32' }]}
          onPress={() => setIsScanning(!isScanning)}
        >
          <Text style={styles.buttonText}>
            {isScanning ? 'Stop Scan' : 'Start Scan'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, { backgroundColor: '#FF9800' }]}
          onPress={() => setGPSCompleted(!isGPSCompleted)}
        >
          <Text style={styles.buttonText}>
            Toggle GPS Completed
          </Text>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#2E7D32',
    marginBottom: 12,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
