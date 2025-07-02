import React, { useState } from 'react';
import { X, CreditCard, Shield, Clock, Star, CheckCircle } from 'lucide-react';

interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  hourlyRate: number;
  rating: number;
}

interface PaymentModalProps {
  user: User;
  onClose: () => void;
  onPaymentSuccess: (user: User) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ user, onClose, onPaymentSuccess }) => {
  const [paymentStep, setPaymentStep] = useState<'details' | 'payment' | 'processing' | 'success'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const handlePayment = async () => {
    setPaymentStep('processing');
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    setPaymentStep('success');
    
    // Auto-close and redirect after success
    setTimeout(() => {
      onPaymentSuccess(user);
    }, 2000);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/90 backdrop-blur-xl border border-purple-500/30 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {paymentStep === 'details' && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-purple-500/30">
              <h2 className="text-xl font-bold text-white">Book Chat Session</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors"
              >
                <X className="w-4 h-4 text-purple-300" />
              </button>
            </div>

            {/* User Info */}
            <div className="p-6 border-b border-purple-500/30">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-purple-500/30">
                  <img
                    src={user.avatar}
                    alt={user.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{user.displayName}</h3>
                  <div className="flex items-center text-purple-300 text-sm">
                    <Star className="w-4 h-4 fill-current mr-1" />
                    <span>{user.rating} rating</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 border border-purple-500/40 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-purple-200 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    1 Hour Chat Session
                  </span>
                  <span className="text-white font-bold text-lg">${user.hourlyRate}</span>
                </div>
                <p className="text-purple-200/80 text-sm">
                  Private conversation with {user.displayName.split(' ')[0]} for 60 minutes
                </p>
              </div>
            </div>

            {/* Session Details */}
            <div className="p-6 border-b border-purple-500/30">
              <h4 className="text-purple-200 font-semibold mb-3">What's Included</h4>
              <div className="space-y-2">
                {[
                  'Private 1-on-1 chat session',
                  'Full 60 minutes of conversation',
                  'Secure and encrypted messaging',
                  'No additional fees or charges'
                ].map((feature, index) => (
                  <div key={index} className="flex items-center text-purple-200/80 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="p-6 border-b border-purple-500/30">
              <div className="space-y-2">
                <div className="flex justify-between text-purple-200">
                  <span>Chat session (1 hour)</span>
                  <span>${user.hourlyRate}</span>
                </div>
                <div className="flex justify-between text-purple-200/60 text-sm">
                  <span>Platform fee</span>
                  <span>$0</span>
                </div>
                <div className="border-t border-purple-500/30 pt-2 mt-2">
                  <div className="flex justify-between text-white font-bold text-lg">
                    <span>Total</span>
                    <span>${user.hourlyRate}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <div className="p-6">
              <button
                onClick={() => setPaymentStep('payment')}
                className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-black text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:from-purple-700 hover:via-purple-800 hover:to-gray-900 shadow-lg shadow-purple-900/60 border border-purple-500/40"
              >
                Continue to Payment
              </button>
            </div>
          </>
        )}

        {paymentStep === 'payment' && (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-purple-500/30">
              <h2 className="text-xl font-bold text-white">Payment Details</h2>
              <button
                onClick={onClose}
                className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors"
              >
                <X className="w-4 h-4 text-purple-300" />
              </button>
            </div>

            {/* Payment Method Selection */}
            <div className="p-6 border-b border-purple-500/30">
              <h4 className="text-purple-200 font-semibold mb-3">Payment Method</h4>
              <div className="space-y-3">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`w-full p-4 rounded-2xl border transition-all duration-300 flex items-center ${
                    paymentMethod === 'card'
                      ? 'bg-purple-600/20 border-purple-500/60 text-white'
                      : 'bg-black/40 border-purple-500/30 text-purple-200 hover:bg-black/50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mr-3" />
                  <span>Credit/Debit Card</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('paypal')}
                  className={`w-full p-4 rounded-2xl border transition-all duration-300 flex items-center ${
                    paymentMethod === 'paypal'
                      ? 'bg-purple-600/20 border-purple-500/60 text-white'
                      : 'bg-black/40 border-purple-500/30 text-purple-200 hover:bg-black/50'
                  }`}
                >
                  <div className="w-5 h-5 mr-3 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">
                    P
                  </div>
                  <span>PayPal</span>
                </button>
              </div>
            </div>

            {/* Card Details Form */}
            {paymentMethod === 'card' && (
              <div className="p-6 border-b border-purple-500/30">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardData.number}
                      onChange={(e) => setCardData(prev => ({ ...prev, number: formatCardNumber(e.target.value) }))}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full bg-black/30 border border-purple-500/30 rounded-2xl px-4 py-3 text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-purple-200 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardData.expiry}
                        onChange={(e) => setCardData(prev => ({ ...prev, expiry: formatExpiry(e.target.value) }))}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full bg-black/30 border border-purple-500/30 rounded-2xl px-4 py-3 text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-200 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cardData.cvv}
                        onChange={(e) => setCardData(prev => ({ ...prev, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                        placeholder="123"
                        maxLength={4}
                        className="w-full bg-black/30 border border-purple-500/30 rounded-2xl px-4 py-3 text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardData.name}
                      onChange={(e) => setCardData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="John Doe"
                      className="w-full bg-black/30 border border-purple-500/30 rounded-2xl px-4 py-3 text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="p-6 border-b border-purple-500/30">
              <div className="flex items-start space-x-3 bg-purple-600/10 border border-purple-500/30 rounded-2xl p-4">
                <Shield className="w-5 h-5 text-purple-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-purple-200 text-sm font-medium mb-1">Secure Payment</p>
                  <p className="text-purple-200/80 text-xs">
                    Your payment information is encrypted and secure. We never store your card details.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <div className="p-6">
              <button
                onClick={handlePayment}
                disabled={paymentMethod === 'card' && (!cardData.number || !cardData.expiry || !cardData.cvv || !cardData.name)}
                className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-black text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:from-purple-700 hover:via-purple-800 hover:to-gray-900 shadow-lg shadow-purple-900/60 border border-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Pay ${user.hourlyRate} Now
              </button>
            </div>
          </>
        )}

        {paymentStep === 'processing' && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Processing Payment</h3>
            <p className="text-purple-200/80">Please wait while we process your payment securely...</p>
          </div>
        )}

        {paymentStep === 'success' && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Payment Successful!</h3>
            <p className="text-purple-200/80 mb-4">
              Your chat session with {user.displayName} has been booked.
            </p>
            <p className="text-purple-300 text-sm">
              Redirecting to chat...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;