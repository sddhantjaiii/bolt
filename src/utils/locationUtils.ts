// Location utility functions for geolocation and distance calculations

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationData {
  name: string;
  coordinates: Coordinates;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
}

// Calculate distance between two coordinates using Haversine formula
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(coord2.latitude - coord1.latitude);
  const dLon = toRadians(coord2.longitude - coord1.longitude);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coord1.latitude)) * Math.cos(toRadians(coord2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

// Get user's current location
export function getCurrentLocation(): Promise<Coordinates> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
}

// Mock geocoding function (in production, use a real geocoding service)
export async function geocodeLocation(locationName: string): Promise<LocationData | null> {
  // Mock coordinates for popular cities
  const mockLocations: { [key: string]: LocationData } = {
    'new york, ny': {
      name: 'New York, NY',
      coordinates: { latitude: 40.7128, longitude: -74.0060 },
      city: 'New York',
      state: 'NY',
      country: 'USA'
    },
    'los angeles, ca': {
      name: 'Los Angeles, CA',
      coordinates: { latitude: 34.0522, longitude: -118.2437 },
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA'
    },
    'chicago, il': {
      name: 'Chicago, IL',
      coordinates: { latitude: 41.8781, longitude: -87.6298 },
      city: 'Chicago',
      state: 'IL',
      country: 'USA'
    },
    'houston, tx': {
      name: 'Houston, TX',
      coordinates: { latitude: 29.7604, longitude: -95.3698 },
      city: 'Houston',
      state: 'TX',
      country: 'USA'
    },
    'phoenix, az': {
      name: 'Phoenix, AZ',
      coordinates: { latitude: 33.4484, longitude: -112.0740 },
      city: 'Phoenix',
      state: 'AZ',
      country: 'USA'
    },
    'philadelphia, pa': {
      name: 'Philadelphia, PA',
      coordinates: { latitude: 39.9526, longitude: -75.1652 },
      city: 'Philadelphia',
      state: 'PA',
      country: 'USA'
    },
    'san antonio, tx': {
      name: 'San Antonio, TX',
      coordinates: { latitude: 29.4241, longitude: -98.4936 },
      city: 'San Antonio',
      state: 'TX',
      country: 'USA'
    },
    'san diego, ca': {
      name: 'San Diego, CA',
      coordinates: { latitude: 32.7157, longitude: -117.1611 },
      city: 'San Diego',
      state: 'CA',
      country: 'USA'
    },
    'dallas, tx': {
      name: 'Dallas, TX',
      coordinates: { latitude: 32.7767, longitude: -96.7970 },
      city: 'Dallas',
      state: 'TX',
      country: 'USA'
    },
    'miami, fl': {
      name: 'Miami, FL',
      coordinates: { latitude: 25.7617, longitude: -80.1918 },
      city: 'Miami',
      state: 'FL',
      country: 'USA'
    }
  };

  const key = locationName.toLowerCase().trim();
  return mockLocations[key] || null;
}

// Generate mock host locations within radius
export function generateMockHostLocations(centerCoords: Coordinates, radiusKm: number = 100): Coordinates[] {
  const locations: Coordinates[] = [];
  const numLocations = 20;

  for (let i = 0; i < numLocations; i++) {
    // Generate random coordinates within the radius
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * radiusKm;
    
    // Convert distance to degrees (approximate)
    const deltaLat = (distance / 111) * Math.cos(angle);
    const deltaLon = (distance / (111 * Math.cos(toRadians(centerCoords.latitude)))) * Math.sin(angle);
    
    locations.push({
      latitude: centerCoords.latitude + deltaLat,
      longitude: centerCoords.longitude + deltaLon
    });
  }

  return locations;
}

// Privacy-focused location hashing (for secure storage)
export function hashLocation(coords: Coordinates): string {
  // Simple hash for demo - in production use proper encryption
  const combined = `${coords.latitude.toFixed(4)},${coords.longitude.toFixed(4)}`;
  return btoa(combined);
}

// Validate coordinates
export function isValidCoordinates(coords: Coordinates): boolean {
  return (
    coords.latitude >= -90 && coords.latitude <= 90 &&
    coords.longitude >= -180 && coords.longitude <= 180
  );
}