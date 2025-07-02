import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, Heart, Users, Moon, Flame, Phone, ArrowLeft, Shield, User } from 'lucide-react';
import Feed from './components/Feed';
import Profile from './components/Profile';
import PaymentModal from './components/PaymentModal';
import Chat from './components/Chat';
import HostSetup from './components/HostSetup';
import Discover from './components/Discover';
import Search from './components/Search';
import Trending from './components/Trending';
import BottomNavigation from './components/BottomNavigation';
import SideMenu from './components/SideMenu';
import Messages from './components/Messages';
import Bookings from './components/Bookings';
import HelpSupport from './components/HelpSupport';
import ChatList from './components/ChatList';
import ChatView from './components/ChatView';
import MultiStepRegistration from './components/MultiStepRegistration';

interface LoginForm {
  email: string;
  password: string;
}

interface RegistrationData {
  mobileNumber: string;
  countryCode: string;
  otp: string;
  fullName: string;
  handle: string;
  profilePhoto: File | null;
  password: string;
  confirmPassword: string;
  gender: string;
  dateOfBirth: string;
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
  expertise?: string[];
  roleType?: string;
  currency?: string;
  coordinates?: { latitude: number; longitude: number };
}

interface Story {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  isViewed: boolean;
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

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'system';
  isRead: boolean;
}

interface Conversation {
  id: string;
  user: User;
  lastMessage: Message;
  unreadCount: number;
  isPinned: boolean;
  isTyping?: boolean;
}

type AppView = 'auth' | 'registration' | 'feed' | 'trending' | 'search' | 'profile' | 'discover' | 'chat' | 'host-setup' | 'messages' | 'bookings' | 'help' | 'chat-list' | 'chat-view';

function App() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('auth');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginForm>>({});

  // App state
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [chatUser, setChatUser] = useState<User | null>(null);
  const [showSideMenu, setShowSideMenu] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  // Current user data (mock)
  const [currentUser, setCurrentUser] = useState<User>({
    id: 'current-user',
    username: 'you',
    displayName: 'Your Name',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
    bio: 'Living life to the fullest ✨',
    age: 25,
    location: 'New York, NY',
    hourlyRate: 0,
    rating: 0,
    totalChats: 0,
    isOnline: true,
    isHost: false,
    interests: ['Travel', 'Music', 'Art'],
    photos: [],
    currency: 'USD'
  });

  // Auth validation functions
  const validateForm = (): boolean => {
    const newErrors: Partial<LoginForm> = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Auth action functions
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = validateForm();
    if (!isValid) return;
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    
    // Login successful
    setIsAuthenticated(true);
    setCurrentView('feed');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof LoginForm]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setCurrentView('auth');
    setSelectedUser(null);
    setChatUser(null);
    setSelectedConversation(null);
    setShowSideMenu(false);
    setFormData({
      email: '',
      password: ''
    });
    setErrors({});
  };

  // Registration handlers
  const handleJoinClick = () => {
    setCurrentView('registration');
  };

  const handleRegistrationComplete = async (data: RegistrationData) => {
    setIsLoading(true);
    
    // Simulate account creation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update current user with registration data
    setCurrentUser(prev => ({
      ...prev,
      username: data.handle.slice(1), // Remove # from handle
      displayName: data.fullName,
      avatar: data.profilePhoto ? URL.createObjectURL(data.profilePhoto) : prev.avatar,
      age: data.dateOfBirth ? new Date().getFullYear() - new Date(data.dateOfBirth).getFullYear() : prev.age
    }));
    
    setIsLoading(false);
    setIsAuthenticated(true);
    setCurrentView('feed');
  };

  const handleGoogleSignup = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsAuthenticated(true);
    setCurrentView('feed');
  };

  const handleBackToLogin = () => {
    setCurrentView('auth');
  };

  // App navigation functions
  const handleProfileClick = (user: User) => {
    setSelectedUser(user);
    setCurrentView('profile');
  };

  const handleStoryClick = (story: Story) => {
    console.log('Story clicked:', story);
  };

  const handlePurchaseChat = (user: User) => {
    setSelectedUser(user);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = (user: User) => {
    setShowPaymentModal(false);
    setChatUser(user);
    setCurrentView('chat');
  };

  const handleBackToFeed = () => {
    setCurrentView('feed');
    setSelectedUser(null);
    setChatUser(null);
    setSelectedConversation(null);
  };

  const handleHostSetupComplete = (hostData: any) => {
    // Update current user with host data
    setCurrentUser(prev => ({
      ...prev,
      isHost: true,
      hourlyRate: hostData.hourlyRate,
      interests: hostData.interests,
      expertise: hostData.expertise,
      roleType: hostData.roleType
    }));
    setCurrentView('profile');
  };

  const handlePostClick = (post: Post) => {
    console.log('Post clicked:', post);
  };

  const handleNavigation = (view: 'feed' | 'trending' | 'search' | 'profile') => {
    if (view === 'profile') {
      setSelectedUser(currentUser);
      setCurrentView('profile');
    } else {
      setCurrentView(view);
      setSelectedUser(null);
      setChatUser(null);
      setSelectedConversation(null);
    }
  };

  const handleMenuToggle = () => {
    setShowSideMenu(!showSideMenu);
  };

  const handleCurrencyChange = (currency: string) => {
    setCurrentUser(prev => ({ ...prev, currency }));
  };

  const handleSideMenuNavigation = (section: string) => {
    switch (section) {
      case 'messages':
        setCurrentView('messages');
        break;
      case 'bookings':
        setCurrentView('bookings');
        break;
      case 'help':
        setCurrentView('help');
        break;
      default:
        console.log('Navigate to:', section);
    }
    setShowSideMenu(false);
  };

  // Chat navigation functions
  const handleChatClick = () => {
    setCurrentView('chat-list');
    setSelectedConversation(null);
  };

  const handleChatSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setCurrentView('chat-view');
  };

  const handleBackToChatList = () => {
    setCurrentView('chat-list');
    setSelectedConversation(null);
  };

  const handleNewChat = () => {
    // For now, just show a placeholder
    console.log('New chat functionality to be implemented');
  };

  // Render based on current view
  if (!isAuthenticated) {
    if (currentView === 'registration') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
          {/* Enhanced Background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-purple-900/85 to-indigo-900/75"></div>
            
            {/* Larger, more vivid background orbs */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/40 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-purple-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-700/25 rounded-full blur-3xl animate-pulse delay-500"></div>
            
            {/* More vivid floating particles */}
            <div className="absolute top-10 left-10 w-3 h-3 bg-purple-400/80 rounded-full animate-ping"></div>
            <div className="absolute top-1/3 right-20 w-2 h-2 bg-purple-300/70 rounded-full animate-ping delay-700"></div>
            <div className="absolute bottom-20 left-1/3 w-2.5 h-2.5 bg-purple-400/60 rounded-full animate-ping delay-1500"></div>
            
            <div className="absolute top-1/2 right-10 w-4 h-4 bg-purple-500/50 rounded-full animate-pulse delay-300"></div>
            <div className="absolute bottom-1/4 left-10 w-3 h-3 bg-purple-600/60 rounded-full animate-pulse delay-800"></div>
            
            {/* Additional vivid elements */}
            <div className="absolute top-20 right-1/3 w-1.5 h-1.5 bg-purple-200/60 rounded-full animate-ping delay-2000"></div>
            <div className="absolute bottom-1/2 left-20 w-2 h-2 bg-purple-500/40 rounded-full animate-pulse delay-1200"></div>
          </div>

          <div className="relative w-full max-w-sm z-10">
            <div className="bg-black/50 backdrop-blur-xl border border-purple-500/40 rounded-3xl shadow-2xl shadow-purple-900/80 p-6 transition-all duration-500 hover:shadow-purple-700/60 hover:border-purple-400/60 hover:bg-black/60">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-18 h-18 bg-gradient-to-br from-purple-600 via-purple-700 to-black rounded-3xl mb-4 shadow-lg shadow-purple-900/80 border border-purple-500/50">
                  <Users className="w-9 h-9 text-purple-200 fill-current drop-shadow-lg" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-200 via-purple-100 to-white bg-clip-text text-transparent mb-2 drop-shadow-sm">
                  Create an Account
                </h1>
                <p className="text-purple-200/90 text-base font-light">
                  Join our exclusive community
                </p>
              </div>

              <MultiStepRegistration
                onComplete={handleRegistrationComplete}
                onGoogleSignup={handleGoogleSignup}
                onLoginClick={handleBackToLogin}
                isLoading={isLoading}
              />

              {/* Back to Login Link */}
              <div className="text-center mt-6">
                <button
                  onClick={handleBackToLogin}
                  className="text-purple-200/80 hover:text-purple-100 transition-colors text-sm"
                >
                  Already have an account? <span className="text-purple-300 hover:text-purple-200 font-semibold">Login</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Magical Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black/95 via-purple-900/85 to-indigo-900/75"></div>
          
          {/* Glowing orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-700/15 rounded-full blur-3xl animate-pulse delay-500"></div>
          
          {/* Floating particles */}
          <div className="absolute top-10 left-10 w-2 h-2 bg-purple-400/60 rounded-full animate-ping"></div>
          <div className="absolute top-1/3 right-20 w-1 h-1 bg-purple-300/50 rounded-full animate-ping delay-700"></div>
          <div className="absolute bottom-20 left-1/3 w-1.5 h-1.5 bg-purple-400/40 rounded-full animate-ping delay-1500"></div>
        </div>

        <div className="relative w-full max-w-sm z-10">
          <div className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl shadow-2xl shadow-purple-900/60 p-8 transition-all duration-500 hover:shadow-purple-700/40 hover:border-purple-400/50 hover:bg-black/50">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 via-purple-700 to-black rounded-full mb-6 shadow-lg shadow-purple-900/70 border border-purple-500/40">
                <Moon className="w-8 h-8 text-purple-200 fill-current" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-200 via-purple-100 to-white bg-clip-text text-transparent mb-2">
                Welcome Back
              </h1>
              <p className="text-purple-200/90 text-base font-light">
                Enter the forbidden realm
              </p>
            </div>

            {/* Toggle Buttons */}
            <div className="flex bg-black/30 backdrop-blur-sm rounded-2xl p-1 mb-8 border border-purple-500/20">
              <button
                onClick={() => setAuthMode('signin')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                  authMode === 'signin'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-900/50'
                    : 'text-purple-200/70 hover:text-purple-100 hover:bg-black/20'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode('signup')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                  authMode === 'signup'
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-900/50'
                    : 'text-purple-200/70 hover:text-purple-100 hover:bg-black/20'
                }`}
              >
                Join Club
              </button>
            </div>

            {authMode === 'signin' ? (
              /* Sign In Form */
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-purple-300/80 group-focus-within:text-purple-200 transition-colors" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`block w-full pl-12 pr-4 py-4 border ${
                        errors.email ? 'border-red-400/60' : 'border-purple-500/30'
                      } rounded-2xl bg-black/30 backdrop-blur-sm text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60 transition-all duration-300 hover:bg-black/40 hover:border-purple-400/50 text-base`}
                      placeholder="Email Address"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-400/90 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-purple-300/80 group-focus-within:text-purple-200 transition-colors" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`block w-full pl-12 pr-14 py-4 border ${
                        errors.password ? 'border-red-400/60' : 'border-purple-500/30'
                      } rounded-2xl bg-black/30 backdrop-blur-sm text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60 transition-all duration-300 hover:bg-black/40 hover:border-purple-400/50 text-base`}
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-purple-300/80 hover:text-purple-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400/90 text-sm mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-black text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:from-purple-700 hover:via-purple-800 hover:to-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/60 hover:shadow-purple-800/70 border border-purple-500/40 group"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Entering...
                    </div>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Flame className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                      Enter Now
                    </span>
                  )}
                </button>
              </form>
            ) : (
              /* Join Club Placeholder */
              <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto border border-purple-500/30">
                  <Users className="w-8 h-8 text-purple-300" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Join The Club</h3>
                  <p className="text-purple-200/80 text-sm mb-6">
                    Create your account to access our exclusive community
                  </p>
                </div>
                <button
                  onClick={handleJoinClick}
                  className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-black text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:from-purple-700 hover:via-purple-800 hover:to-gray-900 shadow-lg shadow-purple-900/60 border border-purple-500/40"
                >
                  <span className="flex items-center justify-center">
                    <Users className="w-5 h-5 mr-2" />
                    Start Registration
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:bg-black/40">
              <Heart className="w-6 h-6 text-purple-300 mx-auto mb-2 fill-current" />
              <p className="text-purple-200/90 text-xs font-light">Intimate Support</p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:bg-black/40">
              <Lock className="w-6 h-6 text-purple-300 mx-auto mb-2" />
              <p className="text-purple-200/90 text-xs font-light">Private & Secure</p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:bg-black/40">
              <Moon className="w-6 h-6 text-purple-300 mx-auto mb-2 fill-current" />
              <p className="text-purple-200/90 text-xs font-light">Night Mode</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main app views
  switch (currentView) {
    case 'feed':
      return (
        <>
          <Feed 
            onProfileClick={handleProfileClick}
            onStoryClick={handleStoryClick}
            onMenuToggle={handleMenuToggle}
            onChatClick={handleChatClick}
          />
          <BottomNavigation activeTab="feed" onTabChange={handleNavigation} />
          <SideMenu 
            isOpen={showSideMenu}
            onClose={() => setShowSideMenu(false)}
            currentUser={currentUser}
            onCurrencyChange={handleCurrencyChange}
            onNavigate={handleSideMenuNavigation}
            onSignOut={handleSignOut}
          />
          {showPaymentModal && selectedUser && (
            <PaymentModal
              user={selectedUser}
              onClose={() => setShowPaymentModal(false)}
              onPaymentSuccess={handlePaymentSuccess}
            />
          )}
        </>
      );
    
    case 'trending':
      return (
        <>
          <Trending
            onProfileClick={handleProfileClick}
            onPostClick={handlePostClick}
            onMenuToggle={handleMenuToggle}
            onChatClick={handleChatClick}
          />
          <BottomNavigation activeTab="trending" onTabChange={handleNavigation} />
          <SideMenu 
            isOpen={showSideMenu}
            onClose={() => setShowSideMenu(false)}
            currentUser={currentUser}
            onCurrencyChange={handleCurrencyChange}
            onNavigate={handleSideMenuNavigation}
            onSignOut={handleSignOut}
          />
        </>
      );
    
    case 'search':
      return (
        <>
          <Search
            onProfileClick={handleProfileClick}
            onMenuToggle={handleMenuToggle}
            onChatClick={handleChatClick}
            currentUser={currentUser}
          />
          <BottomNavigation activeTab="search" onTabChange={handleNavigation} />
          <SideMenu 
            isOpen={showSideMenu}
            onClose={() => setShowSideMenu(false)}
            currentUser={currentUser}
            onCurrencyChange={handleCurrencyChange}
            onNavigate={handleSideMenuNavigation}
            onSignOut={handleSignOut}
          />
        </>
      );
    
    case 'discover':
      return (
        <>
          <Discover
            onProfileClick={handleProfileClick}
            onPostClick={handlePostClick}
          />
          <BottomNavigation activeTab="feed" onTabChange={handleNavigation} />
        </>
      );
    
    case 'profile':
      return (
        <>
          <Profile
            user={selectedUser || currentUser}
            onBack={handleBackToFeed}
            onPurchaseChat={handlePurchaseChat}
            isOwnProfile={selectedUser?.id === currentUser.id || !selectedUser}
            onHostSetup={() => setCurrentView('host-setup')}
            onMenuToggle={handleMenuToggle}
            onChatClick={handleChatClick}
          />
          <BottomNavigation activeTab="profile" onTabChange={handleNavigation} />
          <SideMenu 
            isOpen={showSideMenu}
            onClose={() => setShowSideMenu(false)}
            currentUser={currentUser}
            onCurrencyChange={handleCurrencyChange}
            onNavigate={handleSideMenuNavigation}
            onSignOut={handleSignOut}
          />
        </>
      );
    
    case 'chat':
      return chatUser ? (
        <Chat
          user={chatUser}
          onBack={handleBackToFeed}
          sessionDuration={60}
        />
      ) : null;
    
    case 'host-setup':
      return (
        <HostSetup
          onBack={() => setCurrentView('profile')}
          onComplete={handleHostSetupComplete}
          currentUser={currentUser}
        />
      );

    case 'messages':
      return (
        <Messages
          onBack={() => setCurrentView('feed')}
        />
      );

    case 'bookings':
      return (
        <Bookings
          onBack={() => setCurrentView('feed')}
          currentUser={currentUser}
        />
      );

    case 'help':
      return (
        <HelpSupport
          onBack={() => setCurrentView('feed')}
        />
      );

    case 'chat-list':
      return (
        <ChatList
          onBack={handleBackToFeed}
          onChatSelect={handleChatSelect}
          onNewChat={handleNewChat}
        />
      );

    case 'chat-view':
      return selectedConversation ? (
        <ChatView
          conversation={selectedConversation}
          onBack={handleBackToChatList}
        />
      ) : null;
    
    default:
      return null;
  }
}

export default App;