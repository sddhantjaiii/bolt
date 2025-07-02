import React, { useState } from 'react';
import { ArrowLeft, Star, MapPin, Clock, Heart, MessageCircle, Shield, Flag, Blocks as Block, Camera, Edit3, DollarSign, Users, Play, MoreHorizontal, ShoppingBag, Settings, Plus, Menu } from 'lucide-react';

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
  followers?: number;
  following?: number;
  posts?: number;
  roleType?: string;
  expertise?: string[];
}

interface Post {
  id: string;
  type: 'image' | 'video' | 'carousel';
  content: string[];
  caption: string;
  likes: number;
  comments: number;
  timestamp: Date;
  isLiked: boolean;
}

interface ProfileProps {
  user: User;
  onBack: () => void;
  onPurchaseChat: (user: User) => void;
  isOwnProfile?: boolean;
  onHostSetup?: () => void;
  onMenuToggle: () => void;
  onChatClick: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onBack, onPurchaseChat, isOwnProfile = false, onHostSetup, onMenuToggle, onChatClick }) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editedBio, setEditedBio] = useState(user.bio);
  const [editedDisplayName, setEditedDisplayName] = useState(user.displayName);
  
  // Mock user data with additional fields
  const enhancedUser = {
    ...user,
    followers: user.followers || Math.floor(Math.random() * 50000) + 5000,
    following: user.following || Math.floor(Math.random() * 1000) + 100,
    posts: user.posts || Math.floor(Math.random() * 200) + 50
  };

  // Mock posts data for the user
  const userPosts: Post[] = [
    {
      id: '1',
      type: 'image',
      content: ['https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop'],
      caption: 'Finding peace in the little moments ✨',
      likes: 1247,
      comments: 89,
      timestamp: new Date(Date.now() - 3600000),
      isLiked: false
    },
    {
      id: '2',
      type: 'carousel',
      content: [
        'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
        'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop'
      ],
      caption: 'Behind the scenes of my cozy reading corner 📚',
      likes: 892,
      comments: 67,
      timestamp: new Date(Date.now() - 7200000),
      isLiked: true
    },
    {
      id: '3',
      type: 'image',
      content: ['https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop'],
      caption: 'Late night art session 🎨',
      likes: 634,
      comments: 45,
      timestamp: new Date(Date.now() - 10800000),
      isLiked: false
    },
    {
      id: '4',
      type: 'image',
      content: ['https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop'],
      caption: 'Morning motivation from my home office 💪',
      likes: 1456,
      comments: 123,
      timestamp: new Date(Date.now() - 14400000),
      isLiked: false
    },
    {
      id: '5',
      type: 'image',
      content: ['https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop'],
      caption: 'Yoga and meditation have changed my life 🧘‍♀️',
      likes: 789,
      comments: 56,
      timestamp: new Date(Date.now() - 18000000),
      isLiked: true
    },
    {
      id: '6',
      type: 'image',
      content: ['https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop'],
      caption: 'Coffee dates with myself are the best kind 💜',
      likes: 923,
      comments: 78,
      timestamp: new Date(Date.now() - 21600000),
      isLiked: false
    },
    {
      id: '7',
      type: 'carousel',
      content: [
        'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop',
        'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop'
      ],
      caption: 'Healing isn\'t linear, and that\'s okay 💜',
      likes: 1678,
      comments: 156,
      timestamp: new Date(Date.now() - 25200000),
      isLiked: true
    },
    {
      id: '8',
      type: 'image',
      content: ['https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop'],
      caption: 'Mercury retrograde vibes got you feeling scattered? 🌙✨',
      likes: 567,
      comments: 89,
      timestamp: new Date(Date.now() - 28800000),
      isLiked: false
    },
    {
      id: '9',
      type: 'image',
      content: ['https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=400&h=600&fit=crop'],
      caption: 'Words have power to heal, to inspire, to transform 📝✨',
      likes: 445,
      comments: 67,
      timestamp: new Date(Date.now() - 32400000),
      isLiked: false
    }
  ];

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const handlePostClick = (post: Post) => {
    setSelectedPost(post);
  };

  const handleSaveProfile = () => {
    // In a real app, this would save to the backend
    setShowEditProfile(false);
    // Update the user object with new values
    user.bio = editedBio;
    user.displayName = editedDisplayName;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 pb-20">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl border-b border-purple-500/30 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isOwnProfile ? (
                <button
                  onClick={onMenuToggle}
                  className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors"
                >
                  <Menu className="w-4 h-4 text-purple-300" />
                </button>
              ) : (
                <button
                  onClick={onBack}
                  className="flex items-center text-purple-300 hover:text-purple-200 transition-colors group"
                >
                  <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                  <span>Back</span>
                </button>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {!isOwnProfile && (
                <>
                  <button 
                    onClick={onChatClick}
                    className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors relative"
                  >
                    <MessageCircle className="w-4 h-4 text-purple-300" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                  </button>
                  <button className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors">
                    <Heart className="w-4 h-4 text-purple-400 drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.6))' }} />
                  </button>
                  <button 
                    onClick={() => setShowReportModal(true)}
                    className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors"
                  >
                    <Flag className="w-4 h-4 text-purple-300" />
                  </button>
                </>
              )}
              {isOwnProfile && (
                <button 
                  onClick={() => setShowEditProfile(true)}
                  className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors"
                >
                  <Edit3 className="w-4 h-4 text-purple-300" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4">
        {/* Profile Header */}
        <div className="py-6">
          <div className="flex items-start space-x-4 mb-6">
            {/* Profile Picture */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full overflow-hidden border-3 border-purple-500/40 shadow-lg shadow-purple-900/60">
                <img
                  src={enhancedUser.avatar}
                  alt={enhancedUser.displayName}
                  className="w-full h-full object-cover"
                />
              </div>
              {enhancedUser.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-black flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                </div>
              )}
              {isOwnProfile && (
                <button className="absolute -bottom-1 -left-1 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center border-2 border-black hover:bg-purple-700 transition-colors">
                  <Camera className="w-3 h-3 text-white" />
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="flex-1">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-white">{formatNumber(enhancedUser.posts)}</div>
                  <div className="text-purple-200/80 text-sm">Posts</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-white">{formatNumber(enhancedUser.followers)}</div>
                  <div className="text-purple-200/80 text-sm">Followers</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-purple-400 fill-current" />
                    <span className="text-xl font-bold text-white">{enhancedUser.rating}</span>
                  </div>
                  <div className="text-purple-200/80 text-sm">Rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Name and Bio */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-white mb-1">{enhancedUser.displayName}</h1>
            <p className="text-purple-200/80 mb-3">@{enhancedUser.username}</p>
            <p className="text-purple-100 leading-relaxed mb-4">{enhancedUser.bio}</p>
            
            <div className="flex items-center text-purple-200/80 mb-4">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="text-sm">{enhancedUser.location} • {enhancedUser.age} years old</span>
            </div>

            {/* Role Type & Expertise */}
            {enhancedUser.roleType && (
              <div className="mb-4">
                <span className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 border border-purple-500/40 text-purple-300 px-3 py-1.5 rounded-xl text-sm font-medium capitalize">
                  Offers {enhancedUser.roleType} Experience
                </span>
              </div>
            )}

            {enhancedUser.expertise && enhancedUser.expertise.length > 0 && (
              <div className="mb-4">
                <h4 className="text-purple-200 font-semibold text-sm mb-2">Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {enhancedUser.expertise.map((exp) => (
                    <span
                      key={exp}
                      className="bg-green-600/20 text-green-300 px-3 py-1.5 rounded-xl text-sm border border-green-500/30"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Interests */}
            <div className="flex flex-wrap gap-2">
              {enhancedUser.interests.map((interest) => (
                <span
                  key={interest}
                  className="bg-purple-600/20 text-purple-200 px-3 py-1.5 rounded-xl text-sm border border-purple-500/30"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Host Banner */}
          {enhancedUser.isHost && (
            <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 rounded-3xl p-6 mb-6 border border-purple-500/40 shadow-lg shadow-purple-900/60">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-bold text-lg mb-1">Available for Chat</h3>
                  <p className="text-purple-100/90 text-sm">Book a private conversation session</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-white">${enhancedUser.hourlyRate}</div>
                  <div className="text-purple-100/80 text-sm">per hour</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-purple-100/90 text-sm mb-4">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{enhancedUser.totalChats} total chats</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  <span>Usually responds in 5 min</span>
                </div>
              </div>

              {!isOwnProfile && (
                <button
                  onClick={() => onPurchaseChat(enhancedUser)}
                  className="w-full bg-white text-purple-700 py-3 px-6 rounded-2xl font-bold transition-all duration-300 hover:bg-purple-50 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  <div className="flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 mr-3" />
                    <span>Book 1-Hour Chat</span>
                  </div>
                </button>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {!isOwnProfile ? (
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button className="bg-black/40 backdrop-blur-xl border border-purple-500/30 text-purple-200 py-3 px-4 rounded-2xl font-medium transition-all duration-300 hover:bg-black/50 hover:border-purple-400/50 flex items-center justify-center">
                <Heart className="w-4 h-4 mr-2 text-purple-400 drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.6))' }} />
                Follow
              </button>
              <button className="bg-black/40 backdrop-blur-xl border border-red-500/30 text-red-300 py-3 px-4 rounded-2xl font-medium transition-all duration-300 hover:bg-red-900/20 hover:border-red-400/50 flex items-center justify-center">
                <Block className="w-4 h-4 mr-2" />
                Block
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button 
                onClick={() => setShowEditProfile(true)}
                className="bg-black/40 backdrop-blur-xl border border-purple-500/30 text-purple-200 py-3 px-4 rounded-2xl font-medium transition-all duration-300 hover:bg-black/50 hover:border-purple-400/50 flex items-center justify-center"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </button>
              {!enhancedUser.isHost ? (
                <button 
                  onClick={onHostSetup}
                  className="bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-2xl font-medium transition-all duration-300 hover:from-green-700 hover:to-green-800 flex items-center justify-center"
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Register as Host
                </button>
              ) : (
                <button className="bg-black/40 backdrop-blur-xl border border-green-500/30 text-green-300 py-3 px-4 rounded-2xl font-medium transition-all duration-300 hover:bg-green-900/20 hover:border-green-400/50 flex items-center justify-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Host Settings
                </button>
              )}
            </div>
          )}
        </div>

        {/* Posts Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-purple-200">Posts</h2>
            <div className="flex items-center space-x-2">
              <span className="text-purple-300/80 text-sm">{userPosts.length} posts</span>
              {isOwnProfile && (
                <button className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors">
                  <Plus className="w-4 h-4 text-purple-300" />
                </button>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-1">
            {userPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => handlePostClick(post)}
                className="aspect-square bg-black/40 rounded-lg overflow-hidden cursor-pointer group relative border border-purple-500/20 hover:border-purple-400/50 transition-all duration-300"
              >
                <img
                  src={post.content[0]}
                  alt="Post"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Post Type Indicator */}
                {post.type === 'carousel' && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <MoreHorizontal className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
                
                {post.type === 'video' && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <Play className="w-3 h-3 text-white fill-current" />
                    </div>
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="flex items-center space-x-4 text-white">
                    <div className="flex items-center space-x-1">
                      <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current text-purple-400' : ''}`} />
                      <span className="text-sm font-medium">{formatNumber(post.likes)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">{formatNumber(post.comments)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/90 backdrop-blur-xl border border-purple-500/30 rounded-3xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-purple-500/30">
              <h3 className="text-xl font-bold text-white">Edit Profile</h3>
              <button
                onClick={() => setShowEditProfile(false)}
                className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-purple-300" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Display Name</label>
                <input
                  type="text"
                  value={editedDisplayName}
                  onChange={(e) => setEditedDisplayName(e.target.value)}
                  className="w-full bg-black/30 border border-purple-500/30 rounded-2xl px-4 py-3 text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-purple-200 mb-2">Bio</label>
                <textarea
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  rows={4}
                  maxLength={150}
                  className="w-full bg-black/30 border border-purple-500/30 rounded-2xl px-4 py-3 text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60 resize-none"
                />
                <p className="text-purple-300/60 text-sm mt-1">{editedBio.length}/150 characters</p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowEditProfile(false)}
                  className="flex-1 bg-black/40 border border-purple-500/30 text-purple-200 py-3 rounded-2xl font-medium hover:bg-black/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-2xl font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-300"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/90 backdrop-blur-xl border border-purple-500/30 rounded-3xl w-full max-w-md max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-purple-500/30">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-purple-500/30">
                  <img
                    src={enhancedUser.avatar}
                    alt={enhancedUser.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-semibold text-white">{enhancedUser.displayName}</span>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-purple-300" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="aspect-square overflow-hidden">
              <img
                src={selectedPost.content[0]}
                alt="Post content"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Modal Footer */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  <button className={`transition-all duration-300 ${
                    selectedPost.isLiked ? 'text-purple-400 scale-110' : 'text-purple-300 hover:text-purple-400'
                  }`}>
                    <Heart className={`w-6 h-6 ${selectedPost.isLiked ? 'fill-current' : ''}`} />
                  </button>
                  <button className="text-purple-300 hover:text-purple-200 transition-colors">
                    <MessageCircle className="w-6 h-6" />
                  </button>
                </div>
                <span className="text-purple-200/80 text-sm">
                  {formatNumber(selectedPost.likes)} likes
                </span>
              </div>
              <p className="text-purple-100 text-sm leading-relaxed">
                <span className="font-semibold text-white">{enhancedUser.displayName}</span>{' '}
                {selectedPost.caption}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/90 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold text-white mb-4">Report User</h3>
            <div className="space-y-3 mb-6">
              {['Inappropriate content', 'Harassment', 'Spam', 'Fake profile', 'Other'].map((reason) => (
                <button
                  key={reason}
                  className="w-full text-left bg-black/40 border border-purple-500/30 text-purple-200 py-3 px-4 rounded-2xl hover:bg-purple-600/20 hover:border-purple-400/50 transition-all duration-300"
                >
                  {reason}
                </button>
              ))}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 bg-black/40 border border-purple-500/30 text-purple-200 py-3 rounded-2xl font-medium hover:bg-black/50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 bg-red-600 text-white py-3 rounded-2xl font-medium hover:bg-red-700 transition-colors">
                Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;