import React, { useState } from 'react';
import { ArrowLeft, Shield, Eye, EyeOff, Users, MessageSquare, MapPin, Clock, User, Trash2, ChevronRight } from 'lucide-react';

interface PrivacySettingsProps {
  onBack: () => void;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({ onBack }) => {
  const [settings, setSettings] = useState({
    profileVisibility: 'public', // public, private
    hideAge: false,
    hideDistance: false,
    hideLastSeen: false,
    whoCanMessage: 'everyone', // everyone, matched, hosts
    locationSharing: true,
    onlineStatus: true,
    readReceipts: true,
    activityStatus: true
  });

  const [blockedUsers] = useState([
    {
      id: '1',
      username: 'blocked_user1',
      displayName: 'John Doe',
      avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      blockedDate: new Date(Date.now() - 86400000) // 1 day ago
    },
    {
      id: '2',
      username: 'blocked_user2',
      displayName: 'Jane Smith',
      avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      blockedDate: new Date(Date.now() - 172800000) // 2 days ago
    }
  ]);

  const [showBlockedUsers, setShowBlockedUsers] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleUnblock = (userId: string) => {
    // In a real app, this would call an API
    console.log('Unblocking user:', userId);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (showBlockedUsers) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 pb-20">
        {/* Header */}
        <div className="bg-black/40 backdrop-blur-xl border-b border-purple-500/30 sticky top-0 z-50">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowBlockedUsers(false)}
                className="flex items-center text-purple-300 hover:text-purple-200 transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>
              <h1 className="text-xl font-bold text-white">Blocked Users</h1>
              <div className="w-16"></div>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 py-6">
          {blockedUsers.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-purple-300" />
              </div>
              <p className="text-purple-200/80 mb-2">No blocked users</p>
              <p className="text-purple-300/60 text-sm">Users you block will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {blockedUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500/30">
                        <img
                          src={user.avatar}
                          alt={user.displayName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{user.displayName}</h3>
                        <p className="text-purple-200/80 text-sm">@{user.username}</p>
                        <p className="text-purple-300/60 text-xs">Blocked {formatDate(user.blockedDate)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleUnblock(user.id)}
                      className="bg-purple-600/20 border border-purple-500/30 text-purple-300 px-4 py-2 rounded-xl text-sm hover:bg-purple-600/30 hover:border-purple-400/50 transition-all duration-300"
                    >
                      Unblock
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
            <h1 className="text-xl font-bold text-white">Privacy & Security</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Profile Visibility */}
        <div className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6">
          <h3 className="text-purple-200 font-semibold mb-4 flex items-center">
            <Eye className="w-5 h-5 mr-2" />
            Profile Visibility
          </h3>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="profileVisibility"
                value="public"
                checked={settings.profileVisibility === 'public'}
                onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                className="w-4 h-4 text-purple-600 bg-black/30 border-purple-500/30 focus:ring-purple-500/30"
              />
              <span className="ml-3 text-purple-100 text-sm">
                <strong>Public</strong> - Anyone can see your profile
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="profileVisibility"
                value="private"
                checked={settings.profileVisibility === 'private'}
                onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                className="w-4 h-4 text-purple-600 bg-black/30 border-purple-500/30 focus:ring-purple-500/30"
              />
              <span className="ml-3 text-purple-100 text-sm">
                <strong>Private</strong> - Only people you approve can see your profile
              </span>
            </label>
          </div>
        </div>

        {/* Hide Information */}
        <div className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6">
          <h3 className="text-purple-200 font-semibold mb-4 flex items-center">
            <EyeOff className="w-5 h-5 mr-2" />
            Hide Information
          </h3>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-purple-100 text-sm">Hide my age</span>
              <input
                type="checkbox"
                checked={settings.hideAge}
                onChange={(e) => handleSettingChange('hideAge', e.target.checked)}
                className="w-5 h-5 text-purple-600 bg-black/30 border-purple-500/30 rounded focus:ring-purple-500/30"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-purple-100 text-sm">Hide my distance</span>
              <input
                type="checkbox"
                checked={settings.hideDistance}
                onChange={(e) => handleSettingChange('hideDistance', e.target.checked)}
                className="w-5 h-5 text-purple-600 bg-black/30 border-purple-500/30 rounded focus:ring-purple-500/30"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-purple-100 text-sm">Hide when I was last seen</span>
              <input
                type="checkbox"
                checked={settings.hideLastSeen}
                onChange={(e) => handleSettingChange('hideLastSeen', e.target.checked)}
                className="w-5 h-5 text-purple-600 bg-black/30 border-purple-500/30 rounded focus:ring-purple-500/30"
              />
            </label>
          </div>
        </div>

        {/* Messaging Settings */}
        <div className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6">
          <h3 className="text-purple-200 font-semibold mb-4 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Who Can Message You
          </h3>
          
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="radio"
                name="whoCanMessage"
                value="everyone"
                checked={settings.whoCanMessage === 'everyone'}
                onChange={(e) => handleSettingChange('whoCanMessage', e.target.value)}
                className="w-4 h-4 text-purple-600 bg-black/30 border-purple-500/30 focus:ring-purple-500/30"
              />
              <span className="ml-3 text-purple-100 text-sm">Everyone</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="whoCanMessage"
                value="matched"
                checked={settings.whoCanMessage === 'matched'}
                onChange={(e) => handleSettingChange('whoCanMessage', e.target.value)}
                className="w-4 h-4 text-purple-600 bg-black/30 border-purple-500/30 focus:ring-purple-500/30"
              />
              <span className="ml-3 text-purple-100 text-sm">Only matched users</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="whoCanMessage"
                value="hosts"
                checked={settings.whoCanMessage === 'hosts'}
                onChange={(e) => handleSettingChange('whoCanMessage', e.target.value)}
                className="w-4 h-4 text-purple-600 bg-black/30 border-purple-500/30 focus:ring-purple-500/30"
              />
              <span className="ml-3 text-purple-100 text-sm">Hosts only</span>
            </label>
          </div>
        </div>

        {/* Activity & Location */}
        <div className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6">
          <h3 className="text-purple-200 font-semibold mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Activity & Location
          </h3>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-purple-100 text-sm">Share my location</span>
              <input
                type="checkbox"
                checked={settings.locationSharing}
                onChange={(e) => handleSettingChange('locationSharing', e.target.checked)}
                className="w-5 h-5 text-purple-600 bg-black/30 border-purple-500/30 rounded focus:ring-purple-500/30"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-purple-100 text-sm">Show when I'm online</span>
              <input
                type="checkbox"
                checked={settings.onlineStatus}
                onChange={(e) => handleSettingChange('onlineStatus', e.target.checked)}
                className="w-5 h-5 text-purple-600 bg-black/30 border-purple-500/30 rounded focus:ring-purple-500/30"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-purple-100 text-sm">Send read receipts</span>
              <input
                type="checkbox"
                checked={settings.readReceipts}
                onChange={(e) => handleSettingChange('readReceipts', e.target.checked)}
                className="w-5 h-5 text-purple-600 bg-black/30 border-purple-500/30 rounded focus:ring-purple-500/30"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-purple-100 text-sm">Show activity status</span>
              <input
                type="checkbox"
                checked={settings.activityStatus}
                onChange={(e) => handleSettingChange('activityStatus', e.target.checked)}
                className="w-5 h-5 text-purple-600 bg-black/30 border-purple-500/30 rounded focus:ring-purple-500/30"
              />
            </label>
          </div>
        </div>

        {/* Blocked Users */}
        <div className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6">
          <button
            onClick={() => setShowBlockedUsers(true)}
            className="w-full flex items-center justify-between text-left"
          >
            <div className="flex items-center">
              <User className="w-5 h-5 text-purple-300 mr-3" />
              <div>
                <h3 className="text-purple-200 font-semibold">Blocked Users</h3>
                <p className="text-purple-300/60 text-sm">Manage blocked users ({blockedUsers.length})</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-purple-300/60" />
          </button>
        </div>

        {/* Save Button */}
        <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 rounded-2xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg shadow-purple-900/60 border border-purple-500/40">
          Save Privacy Settings
        </button>
      </div>
    </div>
  );
};

export default PrivacySettings;