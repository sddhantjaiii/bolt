import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Search, MoreVertical, Phone, Video, Info, Heart, Image, Smile, Paperclip, Plus, Edit, Users, Clock, Star } from 'lucide-react';

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

interface MessagesProps {
  onBack: () => void;
}

const Messages: React.FC<MessagesProps> = ({ onBack }) => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = 'current-user';

  // Mock conversations data with enhanced features
  const [conversations, setConversations] = useState<Conversation[]>([
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
  ]);

  // Mock messages for each conversation
  const [conversationMessages, setConversationMessages] = useState<{ [key: string]: Message[] }>({
    'conv1': [
      {
        id: 'msg1-1',
        senderId: '1',
        content: 'Hi! Thank you for booking a session with me. I\'m really excited to chat with you today! 😊',
        timestamp: new Date(Date.now() - 7200000),
        type: 'text',
        isRead: true
      },
      {
        id: 'msg1-2',
        senderId: 'current-user',
        content: 'Hi Sophia! I\'m looking forward to this too. I\'ve been feeling a bit overwhelmed lately and could really use some guidance.',
        timestamp: new Date(Date.now() - 7000000),
        type: 'text',
        isRead: true
      },
      {
        id: 'msg1-3',
        senderId: '1',
        content: 'I completely understand that feeling. Let\'s start by talking about what\'s been weighing on your mind. What aspects of your life feel most overwhelming right now?',
        timestamp: new Date(Date.now() - 6800000),
        type: 'text',
        isRead: true
      },
      {
        id: 'msg1-4',
        senderId: 'current-user',
        content: 'It\'s mainly work stress and finding time for self-care. I feel like I\'m constantly running but never getting ahead.',
        timestamp: new Date(Date.now() - 6600000),
        type: 'text',
        isRead: true
      },
      {
        id: 'msg1-5',
        senderId: '1',
        content: 'That\'s such a common experience, and you\'re not alone in feeling this way. The fact that you\'re here seeking support shows incredible self-awareness. Let\'s explore some mindfulness techniques that can help you find moments of peace even in busy days.',
        timestamp: new Date(Date.now() - 6400000),
        type: 'text',
        isRead: true
      },
      {
        id: 'msg1-6',
        senderId: '1',
        content: 'Thank you for the wonderful session today! I really enjoyed our conversation about mindfulness and self-care. Looking forward to our next chat! 💜',
        timestamp: new Date(Date.now() - 1800000),
        type: 'text',
        isRead: false
      },
      {
        id: 'msg1-7',
        senderId: '1',
        content: 'I\'ve attached a guided meditation audio that we discussed. Try it when you have 10 minutes of quiet time! 🧘‍♀️',
        timestamp: new Date(Date.now() - 1200000),
        type: 'text',
        isRead: false
      }
    ]
  });

  // Available users for new messages
  const availableUsers: User[] = [
    {
      id: '7',
      username: 'violet_wisdom',
      displayName: 'Violet Wisdom',
      avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      isOnline: true,
      isHost: true,
      rating: 4.9
    },
    {
      id: '8',
      username: 'alex_wisdom',
      displayName: 'Alex Wisdom',
      avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      isOnline: false,
      lastSeen: new Date(Date.now() - 1800000),
      isHost: true,
      rating: 4.7
    },
    {
      id: '9',
      username: 'sage_whispers',
      displayName: 'Sage Whispers',
      avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      isOnline: true,
      isHost: true,
      rating: 4.6
    }
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConv = conversations.find(conv => conv.id === selectedConversation);
  const messages = selectedConversation ? conversationMessages[selectedConversation] || [] : [];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate typing indicator
  useEffect(() => {
    if (newMessage.length > 0) {
      setIsTyping(true);
      const timer = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [newMessage]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      content: newMessage.trim(),
      timestamp: new Date(),
      type: 'text',
      isRead: false
    };

    // Add message to conversation
    setConversationMessages(prev => ({
      ...prev,
      [selectedConversation]: [...(prev[selectedConversation] || []), message]
    }));

    // Update last message in conversation list
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation 
        ? { ...conv, lastMessage: message }
        : conv
    ));

    setNewMessage('');

    // Simulate response from the other user
    setTimeout(() => {
      const responses = [
        "That's really insightful! I love how you think about these things.",
        "Thank you for sharing that with me. It means a lot to hear your perspective.",
        "I completely understand what you mean. That's such a valid way to feel.",
        "Your thoughts on this are so thoughtful and well-articulated.",
        "I appreciate you opening up about this. It takes courage to be vulnerable.",
        "That's a beautiful way to look at it. You have such wisdom.",
        "I'm so glad we can have these deep conversations together."
      ];
      
      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: selectedConv?.user.id || '',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        type: 'text',
        isRead: false
      };
      
      setConversationMessages(prev => ({
        ...prev,
        [selectedConversation]: [...(prev[selectedConversation] || []), response]
      }));

      // Update last message in conversation list
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation 
          ? { ...conv, lastMessage: response }
          : conv
      ));
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const markAsRead = (conversationId: string) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, unreadCount: 0 }
        : conv
    ));
  };

  const startNewConversation = (user: User) => {
    const newConvId = `conv-${Date.now()}`;
    const newConversation: Conversation = {
      id: newConvId,
      user,
      lastMessage: {
        id: 'initial',
        senderId: 'system',
        content: 'Say hello to start the conversation!',
        timestamp: new Date(),
        type: 'system',
        isRead: true
      },
      unreadCount: 0,
      isPinned: false,
      isTyping: false
    };

    setConversations(prev => [newConversation, ...prev]);
    setSelectedConversation(newConvId);
    setShowNewMessage(false);
  };

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

  const formatMessageTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

  if (selectedConversation && selectedConv) {
    // Chat View
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex flex-col">
        {/* Chat Header */}
        <div className="bg-black/40 backdrop-blur-xl border-b border-purple-500/30 sticky top-0 z-50">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="flex items-center text-purple-300 hover:text-purple-200 transition-colors group"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                </button>
                
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500/30">
                      <img
                        src={selectedConv.user.avatar}
                        alt={selectedConv.user.displayName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {selectedConv.user.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-white text-sm">{selectedConv.user.displayName}</h3>
                      {selectedConv.user.isHost && selectedConv.user.rating && (
                        <div className="flex items-center">
                          <Star className="w-3 h-3 text-purple-400 fill-current" />
                          <span className="text-purple-300 text-xs ml-1">{selectedConv.user.rating}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-purple-300/80 text-xs">
                      {selectedConv.isTyping ? (
                        <span className="flex items-center">
                          <span className="animate-pulse">typing</span>
                          <span className="ml-1 animate-bounce">...</span>
                        </span>
                      ) : (
                        getLastSeenText(selectedConv.user)
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors">
                  <Phone className="w-4 h-4 text-purple-300" />
                </button>
                <button className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors">
                  <Video className="w-4 h-4 text-purple-300" />
                </button>
                <button className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors">
                  <Info className="w-4 h-4 text-purple-300" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-md mx-auto px-4 py-4 space-y-4">
            {messages.map((message, index) => {
              const isCurrentUser = message.senderId === currentUserId;
              const showAvatar = !isCurrentUser && (index === 0 || messages[index - 1].senderId !== message.senderId);
              
              return (
                <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-end space-x-2 max-w-[80%] ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {showAvatar && !isCurrentUser && (
                      <div className="w-6 h-6 rounded-full overflow-hidden border border-purple-500/30 flex-shrink-0">
                        <img
                          src={selectedConv.user.avatar}
                          alt={selectedConv.user.displayName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className={`${
                      isCurrentUser
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                        : message.type === 'system'
                        ? 'bg-purple-600/20 border border-purple-500/30 text-purple-200'
                        : 'bg-black/40 backdrop-blur-sm border border-purple-500/30 text-purple-100'
                    } rounded-2xl px-4 py-2 ${!showAvatar && !isCurrentUser ? 'ml-8' : ''}`}>
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        isCurrentUser ? 'text-purple-200/80' : 'text-purple-300/60'
                      }`}>
                        {formatMessageTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-black/40 backdrop-blur-xl border-t border-purple-500/30">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-end space-x-3">
              <div className="flex items-center space-x-2">
                <button className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors">
                  <Image className="w-4 h-4 text-purple-300" />
                </button>
                <button className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors">
                  <Paperclip className="w-4 h-4 text-purple-300" />
                </button>
              </div>
              
              <div className="flex-1 relative">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  rows={1}
                  className="w-full bg-black/30 border border-purple-500/30 rounded-2xl px-4 py-3 pr-12 text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60 resize-none"
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors">
                  <Smile className="w-4 h-4 text-purple-300" />
                </button>
              </div>
              
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center hover:from-purple-700 hover:to-purple-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/60"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Messages List View
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 pb-20">
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
                onClick={() => setShowNewMessage(true)}
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
          {filteredConversations.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-purple-300" />
              </div>
              <p className="text-purple-200/80 mb-2">No conversations found</p>
              <p className="text-purple-300/60 text-sm">Try searching with a different term</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => {
                    setSelectedConversation(conversation.id);
                    markAsRead(conversation.id);
                  }}
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
                              {conversation.lastMessage.senderId === currentUserId && 'You: '}
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

      {/* New Message Modal */}
      {showNewMessage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/90 backdrop-blur-xl border border-purple-500/30 rounded-3xl w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-purple-500/30">
              <h3 className="text-xl font-bold text-white">New Message</h3>
              <button
                onClick={() => setShowNewMessage(false)}
                className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors"
              >
                <X className="w-4 h-4 text-purple-300" />
              </button>
            </div>

            <div className="p-4">
              <p className="text-purple-200/80 text-sm mb-4">
                Start a conversation with someone new
              </p>
              
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {availableUsers.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => startNewConversation(user)}
                    className="w-full text-left p-4 bg-black/40 border border-purple-500/30 rounded-2xl hover:bg-purple-600/20 hover:border-purple-400/50 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-purple-500/30">
                          <img
                            src={user.avatar}
                            alt={user.displayName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {user.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-white">{user.displayName}</h4>
                          {user.isHost && user.rating && (
                            <div className="flex items-center">
                              <Star className="w-3 h-3 text-purple-400 fill-current" />
                              <span className="text-purple-300 text-xs ml-1">{user.rating}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-purple-200/80 text-sm">@{user.username}</p>
                        <p className="text-purple-300/60 text-xs">{getLastSeenText(user)}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;