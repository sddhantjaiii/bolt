import React, { useState, useEffect } from 'react';
import { MapPin, Search, X, Navigation, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { getCurrentLocation, geocodeLocation, LocationData, Coordinates } from '../utils/locationUtils';

interface LocationSearchProps {
  onLocationSelect: (location: LocationData) => void;
  onClose: () => void;
  currentLocation?: LocationData | null;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ 
  onLocationSelect, 
  onClose, 
  currentLocation 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);

  const popularLocations = [
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'Houston, TX',
    'Phoenix, AZ',
    'Philadelphia, PA',
    'San Antonio, TX',
    'San Diego, CA',
    'Dallas, TX',
    'Miami, FL'
  ];

  const handleUseCurrentLocation = async () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    try {
      const coords = await getCurrentLocation();
      const locationData: LocationData = {
        name: 'Current Location',
        coordinates: coords,
        address: `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`
      };
      
      onLocationSelect(locationData);
    } catch (error) {
      console.error('Error getting location:', error);
      setLocationError('Unable to access your location. Please check your browser permissions.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleLocationSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const result = await geocodeLocation(query);
      if (result) {
        setSearchResults([result]);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching location:', error);
      setSearchResults([]);
    }
  };

  const handlePopularLocationClick = async (locationName: string) => {
    const result = await geocodeLocation(locationName);
    if (result) {
      onLocationSelect(result);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleLocationSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/90 backdrop-blur-xl border border-purple-500/30 rounded-3xl w-full max-w-md max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/30">
          <h3 className="text-xl font-bold text-white">Choose Your Location</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors"
          >
            <X className="w-4 h-4 text-purple-300" />
          </button>
        </div>

        <div className="p-6">
          {/* Current Location Button */}
          <button
            onClick={handleUseCurrentLocation}
            disabled={isLoadingLocation}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-2xl font-medium transition-all duration-300 hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed mb-4 flex items-center justify-center"
          >
            {isLoadingLocation ? (
              <>
                <Loader className="w-5 h-5 mr-3 animate-spin" />
                Getting your location...
              </>
            ) : (
              <>
                <Navigation className="w-5 h-5 mr-3" />
                Use Current Location
              </>
            )}
          </button>

          {/* Location Error */}
          {locationError && (
            <div className="bg-red-600/20 border border-red-500/30 rounded-2xl p-3 mb-4 flex items-start">
              <AlertCircle className="w-5 h-5 text-red-400 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-300 text-sm font-medium">Location Access Denied</p>
                <p className="text-red-300/80 text-xs mt-1">{locationError}</p>
              </div>
            </div>
          )}

          {/* Current Location Display */}
          {currentLocation && (
            <div className="bg-green-600/20 border border-green-500/30 rounded-2xl p-3 mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
              <div>
                <p className="text-green-300 text-sm font-medium">Current Selection</p>
                <p className="text-green-300/80 text-xs">{currentLocation.name}</p>
              </div>
            </div>
          )}

          {/* Search Input */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-300/80" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for a city or area..."
              className="w-full pl-10 pr-4 py-3 bg-black/30 border border-purple-500/30 rounded-2xl text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60"
            />
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mb-6">
              <h4 className="text-purple-200 font-semibold mb-3 text-sm">Search Results</h4>
              <div className="space-y-2">
                {searchResults.map((location, index) => (
                  <button
                    key={index}
                    onClick={() => onLocationSelect(location)}
                    className="w-full text-left p-3 bg-black/30 border border-purple-500/30 rounded-2xl text-purple-200 hover:bg-purple-600/20 hover:border-purple-400/50 transition-all duration-300"
                  >
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-3 text-purple-400" />
                      <div>
                        <span className="font-medium">{location.name}</span>
                        {location.address && (
                          <p className="text-purple-300/60 text-xs mt-1">{location.address}</p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Popular Locations */}
          <div>
            <h4 className="text-purple-200 font-semibold mb-3 text-sm">Popular Locations</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {popularLocations
                .filter(location => 
                  searchQuery === '' || 
                  location.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((location) => (
                  <button
                    key={location}
                    onClick={() => handlePopularLocationClick(location)}
                    className="w-full text-left p-3 bg-black/30 border border-purple-500/30 rounded-2xl text-purple-200 hover:bg-purple-600/20 hover:border-purple-400/50 transition-all duration-300"
                  >
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-3 text-purple-300" />
                      <span>{location}</span>
                    </div>
                  </button>
                ))}
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="mt-6 bg-purple-600/10 border border-purple-500/30 rounded-2xl p-3">
            <p className="text-purple-200/80 text-xs">
              <strong>Privacy:</strong> Your location data is used only to find nearby hosts and is not stored permanently. You can change your location preference anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSearch;