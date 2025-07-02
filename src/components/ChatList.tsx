import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Edit, MoreVertical, MessageCircle, Star, Clock, CheckCircle, Check } from 'lucide-react';

interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: Date;
  isHost?: boolean;
  rating?: number;
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

interface ChatListProps {
  onBack: () => void;
  onChatSelect: (conversation: Conversation) => void;
  onNewChat: () => void;
}

const ChatList: React.FC<ChatListProps> = ({ onBack, onChatSelect, onNewChat }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Mock conversations data
  useEffect(() => {
    const mockConversations: Conversation[] = [
      {
        id: 'conv1',
        user: {
          id: '1',
          username: 'sophia_rose',
          displayName: 'Sophia Rose',
          avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          isOnline: true,
          isHost: true,
          rating: 4.9
        },
        lastMessage: {
          id: 'msg1',
          senderId: '1',
          content: 'Thank you for the wonderful session today! I really enjoyed our conversation about mindfulness and self-care. Looking forward to our next chat! 💜',
          timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
          type: 'text',
          isRead: false
        },
        unreadCount: 2,
        isPinned: true,
        isTyping: false
      },
      {
        id: 'conv2',
        user: {
          id: '2',
          username: 'emma_night',
          displayName: 'Emma Night',
          avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          isOnline: false,
          lastSeen: new Date(Date.now() - 3600000), // 1 hour ago
          isHost: true,
          rating: 4.8
        },
        lastMessage: {
          id: 'msg2',
          senderId: 'current-user',
          content: 'That book recommendation was perfect! I started reading it last night.',
          timestamp: new Date(Date.now() - 7200000), // 2 hours ago
          type: 'text',
          isRead: true
        },
        unreadCount: 0,
        isPinned: false,
        isTyping: false
      },
      {
        id: 'conv3',
        user: {
          id: '3',
          username: 'luna_star',
          displayName: 'Luna Star',
          avatar: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          isOnline: true,
          isHost: true,
          rating: 4.7
        },
        lastMessage: {
          id: 'msg3',
          senderId: '3',
          content: 'Your art session sounds amazing! I\'d love to hear more about your creative process. When would be a good time for our next chat?',
          timestamp: new Date(Date.now() - 10800000), // 3 hours ago
          type: 'text',
          isRead: false
        },
        unreadCount: 1,
        isPinned: false,
        isTyping: true
      },
      {
        id: 'conv4',
        user: {
          id: '4',
          username: 'aria_moon',
          displayName: 'Aria Moon',
          avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          isOnline: false,
          lastSeen: new Date(Date.now() - 14400000), // 4 hours ago
          isHost: true,
          rating: 4.9
        },
        lastMessage: {
          id: 'msg4',
          senderId: '4',
          content: 'Great session on business strategy! The tips you shared about goal setting were incredibly helpful. Thank you! 🚀',
          timestamp: new Date(Date.now() - 14400000),
          type: 'text',
          isRead: true
        },
        unreadCount: 0,
        isPinned: false,
        isTyping: false
      },
      {
        id: 'conv5',
        user: {
          id: '5',
          username: 'zara_dreams',
          displayName: 'Zara Dreams',
          avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          isOnline: true,
          isHost: true,
          rating: 4.6
        },
        lastMessage: {
          id: 'msg5',
          senderId: 'current-user',
          content: 'The meditation techniques you taught me have been life-changing!',
          timestamp: new Date(Date.now() - 18000000), // 5 hours ago
          type: 'text',
          isRead: true
        },
        unreadCount: 0,
        isPinned: false,
        isTyping: false
      },
      {
        id: 'conv6',
        user: {
          id: '6',
          username: 'maya_soul',
          displayName: 'Maya Soul',
          avatar: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
          isOnline: false,
          lastSeen: new Date(Date.now() - 21600000), // 6 hours ago
          isHost: true,
          rating: 4.8
        },
        lastMessage: {
          id: 'msg6',
          senderId: '6',
          content: 'I loved hearing about your travel adventures! Your stories from Bali were so inspiring. Can\'t wait to plan my own trip! ✈️',
          timestamp: new Date(Date.now() - 21600000),
          type: 'text',
          isRead: false
        },
        unreadCount: 3,
        isPinned: false,
        isTyping: false
      }
    ];

    // Simulate loading
    setTimeout(() => {
      setConversations(mockConversations);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredConversations = conversations.filter(conv =>
    conv.user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days}d`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return 'now';
    }
  };

  const getLastSeenText = (user: User) => {
    if (user.isOnline) return 'Online';
    if (user.lastSeen) {
      const diff = new Date().getTime() - user.lastSeen.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);
      
      if (days > 0) return `Last seen ${days}d ago`;
      if (hours > 0) return `Last seen ${hours}h ago`;
      return 'Last seen recently';
    }
    return 'Last seen recently';
  };

  const currentUserId = 'current-user';

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl border-b border-purple-500/30 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={onBack}
                className="flex items-center text-purple-300 hover:text-purple-200 transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-200 to-white bg-clip-text text-transparent">
                Messages
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={onNewChat}
                className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors"
              >
                <Edit className="w-4 h-4 text-purple-300" />
              </button>
              <button className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors">
                <MoreVertical className="w-4 h-4 text-purple-300" />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-300/80" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-10 pr-4 py-3 bg-black/30 border border-purple-500/30 rounded-2xl text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60"
            />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4">
        {/* Conversations List */}
        <div className="py-4">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-4 animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="w-14 h-14 bg-purple-600/20 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-purple-600/20 rounded mb-2"></div>
                      <div className="h-3 bg-purple-600/10 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-purple-300" />
              </div>
              <p className="text-purple-200/80 mb-2">
                {searchQuery ? 'No conversations found' : 'No messages yet'}
              </p>
              <p className="text-purple-300/60 text-sm">
                {searchQuery ? 'Try searching with different keywords' : 'Start a conversation with someone new'}
              </p>
              {!searchQuery && (
                <button
                  onClick={onNewChat}
                  className="mt-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 rounded-2xl font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-300"
                >
                  Start New Chat
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => onChatSelect(conversation)}
                  className="w-full bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-4 hover:bg-black/50 hover:border-purple-400/50 transition-all duration-300 text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-purple-500/30">
                        <img
                          src={conversation.user.avatar}
                          alt={conversation.user.displayName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {conversation.user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
                      )}
                      {conversation.isPinned && (
                        <div className="absolute -top-1 -left-1 w-4 h-4 bg-purple-600 rounded-full border-2 border-black flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <h3 className={`font-semibold truncate ${
                            conversation.unreadCount > 0 ? 'text-white' : 'text-purple-100'
                          }`}>
                            {conversation.user.displayName}
                          </h3>
                          {conversation.user.isHost && conversation.user.rating && (
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-purple-400 fill-current" />
                              <span className="text-purple-300 text-xs ml-1">{conversation.user.rating}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-purple-300/80 text-xs">
                            {formatTime(conversation.lastMessage.timestamp)}
                          </span>
                          {conversation.unreadCount > 0 && (
                            <div className="w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                {conversation.unreadCount > 9 ? '9+' : conversation.unreadCount}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <p className={`text-sm truncate ${
                          conversation.unreadCount > 0 ? 'text-purple-200' : 'text-purple-300/80'
                        }`}>
                          {conversation.isTyping ? (
                            <span className="flex items-center text-purple-400">
                              <span className="animate-pulse">typing</span>
                              <span className="ml-1 animate-bounce">...</span>
                            </span>
                          ) : (
                            <>
                              {conversation.lastMessage.senderId === currentUserId && (
                                <span className="mr-1">
                                  {conversation.lastMessage.isRead ? (
                                    <CheckCircle className="w-3 h-3 inline text-purple-400" />
                                  ) : (
                                    <Check className="w-3 h-3 inline text-purple-300/60" />
                                  )}
                                </span>
                              )}
                              {conversation.lastMessage.content}
                            </>
                          )}
                        </p>
                        {conversation.lastMessage.senderId === currentUserId && conversation.lastMessage.isRead && (
                          <div className="w-4 h-4 rounded-full overflow-hidden border border-purple-500/30 ml-2 flex-shrink-0">
                            <img
                              src={conversation.user.avatar}
                              alt="Read"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatList;