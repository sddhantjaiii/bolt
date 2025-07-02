import React, { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal, Play, Volume2, VolumeX, Star, Clock, Flame, TrendingUp, Plus, MapPin, Filter, Search, X, Navigation, ShoppingBag } from 'lucide-react';
import LocationSearch from './LocationSearch';
import { calculateDistance, LocationData, Coordinates, generateMockHostLocations } from '../utils/locationUtils';

interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  isVerified?: boolean;
  isHost?: boolean;
  hourlyRate?: number;
  rating?: number;
  location?: string;
  distance?: number;
  gender?: 'male' | 'female' | 'non-binary';
  age?: number;
  bio?: string;
  coordinates?: Coordinates;
}

interface Story {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  isViewed: boolean;
  timestamp: Date;
  isLive?: boolean;
}

interface Post {
  id: string;
  user: User;
  type: 'image' | 'video' | 'carousel';
  content: string[];
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  timestamp: Date;
  isLiked: boolean;
  isSaved: boolean;
  isFollowing: boolean;
  isTrending?: boolean;
  engagementRate?: number;
  tags?: string[];
}

interface DiscoverProps {
  onProfileClick: (user: User) => void;
  onPostClick: (post: Post) => void;
}

const Discover: React.FC<DiscoverProps> = ({ onProfileClick, onPostClick }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [localHosts, setLocalHosts] = useState<User[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'trending' | 'hosts' | 'following'>('all');
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [mutedVideos, setMutedVideos] = useState<Set<string>>(new Set());
  const [expandedCaptions, setExpandedCaptions] = useState<Set<string>>(new Set());
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [showGenderFilter, setShowGenderFilter] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [selectedGender, setSelectedGender] = useState<'all' | 'male' | 'female' | 'non-binary'>('all');
  const [radiusKm, setRadiusKm] = useState(100);
  const [isLoadingHosts, setIsLoadingHosts] = useState(false);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement }>({});

  // Base host data with coordinates
  const baseHosts: User[] = [
    {
      id: 'h1',
      username: 'sophia_rose',
      displayName: 'Sophia Rose',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      isVerified: true,
      isHost: true,
      hourlyRate: 45,
      rating: 4.9,
      location: 'Downtown',
      gender: 'female',
      age: 26,
      bio: 'Life coach & wellness enthusiast',
      coordinates: { latitude: 40.7589, longitude: -73.9851 }
    },
    {
      id: 'h2',
      username: 'emma_night',
      displayName: 'Emma Night',
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      isVerified: true,
      isHost: true,
      hourlyRate: 65,
      rating: 4.8,
      location: 'Midtown',
      gender: 'female',
      age: 29,
      bio: 'Professional therapist offering deep conversations',
      coordinates: { latitude: 40.7505, longitude: -73.9934 }
    },
    {
      id: 'h3',
      username: 'alex_wisdom',
      displayName: 'Alex Wisdom',
      avatar: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      isHost: true,
      hourlyRate: 35,
      rating: 4.7,
      location: 'Uptown',
      gender: 'non-binary',
      age: 24,
      bio: 'Creative soul who loves deep midnight conversations',
      coordinates: { latitude: 40.7831, longitude: -73.9712 }
    },
    {
      id: 'h4',
      username: 'marcus_moon',
      displayName: 'Marcus Moon',
      avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      isVerified: true,
      isHost: true,
      hourlyRate: 80,
      rating: 4.9,
      location: 'Business District',
      gender: 'male',
      age: 31,
      bio: 'Entrepreneur & motivational speaker',
      coordinates: { latitude: 40.7061, longitude: -74.0087 }
    },
    {
      id: 'h5',
      username: 'zara_dreams',
      displayName: 'Zara Dreams',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      isHost: true,
      hourlyRate: 40,
      rating: 4.6,
      location: 'Arts Quarter',
      gender: 'female',
      age: 27,
      bio: 'Yoga instructor & spiritual guide',
      coordinates: { latitude: 40.7282, longitude: -73.9942 }
    },
    {
      id: 'h6',
      username: 'david_soul',
      displayName: 'David Soul',
      avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      isHost: true,
      hourlyRate: 55,
      rating: 4.8,
      location: 'Riverside',
      gender: 'male',
      age: 25,
      bio: 'Travel blogger & life adventurer',
      coordinates: { latitude: 40.7411, longitude: -73.9897 }
    },
    {
      id: 'h7',
      username: 'violet_wisdom',
      displayName: 'Violet Wisdom',
      avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      isVerified: true,
      isHost: true,
      hourlyRate: 70,
      rating: 4.9,
      location: 'University Area',
      gender: 'female',
      age: 32,
      bio: 'Relationship coach & emotional healer',
      coordinates: { latitude: 40.8075, longitude: -73.9626 }
    },
    {
      id: 'h8',
      username: 'jordan_nights',
      displayName: 'Jordan Nights',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      isHost: true,
      hourlyRate: 50,
      rating: 4.7,
      location: 'Tech Hub',
      gender: 'non-binary',
      age: 28,
      bio: 'Astrologer & cosmic guide',
      coordinates: { latitude: 40.7505, longitude: -73.9758 }
    },
    {
      id: 'h9',
      username: 'sage_whispers',
      displayName: 'Sage Whispers',
      avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      isHost: true,
      hourlyRate: 42,
      rating: 4.6,
      location: 'Cultural District',
      gender: 'female',
      age: 26,
      bio: 'Creative writer & storyteller',
      coordinates: { latitude: 40.7614, longitude: -73.9776 }
    },
    {
      id: 'h10',
      username: 'phoenix_rising',
      displayName: 'Phoenix Rising',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      isVerified: true,
      isHost: true,
      hourlyRate: 60,
      rating: 4.8,
      location: 'Sports Complex',
      gender: 'male',
      age: 30,
      bio: 'Fitness coach & mental health advocate',
      coordinates: { latitude: 40.7282, longitude: -73.9776 }
    }
  ];

  // Update hosts when location changes
  useEffect(() => {
    if (selectedLocation) {
      updateLocalHosts(selectedLocation);
    } else {
      // Default to New York coordinates
      const defaultLocation: LocationData = {
        name: 'New York, NY',
        coordinates: { latitude: 40.7128, longitude: -74.0060 }
      };
      updateLocalHosts(defaultLocation);
    }
  }, [selectedLocation, radiusKm]);

  const updateLocalHosts = async (location: LocationData) => {
    setIsLoadingHosts(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Calculate distances and filter hosts within radius
    const hostsWithDistance = baseHosts.map(host => {
      if (!host.coordinates) return null;
      
      const distance = calculateDistance(location.coordinates, host.coordinates);
      
      if (distance <= radiusKm) {
        return {
          ...host,
          distance: distance
        };
      }
      return null;
    }).filter(Boolean) as User[];

    // Sort by distance
    hostsWithDistance.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    
    setLocalHosts(hostsWithDistance);
    setIsLoadingHosts(false);
  };

  // Mock data for stories
  useEffect(() => {
    const mockStories: Story[] = [
      {
        id: '1',
        userId: '1',
        username: 'sophia_rose',
        displayName: 'Sophia Rose',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        isViewed: false,
        timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
        isLive: false
      },
      {
        id: '2',
        userId: '2',
        username: 'emma_night',
        displayName: 'Emma Night',
        avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        isViewed: true,
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        isLive: false
      },
      {
        id: '3',
        userId: '7',
        username: 'violet_wisdom',
        displayName: 'Violet Wisdom',
        avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        isViewed: false,
        timestamp: new Date(Date.now() - 900000), // 15 minutes ago
        isLive: true
      },
      {
        id: '4',
        userId: '10',
        username: 'phoenix_rising',
        displayName: 'Phoenix Rising',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        isViewed: false,
        timestamp: new Date(Date.now() - 2700000), // 45 minutes ago
        isLive: false
      },
      {
        id: '5',
        userId: '6',
        username: 'maya_soul',
        displayName: 'Maya Soul',
        avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        isViewed: true,
        timestamp: new Date(Date.now() - 5400000), // 1.5 hours ago
        isLive: false
      },
      {
        id: '6',
        userId: '12',
        username: 'crystal_clarity',
        displayName: 'Crystal Clarity',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        isViewed: false,
        timestamp: new Date(Date.now() - 1200000), // 20 minutes ago
        isLive: false
      },
      {
        id: '7',
        userId: '4',
        username: 'aria_moon',
        displayName: 'Aria Moon',
        avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        isViewed: false,
        timestamp: new Date(Date.now() - 600000), // 10 minutes ago
        isLive: false
      }
    ];
    setStories(mockStories);
  }, []);

  // Mock data for posts
  useEffect(() => {
    const mockPosts: Post[] = [
      {
        id: '1',
        user: {
          id: '1',
          username: 'sophia_rose',
          displayName: 'Sophia Rose',
          avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          isVerified: true,
          isHost: true,
          hourlyRate: 45,
          rating: 4.9
        },
        type: 'image',
        content: ['https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop'],
        caption: 'Finding peace in the little moments ✨ Sometimes the best therapy is just watching the sunset and remembering that tomorrow is a new day. What brings you peace? 💜',
        likes: 1247,
        comments: 89,
        shares: 23,
        saves: 156,
        timestamp: new Date(Date.now() - 3600000),
        isLiked: false,
        isSaved: false,
        isFollowing: true,
        isTrending: true,
        engagementRate: 8.2,
        tags: ['wellness', 'mindfulness', 'sunset']
      },
      {
        id: '2',
        user: {
          id: '2',
          username: 'emma_night',
          displayName: 'Emma Night',
          avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          isVerified: true,
          isHost: true,
          hourlyRate: 65,
          rating: 4.8
        },
        type: 'carousel',
        content: [
          'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
          'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop'
        ],
        caption: 'Behind the scenes of my cozy reading corner 📚 This is where I spend most of my evenings, diving into psychology books and preparing for our deep conversations. What\'s on your reading list?',
        likes: 892,
        comments: 67,
        shares: 12,
        saves: 234,
        timestamp: new Date(Date.now() - 7200000),
        isLiked: true,
        isSaved: true,
        isFollowing: true,
        engagementRate: 7.1,
        tags: ['books', 'psychology', 'cozy']
      },
      {
        id: '3',
        user: {
          id: '3',
          username: 'luna_star',
          displayName: 'Luna Star',
          avatar: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          isHost: true,
          hourlyRate: 35,
          rating: 4.7
        },
        type: 'image',
        content: ['https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop'],
        caption: 'Late night art session 🎨 There\'s something magical about creating when the world is quiet. Art has always been my way of processing emotions and connecting with others. What\'s your creative outlet?',
        likes: 634,
        comments: 45,
        shares: 8,
        saves: 89,
        timestamp: new Date(Date.now() - 10800000),
        isLiked: false,
        isSaved: false,
        isFollowing: false,
        isTrending: true,
        engagementRate: 9.1,
        tags: ['art', 'creativity', 'nighttime']
      },
      {
        id: '4',
        user: {
          id: '4',
          username: 'aria_moon',
          displayName: 'Aria Moon',
          avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          isVerified: true,
          isHost: true,
          hourlyRate: 80,
          rating: 4.9
        },
        type: 'image',
        content: ['https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop'],
        caption: 'Morning motivation from my home office 💪 Starting the day with intention and gratitude. Remember, every small step counts towards your bigger goals. What\'s one thing you\'re working towards today?',
        likes: 1456,
        comments: 123,
        shares: 45,
        saves: 267,
        timestamp: new Date(Date.now() - 14400000),
        isLiked: false,
        isSaved: true,
        isFollowing: false,
        isTrending: true,
        engagementRate: 8.7,
        tags: ['motivation', 'business', 'goals']
      },
      {
        id: '5',
        user: {
          id: '5',
          username: 'zara_dreams',
          displayName: 'Zara Dreams',
          avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          isHost: true,
          hourlyRate: 40,
          rating: 4.6
        },
        type: 'image',
        content: ['https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop'],
        caption: 'Yoga and meditation have changed my life 🧘‍♀️ Finding balance isn\'t just about poses - it\'s about creating space for yourself in a busy world. Who else needs some zen today?',
        likes: 789,
        comments: 56,
        shares: 19,
        saves: 145,
        timestamp: new Date(Date.now() - 18000000),
        isLiked: true,
        isSaved: false,
        isFollowing: false,
        engagementRate: 6.8,
        tags: ['yoga', 'meditation', 'wellness']
      },
      {
        id: '6',
        user: {
          id: '6',
          username: 'maya_soul',
          displayName: 'Maya Soul',
          avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          isHost: true,
          hourlyRate: 55,
          rating: 4.8
        },
        type: 'image',
        content: ['https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop'],
        caption: 'Coffee dates with myself are the best kind 💜 Taking time to journal and reflect on the week. Self-care isn\'t selfish - it\'s necessary. How do you recharge?',
        likes: 923,
        comments: 78,
        shares: 15,
        saves: 189,
        timestamp: new Date(Date.now() - 21600000),
        isLiked: false,
        isSaved: true,
        isFollowing: true,
        engagementRate: 7.4,
        tags: ['selfcare', 'coffee', 'journaling']
      }
    ];
    setPosts(mockPosts);
  }, []);

  const filteredPosts = posts.filter(post => {
    switch (activeFilter) {
      case 'trending':
        return post.isTrending;
      case 'hosts':
        return post.user.isHost;
      case 'following':
        return post.isFollowing;
      default:
        return true;
    }
  });

  const filteredHosts = localHosts.filter(host => {
    if (selectedGender !== 'all' && host.gender !== selectedGender) {
      return false;
    }
    return true;
  });

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleSave = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isSaved: !post.isSaved,
            saves: post.isSaved ? post.saves - 1 : post.saves + 1
          }
        : post
    ));
  };

  const handleFollow = (userId: string) => {
    setPosts(prev => prev.map(post => 
      post.user.id === userId 
        ? { ...post, isFollowing: !post.isFollowing }
        : post
    ));
  };

  const handleStoryClick = (story: Story) => {
    // Mark story as viewed
    setStories(prev => prev.map(s => 
      s.id === story.id ? { ...s, isViewed: true } : s
    ));
    // Handle story viewing logic here
    console.log('Story clicked:', story);
  };

  const toggleCaptionExpansion = (postId: string) => {
    setExpandedCaptions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const truncateCaption = (caption: string, maxLength: number = 80) => {
    if (caption.length <= maxLength) return caption;
    return caption.substring(0, maxLength) + '...';
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const getTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    return 'now';
  };

  const handleLocationSelect = (location: LocationData) => {
    setSelectedLocation(location);
    setShowLocationSearch(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl border-b border-purple-500/30 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-200 to-white bg-clip-text text-transparent">
              Discover
            </h1>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-300" />
              <span className="text-purple-200 text-sm font-medium">Trending Now</span>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-black/30 backdrop-blur-sm rounded-2xl p-1 border border-purple-500/20 overflow-x-auto">
            {[
              { key: 'all', label: 'All', icon: null },
              { key: 'trending', label: 'Trending', icon: Flame },
              { key: 'hosts', label: 'Hosts', icon: Star },
              { key: 'following', label: 'Following', icon: Heart }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key as any)}
                className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                  activeFilter === filter.key
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-900/50'
                    : 'text-purple-200/70 hover:text-purple-100 hover:bg-black/20'
                }`}
              >
                {filter.icon && <filter.icon className="w-4 h-4 mr-2" />}
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Local Hosts Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-purple-200">
              Local Hosts {selectedLocation && `in ${selectedLocation.name}`}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowLocationSearch(true)}
                className="flex items-center bg-black/40 border border-purple-500/30 text-purple-200 px-3 py-1.5 rounded-xl text-sm hover:bg-purple-600/20 hover:border-purple-400/50 transition-all duration-300"
              >
                <MapPin className="w-4 h-4 mr-2" />
                <span className="max-w-24 truncate">
                  {selectedLocation ? selectedLocation.name.split(',')[0] : 'Set Location'}
                </span>
              </button>
              <button
                onClick={() => setShowGenderFilter(true)}
                className="flex items-center bg-black/40 border border-purple-500/30 text-purple-200 px-3 py-1.5 rounded-xl text-sm hover:bg-purple-600/20 hover:border-purple-400/50 transition-all duration-300"
              >
                <Filter className="w-4 h-4 mr-2" />
                <span className="capitalize">{selectedGender === 'all' ? 'All' : selectedGender}</span>
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isLoadingHosts && (
            <div className="text-center py-8">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              </div>
              <p className="text-purple-200/80">Finding hosts near you...</p>
            </div>
          )}

          {/* Hosts Grid */}
          {!isLoadingHosts && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredHosts.slice(0, 8).map((host) => (
                  <div
                    key={host.id}
                    onClick={() => onProfileClick(host)}
                    className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-4 hover:bg-black/50 hover:border-purple-400/50 transition-all duration-300 cursor-pointer group"
                  >
                    <div className="text-center">
                      <div className="relative mb-3">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500/30 mx-auto">
                          <img
                            src={host.avatar}
                            alt={host.displayName}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        {host.isVerified && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center border-2 border-black">
                            <Star className="w-2.5 h-2.5 text-white fill-current" />
                          </div>
                        )}
                      </div>
                      
                      <h3 className="font-semibold text-white text-sm mb-1 truncate">{host.displayName}</h3>
                      <p className="text-purple-200/80 text-xs mb-2 truncate">{host.bio}</p>
                      
                      <div className="flex items-center justify-center space-x-1 mb-2">
                        <Star className="w-3 h-3 text-purple-400 fill-current" />
                        <span className="text-purple-200 text-xs font-medium">{host.rating}</span>
                      </div>
                      
                      <div className="flex items-center justify-center space-x-1 mb-3">
                        <MapPin className="w-3 h-3 text-purple-300/80" />
                        <span className="text-purple-300/80 text-xs">
                          {host.location} • {host.distance?.toFixed(1)}km
                        </span>
                      </div>
                      
                      <div className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 border border-purple-500/40 rounded-xl p-2">
                        <div className="text-white font-bold text-sm">${host.hourlyRate}/hr</div>
                        <div className="text-purple-200/80 text-xs">Available now</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredHosts.length > 8 && (
                <div className="text-center mt-4">
                  <button className="bg-gradient-to-r from-purple-600 via-purple-700 to-black text-white py-2 px-6 rounded-2xl font-medium transition-all duration-300 hover:from-purple-700 hover:via-purple-800 hover:to-gray-900 shadow-lg shadow-purple-900/60 border border-purple-500/40">
                    View All {filteredHosts.length} Hosts
                  </button>
                </div>
              )}

              {filteredHosts.length === 0 && !isLoadingHosts && (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-purple-300/60 mx-auto mb-3" />
                  <p className="text-purple-200/80 mb-2">No hosts found in this area</p>
                  <p className="text-purple-300/60 text-sm">Try expanding your search radius or changing location</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Stories Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-purple-200">Stories from People You Follow</h2>
            <button className="text-purple-300 hover:text-purple-200 transition-colors text-sm">
              View All
            </button>
          </div>
          
          <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
            {/* Add Your Story */}
            <div className="flex-shrink-0 text-center">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 via-purple-700 to-black border-2 border-purple-500/30 flex items-center justify-center hover:border-purple-400/50 transition-colors cursor-pointer">
                  <Plus className="w-6 h-6 text-purple-200" />
                </div>
              </div>
              <p className="text-purple-200/80 text-xs mt-2 font-medium">Your Story</p>
            </div>

            {/* Stories */}
            {stories.map((story) => (
              <div key={story.id} className="flex-shrink-0 text-center">
                <button
                  onClick={() => handleStoryClick(story)}
                  className="relative block"
                >
                  <div className={`w-16 h-16 rounded-full p-0.5 ${
                    story.isViewed 
                      ? 'bg-gray-500/50' 
                      : story.isLive
                      ? 'bg-gradient-to-tr from-red-500 via-pink-500 to-purple-600'
                      : 'bg-gradient-to-tr from-purple-500 to-purple-700'
                  } hover:scale-105 transition-transform duration-200`}>
                    <div className="w-full h-full rounded-full border-2 border-black overflow-hidden">
                      <img
                        src={story.avatar}
                        alt={story.displayName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  
                  {/* Live Indicator */}
                  {story.isLive && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold border-2 border-black">
                      LIVE
                    </div>
                  )}
                  
                  {/* Story Indicator */}
                  {!story.isLive && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center border-2 border-black">
                      <Play className="w-2 h-2 text-white fill-current" />
                    </div>
                  )}
                </button>
                <p className="text-purple-200/80 text-xs mt-2 truncate w-16 font-medium">
                  {story.displayName.split(' ')[0]}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl overflow-hidden hover:bg-black/50 hover:border-purple-400/50 transition-all duration-300 group"
            >
              {/* Post Header */}
              <div className="p-4 border-b border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div 
                    className="flex items-center space-x-3 cursor-pointer"
                    onClick={() => onProfileClick(post.user)}
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500/30">
                        <img
                          src={post.user.avatar}
                          alt={post.user.displayName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {post.user.isVerified && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-600 rounded-full flex items-center justify-center">
                          <Star className="w-2 h-2 text-white fill-current" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-white text-sm">{post.user.displayName}</h3>
                        {post.isTrending && (
                          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center">
                            <Flame className="w-3 h-3 mr-1" />
                            HOT
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-purple-300/80">
                        <span>@{post.user.username}</span>
                        <span>•</span>
                        <span>{getTimeAgo(post.timestamp)}</span>
                        {post.user.isHost && (
                          <>
                            <span>•</span>
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              <span>${post.user.hourlyRate}/hr</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!post.isFollowing && (
                      <button
                        onClick={() => handleFollow(post.user.id)}
                        className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-1 rounded-full text-xs font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-300"
                      >
                        Follow
                      </button>
                    )}
                    <button className="w-6 h-6 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors">
                      <MoreHorizontal className="w-3 h-3 text-purple-300" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div 
                className="relative cursor-pointer"
                onClick={() => onPostClick(post)}
              >
                {post.type === 'image' && (
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={post.content[0]}
                      alt="Post content"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                {post.type === 'carousel' && (
                  <div className="aspect-[4/5] overflow-hidden relative">
                    <img
                      src={post.content[0]}
                      alt="Post content"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                      1/{post.content.length}
                    </div>
                  </div>
                )}

                {/* Engagement Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Heart className="w-4 h-4" />
                          <span className="text-sm font-medium">{formatNumber(post.likes)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">{formatNumber(post.comments)}</span>
                        </div>
                      </div>
                      {post.engagementRate && (
                        <div className="bg-purple-600/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold">
                          {post.engagementRate}% engagement
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Actions */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-1 transition-all duration-300 ${
                        post.isLiked 
                          ? 'text-purple-400 scale-110' 
                          : 'text-purple-300 hover:text-purple-400 hover:scale-110'
                      }`}
                      style={post.isLiked ? { 
                        filter: 'drop-shadow(0 0 12px rgba(168, 85, 247, 0.8))',
                        textShadow: '0 0 8px rgba(168, 85, 247, 0.6)'
                      } : {}}
                    >
                      <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span className="text-sm font-medium">{formatNumber(post.likes)}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-purple-300 hover:text-purple-200 transition-colors">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">{formatNumber(post.comments)}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-purple-300 hover:text-purple-200 transition-colors">
                      <Share className="w-5 h-5" />
                      <span className="text-sm font-medium">{formatNumber(post.shares)}</span>
                    </button>
                  </div>
                  <button
                    onClick={() => handleSave(post.id)}
                    className={`transition-all duration-300 ${
                      post.isSaved ? 'text-purple-400 scale-110' : 'text-purple-300 hover:text-purple-400 hover:scale-110'
                    }`}
                  >
                    <ShoppingBag className={`w-5 h-5 ${post.isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Caption with Truncation */}
                <div className="text-purple-100 text-sm leading-relaxed">
                  <span className="font-semibold text-white">{post.user.displayName}</span>{' '}
                  {expandedCaptions.has(post.id) ? (
                    <>
                      {post.caption}
                      {post.caption.length > 80 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCaptionExpansion(post.id);
                          }}
                          className="text-purple-300 hover:text-purple-200 ml-2 font-medium"
                        >
                          Show less
                        </button>
                      )}
                    </>
                  ) : (
                    <>
                      {truncateCaption(post.caption)}
                      {post.caption.length > 80 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCaptionExpansion(post.id);
                          }}
                          className="text-purple-300 hover:text-purple-200 ml-2 font-medium"
                        >
                          more
                        </button>
                      )}
                    </>
                  )}
                </div>

                {/* Tags */}
                {post.tags && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-purple-300 text-xs hover:text-purple-200 cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="bg-gradient-to-r from-purple-600 via-purple-700 to-black text-white py-3 px-8 rounded-2xl font-semibold transition-all duration-300 hover:from-purple-700 hover:via-purple-800 hover:to-gray-900 shadow-lg shadow-purple-900/60 border border-purple-500/40">
            Load More Posts
          </button>
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

      {/* Gender Filter Modal */}
      {showGenderFilter && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/90 backdrop-blur-xl border border-purple-500/30 rounded-3xl w-full max-w-sm">
            <div className="flex items-center justify-between p-6 border-b border-purple-500/30">
              <h3 className="text-xl font-bold text-white">Filter by Gender</h3>
              <button
                onClick={() => setShowGenderFilter(false)}
                className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors"
              >
                <X className="w-4 h-4 text-purple-300" />
              </button>
            </div>

            <div className="p-6 space-y-3">
              {[
                { key: 'all', label: 'All Genders' },
                { key: 'female', label: 'Female' },
                { key: 'male', label: 'Male' },
                { key: 'non-binary', label: 'Non-Binary' }
              ].map((option) => (
                <button
                  key={option.key}
                  onClick={() => {
                    setSelectedGender(option.key as any);
                    setShowGenderFilter(false);
                  }}
                  className={`w-full text-left p-3 rounded-2xl transition-all duration-300 ${
                    selectedGender === option.key
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                      : 'bg-black/30 border border-purple-500/30 text-purple-200 hover:bg-purple-600/20 hover:border-purple-400/50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Discover;