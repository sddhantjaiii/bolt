import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search as SearchIcon, MapPin, Filter, X, Star, Clock, Users, ArrowLeft, Navigation, Loader, Menu, Globe, MessageCircle } from 'lucide-react';
import LocationSearch from './LocationSearch';
import { calculateDistance, LocationData, Coordinates } from '../utils/locationUtils';

interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  age: number;
  location: string;
  hourlyRate?: number;
  rating?: number;
  totalChats?: number;
  isOnline: boolean;
  isHost: boolean;
  interests: string[];
  photos: string[];
  isVerified?: boolean;
  gender?: 'male' | 'female' | 'non-binary';
  coordinates?: Coordinates;
  distance?: number;
  roleType?: string;
  expertise?: string[];
}

interface SearchProps {
  onProfileClick: (user: User) => void;
  onMenuToggle: () => void;
  onChatClick: () => void;
  currentUser: User;
}

const Search: React.FC<SearchProps> = ({ onProfileClick, onMenuToggle, onChatClick, currentUser }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [showLocalHosts, setShowLocalHosts] = useState(false);
  const [radiusKm, setRadiusKm] = useState(50);
  const [selectedGender, setSelectedGender] = useState<'all' | 'male' | 'female' | 'non-binary'>('all');
  const [selectedRole, setSelectedRole] = useState<'all' | 'boyfriend' | 'girlfriend' | 'friend' | 'listener' | 'mother' | 'father'>('all');
  const [ageRange, setAgeRange] = useState({ min: 18, max: 65 });
  const [ratingFilter, setRatingFilter] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastUserElementRef = useRef<HTMLDivElement | null>(null);

  // Mock users database with enhanced data
  const allUsers: User[] = [
    {
      id: '1',
      username: 'sophia_rose',
      displayName: 'Sophia Rose',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      bio: 'Life coach & wellness enthusiast who loves deep conversations about personal growth',
      age: 26,
      location: 'Los Angeles, CA',
      hourlyRate: 45,
      rating: 4.9,
      totalChats: 127,
      isOnline: true,
      isHost: true,
      interests: ['Wellness', 'Travel', 'Art', 'Psychology'],
      photos: ['https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop'],
      isVerified: true,
      gender: 'female',
      coordinates: { latitude: 34.0522, longitude: -118.2437 },
      roleType: 'girlfriend',
      expertise: ['Relationship Advice', 'Mindfulness', 'Life Coaching']
    },
    {
      id: '2',
      username: 'emma_night',
      displayName: 'Emma Night',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      bio: 'Professional therapist offering deep conversations and emotional support',
      age: 29,
      location: 'New York, NY',
      hourlyRate: 65,
      rating: 4.8,
      totalChats: 89,
      isOnline: false,
      isHost: true,
      interests: ['Psychology', 'Music', 'Books', 'Meditation'],
      photos: ['https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop'],
      isVerified: true,
      gender: 'female',
      coordinates: { latitude: 40.7128, longitude: -74.0060 },
      roleType: 'listener',
      expertise: ['Therapy', 'Mental Health', 'Emotional Support']
    },
    {
      id: '3',
      username: 'marcus_moon',
      displayName: 'Marcus Moon',
      avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      bio: 'Entrepreneur & motivational speaker helping people achieve their dreams',
      age: 31,
      location: 'San Francisco, CA',
      hourlyRate: 80,
      rating: 4.9,
      totalChats: 203,
      isOnline: true,
      isHost: true,
      interests: ['Business', 'Technology', 'Fitness', 'Investing'],
      photos: ['https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop'],
      isVerified: true,
      gender: 'male',
      coordinates: { latitude: 37.7749, longitude: -122.4194 },
      roleType: 'boyfriend',
      expertise: ['Business Coaching', 'Motivation', 'Career Advice']
    },
    {
      id: '4',
      username: 'luna_star',
      displayName: 'Luna Star',
      avatar: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      bio: 'Creative soul who loves deep midnight conversations about art and life',
      age: 24,
      location: 'Miami, FL',
      hourlyRate: 35,
      rating: 4.7,
      totalChats: 156,
      isOnline: true,
      isHost: true,
      interests: ['Art', 'Philosophy', 'Astrology', 'Poetry'],
      photos: ['https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop'],
      gender: 'female',
      coordinates: { latitude: 25.7617, longitude: -80.1918 },
      roleType: 'friend',
      expertise: ['Art Therapy', 'Creative Writing', 'Spiritual Guidance']
    },
    {
      id: '5',
      username: 'david_soul',
      displayName: 'David Soul',
      avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      bio: 'Travel blogger & life adventurer sharing stories from around the world',
      age: 25,
      location: 'Portland, OR',
      hourlyRate: 55,
      rating: 4.8,
      totalChats: 134,
      isOnline: false,
      isHost: true,
      interests: ['Travel', 'Photography', 'Culture', 'Adventure'],
      photos: ['https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'],
      gender: 'male',
      coordinates: { latitude: 45.5152, longitude: -122.6784 },
      roleType: 'friend',
      expertise: ['Travel Planning', 'Cultural Exchange', 'Adventure Coaching']
    },
    {
      id: '6',
      username: 'violet_wisdom',
      displayName: 'Violet Wisdom',
      avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      bio: 'Relationship coach & emotional healer helping people find love and connection',
      age: 32,
      location: 'Chicago, IL',
      hourlyRate: 70,
      rating: 4.9,
      totalChats: 245,
      isOnline: true,
      isHost: true,
      interests: ['Relationships', 'Healing', 'Communication', 'Love'],
      photos: ['https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'],
      isVerified: true,
      gender: 'female',
      coordinates: { latitude: 41.8781, longitude: -87.6298 },
      roleType: 'mother',
      expertise: ['Relationship Coaching', 'Emotional Healing', 'Communication Skills']
    }
  ];

  // Generate more mock users for infinite scroll
  const generateMoreUsers = (pageNum: number): User[] => {
    const baseUsers = allUsers;
    const moreUsers: User[] = [];
    
    for (let i = 0; i < 10; i++) {
      const baseUser = baseUsers[i % baseUsers.length];
      const userId = `${baseUser.id}-${pageNum}-${i}`;
      
      moreUsers.push({
        ...baseUser,
        id: userId,
        username: `${baseUser.username}_${pageNum}${i}`,
        displayName: `${baseUser.displayName} ${pageNum}${i}`,
        age: Math.floor(Math.random() * 15) + 20,
        hourlyRate: baseUser.hourlyRate ? Math.floor(Math.random() * 50) + 30 : undefined,
        rating: baseUser.rating ? Math.round((Math.random() * 1 + 4) * 10) / 10 : undefined,
        totalChats: baseUser.totalChats ? Math.floor(Math.random() * 200) + 50 : undefined,
        isOnline: Math.random() > 0.5
      });
    }
    
    return moreUsers;
  };

  // Search function with pagination and filters
  const performSearch = useCallback(async (query: string, pageNum: number = 1, append: boolean = false) => {
    setIsSearching(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let filtered: User[] = [];
    
    if (query.trim()) {
      const searchTerm = query.toLowerCase();
      filtered = allUsers.filter(user => {
        return (
          user.displayName.toLowerCase().includes(searchTerm) ||
          user.username.toLowerCase().includes(searchTerm) ||
          user.bio.toLowerCase().includes(searchTerm) ||
          user.location.toLowerCase().includes(searchTerm) ||
          user.interests.some(interest => interest.toLowerCase().includes(searchTerm)) ||
          (user.expertise && user.expertise.some(exp => exp.toLowerCase().includes(searchTerm))) ||
          (user.roleType && user.roleType.toLowerCase().includes(searchTerm))
        );
      });
    } else {
      // Show all users when no search query
      filtered = [...allUsers];
    }

    // Apply location filter
    if (selectedLocation && showLocalHosts) {
      filtered = filtered.map(user => {
        if (!user.coordinates) return null;
        const distance = calculateDistance(selectedLocation.coordinates, user.coordinates);
        if (distance <= radiusKm) {
          return { ...user, distance };
        }
        return null;
      }).filter(Boolean) as User[];

      // Sort by distance
      filtered.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }

    // Apply other filters
    if (selectedGender !== 'all') {
      filtered = filtered.filter(user => user.gender === selectedGender);
    }

    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.roleType === selectedRole);
    }

    filtered = filtered.filter(user => user.age >= ageRange.min && user.age <= ageRange.max);

    if (ratingFilter > 0) {
      filtered = filtered.filter(user => (user.rating || 0) >= ratingFilter);
    }

    // Add more results for pagination
    if (pageNum > 1) {
      const moreUsers = generateMoreUsers(pageNum);
      filtered = [...filtered, ...moreUsers];
    }

    if (append) {
      setSearchResults(prev => [...prev, ...filtered.slice((pageNum - 1) * 8, pageNum * 8)]);
    } else {
      setSearchResults(filtered.slice(0, 8));
    }
    
    setHasMore(filtered.length > pageNum * 8);
    setIsSearching(false);
  }, [selectedLocation, showLocalHosts, radiusKm, selectedGender, selectedRole, ageRange, ratingFilter]);

  // Load more results
  const loadMoreResults = useCallback(async () => {
    if (isSearching || !hasMore) return;

    const nextPage = page + 1;
    await performSearch(searchQuery, nextPage, true);
    setPage(nextPage);
  }, [performSearch, searchQuery, page, isSearching, hasMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isSearching) {
          loadMoreResults();
        }
      },
      { threshold: 0.1 }
    );

    if (lastUserElementRef.current) {
      observerRef.current.observe(lastUserElementRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [loadMoreResults, hasMore, isSearching]);

  // Handle search input with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setPage(1);
      setHasMore(true);
      performSearch(searchQuery, 1, false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, performSearch]);

  // Initial load
  useEffect(() => {
    performSearch('', 1, false);
  }, [performSearch]);

  const handleLocationSelect = (location: LocationData) => {
    setSelectedLocation(location);
    setShowLocationSearch(false);
  };

  const clearFilters = () => {
    setSelectedLocation(null);
    setShowLocalHosts(false);
    setSelectedGender('all');
    setSelectedRole('all');
    setAgeRange({ min: 18, max: 65 });
    setRatingFilter(0);
    setRadiusKm(50);
  };

  const getCurrencySymbol = () => {
    const symbols: { [key: string]: string } = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'INR': '₹',
      'JPY': '¥',
      'CAD': 'C$',
      'AUD': 'A$',
      'CHF': 'Fr',
      'CNY': '¥',
      'KRW': '₩'
    };
    return symbols[currentUser.currency || 'USD'] || '$';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 pb-20">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl border-b border-purple-500/30 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={onMenuToggle}
                className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors"
              >
                <Menu className="w-4 h-4 text-purple-300" />
              </button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-200 to-white bg-clip-text text-transparent">
                Search
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={onChatClick}
                className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors relative"
              >
                <MessageCircle className="w-4 h-4 text-purple-300" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button>
              <button
                onClick={() => setShowFilters(true)}
                className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors"
              >
                <Filter className="w-4 h-4 text-purple-300" />
              </button>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative mb-4">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-300/80" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users, interests, roles..."
              className="w-full pl-10 pr-4 py-3 bg-black/30 border border-purple-500/30 rounded-2xl text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60"
            />
            {isSearching && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader className="w-4 h-4 text-purple-300 animate-spin" />
              </div>
            )}
          </div>

          {/* Location Filter Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowLocationSearch(true)}
              className="flex items-center bg-black/30 border border-purple-500/30 text-purple-200 px-3 py-2 rounded-xl text-sm hover:bg-purple-600/20 hover:border-purple-400/50 transition-all duration-300"
            >
              <MapPin className="w-4 h-4 mr-2" />
              <span>{selectedLocation ? selectedLocation.name.split(',')[0] : 'Set Location'}</span>
            </button>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showLocalHosts}
                onChange={(e) => setShowLocalHosts(e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-black/30 border-purple-500/30 rounded focus:ring-purple-500/30"
              />
              <span className="text-purple-200 text-sm">Show Local Hosts Near Me</span>
            </label>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4">
        {/* Results Header */}
        <div className="py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-purple-200">
              {searchQuery ? `Results for "${searchQuery}"` : showLocalHosts && selectedLocation ? `Local Hosts in ${selectedLocation.name}` : 'Discover People'}
            </h2>
            {(selectedLocation || selectedGender !== 'all' || selectedRole !== 'all' || ratingFilter > 0) && (
              <button
                onClick={clearFilters}
                className="text-purple-300 hover:text-purple-200 text-sm transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
          
          {/* Results List */}
          {searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map((user, index) => (
                <div
                  key={user.id}
                  onClick={() => onProfileClick(user)}
                  className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-4 hover:bg-black/50 hover:border-purple-400/50 transition-all duration-300 cursor-pointer"
                  ref={index === searchResults.length - 1 ? lastUserElementRef : null}
                >
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-purple-500/30">
                        <img
                          src={user.avatar}
                          alt={user.displayName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
                      )}
                      {user.isVerified && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center border-2 border-black">
                          <Star className="w-2.5 h-2.5 text-white fill-current" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-white truncate">{user.displayName}</h3>
                        {user.isHost && user.rating && (
                          <div className="flex items-center text-purple-300 text-sm">
                            <Star className="w-3 h-3 fill-current mr-1" />
                            <span>{user.rating}</span>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-purple-200/80 text-sm truncate mb-2">@{user.username}</p>
                      <p className="text-purple-300/80 text-sm truncate mb-2">{user.bio}</p>
                      
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center text-purple-300/80 text-xs">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{user.location}</span>
                          {user.distance && (
                            <span className="ml-2">• {user.distance.toFixed(1)}km away</span>
                          )}
                        </div>
                        
                        {user.isHost && user.hourlyRate && (
                          <div className="flex items-center text-purple-300 text-sm">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{getCurrencySymbol()}{user.hourlyRate}/hr</span>
                          </div>
                        )}
                      </div>

                      {/* Role Type */}
                      {user.roleType && (
                        <div className="mb-2">
                          <span className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 border border-purple-500/40 text-purple-300 px-2 py-1 rounded-lg text-xs font-medium capitalize">
                            {user.roleType}
                          </span>
                        </div>
                      )}
                      
                      {/* Interests & Expertise */}
                      <div className="flex flex-wrap gap-1">
                        {user.interests.slice(0, 2).map((interest) => (
                          <span
                            key={interest}
                            className="bg-purple-600/20 text-purple-300 px-2 py-0.5 rounded-lg text-xs"
                          >
                            {interest}
                          </span>
                        ))}
                        {user.expertise && user.expertise.slice(0, 1).map((exp) => (
                          <span
                            key={exp}
                            className="bg-green-600/20 text-green-300 px-2 py-0.5 rounded-lg text-xs border border-green-500/30"
                          >
                            {exp}
                          </span>
                        ))}
                        {(user.interests.length > 2 || (user.expertise && user.expertise.length > 1)) && (
                          <span className="text-purple-300/60 text-xs">
                            +{(user.interests.length - 2) + ((user.expertise?.length || 0) - 1)} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : !isSearching && searchQuery ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <SearchIcon className="w-8 h-8 text-purple-300" />
              </div>
              <p className="text-purple-200/80 mb-2">No users found</p>
              <p className="text-purple-300/60 text-sm">
                Try searching with different keywords or adjust your filters
              </p>
            </div>
          ) : null}

          {/* Loading indicator */}
          {isSearching && (
            <div className="text-center py-8">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <Loader className="w-4 h-4 text-white animate-spin" />
              </div>
              <p className="text-purple-200/80">Searching...</p>
            </div>
          )}

          {/* End of results message */}
          {!hasMore && searchResults.length > 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-purple-300" />
              </div>
              <p className="text-purple-200/80 mb-2">That's everyone!</p>
              <p className="text-purple-300/60 text-sm">Try a different search to find more people</p>
            </div>
          )}
        </div>
      </div>

      {/* Location Search Modal */}
      {showLocationSearch && (
        <LocationSearch
          onLocationSelect={handleLocationSelect}
          onClose={() => setShowLocationSearch(false)}
          currentLocation={selectedLocation}
        />
      )}

      {/* Advanced Filters Modal */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/90 backdrop-blur-xl border border-purple-500/30 rounded-3xl w-full max-w-sm max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-purple-500/30">
              <h3 className="text-xl font-bold text-white">Advanced Filters</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors"
              >
                <X className="w-4 h-4 text-purple-300" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Gender Filter */}
              <div>
                <h4 className="text-purple-200 font-semibold mb-3">Gender</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'all', label: 'All' },
                    { key: 'female', label: 'Female' },
                    { key: 'male', label: 'Male' },
                    { key: 'non-binary', label: 'Non-Binary' }
                  ].map((option) => (
                    <button
                      key={option.key}
                      onClick={() => setSelectedGender(option.key as any)}
                      className={`p-3 rounded-2xl text-sm font-medium transition-all duration-300 ${
                        selectedGender === option.key
                          ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                          : 'bg-black/30 border border-purple-500/30 text-purple-200 hover:bg-purple-600/20'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Role Type Filter */}
              <div>
                <h4 className="text-purple-200 font-semibold mb-3">Relationship Role</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'all', label: 'All Roles' },
                    { key: 'boyfriend', label: 'Boyfriend' },
                    { key: 'girlfriend', label: 'Girlfriend' },
                    { key: 'friend', label: 'Friend' },
                    { key: 'listener', label: 'Listener' },
                    { key: 'mother', label: 'Mother' },
                    { key: 'father', label: 'Father' }
                  ].map((option) => (
                    <button
                      key={option.key}
                      onClick={() => setSelectedRole(option.key as any)}
                      className={`p-3 rounded-2xl text-sm font-medium transition-all duration-300 ${
                        selectedRole === option.key
                          ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                          : 'bg-black/30 border border-purple-500/30 text-purple-200 hover:bg-purple-600/20'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Range */}
              <div>
                <h4 className="text-purple-200 font-semibold mb-3">Age Range</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-purple-300/80 text-sm mb-1">Min Age</label>
                    <input
                      type="number"
                      value={ageRange.min}
                      onChange={(e) => setAgeRange(prev => ({ ...prev, min: parseInt(e.target.value) || 18 }))}
                      min="18"
                      max="65"
                      className="w-full bg-black/30 border border-purple-500/30 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-purple-300/80 text-sm mb-1">Max Age</label>
                    <input
                      type="number"
                      value={ageRange.max}
                      onChange={(e) => setAgeRange(prev => ({ ...prev, max: parseInt(e.target.value) || 65 }))}
                      min="18"
                      max="65"
                      className="w-full bg-black/30 border border-purple-500/30 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h4 className="text-purple-200 font-semibold mb-3">Minimum Rating</h4>
                <div className="flex space-x-2">
                  {[0, 3, 4, 4.5, 4.8].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setRatingFilter(rating)}
                      className={`flex-1 p-2 rounded-xl text-sm transition-all duration-300 ${
                        ratingFilter === rating
                          ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                          : 'bg-black/30 border border-purple-500/30 text-purple-200 hover:bg-purple-600/20'
                      }`}
                    >
                      {rating === 0 ? 'Any' : `${rating}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Distance Range (when location is set) */}
              {selectedLocation && (
                <div>
                  <h4 className="text-purple-200 font-semibold mb-3">Distance Range</h4>
                  <div className="space-y-3">
                    <input
                      type="range"
                      min="5"
                      max="200"
                      value={radiusKm}
                      onChange={(e) => setRadiusKm(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-purple-300/80 text-sm">
                      <span>5km</span>
                      <span className="font-medium">{radiusKm}km</span>
                      <span>200km</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Apply/Clear Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={clearFilters}
                  className="flex-1 bg-black/40 border border-purple-500/30 text-purple-200 py-3 rounded-2xl font-medium hover:bg-black/50 transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-2xl font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-300"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;