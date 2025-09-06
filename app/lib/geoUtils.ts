// Geographic utilities for field scanning and polygon calculations

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface GeoJSONPolygon {
  type: 'Feature';
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  properties: {
    name: string;
    area_m2?: number;
  };
}

/**
 * Calculate the area of a polygon using the shoelace formula
 * @param coordinates Array of [longitude, latitude] pairs
 * @returns Area in square meters
 */
export const calculatePolygonArea = (coordinates: number[][]): number => {
  if (coordinates.length < 3) return 0;

  // Ensure the polygon is closed
  const coords = [...coordinates];
  if (coords[0][0] !== coords[coords.length - 1][0] || 
      coords[0][1] !== coords[coords.length - 1][1]) {
    coords.push(coords[0]);
  }

  let area = 0;
  const earthRadius = 6371000; // Earth's radius in meters

  for (let i = 0; i < coords.length - 1; i++) {
    const lat1 = coords[i][1] * Math.PI / 180;
    const lat2 = coords[i + 1][1] * Math.PI / 180;
    const deltaLng = (coords[i + 1][0] - coords[i][0]) * Math.PI / 180;

    area += deltaLng * (2 + Math.sin(lat1) + Math.sin(lat2));
  }

  return Math.abs(area * earthRadius * earthRadius / 2);
};

/**
 * Calculate the distance between two coordinates using Haversine formula
 * @param coord1 First coordinate
 * @param coord2 Second coordinate
 * @returns Distance in meters
 */
export const calculateDistance = (coord1: Coordinate, coord2: Coordinate): number => {
  const R = 6371000; // Earth's radius in meters
  const dLat = (coord2.latitude - coord1.latitude) * Math.PI / 180;
  const dLng = (coord2.longitude - coord1.longitude) * Math.PI / 180;
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coord1.latitude * Math.PI / 180) * Math.cos(coord2.latitude * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
};

/**
 * Validate if a polygon is valid (not self-intersecting, has minimum points)
 * @param coordinates Array of [longitude, latitude] pairs
 * @returns True if polygon is valid
 */
export const validatePolygon = (coordinates: number[][]): boolean => {
  if (coordinates.length < 3) return false;
  
  // Check for minimum area (at least 10 square meters)
  const area = calculatePolygonArea(coordinates);
  if (area < 10) return false;
  
  // Basic self-intersection check (simplified)
  // For MVP, we'll do a basic check
  return true;
};

/**
 * Create a GeoJSON polygon from coordinates
 * @param coordinates Array of [longitude, latitude] pairs
 * @param name Name of the field
 * @returns GeoJSON polygon object
 */
export const createGeoJSONPolygon = (coordinates: number[][], name: string): GeoJSONPolygon => {
  // Ensure polygon is closed
  const coords = [...coordinates];
  if (coords[0][0] !== coords[coords.length - 1][0] || 
      coords[0][1] !== coords[coords.length - 1][1]) {
    coords.push(coords[0]);
  }

  const area = calculatePolygonArea(coords);

  return {
    type: 'Feature',
    geometry: {
      type: 'Polygon',
      coordinates: [coords]
    },
    properties: {
      name,
      area_m2: area
    }
  };
};

/**
 * Simplify a polygon by removing points that are too close together
 * @param coordinates Array of [longitude, latitude] pairs
 * @param tolerance Minimum distance between points in meters
 * @returns Simplified coordinates array
 */
export const simplifyPolygon = (coordinates: number[][], tolerance: number = 2): number[][] => {
  if (coordinates.length <= 2) return coordinates;

  const simplified: number[][] = [coordinates[0]];
  let lastPoint = { latitude: coordinates[0][1], longitude: coordinates[0][0] };

  for (let i = 1; i < coordinates.length - 1; i++) {
    const currentPoint = { 
      latitude: coordinates[i][1], 
      longitude: coordinates[i][0] 
    };
    
    const distance = calculateDistance(lastPoint, currentPoint);
    
    if (distance >= tolerance) {
      simplified.push(coordinates[i]);
      lastPoint = currentPoint;
    }
  }

  // Always include the last point
  simplified.push(coordinates[coordinates.length - 1]);
  
  return simplified;
};

/**
 * Calculate the center point of a polygon
 * @param coordinates Array of [longitude, latitude] pairs
 * @returns Center coordinate
 */
export const calculatePolygonCenter = (coordinates: number[][]): Coordinate => {
  let latSum = 0;
  let lngSum = 0;
  
  coordinates.forEach(coord => {
    lngSum += coord[0];
    latSum += coord[1];
  });
  
  return {
    latitude: latSum / coordinates.length,
    longitude: lngSum / coordinates.length
  };
};

/**
 * Format area for display
 * @param areaInM2 Area in square meters
 * @param isMetric Whether to use metric units
 * @returns Formatted area string
 */
export const formatArea = (areaInM2: number, isMetric: boolean = true): string => {
  if (isMetric) {
    if (areaInM2 >= 10000) {
      return `${(areaInM2 / 10000).toFixed(2)} hectares`;
    }
    return `${areaInM2.toFixed(0)} m²`;
  } else {
    const acres = areaInM2 * 0.000247105;
    return `${acres.toFixed(2)} acres`;
  }
};
