import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, Star, User, DollarSign, MessageCircle, Phone, Video, MoreVertical, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  rating?: number;
  isHost?: boolean;
}

interface Booking {
  id: string;
  host: User;
  date: Date;
  duration: number; // in minutes
  amount: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  sessionType: 'chat' | 'video' | 'phone';
  notes?: string;
  currency: string;
}

interface BookingsProps {
  onBack: () => void;
  currentUser: User;
}

const Bookings: React.FC<BookingsProps> = ({ onBack, currentUser }) => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Mock bookings data
  const bookings: Booking[] = [
    {
      id: 'book1',
      host: {
        id: '1',
        username: 'sophia_rose',
        displayName: 'Sophia Rose',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        rating: 4.9,
        isHost: true
      },
      date: new Date(Date.now() + 86400000), // Tomorrow
      duration: 60,
      amount: 45,
      status: 'upcoming',
      sessionType: 'chat',
      notes: 'Looking forward to discussing mindfulness techniques',
      currency: 'USD'
    },
    {
      id: 'book2',
      host: {
        id: '2',
        username: 'emma_night',
        displayName: 'Emma Night',
        avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        rating: 4.8,
        isHost: true
      },
      date: new Date(Date.now() + 172800000), // Day after tomorrow
      duration: 90,
      amount: 97.5,
      status: 'upcoming',
      sessionType: 'video',
      notes: 'Therapy session - relationship guidance',
      currency: 'USD'
    },
    {
      id: 'book3',
      host: {
        id: '3',
        username: 'marcus_moon',
        displayName: 'Marcus Moon',
        avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        rating: 4.9,
        isHost: true
      },
      date: new Date(Date.now() - 86400000), // Yesterday
      duration: 60,
      amount: 80,
      status: 'completed',
      sessionType: 'chat',
      notes: 'Business strategy consultation',
      currency: 'USD'
    },
    {
      id: 'book4',
      host: {
        id: '4',
        username: 'luna_star',
        displayName: 'Luna Star',
        avatar: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        rating: 4.7,
        isHost: true
      },
      date: new Date(Date.now() - 172800000), // 2 days ago
      duration: 45,
      amount: 26.25,
      status: 'completed',
      sessionType: 'chat',
      notes: 'Art therapy and creative discussion',
      currency: 'USD'
    },
    {
      id: 'book5',
      host: {
        id: '5',
        username: 'zara_dreams',
        displayName: 'Zara Dreams',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        rating: 4.6,
        isHost: true
      },
      date: new Date(Date.now() - 259200000), // 3 days ago
      duration: 30,
      amount: 20,
      status: 'cancelled',
      sessionType: 'video',
      notes: 'Yoga and meditation session',
      currency: 'USD'
    },
    {
      id: 'book6',
      host: {
        id: '6',
        username: 'violet_wisdom',
        displayName: 'Violet Wisdom',
        avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
        rating: 4.9,
        isHost: true
      },
      date: new Date(Date.now() - 345600000), // 4 days ago
      duration: 75,
      amount: 87.5,
      status: 'completed',
      sessionType: 'chat',
      notes: 'Relationship coaching session',
      currency: 'USD'
    }
  ];

  const getCurrencySymbol = () => {
    const symbols: { [key: string]: string } = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'INR': '₹',
      'JPY': '¥',
      'CAD': 'C$',
      'AUD': 'A$',
      'CHF': 'Fr',
      'CNY': '¥',
      'KRW': '₩'
    };
    return symbols[currentUser.currency || 'USD'] || '$';
  };

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video;
      case 'phone':
        return Phone;
      default:
        return MessageCircle;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'cancelled':
        return XCircle;
      default:
        return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'cancelled':
        return 'text-red-400';
      default:
        return 'text-purple-400';
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      return 'Today';
    } else if (days === 1) {
      return 'Tomorrow';
    } else if (days === -1) {
      return 'Yesterday';
    } else if (days > 1) {
      return `In ${days} days`;
    } else {
      return `${Math.abs(days)} days ago`;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  const upcomingBookings = bookings.filter(b => b.status === 'upcoming');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  const displayBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

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
                Bookings
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-purple-300" />
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex bg-black/30 backdrop-blur-sm rounded-2xl p-1 border border-purple-500/20">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === 'upcoming'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-900/50'
                  : 'text-purple-200/70 hover:text-purple-100 hover:bg-black/20'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Upcoming ({upcomingBookings.length})</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === 'past'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-900/50'
                  : 'text-purple-200/70 hover:text-purple-100 hover:bg-black/20'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4" />
                <span>Past ({pastBookings.length})</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4">
        {/* Bookings List */}
        <div className="py-4">
          {displayBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-purple-300" />
              </div>
              <p className="text-purple-200/80 mb-2">
                {activeTab === 'upcoming' ? 'No upcoming bookings' : 'No past bookings'}
              </p>
              <p className="text-purple-300/60 text-sm">
                {activeTab === 'upcoming' 
                  ? 'Book a session with a host to get started'
                  : 'Your completed sessions will appear here'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {displayBookings.map((booking) => {
                const SessionIcon = getSessionIcon(booking.sessionType);
                const StatusIcon = getStatusIcon(booking.status);
                
                return (
                  <div
                    key={booking.id}
                    onClick={() => setSelectedBooking(booking)}
                    className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-4 hover:bg-black/50 hover:border-purple-400/50 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-purple-500/30">
                          <img
                            src={booking.host.avatar}
                            alt={booking.host.displayName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center border-2 border-black">
                          <SessionIcon className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-white truncate">{booking.host.displayName}</h3>
                            {booking.host.rating && (
                              <div className="flex items-center">
                                <Star className="w-3 h-3 text-purple-400 fill-current" />
                                <span className="text-purple-300 text-xs ml-1">{booking.host.rating}</span>
                              </div>
                            )}
                          </div>
                          <div className={`flex items-center ${getStatusColor(booking.status)}`}>
                            <StatusIcon className="w-4 h-4" />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center text-purple-300/80 text-sm">
                            <Calendar className="w-3 h-3 mr-1" />
                            <span>{formatDate(booking.date)} at {formatTime(booking.date)}</span>
                          </div>
                          <div className="flex items-center text-purple-300 text-sm">
                            <DollarSign className="w-3 h-3 mr-1" />
                            <span>{getCurrencySymbol()}{booking.amount}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-purple-300/80 text-sm">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{formatDuration(booking.duration)}</span>
                          </div>
                          <span className={`text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        
                        {booking.notes && (
                          <p className="text-purple-200/60 text-sm mt-2 truncate">
                            {booking.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/90 backdrop-blur-xl border border-purple-500/30 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-purple-500/30">
              <h3 className="text-xl font-bold text-white">Booking Details</h3>
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-purple-300" />
              </button>
            </div>

            <div className="p-6">
              {/* Host Info */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-purple-500/30">
                  <img
                    src={selectedBooking.host.avatar}
                    alt={selectedBooking.host.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-lg">{selectedBooking.host.displayName}</h4>
                  <p className="text-purple-200/80">@{selectedBooking.host.username}</p>
                  {selectedBooking.host.rating && (
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-purple-400 fill-current mr-1" />
                      <span className="text-purple-300 text-sm">{selectedBooking.host.rating} rating</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Session Details */}
              <div className="space-y-4 mb-6">
                <div className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 border border-purple-500/40 rounded-2xl p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-purple-200/60 text-sm">Date & Time</p>
                      <p className="text-white font-medium">{formatDate(selectedBooking.date)}</p>
                      <p className="text-purple-200">{formatTime(selectedBooking.date)}</p>
                    </div>
                    <div>
                      <p className="text-purple-200/60 text-sm">Duration</p>
                      <p className="text-white font-medium">{formatDuration(selectedBooking.duration)}</p>
                    </div>
                    <div>
                      <p className="text-purple-200/60 text-sm">Session Type</p>
                      <div className="flex items-center">
                        {React.createElement(getSessionIcon(selectedBooking.sessionType), {
                          className: "w-4 h-4 text-purple-300 mr-2"
                        })}
                        <span className="text-white font-medium capitalize">{selectedBooking.sessionType}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-purple-200/60 text-sm">Amount Paid</p>
                      <p className="text-white font-medium">{getCurrencySymbol()}{selectedBooking.amount}</p>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-center">
                  <div className={`flex items-center px-4 py-2 rounded-xl border ${
                    selectedBooking.status === 'completed' 
                      ? 'bg-green-600/20 border-green-500/30 text-green-300'
                      : selectedBooking.status === 'cancelled'
                      ? 'bg-red-600/20 border-red-500/30 text-red-300'
                      : 'bg-purple-600/20 border-purple-500/30 text-purple-300'
                  }`}>
                    {React.createElement(getStatusIcon(selectedBooking.status), {
                      className: "w-4 h-4 mr-2"
                    })}
                    <span className="font-medium capitalize">{selectedBooking.status}</span>
                  </div>
                </div>

                {/* Notes */}
                {selectedBooking.notes && (
                  <div>
                    <p className="text-purple-200/60 text-sm mb-2">Session Notes</p>
                    <div className="bg-black/40 border border-purple-500/30 rounded-2xl p-4">
                      <p className="text-purple-100 text-sm leading-relaxed">{selectedBooking.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {selectedBooking.status === 'upcoming' && (
                  <>
                    <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-2xl font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-300 flex items-center justify-center">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message Host
                    </button>
                    <div className="grid grid-cols-2 gap-3">
                      <button className="bg-black/40 border border-purple-500/30 text-purple-200 py-2 rounded-2xl font-medium hover:bg-purple-600/20 hover:border-purple-400/50 transition-all duration-300">
                        Reschedule
                      </button>
                      <button className="bg-red-600/20 border border-red-500/30 text-red-300 py-2 rounded-2xl font-medium hover:bg-red-600/30 hover:border-red-400/50 transition-all duration-300">
                        Cancel
                      </button>
                    </div>
                  </>
                )}
                
                {selectedBooking.status === 'completed' && (
                  <div className="grid grid-cols-2 gap-3">
                    <button className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-2xl font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-300">
                      Book Again
                    </button>
                    <button className="bg-black/40 border border-purple-500/30 text-purple-200 py-3 rounded-2xl font-medium hover:bg-purple-600/20 hover:border-purple-400/50 transition-all duration-300">
                      Leave Review
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;