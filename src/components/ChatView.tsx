import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, MoreVertical, Phone, Video, Info, Heart, Image, Smile, Paperclip, Star, Clock } from 'lucide-react';

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

interface ChatViewProps {
  conversation: Conversation;
  onBack: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ conversation, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = 'current-user';

  // Initialize messages for this conversation
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: 'msg1',
        senderId: conversation.user.id,
        content: `Hi! Thank you for booking a session with me. I'm really excited to chat with you today! 😊`,
        timestamp: new Date(Date.now() - 7200000),
        type: 'text',
        isRead: true
      },
      {
        id: 'msg2',
        senderId: currentUserId,
        content: `Hi ${conversation.user.displayName.split(' ')[0]}! I'm looking forward to this too. I've been feeling a bit overwhelmed lately and could really use some guidance.`,
        timestamp: new Date(Date.now() - 7000000),
        type: 'text',
        isRead: true
      },
      {
        id: 'msg3',
        senderId: conversation.user.id,
        content: `I completely understand that feeling. Let's start by talking about what's been weighing on your mind. What aspects of your life feel most overwhelming right now?`,
        timestamp: new Date(Date.now() - 6800000),
        type: 'text',
        isRead: true
      },
      {
        id: 'msg4',
        senderId: currentUserId,
        content: `It's mainly work stress and finding time for self-care. I feel like I'm constantly running but never getting ahead.`,
        timestamp: new Date(Date.now() - 6600000),
        type: 'text',
        isRead: true
      },
      {
        id: 'msg5',
        senderId: conversation.user.id,
        content: `That's such a common experience, and you're not alone in feeling this way. The fact that you're here seeking support shows incredible self-awareness. Let's explore some mindfulness techniques that can help you find moments of peace even in busy days.`,
        timestamp: new Date(Date.now() - 6400000),
        type: 'text',
        isRead: true
      },
      {
        id: 'msg6',
        senderId: conversation.user.id,
        content: conversation.lastMessage.content,
        timestamp: conversation.lastMessage.timestamp,
        type: 'text',
        isRead: false
      }
    ];

    setMessages(mockMessages);
  }, [conversation]);

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
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      content: newMessage.trim(),
      timestamp: new Date(),
      type: 'text',
      isRead: false
    };

    setMessages(prev => [...prev, message]);
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
        senderId: conversation.user.id,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        type: 'text',
        isRead: false
      };
      
      setMessages(prev => [...prev, response]);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex flex-col">
      {/* Chat Header */}
      <div className="bg-black/40 backdrop-blur-xl border-b border-purple-500/30 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={onBack}
                className="flex items-center text-purple-300 hover:text-purple-200 transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500/30">
                    <img
                      src={conversation.user.avatar}
                      alt={conversation.user.displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {conversation.user.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-white text-sm">{conversation.user.displayName}</h3>
                    {conversation.user.isHost && conversation.user.rating && (
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-purple-400 fill-current" />
                        <span className="text-purple-300 text-xs ml-1">{conversation.user.rating}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-purple-300/80 text-xs">
                    {conversation.isTyping ? (
                      <span className="flex items-center">
                        <span className="animate-pulse">typing</span>
                        <span className="ml-1 animate-bounce">...</span>
                      </span>
                    ) : (
                      getLastSeenText(conversation.user)
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
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors"
                >
                  <MoreVertical className="w-4 h-4 text-purple-300" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-10 bg-black/90 backdrop-blur-xl border border-purple-500/30 rounded-2xl py-2 w-48 z-50">
                    <button className="w-full text-left px-4 py-2 text-purple-200 hover:bg-purple-600/20 transition-colors flex items-center">
                      <Info className="w-4 h-4 mr-3" />
                      View Profile
                    </button>
                    <button className="w-full text-left px-4 py-2 text-purple-200 hover:bg-purple-600/20 transition-colors flex items-center">
                      <Heart className="w-4 h-4 mr-3" />
                      Add to Favorites
                    </button>
                  </div>
                )}
              </div>
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
                        src={conversation.user.avatar}
                        alt={conversation.user.displayName}
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

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default ChatView;