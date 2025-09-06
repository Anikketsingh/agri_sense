import { useState, useEffect, useRef, useCallback } from 'react';
import * as Location from 'expo-location';
import { Coordinate } from '../lib/geoUtils';

interface GPSTrackingState {
  coordinates: number[][];
  isTracking: boolean;
  accuracy: number | null;
  error: string | null;
  totalDistance: number;
  currentLocation: Coordinate | null;
}

interface GPSTrackingActions {
  startTracking: () => Promise<void>;
  stopTracking: () => void;
  clearCoordinates: () => void;
  addManualPoint: (coordinate: Coordinate) => void;
  removeLastPoint: () => void;
}

export const useGPSTracking = (): GPSTrackingState & GPSTrackingActions => {
  const [coordinates, setCoordinates] = useState<number[][]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(null);
  
  const watchIdRef = useRef<Location.LocationSubscription | null>(null);
  const lastCoordinateRef = useRef<Coordinate | null>(null);

  // Calculate distance between two coordinates
  const calculateDistance = useCallback((coord1: Coordinate, coord2: Coordinate): number => {
    const R = 6371000; // Earth's radius in meters
    const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
    const dLng = (coord2.longitude - coord1.longitude) * Math.PI / 180;
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(coord1.latitude * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return R * c;
  }, []);

  // Request location permissions
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    try {
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== 'granted') {
        setError('Location permission denied');
        return false;
      }

      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      if (backgroundStatus !== 'granted') {
        setError('Background location permission denied');
        return false;
      }

      return true;
    } catch (err) {
      setError('Failed to request location permissions');
      return false;
    }
  }, []);

  // Start tracking GPS coordinates
  const startTracking = useCallback(async () => {
    try {
      setError(null);
      
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      // Get initial location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });

      const initialCoord: Coordinate = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setCurrentLocation(initialCoord);
      setCoordinates([[initialCoord.longitude, initialCoord.latitude]]);
      setAccuracy(location.coords.accuracy);
      lastCoordinateRef.current = initialCoord;
      setIsTracking(true);

      // Start watching location changes
      watchIdRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 2000, // Update every 2 seconds
          distanceInterval: 2, // Update every 2 meters
        },
        (newLocation) => {
          const newCoord: Coordinate = {
            latitude: newLocation.coords.latitude,
            longitude: newLocation.coords.longitude,
          };

          setCurrentLocation(newCoord);
          setAccuracy(newLocation.coords.accuracy);

          // Only add coordinate if it's significantly different from the last one
          if (lastCoordinateRef.current) {
            const distance = calculateDistance(lastCoordinateRef.current, newCoord);
            
            // Add point if distance is greater than 2 meters
            if (distance >= 2) {
              setCoordinates(prev => {
                const newCoords = [...prev, [newCoord.longitude, newCoord.latitude]];
                return newCoords;
              });

              // Update total distance
              setTotalDistance(prev => prev + distance);
              lastCoordinateRef.current = newCoord;
            }
          }
        }
      );
    } catch (err) {
      setError('Failed to start GPS tracking');
      console.error('GPS tracking error:', err);
    }
  }, [requestPermissions, calculateDistance]);

  // Stop tracking GPS coordinates
  const stopTracking = useCallback(() => {
    if (watchIdRef.current) {
      watchIdRef.current.remove();
      watchIdRef.current = null;
    }
    setIsTracking(false);
  }, []);

  // Clear all coordinates
  const clearCoordinates = useCallback(() => {
    setCoordinates([]);
    setTotalDistance(0);
    lastCoordinateRef.current = null;
  }, []);

  // Add manual point (for manual editing)
  const addManualPoint = useCallback((coordinate: Coordinate) => {
    setCoordinates(prev => [...prev, [coordinate.longitude, coordinate.latitude]]);
  }, []);

  // Remove last point
  const removeLastPoint = useCallback(() => {
    setCoordinates(prev => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, -1);
    });
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        watchIdRef.current.remove();
      }
    };
  }, []);

  return {
    coordinates,
    isTracking,
    accuracy,
    error,
    totalDistance,
    currentLocation,
    startTracking,
    stopTracking,
    clearCoordinates,
    addManualPoint,
    removeLastPoint,
  };
};
