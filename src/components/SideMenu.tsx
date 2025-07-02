import React, { useState } from 'react';
import { X, Settings, Shield, Heart, DollarSign, Globe, User, HelpCircle, LogOut, ChevronRight, MapPin, Calendar, MessageSquare, BookOpen } from 'lucide-react';
import PrivacySettings from './PrivacySettings';
import AppSettings from './AppSettings';
import Wishlist from './Wishlist';

interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  currency?: string;
}

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onCurrencyChange: (currency: string) => void;
  onNavigate: (section: string) => void;
  onSignOut: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, onClose, currentUser, onCurrencyChange, onNavigate, onSignOut }) => {
  const [activeView, setActiveView] = useState<'menu' | 'privacy' | 'settings' | 'wishlist'>('menu');
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar', country: 'United States' },
    { code: 'EUR', symbol: '€', name: 'Euro', country: 'European Union' },
    { code: 'GBP', symbol: '£', name: 'British Pound', country: 'United Kingdom' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', country: 'India' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen', country: 'Japan' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', country: 'Canada' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', country: 'Australia' },
    { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', country: 'Switzerland' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', country: 'China' },
    { code: 'KRW', symbol: '₩', name: 'South Korean Won', country: 'South Korea' }
  ];

  const getCurrentCurrency = () => {
    return currencies.find(c => c.code === currentUser.currency) || currencies[0];
  };

  const handleCurrencySelect = (currency: typeof currencies[0]) => {
    onCurrencyChange(currency.code);
    setShowCurrencyModal(false);
  };

  const handleNavigation = (section: string) => {
    if (section === 'privacy') {
      setActiveView('privacy');
      return;
    }
    if (section === 'settings') {
      setActiveView('settings');
      return;
    }
    if (section === 'wishlist') {
      setActiveView('wishlist');
      return;
    }
    onNavigate(section);
    onClose();
  };

  const handleSignOut = () => {
    onSignOut();
    onClose();
  };

  const handleBackToMenu = () => {
    setActiveView('menu');
  };

  if (!isOpen) return null;

  // Render Privacy Settings
  if (activeView === 'privacy') {
    return <PrivacySettings onBack={handleBackToMenu} />;
  }

  // Render App Settings
  if (activeView === 'settings') {
    return (
      <AppSettings
        onBack={handleBackToMenu}
        currentUser={currentUser}
        onCurrencyChange={onCurrencyChange}
      />
    );
  }

  // Render Wishlist
  if (activeView === 'wishlist') {
    return <Wishlist onBack={handleBackToMenu} />;
  }

  const menuItems = [
    {
      icon: Settings,
      label: 'Settings',
      action: () => handleNavigation('settings'),
      hasChevron: true
    },
    {
      icon: Shield,
      label: 'Privacy & Security',
      action: () => handleNavigation('privacy'),
      hasChevron: true
    },
    {
      icon: Heart,
      label: 'Wishlist',
      action: () => handleNavigation('wishlist'),
      hasChevron: true,
      badge: '3'
    },
    {
      icon: Calendar,
      label: 'Bookings',
      action: () => handleNavigation('bookings'),
      hasChevron: true,
      subtitle: 'Manage your sessions'
    },
    {
      icon: MessageSquare,
      label: 'Messages',
      action: () => handleNavigation('messages'),
      hasChevron: true,
      badge: '2'
    },
    {
      icon: DollarSign,
      label: 'Currency Preferences',
      action: () => setShowCurrencyModal(true),
      hasChevron: true,
      subtitle: getCurrentCurrency().name
    },
    {
      icon: MapPin,
      label: 'Location Settings',
      action: () => handleNavigation('location'),
      hasChevron: true
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      action: () => handleNavigation('help'),
      hasChevron: true
    }
  ];

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Side Menu */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-black/95 backdrop-blur-xl border-r border-purple-500/30 z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500/30">
              <img
                src={currentUser.avatar}
                alt={currentUser.displayName}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-white">{currentUser.displayName}</h3>
              <p className="text-purple-200/80 text-sm">@{currentUser.username}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors"
          >
            <X className="w-4 h-4 text-purple-300" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-4 overflow-y-auto h-full pb-32">
          <div className="space-y-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className="w-full flex items-center justify-between p-4 bg-black/40 border border-purple-500/30 rounded-2xl hover:bg-purple-600/20 hover:border-purple-400/50 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-2xl flex items-center justify-center border border-purple-500/30 group-hover:bg-purple-600/30 transition-colors">
                    <item.icon className="w-5 h-5 text-purple-300" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.subtitle && (
                      <p className="text-purple-200/60 text-sm">{item.subtitle}</p>
                    )}
                  </div>
                </div>
                {item.hasChevron && (
                  <ChevronRight className="w-4 h-4 text-purple-300/60 group-hover:text-purple-300 transition-colors" />
                )}
              </button>
            ))}
          </div>

          {/* Logout Button */}
          <div className="mt-8 pt-4 border-t border-purple-500/30">
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 p-4 bg-red-600/20 border border-red-500/30 rounded-2xl hover:bg-red-600/30 hover:border-red-400/50 transition-all duration-300 group"
            >
              <div className="w-10 h-10 bg-red-600/20 rounded-2xl flex items-center justify-center border border-red-500/30 group-hover:bg-red-600/30 transition-colors">
                <LogOut className="w-5 h-5 text-red-300" />
              </div>
              <span className="text-red-300 font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Currency Modal */}
      {showCurrencyModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-60 flex items-center justify-center p-4">
          <div className="bg-black/90 backdrop-blur-xl border border-purple-500/30 rounded-3xl w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-purple-500/30">
              <h3 className="text-xl font-bold text-white">Currency Preferences</h3>
              <button
                onClick={() => setShowCurrencyModal(false)}
                className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors"
              >
                <X className="w-4 h-4 text-purple-300" />
              </button>
            </div>

            <div className="p-4">
              <p className="text-purple-200/80 text-sm mb-4">
                Choose your preferred currency for pricing display
              </p>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {currencies.map((currency) => (
                  <button
                    key={currency.code}
                    onClick={() => handleCurrencySelect(currency)}
                    className={`w-full text-left p-4 rounded-2xl transition-all duration-300 ${
                      currentUser.currency === currency.code
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white border border-purple-500/50'
                        : 'bg-black/40 border border-purple-500/30 text-purple-200 hover:bg-purple-600/20 hover:border-purple-400/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-lg ${
                          currentUser.currency === currency.code
                            ? 'bg-white/20 text-white'
                            : 'bg-purple-600/20 text-purple-300'
                        }`}>
                          {currency.symbol}
                        </div>
                        <div>
                          <div className="font-medium">{currency.name}</div>
                          <div className={`text-sm ${
                            currentUser.currency === currency.code
                              ? 'text-purple-200'
                              : 'text-purple-300/60'
                          }`}>
                            {currency.country}
                          </div>
                        </div>
                      </div>
                      <div className={`text-sm font-mono ${
                        currentUser.currency === currency.code
                          ? 'text-purple-200'
                          : 'text-purple-300/80'
                      }`}>
                        {currency.code}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 bg-purple-600/10 border border-purple-500/30 rounded-2xl p-4">
                <p className="text-purple-200/80 text-sm">
                  <strong>Note:</strong> Currency preference only affects display. All transactions are processed in the host's local currency.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SideMenu;