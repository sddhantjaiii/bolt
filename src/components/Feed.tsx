import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Heart, MessageCircle, Clock, Star, Play, ChevronRight, Users, Flame, Search as SearchIcon, Compass, Share, MoreHorizontal, Send, X, Home, Menu, Settings, Shield, BookmarkCheck, Calendar, ShoppingBag, Plus } from 'lucide-react';
import StoryUpload from './StoryUpload';

interface Story {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  isViewed: boolean;
  content?: string;
  timestamp?: Date;
}

interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  age: number;
  location: string;
  hourlyRate: number;
  rating: number;
  totalChats: number;
  isOnline: boolean;
  isHost: boolean;
  interests: string[];
  photos: string[];
  isVerified?: boolean;
}

interface Comment {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatar: string;
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
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

interface FeedProps {
  onProfileClick: (user: User) => void;
  onStoryClick: (story: Story) => void;
  onMenuToggle: () => void;
  onChatClick: () => void;
}

const Feed: React.FC<FeedProps> = ({ onProfileClick, onStoryClick, onMenuToggle, onChatClick }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [showStoryUpload, setShowStoryUpload] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useRef<HTMLDivElement | null>(null);

  // Mock data generator
  const generateMockPosts = (pageNum: number, count: number = 5): Post[] => {
    const mockUsers: User[] = [
      {
        id: '1',
        username: 'emma_rose',
        displayName: 'Emma Rose',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
        bio: 'Professional companion & lifestyle enthusiast',
        age: 24,
        location: 'New York, NY',
        hourlyRate: 200,
        rating: 4.9,
        totalChats: 156,
        isOnline: true,
        isHost: true,
        interests: ['Travel', 'Fine Dining', 'Art'],
        photos: ['https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400'],
        isVerified: true
      },
      {
        id: '2',
        username: 'sophia_m',
        displayName: 'Sophia Moon',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
        bio: 'Wellness coach & mindfulness expert',
        age: 28,
        location: 'Los Angeles, CA',
        hourlyRate: 150,
        rating: 4.8,
        totalChats: 203,
        isOnline: false,
        isHost: true,
        interests: ['Wellness', 'Meditation', 'Yoga'],
        photos: [],
        isVerified: true
      },
      {
        id: '3',
        username: 'luna_star',
        displayName: 'Luna Star',
        avatar: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=150',
        bio: 'Creative soul & art enthusiast',
        age: 26,
        location: 'Miami, FL',
        hourlyRate: 120,
        rating: 4.7,
        totalChats: 89,
        isOnline: true,
        isHost: true,
        interests: ['Art', 'Music', 'Photography'],
        photos: [],
        isVerified: false
      }
    ];

    const mockImages = [
      'https://images.pexels.com/photos/1391498/pexels-photo-1391498.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=600'
    ];

    const mockCaptions = [
      'Beautiful evening in the city ✨ Available for dinner dates this weekend!',
      'Finding peace in the little moments 💜 What brings you joy today?',
      'Late night art session 🎨 There\'s something magical about creating when the world is quiet.',
      'Morning motivation from my home office 💪 Starting the day with intention.',
      'Coffee dates with myself are the best kind ☕ Self-care isn\'t selfish.',
      'Yoga and meditation have changed my life 🧘‍♀️ Finding balance in chaos.',
      'Behind the scenes of my cozy reading corner 📚 What\'s on your reading list?',
      'Mercury retrograde vibes got you feeling scattered? 🌙✨ Let\'s talk about it.',
      'Words have power to heal, to inspire, to transform 📝✨',
      'Healing isn\'t linear, and that\'s okay 💜 Be gentle with yourself.'
    ];

    return Array.from({ length: count }, (_, index) => {
      const postId = (pageNum - 1) * count + index + 1;
      const user = mockUsers[index % mockUsers.length];
      const imageIndex = (postId - 1) % mockImages.length;
      const captionIndex = (postId - 1) % mockCaptions.length;
      
      return {
        id: `post-${postId}`,
        user,
        type: 'image' as const,
        content: [mockImages[imageIndex]],
        caption: mockCaptions[captionIndex],
        likes: Math.floor(Math.random() * 2000) + 100,
        comments: Math.floor(Math.random() * 200) + 10,
        shares: Math.floor(Math.random() * 50) + 5,
        saves: Math.floor(Math.random() * 300) + 20,
        timestamp: new Date(Date.now() - (postId * 3600000) - Math.random() * 86400000),
        isLiked: Math.random() > 0.7,
        isSaved: Math.random() > 0.8,
        isFollowing: Math.random() > 0.5,
        isTrending: Math.random() > 0.8,
        engagementRate: Math.round((Math.random() * 5 + 5) * 10) / 10,
        tags: ['lifestyle', 'wellness', 'inspiration'].slice(0, Math.floor(Math.random() * 3) + 1)
      };
    });
  };

  // Initial load
  useEffect(() => {
    const initialPosts = generateMockPosts(1, 8);
    setPosts(initialPosts);

    // Mock stories
    const mockStories: Story[] = [
      {
        id: '1',
        userId: '1',
        username: 'emma_rose',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
        isViewed: false,
        content: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=300&h=500&fit=crop',
        timestamp: new Date(Date.now() - 1800000)
      },
      {
        id: '2',
        userId: '2',
        username: 'sophia_m',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
        isViewed: true,
        content: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=300&h=500&fit=crop',
        timestamp: new Date(Date.now() - 3600000)
      },
      {
        id: '3',
        userId: '3',
        username: 'luna_star',
        avatar: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=150',
        isViewed: false,
        content: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=300&h=500&fit=crop',
        timestamp: new Date(Date.now() - 900000)
      }
    ];
    setStories(mockStories);
  }, []);

  // Load more posts
  const loadMorePosts = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const nextPage = page + 1;
    const newPosts = generateMockPosts(nextPage, 5);
    
    if (newPosts.length === 0 || nextPage > 10) {
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

  const handleStoryUpload = (storyData: { type: 'image' | 'video'; content: string; text?: string; duration?: number }) => {
    // Create new story
    const newStory: Story = {
      id: Date.now().toString(),
      userId: 'current-user',
      username: 'you',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      isViewed: false,
      content: storyData.content,
      timestamp: new Date()
    };

    // Add to stories (put at beginning after "Add Story")
    setStories(prev => [newStory, ...prev]);
    setShowStoryUpload(false);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 pb-20">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl border-b border-purple-500/30 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={onMenuToggle}
                className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors"
              >
                <Menu className="w-4 h-4 text-purple-300" />
              </button>
              <Heart className="w-8 h-8 text-purple-400 drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.6))' }} />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-200 to-white bg-clip-text text-transparent">
                The Club
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
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4">
        {/* Stories */}
        <div className="py-4">
          <div className="flex space-x-4 overflow-x-auto scrollbar-hide">
            {/* Add Your Story */}
            <div className="flex-shrink-0 text-center">
              <div className="relative">
                <button
                  onClick={() => setShowStoryUpload(true)}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 via-purple-700 to-black border-2 border-purple-500/30 flex items-center justify-center hover:border-purple-400/50 transition-colors cursor-pointer group"
                >
                  <Plus className="w-6 h-6 text-purple-200 group-hover:scale-110 transition-transform" />
                </button>
              </div>
              <p className="text-purple-200/80 text-xs mt-2 font-medium">Your Story</p>
            </div>

            {/* Stories */}
            {stories.map((story) => (
              <button
                key={story.id}
                onClick={() => onStoryClick(story)}
                className="flex-shrink-0 text-center"
              >
                <div className={`w-16 h-16 rounded-full p-0.5 ${
                  story.isViewed 
                    ? 'bg-gray-500/50' 
                    : 'bg-gradient-to-tr from-purple-500 to-purple-700'
                } hover:scale-105 transition-transform duration-200`}>
                  <div className="w-full h-full rounded-full border-2 border-black overflow-hidden">
                    <img
                      src={story.avatar}
                      alt={story.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <p className="text-purple-200/80 text-xs mt-2 truncate w-16 font-medium">
                  {story.username === 'you' ? 'You' : story.username}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {posts.map((post, index) => (
            <div 
              key={post.id} 
              className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl overflow-hidden transition-all duration-300 hover:bg-black/50 hover:border-purple-400/50"
              ref={index === posts.length - 1 ? lastPostElementRef : null}
            >
              {/* Post Header */}
              <div className="p-4 border-b border-purple-500/20">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => onProfileClick(post.user)}
                    className="flex items-center space-x-3"
                  >
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500/30">
                        <img
                          src={post.user.avatar}
                          alt={post.user.displayName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {post.user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
                      )}
                    </div>
                    <div className="text-left">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-white">{post.user.displayName}</h3>
                        {post.user.isVerified && (
                          <Star className="w-4 h-4 text-purple-400 fill-current" />
                        )}
                        {post.isTrending && (
                          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center">
                            <Flame className="w-3 h-3 mr-1" />
                            TRENDING
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-purple-300/80">
                        <span>@{post.user.username}</span>
                        <span>•</span>
                        <span>{Math.floor((Date.now() - post.timestamp.getTime()) / (1000 * 60 * 60))}h ago</span>
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
                  </button>
                  
                  <button className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-purple-300" />
                  </button>
                </div>
              </div>

              {/* Post Content */}
              <div className="relative">
                {post.type === 'image' && (
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={post.content[0]}
                      alt="Post content"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
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
                      <Heart className={`w-6 h-6 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span className="text-sm font-medium">{formatNumber(post.likes)}</span>
                    </button>
                    <button
                      onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                      className="flex items-center space-x-1 text-purple-300 hover:text-purple-200 transition-colors"
                    >
                      <MessageCircle className="w-6 h-6" />
                      <span className="text-sm font-medium">{formatNumber(post.comments)}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-purple-300 hover:text-purple-200 transition-colors">
                      <Share className="w-6 h-6" />
                      <span className="text-sm font-medium">{formatNumber(post.shares)}</span>
                    </button>
                  </div>
                  <button 
                    onClick={() => handleSave(post.id)}
                    className={`transition-all duration-300 ${
                      post.isSaved ? 'text-purple-400 scale-110' : 'text-purple-300 hover:text-purple-400 hover:scale-110'
                    }`}
                  >
                    <ShoppingBag className={`w-6 h-6 ${post.isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Post Caption */}
                <div className="text-purple-100 text-sm leading-relaxed mb-3">
                  <span className="font-semibold text-white">{post.user.displayName}</span>{' '}
                  {post.caption.length > 80 ? post.caption.substring(0, 80) + '...' : post.caption}
                </div>

                {/* Post Meta */}
                <div className="flex items-center justify-between text-sm text-purple-300/80">
                  <div className="flex items-center space-x-4">
                    {post.engagementRate && (
                      <span className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{post.engagementRate}% engagement</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Comments Section */}
              {showComments === post.id && (
                <div className="border-t border-purple-500/20 p-4 bg-black/20">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-purple-500/30">
                        <img
                          src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=50"
                          alt="Commenter"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="bg-black/30 rounded-2xl px-3 py-2">
                          <p className="text-purple-100 text-sm">
                            <span className="font-semibold text-white">sophia_m</span> Looks amazing! 😍
                          </p>
                        </div>
                        <div className="flex items-center space-x-4 mt-2 ml-3">
                          <span className="text-xs text-purple-300/60">2h ago</span>
                          <button className="text-xs text-purple-300/80 hover:text-purple-300">Reply</button>
                          <button className="text-xs text-purple-300/80 hover:text-purple-300">Like</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-purple-500/30">
                      <img
                        src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=50"
                        alt="Your avatar"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex items-center space-x-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        className="flex-1 bg-black/30 border border-purple-500/30 rounded-2xl px-4 py-2 text-white placeholder-purple-300/60 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60"
                      />
                      <button className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center hover:from-purple-700 hover:to-purple-800 transition-all duration-300">
                        <Send className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    <button
                      onClick={() => setShowComments(null)}
                      className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors"
                    >
                      <X className="w-4 h-4 text-purple-300" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Loading indicator */}
        {isLoading && (
          <div className="text-center py-8">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            </div>
            <p className="text-purple-200/80">Loading more posts...</p>
          </div>
        )}

        {/* End of feed message */}
        {!hasMore && posts.length > 0 && (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-purple-300" />
            </div>
            <p className="text-purple-200/80 mb-2">You're all caught up!</p>
            <p className="text-purple-300/60 text-sm">Check back later for new posts</p>
          </div>
        )}
      </div>

      {/* Story Upload Modal */}
      {showStoryUpload && (
        <StoryUpload
          onClose={() => setShowStoryUpload(false)}
          onUpload={handleStoryUpload}
        />
      )}
    </div>
  );
};

export default Feed;