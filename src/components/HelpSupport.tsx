import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, MessageSquare, Phone, Mail, Send, ChevronRight, ExternalLink, CheckCircle, AlertCircle, Book, CreditCard, Shield, Users } from 'lucide-react';

interface HelpSupportProps {
  onBack: () => void;
}

const HelpSupport: React.FC<HelpSupportProps> = ({ onBack }) => {
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    issueType: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const helpTopics = [
    {
      id: 'booking',
      icon: Book,
      title: 'How to book a host',
      description: 'Learn how to find and book chat sessions with hosts',
      content: [
        'Browse hosts in the Search or Discover sections',
        'View their profiles to see rates, ratings, and expertise',
        'Tap "Book 1-Hour Chat" on their profile',
        'Complete payment to confirm your booking',
        'You\'ll receive a confirmation and can start chatting immediately'
      ]
    },
    {
      id: 'pricing',
      icon: CreditCard,
      title: 'How pricing works',
      description: 'Understand our pricing structure and payment methods',
      content: [
        'Hosts set their own hourly rates (typically $15-$100/hour)',
        'You pay upfront for the session duration',
        'No hidden fees or additional charges',
        'Payments are processed securely through our platform',
        'Refunds available for cancelled sessions (see cancellation policy)'
      ]
    },
    {
      id: 'cancellation',
      icon: AlertCircle,
      title: 'Cancel a session',
      description: 'Learn about our cancellation policy and how to cancel',
      content: [
        'You can cancel up to 24 hours before the session for a full refund',
        'Cancellations within 24 hours are subject to a 50% fee',
        'To cancel: Go to Bookings → Select session → Tap Cancel',
        'Emergency cancellations may be eligible for full refund',
        'Contact support if you need to cancel due to technical issues'
      ]
    },
    {
      id: 'safety',
      icon: Shield,
      title: 'Safety & Privacy',
      description: 'Your safety and privacy are our top priorities',
      content: [
        'All conversations are private and encrypted',
        'Hosts are verified and background-checked',
        'Report inappropriate behavior immediately',
        'Block users who make you uncomfortable',
        'Your personal information is never shared with hosts'
      ]
    },
    {
      id: 'hosting',
      icon: Users,
      title: 'Becoming a host',
      description: 'Learn how to start earning as a host on our platform',
      content: [
        'Tap "Register as Host" on your profile',
        'Complete the verification process',
        'Set your hourly rate and availability',
        'Create an engaging profile with your expertise',
        'Start receiving booking requests from users'
      ]
    },
    {
      id: 'technical',
      icon: HelpCircle,
      title: 'Technical issues',
      description: 'Troubleshoot common technical problems',
      content: [
        'Check your internet connection',
        'Update the app to the latest version',
        'Clear app cache and restart',
        'Try logging out and back in',
        'Contact support if issues persist'
      ]
    }
  ];

  const issueTypes = [
    'Payment Issue',
    'Booking Problem',
    'Technical Issue',
    'Host Behavior',
    'Account Problem',
    'Feature Request',
    'Other'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setShowContactForm(false);
      setFormData({ name: '', email: '', issueType: '', message: '' });
    }, 3000);
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/1234567890?text=Hi, I need help with The Club app', '_blank');
  };

  const openEmail = () => {
    window.open('mailto:support@theclub.app?subject=Support Request', '_blank');
  };

  if (selectedTopic) {
    const topic = helpTopics.find(t => t.id === selectedTopic);
    if (!topic) return null;

    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 pb-20">
        {/* Header */}
        <div className="bg-black/40 backdrop-blur-xl border-b border-purple-500/30 sticky top-0 z-50">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedTopic(null)}
                className="flex items-center text-purple-300 hover:text-purple-200 transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-200 to-white bg-clip-text text-transparent">
                {topic.title}
              </h1>
              <div className="w-16"></div>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 py-6">
          <div className="bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-3xl p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-purple-600/20 rounded-2xl flex items-center justify-center border border-purple-500/30">
                <topic.icon className="w-6 h-6 text-purple-300" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{topic.title}</h2>
                <p className="text-purple-200/80 text-sm">{topic.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              {topic.content.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-300 text-sm font-bold">{index + 1}</span>
                  </div>
                  <p className="text-purple-100 text-sm leading-relaxed">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-purple-500/30">
              <p className="text-purple-200/80 text-sm mb-4">Still need help?</p>
              <button
                onClick={() => setShowContactForm(true)}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-2xl font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-300 flex items-center justify-center"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Contact Support
              </button>
            </div>
          </div>
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
            <div className="flex items-center space-x-3">
              <button
                onClick={onBack}
                className="flex items-center text-purple-300 hover:text-purple-200 transition-colors group"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                <span>Back</span>
              </button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-200 to-white bg-clip-text text-transparent">
                Help & Support
              </h1>
            </div>
            <HelpCircle className="w-6 h-6 text-purple-300" />
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Quick Contact Options */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-purple-200 mb-4">Quick Contact</h2>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={openWhatsApp}
              className="bg-green-600/20 border border-green-500/30 text-green-300 p-4 rounded-2xl hover:bg-green-600/30 hover:border-green-400/50 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Phone className="w-5 h-5" />
              <span className="font-medium">WhatsApp</span>
              <ExternalLink className="w-3 h-3" />
            </button>
            <button
              onClick={openEmail}
              className="bg-blue-600/20 border border-blue-500/30 text-blue-300 p-4 rounded-2xl hover:bg-blue-600/30 hover:border-blue-400/50 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Mail className="w-5 h-5" />
              <span className="font-medium">Email</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Help Topics */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-purple-200 mb-4">Common Help Topics</h2>
          <div className="space-y-3">
            {helpTopics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className="w-full bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-4 hover:bg-black/50 hover:border-purple-400/50 transition-all duration-300 text-left group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-2xl flex items-center justify-center border border-purple-500/30 group-hover:bg-purple-600/30 transition-colors">
                    <topic.icon className="w-5 h-5 text-purple-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{topic.title}</h3>
                    <p className="text-purple-200/80 text-sm">{topic.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-purple-300/60 group-hover:text-purple-300 transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Contact Form Button */}
        <div>
          <button
            onClick={() => setShowContactForm(true)}
            className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-black text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:from-purple-700 hover:via-purple-800 hover:to-gray-900 shadow-lg shadow-purple-900/60 border border-purple-500/40 flex items-center justify-center"
          >
            <MessageSquare className="w-5 h-5 mr-3" />
            Contact Support Team
          </button>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-black/90 backdrop-blur-xl border border-purple-500/30 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-purple-500/30">
              <h3 className="text-xl font-bold text-white">Contact Support</h3>
              <button
                onClick={() => setShowContactForm(false)}
                className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-purple-300" />
              </button>
            </div>

            {isSubmitted ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Message Sent!</h4>
                <p className="text-purple-200/80 mb-4">
                  Thank you for contacting us. Our support team will get back to you within 24 hours.
                </p>
                <p className="text-purple-300/60 text-sm">
                  You'll receive a confirmation email shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-black/30 border border-purple-500/30 rounded-2xl px-4 py-3 text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-black/30 border border-purple-500/30 rounded-2xl px-4 py-3 text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Issue Type
                  </label>
                  <select
                    name="issueType"
                    value={formData.issueType}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-black/30 border border-purple-500/30 rounded-2xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60"
                  >
                    <option value="">Select an issue type</option>
                    {issueTypes.map((type) => (
                      <option key={type} value={type} className="bg-black text-white">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-200 mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full bg-black/30 border border-purple-500/30 rounded-2xl px-4 py-3 text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60 resize-none"
                    placeholder="Describe your issue in detail..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-2xl font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </>
                  )}
                </button>

                <p className="text-purple-300/60 text-xs text-center">
                  Our support team typically responds within 24 hours
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpSupport;