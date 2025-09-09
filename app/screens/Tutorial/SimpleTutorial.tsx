import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function SimpleTutorial() {
  const navigation = useNavigation();

  const handleComplete = () => {
    navigation.navigate('MainTabs' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="location" size={80} color="#2E7D32" />
        </View>
        
        <Text style={styles.title}>GPS Field Mapping</Text>
        <Text style={styles.description}>
          Learn how to map your fields using GPS technology. This tutorial will show you how to:
        </Text>
        
        <View style={styles.features}>
          <View style={styles.feature}>
            <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />
            <Text style={styles.featureText}>Walk around your field boundaries</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />
            <Text style={styles.featureText}>Record GPS points automatically</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />
            <Text style={styles.featureText}>Calculate field area in real-time</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />
            <Text style={styles.featureText}>Save and manage your field data</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleComplete}>
          <Text style={styles.buttonText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
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
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: 300,
  },
  features: {
    width: '100%',
    maxWidth: 300,
    marginBottom: 40,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#495057',
    marginLeft: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
});
