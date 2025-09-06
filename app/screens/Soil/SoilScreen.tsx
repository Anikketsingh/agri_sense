import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../hooks/useI18n';

export default function SoilScreen() {
  const { t } = useI18n();
  const [isConnected, setIsConnected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [soilData, setSoilData] = useState(null);

  const handleConnectDevice = () => {
    Alert.alert('Connect Device', 'BLE connection will be implemented here');
    setIsConnected(true);
  };

  const handleStartScan = () => {
    setIsScanning(true);
    // TODO: Implement BLE data reading
    setTimeout(() => {
      setIsScanning(false);
      setSoilData({
        ph: 6.5,
        nitrogen: 18,
        phosphorus: 14,
        potassium: 110,
        moisture: 21.3,
        score: 85,
      });
    }, 3000);
  };

  const renderSoilMetric = (label: string, value: number, unit: string, color: string) => (
    <View style={styles.metric}>
      <Text style={styles.metricLabel}>{label}</Text>
      <View style={styles.metricValue}>
        <Text style={[styles.metricNumber, { color }]}>{value}</Text>
        <Text style={styles.metricUnit}>{unit}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('soil.title')}</Text>
      </View>

      <View style={styles.content}>
        {!isConnected ? (
          <View style={styles.connectSection}>
            <Ionicons name="bluetooth-outline" size={64} color="#ccc" />
            <Text style={styles.connectText}>Connect your soil sensor device</Text>
            <TouchableOpacity style={styles.connectButton} onPress={handleConnectDevice}>
              <Text style={styles.connectButtonText}>{t('soil.connectDevice')}</Text>
            </TouchableOpacity>
          </View>
        ) : !soilData ? (
          <View style={styles.scanSection}>
            <Ionicons name="leaf-outline" size={64} color="#2E7D32" />
            <Text style={styles.scanText}>
              {isScanning ? t('soil.scanning') : 'Ready to scan soil'}
            </Text>
            {isScanning && (
              <View style={styles.scanningIndicator}>
                <Text style={styles.scanningText}>Analyzing soil...</Text>
              </View>
            )}
            <TouchableOpacity
              style={[styles.scanButton, isScanning && styles.scanButtonDisabled]}
              onPress={handleStartScan}
              disabled={isScanning}
            >
              <Text style={styles.scanButtonText}>
                {isScanning ? 'Scanning...' : 'Start Soil Analysis'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.resultsSection}>
            <Text style={styles.resultsTitle}>{t('soil.results')}</Text>
            
            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>Soil Score</Text>
              <Text style={styles.scoreValue}>{soilData.score}/100</Text>
            </View>

            <View style={styles.metricsGrid}>
              {renderSoilMetric(t('soil.ph'), soilData.ph, '', '#4CAF50')}
              {renderSoilMetric(t('soil.nitrogen'), soilData.nitrogen, 'ppm', '#2196F3')}
              {renderSoilMetric(t('soil.phosphorus'), soilData.phosphorus, 'ppm', '#FF9800')}
              {renderSoilMetric(t('soil.potassium'), soilData.potassium, 'ppm', '#9C27B0')}
              {renderSoilMetric(t('soil.moisture'), soilData.moisture, '%', '#00BCD4')}
            </View>

            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save Soil Analysis</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
  connectSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  connectText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
  connectButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  connectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scanSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
  scanningIndicator: {
    backgroundColor: '#E8F5E8',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
  },
  scanningText: {
    color: '#2E7D32',
    fontSize: 14,
  },
  scanButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  scanButtonDisabled: {
    backgroundColor: '#ccc',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsSection: {
    flex: 1,
  },
  resultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  scoreCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scoreLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  metric: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  metricLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  metricValue: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  metricNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  metricUnit: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  saveButton: {
    backgroundColor: '#1976D2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

