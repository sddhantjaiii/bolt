import React, { useState } from 'react';
import { ArrowLeft, User, Lock, Bell, Palette, Globe, Eye, EyeOff, Camera, Edit3, Mail, Phone, Shield } from 'lucide-react';

interface AppSettingsProps {
  onBack: () => void;
  currentUser: any;
  onCurrencyChange: (currency: string) => void;
}

const AppSettings: React.FC<AppSettingsProps> = ({ onBack, currentUser, onCurrencyChange }) => {
  const [activeSection, setActiveSection] = useState<'main' | 'profile' | 'password' | 'notifications'>('main');
  const [profileData, setProfileData] = useState({
    displayName: currentUser.displayName,
    username: currentUser.username,
    bio: currentUser.bio,
    email: 'user@example.com',
    phone: '+1 (555) 123-4567'
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    newMatches: true,
    messages: true,
    likes: true,
    superLikes: false,
    promotions: false
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [darkMode, setDarkMode] = useState(true);

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' }
  ];

  const handleProfileSave = () => {
    // In a real app, this would save to backend
    console.log('Saving profile:', profileData);
  };

  const handlePasswordSave = () => {
    // In a real app, this would save to backend
    console.log('Changing password');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleNotificationSave = () => {
    // In a real app, this would save to backend
    console.log('Saving notifications:', notifications);
  };

  if (activeSection === 'profile') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 pb-20">
        <div className="bg-black/40 backdrop-blur-xl border-b border-purple-500/30 sticky top-0 z-50">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveSection('main')}
                className="flex items-center text-purple-300 hover:text-purple-200 transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>
              <h1 className="text-xl font-bold text-white">Edit Profile</h1>
              <div className="w-16"></div>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 py-6 space-y-6">
          {/* Profile Photo */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-purple-500/30">
                <img
                  src={currentUser.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center border-2 border-black hover:bg-purple-700 transition-colors">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
            <p className="text-purple-200/80 text-sm mt-2">Tap to change photo</p>
          </div>

          {/* Profile Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">Display Name</label>
              <input
                type="text"
                value={profileData.displayName}
                onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                className="w-full bg-black/30 border border-purple-500/30 rounded-2xl px-4 py-3 text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60"
              />
            </div>

            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                value={profileData.username}
                onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full bg-black/30 border border-purple-500/30 rounded-2xl px-4 py-3 text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60"
              />
            </div>

            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">Bio</label>
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                rows={3}
                maxLength={150}
                className="w-full bg-black/30 border border-purple-500/30 rounded-2xl px-4 py-3 text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60 resize-none"
              />
              <p className="text-purple-300/60 text-xs mt-1">{profileData.bio.length}/150</p>
            </div>

            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full bg-black/30 border border-purple-500/30 rounded-2xl px-4 py-3 text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60"
              />
            </div>

            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full bg-black/30 border border-purple-500/30 rounded-2xl px-4 py-3 text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60"
              />
            </div>
          </div>

          <button
            onClick={handleProfileSave}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-2xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300"
          >
            Save Changes
          </button>
        </div>
      </div>
    );
  }

  if (activeSection === 'password') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 pb-20">
        <div className="bg-black/40 backdrop-blur-xl border-b border-purple-500/30 sticky top-0 z-50">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveSection('main')}
                className="flex items-center text-purple-300 hover:text-purple-200 transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>
              <h1 className="text-xl font-bold text-white">Change Password</h1>
              <div className="w-16"></div>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 py-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">Current Password</label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full bg-black/30 border border-purple-500/30 rounded-2xl px-4 py-3 pr-12 text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300/80 hover:text-purple-200"
                >
                  {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full bg-black/30 border border-purple-500/30 rounded-2xl px-4 py-3 pr-12 text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300/80 hover:text-purple-200"
                >
                  {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-purple-200 text-sm font-medium mb-2">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full bg-black/30 border border-purple-500/30 rounded-2xl px-4 py-3 pr-12 text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300/80 hover:text-purple-200"
                >
                  {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-purple-600/10 border border-purple-500/30 rounded-2xl p-4">
            <p className="text-purple-200/80 text-sm">
              <strong>Password Requirements:</strong> At least 8 characters with uppercase, lowercase, and number.
            </p>
          </div>

          <button
            onClick={handlePasswordSave}
            disabled={!passwordData.currentPassword || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-2xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Change Password
          </button>
        </div>
      </div>
    );
  }

  if (activeSection === 'notifications') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 pb-20">
        <div className="bg-black/40 backdrop-blur-xl border-b border-purple-500/30 sticky top-0 z-50">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setActiveSection('main')}
                className="flex items-center text-purple-300 hover:text-purple-200 transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>
              <h1 className="text-xl font-bold text-white">Notifications</h1>
              <div className="w-16"></div>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 py-6 space-y-6">
          {/* Notification Methods */}
          <div className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6">
            <h3 className="text-purple-200 font-semibold mb-4">Notification Methods</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-purple-300 mr-3" />
                  <span className="text-purple-100 text-sm">Email notifications</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.email}
                  onChange={(e) => setNotifications(prev => ({ ...prev, email: e.target.checked }))}
                  className="w-5 h-5 text-purple-600 bg-black/30 border-purple-500/30 rounded focus:ring-purple-500/30"
                />
              </label>
              <label className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="w-5 h-5 text-purple-300 mr-3" />
                  <span className="text-purple-100 text-sm">Push notifications</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.push}
                  onChange={(e) => setNotifications(prev => ({ ...prev, push: e.target.checked }))}
                  className="w-5 h-5 text-purple-600 bg-black/30 border-purple-500/30 rounded focus:ring-purple-500/30"
                />
              </label>
              <label className="flex items-center justify-between">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-purple-300 mr-3" />
                  <span className="text-purple-100 text-sm">SMS notifications</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.sms}
                  onChange={(e) => setNotifications(prev => ({ ...prev, sms: e.target.checked }))}
                  className="w-5 h-5 text-purple-600 bg-black/30 border-purple-500/30 rounded focus:ring-purple-500/30"
                />
              </label>
            </div>
          </div>

          {/* Notification Types */}
          <div className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6">
            <h3 className="text-purple-200 font-semibold mb-4">What to notify me about</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-purple-100 text-sm">New matches</span>
                <input
                  type="checkbox"
                  checked={notifications.newMatches}
                  onChange={(e) => setNotifications(prev => ({ ...prev, newMatches: e.target.checked }))}
                  className="w-5 h-5 text-purple-600 bg-black/30 border-purple-500/30 rounded focus:ring-purple-500/30"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-purple-100 text-sm">New messages</span>
                <input
                  type="checkbox"
                  checked={notifications.messages}
                  onChange={(e) => setNotifications(prev => ({ ...prev, messages: e.target.checked }))}
                  className="w-5 h-5 text-purple-600 bg-black/30 border-purple-500/30 rounded focus:ring-purple-500/30"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-purple-100 text-sm">Likes</span>
                <input
                  type="checkbox"
                  checked={notifications.likes}
                  onChange={(e) => setNotifications(prev => ({ ...prev, likes: e.target.checked }))}
                  className="w-5 h-5 text-purple-600 bg-black/30 border-purple-500/30 rounded focus:ring-purple-500/30"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-purple-100 text-sm">Super likes</span>
                <input
                  type="checkbox"
                  checked={notifications.superLikes}
                  onChange={(e) => setNotifications(prev => ({ ...prev, superLikes: e.target.checked }))}
                  className="w-5 h-5 text-purple-600 bg-black/30 border-purple-500/30 rounded focus:ring-purple-500/30"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-purple-100 text-sm">Promotions & offers</span>
                <input
                  type="checkbox"
                  checked={notifications.promotions}
                  onChange={(e) => setNotifications(prev => ({ ...prev, promotions: e.target.checked }))}
                  className="w-5 h-5 text-purple-600 bg-black/30 border-purple-500/30 rounded focus:ring-purple-500/30"
                />
              </label>
            </div>
          </div>

          <button
            onClick={handleNotificationSave}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-2xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300"
          >
            Save Notification Settings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 pb-20">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl border-b border-purple-500/30 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center text-purple-300 hover:text-purple-200 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
            <h1 className="text-xl font-bold text-white">Settings</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* Profile Settings */}
        <button
          onClick={() => setActiveSection('profile')}
          className="w-full bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4 hover:bg-black/50 hover:border-purple-400/50 transition-all duration-300 text-left"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600/20 rounded-2xl flex items-center justify-center">
                <User className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <h3 className="text-white font-medium">Edit Profile</h3>
                <p className="text-purple-200/60 text-sm">Photo, name, bio, contact info</p>
              </div>
            </div>
            <Edit3 className="w-4 h-4 text-purple-300/60" />
          </div>
        </button>

        {/* Password */}
        <button
          onClick={() => setActiveSection('password')}
          className="w-full bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4 hover:bg-black/50 hover:border-purple-400/50 transition-all duration-300 text-left"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600/20 rounded-2xl flex items-center justify-center">
                <Lock className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <h3 className="text-white font-medium">Change Password</h3>
                <p className="text-purple-200/60 text-sm">Update your account password</p>
              </div>
            </div>
            <Shield className="w-4 h-4 text-purple-300/60" />
          </div>
        </button>

        {/* Notifications */}
        <button
          onClick={() => setActiveSection('notifications')}
          className="w-full bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4 hover:bg-black/50 hover:border-purple-400/50 transition-all duration-300 text-left"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600/20 rounded-2xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <h3 className="text-white font-medium">Notifications</h3>
                <p className="text-purple-200/60 text-sm">Email, push, SMS preferences</p>
              </div>
            </div>
            <Bell className="w-4 h-4 text-purple-300/60" />
          </div>
        </button>

        {/* Theme Toggle */}
        <div className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600/20 rounded-2xl flex items-center justify-center">
                <Palette className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <h3 className="text-white font-medium">Dark Mode</h3>
                <p className="text-purple-200/60 text-sm">Toggle app theme</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
              className="w-5 h-5 text-purple-600 bg-black/30 border-purple-500/30 rounded focus:ring-purple-500/30"
            />
          </div>
        </div>

        {/* Currency */}
        <div className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600/20 rounded-2xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-purple-300" />
              </div>
              <div>
                <h3 className="text-white font-medium">Currency</h3>
                <p className="text-purple-200/60 text-sm">Display currency preference</p>
              </div>
            </div>
            <select
              value={currentUser.currency || 'USD'}
              onChange={(e) => onCurrencyChange(e.target.value)}
              className="bg-black/30 border border-purple-500/30 rounded-xl text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50"
            >
              {currencies.map((currency) => (
                <option key={currency.code} value={currency.code} className="bg-gray-800">
                  {currency.symbol} {currency.code}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSettings;