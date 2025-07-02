import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Clock, Star, MoreVertical, Flag, Blocks as Block } from 'lucide-react';

interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  hourlyRate: number;
  rating: number;
  isOnline: boolean;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'system';
}

interface ChatProps {
  user: User;
  onBack: () => void;
  sessionDuration: number; // in minutes
}

const Chat: React.FC<ChatProps> = ({ user, onBack, sessionDuration = 60 }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: 'system',
      content: `Your 1-hour chat session with ${user.displayName} has started. Enjoy your conversation!`,
      timestamp: new Date(Date.now() - 3540000), // 59 minutes ago
      type: 'system'
    },
    {
      id: '2',
      senderId: user.id,
      content: `Hey there! 👋 Thanks for booking a session with me. I'm so excited to chat with you today!`,
      timestamp: new Date(Date.now() - 3480000), // 58 minutes ago
      type: 'text'
    },
    {
      id: '3',
      senderId: 'current-user',
      content: `Hi! I'm really looking forward to this too. I've been having a tough week and could really use someone to talk to.`,
      timestamp: new Date(Date.now() - 3420000), // 57 minutes ago
      type: 'text'
    },
    {
      id: '4',
      senderId: user.id,
      content: `I'm so sorry to hear you've been having a rough time. I'm here to listen and support you through whatever you're going through. What's been weighing on your mind lately?`,
      timestamp: new Date(Date.now() - 3360000), // 56 minutes ago
      type: 'text'
    },
    {
      id: '5',
      senderId: 'current-user',
      content: `It's mostly work stress. My boss has been really demanding lately, and I feel like I'm constantly behind on everything. I barely have time for myself anymore.`,
      timestamp: new Date(Date.now() - 3300000), // 55 minutes ago
      type: 'text'
    },
    {
      id: '6',
      senderId: user.id,
      content: `That sounds incredibly overwhelming. Work stress can really take a toll on both your mental and physical health. Have you been able to set any boundaries with your boss, or do you feel like that's not possible in your situation?`,
      timestamp: new Date(Date.now() - 3240000), // 54 minutes ago
      type: 'text'
    },
    {
      id: '7',
      senderId: 'current-user',
      content: `I've tried, but they always seem to find a way around it. Like they'll say "just this once" or "it's really urgent" and then it becomes the new normal.`,
      timestamp: new Date(Date.now() - 3180000), // 53 minutes ago
      type: 'text'
    },
    {
      id: '8',
      senderId: user.id,
      content: `That's such a common pattern, and it's really frustrating when you feel like your boundaries aren't being respected. It sounds like your boss might be taking advantage of your dedication and work ethic.`,
      timestamp: new Date(Date.now() - 3120000), // 52 minutes ago
      type: 'text'
    },
    {
      id: '9',
      senderId: user.id,
      content: `Have you considered documenting these requests? Sometimes having a record can help you see the pattern more clearly and might be useful if you need to have a more formal conversation about workload.`,
      timestamp: new Date(Date.now() - 3060000), // 51 minutes ago
      type: 'text'
    },
    {
      id: '10',
      senderId: 'current-user',
      content: `That's actually a really good idea. I never thought about keeping track of it all. I guess I just accepted it as normal, but when you put it that way...`,
      timestamp: new Date(Date.now() - 3000000), // 50 minutes ago
      type: 'text'
    },
    {
      id: '11',
      senderId: user.id,
      content: `Exactly! Sometimes we get so used to a situation that we don't realize how unreasonable it's become. You deserve to have a healthy work-life balance. What does your ideal evening or weekend look like?`,
      timestamp: new Date(Date.now() - 2940000), // 49 minutes ago
      type: 'text'
    },
    {
      id: '12',
      senderId: 'current-user',
      content: `Honestly, I used to love reading and going for walks in the park. I haven't done either in months. I miss having time to just... breathe, you know?`,
      timestamp: new Date(Date.now() - 2880000), // 48 minutes ago
      type: 'text'
    },
    {
      id: '13',
      senderId: user.id,
      content: `I can hear how much you miss those simple pleasures. Reading and walking are such wonderful ways to reconnect with yourself. Even 15-20 minutes of either could make a difference in how you feel.`,
      timestamp: new Date(Date.now() - 2820000), // 47 minutes ago
      type: 'text'
    },
    {
      id: '14',
      senderId: user.id,
      content: `What if we brainstormed some small ways you could reclaim even tiny pockets of time for yourself? Sometimes starting small makes it feel more achievable.`,
      timestamp: new Date(Date.now() - 2760000), // 46 minutes ago
      type: 'text'
    },
    {
      id: '15',
      senderId: 'current-user',
      content: `I'd love that. I feel like I've forgotten how to prioritize myself. It's like I don't even know where to start anymore.`,
      timestamp: new Date(Date.now() - 2700000), // 45 minutes ago
      type: 'text'
    },
    {
      id: '16',
      senderId: user.id,
      content: `That feeling is so valid, and you're definitely not alone in feeling that way. Let's start with something really simple - what time do you usually wake up, and is there any flexibility in your morning routine?`,
      timestamp: new Date(Date.now() - 2640000), // 44 minutes ago
      type: 'text'
    },
    {
      id: '17',
      senderId: 'current-user',
      content: `I usually wake up at 6:30 and rush to get ready for work. I could probably wake up 15 minutes earlier without it being too painful.`,
      timestamp: new Date(Date.now() - 2580000), // 43 minutes ago
      type: 'text'
    },
    {
      id: '18',
      senderId: user.id,
      content: `Perfect! Those 15 minutes could be your sacred time. You could read a few pages, do some light stretching, or even just sit with your coffee in silence. The key is making it non-negotiable - just for you.`,
      timestamp: new Date(Date.now() - 2520000), // 42 minutes ago
      type: 'text'
    },
    {
      id: '19',
      senderId: 'current-user',
      content: `That actually sounds really nice. I can't remember the last time I had a peaceful moment with my coffee. I'm always drinking it while checking emails.`,
      timestamp: new Date(Date.now() - 2460000), // 41 minutes ago
      type: 'text'
    },
    {
      id: '20',
      senderId: user.id,
      content: `Oh, I can already picture how different that would feel! No emails, no rushing - just you, your coffee, and maybe looking out the window or reading something that brings you joy. How does that sound as a starting point?`,
      timestamp: new Date(Date.now() - 2400000), // 40 minutes ago
      type: 'text'
    },
    {
      id: '21',
      senderId: 'current-user',
      content: `It sounds amazing, honestly. I'm getting a little emotional just thinking about having that kind of peace in my day. Thank you for helping me see that it's possible.`,
      timestamp: new Date(Date.now() - 2340000), // 39 minutes ago
      type: 'text'
    },
    {
      id: '22',
      senderId: user.id,
      content: `Aww, that makes my heart so happy! 💜 You absolutely deserve that peace and so much more. The fact that you're feeling emotional about it shows how much you've been neglecting your own needs. You're taking the first step by recognizing it.`,
      timestamp: new Date(Date.now() - 2280000), // 38 minutes ago
      type: 'text'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(2220); // 37 minutes remaining
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = 'current-user'; // This would come from auth context

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Session ended
          setMessages(prevMessages => [...prevMessages, {
            id: Date.now().toString(),
            senderId: 'system',
            content: 'Your chat session has ended. Thank you for using our service!',
            timestamp: new Date(),
            type: 'system'
          }]);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const sendMessage = () => {
    if (!newMessage.trim() || timeRemaining <= 0) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      content: newMessage.trim(),
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate response from the other user
    setTimeout(() => {
      const responses = [
        "That's such a beautiful way to think about it. You're really making progress in how you view yourself and your needs.",
        "I'm so proud of you for being open to these changes. It takes courage to prioritize yourself when you're not used to it.",
        "You have such great insights! I can tell you're someone who really cares deeply about doing the right thing.",
        "That sounds like a wonderful plan. How are you feeling about implementing some of these ideas?",
        "I love hearing the hope in your words. You deserve all the peace and happiness you're working towards.",
        "You're being so kind to yourself right now, and that's exactly what you need. Keep nurturing that inner voice.",
        "It's amazing how much clarity can come from just talking things through with someone who listens."
      ];
      
      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: user.id,
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
        type: 'text'
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex flex-col">
      {/* Header */}
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
                      src={user.avatar}
                      alt={user.displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {user.isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-semibold text-white text-sm">{user.displayName}</h3>
                  <div className="flex items-center text-purple-300 text-xs">
                    <Star className="w-3 h-3 fill-current mr-1" />
                    <span>{user.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Timer */}
              <div className={`flex items-center px-3 py-1.5 rounded-xl text-sm font-medium ${
                timeRemaining > 600 
                  ? 'bg-green-600/20 text-green-300 border border-green-500/30'
                  : timeRemaining > 300
                  ? 'bg-yellow-600/20 text-yellow-300 border border-yellow-500/30'
                  : 'bg-red-600/20 text-red-300 border border-red-500/30'
              }`}>
                <Clock className="w-3 h-3 mr-1" />
                <span>{formatTime(timeRemaining)}</span>
              </div>

              {/* Menu */}
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
                      <Flag className="w-4 h-4 mr-3" />
                      Report User
                    </button>
                    <button className="w-full text-left px-4 py-2 text-red-300 hover:bg-red-600/20 transition-colors flex items-center">
                      <Block className="w-4 h-4 mr-3" />
                      Block User
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
          {messages.map((message) => (
            <div key={message.id}>
              {message.type === 'system' ? (
                <div className="text-center">
                  <div className="bg-purple-600/20 border border-purple-500/30 rounded-2xl px-4 py-2 inline-block">
                    <p className="text-purple-200 text-sm">{message.content}</p>
                  </div>
                </div>
              ) : (
                <div className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${
                    message.senderId === currentUserId
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white'
                      : 'bg-black/40 backdrop-blur-sm border border-purple-500/30 text-purple-100'
                  } rounded-2xl px-4 py-3`}>
                    <p className="text-sm leading-relaxed">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.senderId === currentUserId ? 'text-purple-200' : 'text-purple-300/60'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-black/40 backdrop-blur-xl border-t border-purple-500/30">
        <div className="max-w-md mx-auto px-4 py-4">
          {timeRemaining > 0 ? (
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  rows={1}
                  className="w-full bg-black/30 border border-purple-500/30 rounded-2xl px-4 py-3 text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60 resize-none"
                  style={{ minHeight: '48px', maxHeight: '120px' }}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="w-12 h-12 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center hover:from-purple-700 hover:to-purple-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/60"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-purple-200/80 text-sm mb-3">Chat session has ended</p>
              <button
                onClick={onBack}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 rounded-2xl font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-300"
              >
                Return to Feed
              </button>
            </div>
          )}
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

export default Chat;