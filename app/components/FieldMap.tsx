import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Coordinate } from '../lib/geoUtils';

interface FieldMapProps {
  coordinates: number[][];
  currentLocation: Coordinate | null;
  accuracy: number | null;
  isTracking: boolean;
  onAddPoint: (coordinate: Coordinate) => void;
  onRemoveLastPoint: () => void;
  onClearPoints: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const FieldMap: React.FC<FieldMapProps> = ({
  coordinates,
  currentLocation,
  accuracy,
  isTracking,
  onAddPoint,
  onRemoveLastPoint,
  onClearPoints,
}) => {
  const [showControls, setShowControls] = useState(false);

  const handleMapPress = (event: any) => {
    if (!isTracking) return;
    
    // For now, we'll use the current location when user taps
    // In a real implementation, you'd convert screen coordinates to lat/lng
    if (currentLocation) {
      onAddPoint(currentLocation);
    }
  };

  const handleAddCurrentLocation = () => {
    if (currentLocation) {
      onAddPoint(currentLocation);
    } else {
      Alert.alert('No Location', 'Current location not available');
    }
  };

  const renderPolygon = () => {
    if (coordinates.length < 2) return null;

    // Simple polygon visualization using basic shapes
    // In a real app, you'd use a proper map library
    return (
      <View style={styles.polygonContainer}>
        {coordinates.map((coord, index) => (
          <View
            key={index}
            style={[
              styles.polygonPoint,
              { 
                left: (coord[0] + 180) * (screenWidth / 360), // Simple projection
                top: (90 - coord[1]) * (screenHeight / 180),
              }
            ]}
          >
            <View style={styles.pointDot} />
            {index > 0 && (
              <View
                style={[
                  styles.connectingLine,
                  {
                    width: Math.sqrt(
                      Math.pow(
                        (coord[0] - coordinates[index - 1][0]) * (screenWidth / 360), 2
                      ) + Math.pow(
                        (coord[1] - coordinates[index - 1][1]) * (screenHeight / 180), 2
                      )
                    ),
                    transform: [{
                      rotate: `${Math.atan2(
                        (coord[1] - coordinates[index - 1][1]) * (screenHeight / 180),
                        (coord[0] - coordinates[index - 1][0]) * (screenWidth / 360)
                      )}rad`
                    }]
                  }
                ]}
              />
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderCurrentLocation = () => {
    if (!currentLocation) return null;

    return (
      <View
        style={[
          styles.currentLocationMarker,
          {
            left: (currentLocation.longitude + 180) * (screenWidth / 360),
            top: (90 - currentLocation.latitude) * (screenHeight / 180),
          }
        ]}
      >
        <Ionicons name="locate" size={20} color="#2E7D32" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.mapArea}
        onPress={handleMapPress}
        activeOpacity={0.8}
      >
        {/* Map background placeholder */}
        <View style={styles.mapBackground}>
          <Ionicons name="map-outline" size={64} color="#ccc" />
          <Text style={styles.mapText}>
            {isTracking ? 'Walk around your field boundary' : 'Tap to start scanning'}
          </Text>
          {accuracy && (
            <Text style={styles.accuracyText}>
              Accuracy: {accuracy.toFixed(0)}m
            </Text>
          )}
        </View>

        {/* Polygon overlay */}
        {renderPolygon()}
        
        {/* Current location marker */}
        {renderCurrentLocation()}

        {/* GPS status indicator */}
        {isTracking && (
          <View style={styles.gpsIndicator}>
            <View style={styles.gpsDot} />
            <Text style={styles.gpsText}>GPS Tracking</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Control buttons */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setShowControls(!showControls)}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color="#666" />
        </TouchableOpacity>

        {showControls && (
          <View style={styles.controlPanel}>
            <TouchableOpacity
              style={styles.controlAction}
              onPress={handleAddCurrentLocation}
            >
              <Ionicons name="add-circle" size={20} color="#2E7D32" />
              <Text style={styles.controlText}>Add Point</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlAction}
              onPress={onRemoveLastPoint}
              disabled={coordinates.length <= 1}
            >
              <Ionicons name="remove-circle" size={20} color="#D32F2F" />
              <Text style={styles.controlText}>Remove Last</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlAction}
              onPress={onClearPoints}
              disabled={coordinates.length === 0}
            >
              <Ionicons name="trash" size={20} color="#D32F2F" />
              <Text style={styles.controlText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Coordinate count */}
      {coordinates.length > 0 && (
        <View style={styles.coordinateCount}>
          <Text style={styles.countText}>
            {coordinates.length} point{coordinates.length !== 1 ? 's' : ''}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  mapArea: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  mapBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
  },
  mapText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  accuracyText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
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
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2E7D32',
    borderWidth: 2,
    borderColor: '#fff',
  },
  connectingLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#2E7D32',
    top: 5,
    left: 6,
  },
  currentLocationMarker: {
    position: 'absolute',
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#2E7D32',
  },
  gpsIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  gpsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
    marginRight: 6,
  },
  gpsText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  controls: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  controlPanel: {
    position: 'absolute',
    bottom: 60,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minWidth: 120,
  },
  controlAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  controlText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  coordinateCount: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  countText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
});
