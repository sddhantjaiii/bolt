import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, MessageCircle, Share, MoreHorizontal, Play, Volume2, VolumeX, Star, Clock, Flame, TrendingUp, Plus, MapPin, Filter, Search, X, Navigation, ShoppingBag, Users, Menu } from 'lucide-react';

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
  trendingScore?: number;
}

interface TrendingProps {
  onProfileClick: (user: User) => void;
  onPostClick: (post: Post) => void;
  onMenuToggle: () => void;
  onChatClick: () => void;
}

const Trending: React.FC<TrendingProps> = ({ onProfileClick, onPostClick, onMenuToggle, onChatClick }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [expandedCaptions, setExpandedCaptions] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useRef<HTMLDivElement | null>(null);

  // Mock trending posts generator
  const generateTrendingPosts = (pageNum: number, count: number = 6): Post[] => {
    const trendingUsers: User[] = [
      {
        id: '1',
        username: 'sophia_rose',
        displayName: 'Sophia Rose',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        isVerified: true,
        isHost: true,
        hourlyRate: 45,
        rating: 4.9,
        location: 'Los Angeles',
        gender: 'female',
        age: 26,
        bio: 'Life coach & wellness enthusiast'
      },
      {
        id: '2',
        username: 'emma_night',
        displayName: 'Emma Night',
        avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        isVerified: true,
        isHost: true,
        hourlyRate: 65,
        rating: 4.8,
        location: 'New York',
        gender: 'female',
        age: 29,
        bio: 'Professional therapist'
      },
      {
        id: '3',
        username: 'luna_star',
        displayName: 'Luna Star',
        avatar: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        isHost: true,
        hourlyRate: 35,
        rating: 4.7,
        location: 'Miami',
        gender: 'female',
        age: 24,
        bio: 'Creative soul'
      },
      {
        id: '4',
        username: 'marcus_moon',
        displayName: 'Marcus Moon',
        avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        isVerified: true,
        isHost: true,
        hourlyRate: 80,
        rating: 4.9,
        location: 'San Francisco',
        gender: 'male',
        age: 31,
        bio: 'Entrepreneur & speaker'
      },
      {
        id: '5',
        username: 'zara_dreams',
        displayName: 'Zara Dreams',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        isHost: true,
        hourlyRate: 40,
        rating: 4.6,
        location: 'Austin',
        gender: 'female',
        age: 27,
        bio: 'Yoga instructor'
      }
    ];

    const trendingImages = [
      'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
      'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
      'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
      'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
      'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
      'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
      'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
      'https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop'
    ];

    const trendingCaptions = [
      'This mindset shift changed everything for me ✨ Who else is ready to level up? 🚀',
      'POV: You finally understand your worth 💎 Stop settling for less than you deserve!',
      'The glow up is real when you start prioritizing yourself 💜 Self-love isn\'t selfish!',
      'Normalize having standards and boundaries 👑 Your energy is precious, protect it!',
      'That moment when you realize you\'re the main character of your own story 🌟',
      'Reminder: You don\'t need anyone\'s permission to be amazing ✨ Shine bright!',
      'Plot twist: The best relationship you\'ll ever have is with yourself 💕',
      'Energy update: I\'m only accepting good vibes from now on 🌙✨',
      'Life hits different when you stop explaining yourself to everyone 💫',
      'The universe really said "let me show you what you deserve" and I\'m here for it 🙏'
    ];

    return Array.from({ length: count }, (_, index) => {
      const postId = (pageNum - 1) * count + index + 1;
      const user = trendingUsers[index % trendingUsers.length];
      const imageIndex = (postId - 1) % trendingImages.length;
      const captionIndex = (postId - 1) % trendingCaptions.length;
      
      return {
        id: `trending-${postId}`,
        user,
        type: Math.random() > 0.8 ? 'carousel' : 'image' as const,
        content: Math.random() > 0.8 ? [trendingImages[imageIndex], trendingImages[(imageIndex + 1) % trendingImages.length]] : [trendingImages[imageIndex]],
        caption: trendingCaptions[captionIndex],
        likes: Math.floor(Math.random() * 5000) + 1000,
        comments: Math.floor(Math.random() * 500) + 50,
        shares: Math.floor(Math.random() * 200) + 20,
        saves: Math.floor(Math.random() * 800) + 100,
        timestamp: new Date(Date.now() - (Math.random() * 24 * 3600000)),
        isLiked: Math.random() > 0.6,
        isSaved: Math.random() > 0.7,
        isFollowing: Math.random() > 0.4,
        isTrending: true,
        engagementRate: Math.round((Math.random() * 8 + 12) * 10) / 10,
        tags: ['trending', 'viral', 'mindset', 'glow-up', 'self-love'].slice(0, Math.floor(Math.random() * 3) + 2),
        trendingScore: Math.round((Math.random() * 50 + 50) * 10) / 10
      };
    });
  };

  // Initial load
  useEffect(() => {
    const initialPosts = generateTrendingPosts(1, 10);
    setPosts(initialPosts);
  }, []);

  // Load more posts
  const loadMorePosts = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const nextPage = page + 1;
    const newPosts = generateTrendingPosts(nextPage, 6);
    
    if (newPosts.length === 0 || nextPage > 8) {
      setHasMore(false);
    } else {
      setPosts(prev => [...prev, ...newPosts]);
      setPage(nextPage);
    }
    
    setIsLoading(false);
  }, [page, isLoading, hasMore]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMorePosts();
        }
      },
      { threshold: 0.1 }
    );

    if (lastPostElementRef.current) {
      observerRef.current.observe(lastPostElementRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [loadMorePosts, hasMore, isLoading]);

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
                Trending
              </h1>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={onChatClick}
                className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors relative"
              >
                <MessageCircle className="w-4 h-4 text-purple-300" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </button>
              <div className="flex items-center space-x-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <span className="text-orange-300 text-sm font-medium">Hot Right Now</span>
              </div>
            </div>
          </div>

          {/* Trending Stats */}
          <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-500/30 rounded-2xl p-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-orange-300">
                <TrendingUp className="w-4 h-4 mr-2" />
                <span>Trending Algorithm</span>
              </div>
              <span className="text-orange-200 font-medium">Updated 5m ago</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4">
        {/* Posts Grid */}
        <div className="py-4 space-y-6">
          {posts.map((post, index) => (
            <div
              key={post.id}
              className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl overflow-hidden hover:bg-black/50 hover:border-purple-400/50 transition-all duration-300 group"
              ref={index === posts.length - 1 ? lastPostElementRef : null}
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
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center">
                          <Flame className="w-3 h-3 mr-1" />
                          #{Math.floor(Math.random() * 10) + 1}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-purple-300/80">
                        <span>@{post.user.username}</span>
                        <span>•</span>
                        <span>{getTimeAgo(post.timestamp)}</span>
                        {post.trendingScore && (
                          <>
                            <span>•</span>
                            <div className="flex items-center text-orange-400">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              <span>{post.trendingScore}% viral</span>
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

                {/* Trending Overlay */}
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
                      <div className="bg-orange-600/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold flex items-center">
                        <Flame className="w-3 h-3 mr-1" />
                        VIRAL
                      </div>
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
                <div className="text-purple-100 text-sm leading-relaxed mb-3">
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

                {/* Trending Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4 text-purple-300/80">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{post.engagementRate}% engagement</span>
                    </div>
                    <div className="flex items-center space-x-1 text-orange-400">
                      <TrendingUp className="w-4 h-4" />
                      <span>Trending</span>
                    </div>
                  </div>
                  <div className="text-purple-300/60 text-xs">
                    {formatNumber(post.saves)} saves
                  </div>
                </div>

                {/* Tags */}
                {post.tags && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-purple-300 text-xs hover:text-purple-200 cursor-pointer bg-purple-600/10 px-2 py-1 rounded-lg border border-purple-500/20"
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

        {/* Loading indicator */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            </div>
            <p className="text-purple-200/80">Loading trending content...</p>
          </div>
        )}

        {/* End of feed message */}
        {!hasMore && posts.length > 0 && (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-orange-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Flame className="w-6 h-6 text-orange-400" />
            </div>
            <p className="text-purple-200/80 mb-2">You've seen all trending posts!</p>
            <p className="text-purple-300/60 text-sm">Check back soon for new viral content</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Trending;