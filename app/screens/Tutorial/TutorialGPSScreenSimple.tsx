import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TutorialGPSScreenSimple() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>GPS Tutorial</Text>
        <Text style={styles.subtitle}>Step {currentStep + 1}</Text>
        <Text style={styles.description}>
          This is a simplified version to test if React hooks work properly.
        </Text>
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
  subtitle: {
    fontSize: 18,
    color: '#6c757d',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 24,
  },
});
