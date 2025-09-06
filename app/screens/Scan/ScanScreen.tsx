import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '../../hooks/useI18n';
import { useGPSTracking } from '../../hooks/useGPSTracking';
import { FieldMap, FieldNameModal } from '../../components';
import { useFieldsStore } from '../../store/fieldsStore';
import { FieldService } from '../../services/FieldService';
import { createGeoJSONPolygon, formatArea } from '../../lib/geoUtils';

export default function ScanScreen() {
  const { t } = useI18n();
  const { addField, syncFieldToServer } = useFieldsStore();
  const fieldService = new FieldService();
  
  const {
    coordinates,
    isTracking,
    accuracy,
    error: gpsError,
    totalDistance,
    currentLocation,
    startTracking,
    stopTracking,
    clearCoordinates,
    addManualPoint,
    removeLastPoint,
  } = useGPSTracking();

  const [showNameModal, setShowNameModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [area, setArea] = useState(0);

  // Calculate area when coordinates change
  useEffect(() => {
    if (coordinates.length >= 3) {
      const polygon = createGeoJSONPolygon(coordinates, '');
      const calculatedArea = fieldService.calculateArea(polygon);
      setArea(calculatedArea);
    } else {
      setArea(0);
    }
  }, [coordinates]);

  // Handle GPS errors
  useEffect(() => {
    if (gpsError) {
      Alert.alert('GPS Error', gpsError);
    }
  }, [gpsError]);

  const handleStartScan = async () => {
    try {
      await startTracking();
    } catch (error) {
      Alert.alert('Error', 'Failed to start GPS tracking');
    }
  };

  const handleStopScan = () => {
    stopTracking();
  };

  const handleSaveField = () => {
    if (coordinates.length < 3) {
      Alert.alert('Invalid Field', 'Please scan at least 3 points to create a field');
      return;
    }
    setShowNameModal(true);
  };

  const handleFieldNameSave = async (fieldName: string) => {
    if (coordinates.length < 3) {
      Alert.alert('Invalid Field', 'Not enough coordinates to create a field');
      return;
    }

    setIsSaving(true);
    setShowNameModal(false);

    try {
      // Create GeoJSON polygon
      const polygon = createGeoJSONPolygon(coordinates, fieldName);
      
      // Validate polygon
      if (!fieldService.validatePolygon(polygon)) {
        Alert.alert('Invalid Field', 'The scanned area is not valid. Please try again.');
        setIsSaving(false);
        return;
      }

      // Create field object
      const field = {
        id: `field_${Date.now()}`,
        farmerId: 'temp_farmer_id', // TODO: Get from auth store
        name: fieldName,
        polygonGeoJSON: polygon,
        area_m2: area,
        createdAt: new Date().toISOString(),
      };

      // Add to local store immediately
      addField(field);

      // Try to sync to server
      const syncSuccess = await syncFieldToServer(field);
      
      if (syncSuccess) {
        Alert.alert('Success', 'Field saved successfully!');
        // Reset scan state
        clearCoordinates();
        setArea(0);
      } else {
        Alert.alert('Warning', 'Field saved locally but failed to sync to server. It will sync when you have internet connection.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save field');
      console.error('Save field error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const canSaveField = coordinates.length >= 3 && area > 0;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('scan.title')}</Text>
        {isTracking && (
          <View style={styles.trackingIndicator}>
            <View style={styles.trackingDot} />
            <Text style={styles.trackingText}>Tracking</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <FieldMap
          coordinates={coordinates}
          currentLocation={currentLocation}
          accuracy={accuracy}
          isTracking={isTracking}
          onAddPoint={addManualPoint}
          onRemoveLastPoint={removeLastPoint}
          onClearPoints={clearCoordinates}
        />

        <View style={styles.controls}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>{t('scan.area')}</Text>
              <Text style={styles.statValue}>{formatArea(area)}</Text>
            </View>
            
            {totalDistance > 0 && (
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Distance</Text>
                <Text style={styles.statValue}>{totalDistance.toFixed(0)}m</Text>
              </View>
            )}
            
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Points</Text>
              <Text style={styles.statValue}>{coordinates.length}</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            {!isTracking ? (
              <TouchableOpacity
                style={styles.scanButton}
                onPress={handleStartScan}
                disabled={isSaving}
              >
                <Ionicons name="play" size={24} color="#fff" />
                <Text style={styles.scanButtonText}>{t('scan.startScan')}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.scanButton, styles.scanButtonActive]}
                onPress={handleStopScan}
              >
                <Ionicons name="stop" size={24} color="#fff" />
                <Text style={styles.scanButtonText}>{t('scan.stopScan')}</Text>
              </TouchableOpacity>
            )}

            {canSaveField && !isSaving && (
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveField}
              >
                <Ionicons name="save" size={20} color="#fff" />
                <Text style={styles.saveButtonText}>{t('scan.saveField')}</Text>
              </TouchableOpacity>
            )}

            {isSaving && (
              <View style={styles.savingButton}>
                <ActivityIndicator color="#2E7D32" size="small" />
                <Text style={styles.savingText}>Saving...</Text>
              </View>
            )}
          </View>

          {coordinates.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearCoordinates}
            >
              <Ionicons name="trash-outline" size={16} color="#D32F2F" />
              <Text style={styles.clearButtonText}>Clear All Points</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FieldNameModal
        visible={showNameModal}
        onClose={() => setShowNameModal(false)}
        onSave={handleFieldNameSave}
        area={area}
        pointCount={coordinates.length}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  trackingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  trackingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  trackingText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  controls: {
    gap: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  buttonContainer: {
    gap: 12,
  },
  scanButton: {
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  scanButtonActive: {
    backgroundColor: '#D32F2F',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#1976D2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  savingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    gap: 8,
  },
  savingText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ffebee',
    gap: 6,
  },
  clearButtonText: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: '500',
  },
});

