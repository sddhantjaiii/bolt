import React from 'react';
import { Home, TrendingUp, Search, User } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: 'feed' | 'trending' | 'search' | 'profile';
  onTabChange: (tab: 'feed' | 'trending' | 'search' | 'profile') => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'feed', icon: Home, label: 'Feed' },
    { id: 'trending', icon: TrendingUp, label: 'Trending' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-purple-500/30 z-50">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id as any)}
                className={`flex flex-col items-center justify-center py-2 px-4 rounded-2xl transition-all duration-300 min-w-[60px] ${
                  isActive
                    ? 'bg-purple-600/20 text-purple-300'
                    : 'text-purple-400/70 hover:text-purple-300 hover:bg-purple-600/10'
                }`}
              >
                <Icon 
                  className={`w-6 h-6 mb-1 transition-all duration-300 ${
                    isActive ? 'scale-110' : 'scale-100'
                  }`}
                  style={isActive ? { 
                    filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.6))',
                  } : {}}
                />
                <span className={`text-xs font-medium transition-all duration-300 ${
                  isActive ? 'text-purple-200' : 'text-purple-400/70'
                }`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BottomNavigation;