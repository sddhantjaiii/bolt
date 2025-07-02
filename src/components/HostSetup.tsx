import React, { useState } from 'react';
import { ArrowLeft, DollarSign, Clock, Star, Camera, Save, CheckCircle, Heart, Users, Globe } from 'lucide-react';

interface User {
  id: string;
  currency?: string;
}

interface HostSetupProps {
  onBack: () => void;
  onComplete: (hostData: any) => void;
  currentUser: User;
}

const HostSetup: React.FC<HostSetupProps> = ({ onBack, onComplete, currentUser }) => {
  const [step, setStep] = useState<'intro' | 'interests' | 'rate' | 'complete'>('intro');
  const [hourlyRate, setHourlyRate] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState('');

  const availableInterests = [
    'Psychology', 'Life Coaching', 'Relationships', 'Career Advice', 'Wellness',
    'Art', 'Music', 'Travel', 'Business', 'Technology', 'Fitness', 'Cooking',
    'Books', 'Movies', 'Philosophy', 'Spirituality', 'Fashion', 'Gaming',
    'Photography', 'Writing', 'Dancing', 'Meditation', 'Astrology', 'Languages'
  ];

  const availableExpertise = [
    'Relationship Advice', 'Language Learning', 'Mindfulness', 'Career Coaching',
    'Mental Health Support', 'Business Strategy', 'Creative Writing', 'Art Therapy',
    'Fitness Training', 'Nutrition Guidance', 'Travel Planning', 'Financial Advice',
    'Study Help', 'Emotional Support', 'Spiritual Guidance', 'Tech Support'
  ];

  const relationshipRoles = [
    { id: 'boyfriend', label: 'Boyfriend', description: 'Romantic companion experience' },
    { id: 'girlfriend', label: 'Girlfriend', description: 'Caring romantic partner' },
    { id: 'mother', label: 'Mother', description: 'Nurturing maternal figure' },
    { id: 'father', label: 'Father', description: 'Supportive paternal guidance' },
    { id: 'friend', label: 'Friend', description: 'Casual friendly conversations' },
    { id: 'listener', label: 'Listener', description: 'Professional emotional support' }
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

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : prev.length < 8 ? [...prev, interest] : prev
    );
  };

  const toggleExpertise = (expertise: string) => {
    setSelectedExpertise(prev => 
      prev.includes(expertise) 
        ? prev.filter(e => e !== expertise)
        : prev.length < 5 ? [...prev, expertise] : prev
    );
  };

  const handleComplete = () => {
    setStep('complete');
    setTimeout(() => {
      onComplete({
        hourlyRate: parseInt(hourlyRate),
        interests: selectedInterests,
        expertise: selectedExpertise,
        roleType: selectedRole
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl border-b border-purple-500/30 sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={step === 'intro' ? onBack : () => {
                if (step === 'interests') setStep('intro');
                else if (step === 'rate') setStep('interests');
              }}
              className="flex items-center text-purple-300 hover:text-purple-200 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
            
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-200 to-white bg-clip-text text-transparent">
              Become a Host
            </h1>
            
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pb-20">
        {step === 'intro' && (
          <div className="py-8">
            {/* Hero Section */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 via-purple-700 to-black rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-purple-900/70">
                <Star className="w-10 h-10 text-purple-200 fill-current" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Start Earning Today</h2>
              <p className="text-purple-200/80 text-lg leading-relaxed">
                Share your expertise and connect with people who value meaningful conversations
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4 mb-8">
              {[
                {
                  icon: DollarSign,
                  title: 'Set Your Own Rates',
                  description: 'You decide how much your time is worth'
                },
                {
                  icon: Clock,
                  title: 'Flexible Schedule',
                  description: 'Work when you want, as much as you want'
                },
                {
                  icon: Star,
                  title: 'Build Your Reputation',
                  description: 'Earn ratings and grow your following'
                },
                {
                  icon: Heart,
                  title: 'Make Real Connections',
                  description: 'Help people through meaningful conversations'
                }
              ].map((benefit, index) => (
                <div key={index} className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4 hover:bg-black/50 hover:border-purple-400/50 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-2xl flex items-center justify-center border border-purple-500/30">
                      <benefit.icon className="w-6 h-6 text-purple-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{benefit.title}</h3>
                      <p className="text-purple-200/80 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Requirements */}
            <div className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 border border-purple-500/40 rounded-2xl p-6 mb-8">
              <h3 className="font-semibold text-white mb-3">Requirements</h3>
              <div className="space-y-2">
                {[
                  'Be 18 years or older',
                  'Provide engaging conversations',
                  'Maintain professional conduct',
                  'Respond to messages promptly'
                ].map((requirement, index) => (
                  <div key={index} className="flex items-center text-purple-200/80 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                    <span>{requirement}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setStep('interests')}
              className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-black text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:from-purple-700 hover:via-purple-800 hover:to-gray-900 shadow-lg shadow-purple-900/60 border border-purple-500/40"
            >
              Get Started
            </button>
          </div>
        )}

        {step === 'interests' && (
          <div className="py-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Tell Us About Yourself</h2>
              <p className="text-purple-200/80">
                Help people understand what makes you special
              </p>
            </div>

            <div className="space-y-6">
              {/* Relationship Role */}
              <div className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6">
                <label className="block text-sm font-medium text-purple-200 mb-3">
                  Offer Relationship Role As
                </label>
                <p className="text-purple-200/60 text-sm mb-4">
                  Choose the type of relationship experience you want to offer
                </p>
                <div className="space-y-3">
                  {relationshipRoles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 ${
                        selectedRole === role.id
                          ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white border-purple-500/60'
                          : 'bg-black/30 border-purple-500/30 text-purple-200 hover:bg-purple-600/20 hover:border-purple-400/50'
                      }`}
                    >
                      <div className="font-medium mb-1">{role.label}</div>
                      <div className={`text-sm ${
                        selectedRole === role.id ? 'text-purple-200' : 'text-purple-300/80'
                      }`}>
                        {role.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Area of Interest */}
              <div className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6">
                <label className="block text-sm font-medium text-purple-200 mb-3">
                  Area of Interest
                </label>
                <p className="text-purple-200/60 text-sm mb-4">
                  Select topics you're passionate about (choose up to 8)
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableInterests.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      disabled={!selectedInterests.includes(interest) && selectedInterests.length >= 8}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        selectedInterests.includes(interest)
                          ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-900/50'
                          : 'bg-black/30 border border-purple-500/30 text-purple-200 hover:bg-purple-600/20 hover:border-purple-400/50 disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
                <p className="text-purple-200/60 text-sm mt-3">
                  Selected: {selectedInterests.length}/8
                </p>
              </div>

              {/* Expertise */}
              <div className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6">
                <label className="block text-sm font-medium text-purple-200 mb-3">
                  Expertise
                </label>
                <p className="text-purple-200/60 text-sm mb-4">
                  What specific skills or knowledge can you share? (choose up to 5)
                </p>
                <div className="flex flex-wrap gap-2">
                  {availableExpertise.map((expertise) => (
                    <button
                      key={expertise}
                      onClick={() => toggleExpertise(expertise)}
                      disabled={!selectedExpertise.includes(expertise) && selectedExpertise.length >= 5}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        selectedExpertise.includes(expertise)
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-900/50 border border-green-500/50'
                          : 'bg-black/30 border border-green-500/30 text-green-200 hover:bg-green-600/20 hover:border-green-400/50 disabled:opacity-50 disabled:cursor-not-allowed'
                      }`}
                    >
                      {expertise}
                    </button>
                  ))}
                </div>
                <p className="text-green-200/60 text-sm mt-3">
                  Selected: {selectedExpertise.length}/5
                </p>
              </div>
            </div>

            <button
              onClick={() => setStep('rate')}
              disabled={!selectedRole || selectedInterests.length === 0 || selectedExpertise.length === 0}
              className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-black text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:from-purple-700 hover:via-purple-800 hover:to-gray-900 shadow-lg shadow-purple-900/60 border border-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed mt-8"
            >
              Continue
            </button>
          </div>
        )}

        {step === 'rate' && (
          <div className="py-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Set Your Hourly Rate</h2>
              <p className="text-purple-200/80">
                Choose what you'd like to charge per hour of conversation
              </p>
            </div>

            <div className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6 mb-6">
              <label className="block text-sm font-medium text-purple-200 mb-4">
                Hourly Rate ({currentUser.currency || 'USD'})
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-purple-300/80 text-2xl font-bold">{getCurrencySymbol()}</span>
                </div>
                <input
                  type="number"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  placeholder="25"
                  min="5"
                  max="500"
                  className="block w-full pl-12 pr-4 py-4 border border-purple-500/30 rounded-2xl bg-black/30 backdrop-blur-sm text-white text-2xl font-bold text-center placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60"
                />
              </div>
              <p className="text-purple-200/60 text-sm mt-3 text-center">
                Recommended range: {getCurrencySymbol()}15 - {getCurrencySymbol()}100 per hour
              </p>
            </div>

            {/* Rate Examples */}
            <div className="space-y-3 mb-8">
              <h3 className="text-purple-200 font-semibold mb-3">Popular Rates</h3>
              {[
                { rate: 25, category: 'Casual Conversations' },
                { rate: 45, category: 'Life Coaching' },
                { rate: 65, category: 'Professional Advice' },
                { rate: 85, category: 'Specialized Expertise' }
              ].map((example) => (
                <button
                  key={example.rate}
                  onClick={() => setHourlyRate(example.rate.toString())}
                  className="w-full bg-black/30 border border-purple-500/30 rounded-2xl p-4 text-left hover:bg-purple-600/20 hover:border-purple-400/50 transition-all duration-300"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-purple-200">{example.category}</span>
                    <span className="text-white font-bold">{getCurrencySymbol()}{example.rate}/hr</span>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleComplete}
              disabled={!hourlyRate || parseInt(hourlyRate) < 5}
              className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-black text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:from-purple-700 hover:via-purple-800 hover:to-gray-900 shadow-lg shadow-purple-900/60 border border-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5 mr-2 inline" />
              Complete Setup
            </button>
          </div>
        )}

        {step === 'complete' && (
          <div className="py-16 text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Welcome to Hosting!</h2>
            <p className="text-purple-200/80 mb-6">
              Your profile is now live and people can book chat sessions with you.
            </p>
            <div className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 border border-purple-500/40 rounded-2xl p-6">
              <h3 className="font-semibold text-white mb-2">Your Setup:</h3>
              <div className="space-y-2 text-purple-200/80 text-sm">
                <p><strong>Role:</strong> {selectedRole}</p>
                <p><strong>Rate:</strong> {getCurrencySymbol()}{hourlyRate}/hour</p>
                <p><strong>Interests:</strong> {selectedInterests.length} selected</p>
                <p><strong>Expertise:</strong> {selectedExpertise.length} areas</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostSetup;