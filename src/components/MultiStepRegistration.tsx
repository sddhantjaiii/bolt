import React, { useState, useRef } from 'react';
import { ArrowLeft, Phone, Eye, EyeOff, Camera, Check, X, User, Hash, Calendar, ChevronDown, CheckCircle, Shield, Users, Mail } from 'lucide-react';
import FaceEnrollment from './FaceEnrollment';

interface RegistrationData {
  registrationMethod: 'phone' | 'email' | 'gmail';
  mobileNumber: string;
  email: string;
  countryCode: string;
  otp: string;
  fullName: string;
  handle: string;
  profilePhoto: File | null;
  password: string;
  confirmPassword: string;
  gender: string;
  dateOfBirth: string;
  faceScanImages?: string[];
  faceScanCompleted?: boolean;
}

interface MultiStepRegistrationProps {
  onComplete: (data: RegistrationData) => void;
  onGoogleSignup: () => void;
  onLoginClick: () => void;
  isLoading?: boolean;
}

const MultiStepRegistration: React.FC<MultiStepRegistrationProps> = ({ 
  onComplete, 
  onGoogleSignup,
  onLoginClick, 
  isLoading = false 
}) => {
  const [currentStep, setCurrentStep] = useState(0); // Start with method selection
  const [data, setData] = useState<RegistrationData>({
    registrationMethod: 'phone',
    mobileNumber: '',
    email: '',
    countryCode: '+1',
    otp: '',
    fullName: '',
    handle: '',
    profilePhoto: null,
    password: '',
    confirmPassword: '',
    gender: '',
    dateOfBirth: ''
  });
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [isCheckingHandle, setIsCheckingHandle] = useState(false);
  const [handleAvailable, setHandleAvailable] = useState<boolean | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const countryCodes = [
    { code: '+1', country: 'US', flag: '🇺🇸' },
    { code: '+44', country: 'UK', flag: '🇬🇧' },
    { code: '+91', country: 'IN', flag: '🇮🇳' },
    { code: '+86', country: 'CN', flag: '🇨🇳' },
    { code: '+81', country: 'JP', flag: '🇯🇵' },
    { code: '+49', country: 'DE', flag: '🇩🇪' },
    { code: '+33', country: 'FR', flag: '🇫🇷' },
    { code: '+39', country: 'IT', flag: '🇮🇹' },
    { code: '+34', country: 'ES', flag: '🇪🇸' },
    { code: '+7', country: 'RU', flag: '🇷🇺' },
    { code: '+55', country: 'BR', flag: '🇧🇷' },
    { code: '+52', country: 'MX', flag: '🇲🇽' },
    { code: '+61', country: 'AU', flag: '🇦🇺' },
    { code: '+82', country: 'KR', flag: '🇰🇷' },
    { code: '+65', country: 'SG', flag: '🇸🇬' }
  ];

  const genderOptions = [
    { value: '', label: 'Select Gender' },
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  // Validation functions
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10,15}$/;
    return phoneRegex.test(phone.replace(/\s+/g, ''));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateOTP = (otp: string): boolean => {
    return otp.length === 6 && /^\d{6}$/.test(otp);
  };

  const validateFullName = (name: string): boolean => {
    return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name);
  };

  const validateHandle = (handle: string): boolean => {
    if (!handle.startsWith('#')) return false;
    const cleanHandle = handle.slice(1);
    return cleanHandle.length >= 3 && /^[a-zA-Z0-9_]+$/.test(cleanHandle);
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 8 && 
           /(?=.*[a-z])/.test(password) && 
           /(?=.*[A-Z])/.test(password) && 
           /(?=.*\d)/.test(password);
  };

  // Check handle availability
  const checkHandleAvailability = async (handle: string) => {
    if (!validateHandle(handle)) return;
    
    setIsCheckingHandle(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const takenHandles = ['#admin', '#test', '#user', '#instagram', '#facebook'];
    const isAvailable = !takenHandles.includes(handle.toLowerCase());
    
    setHandleAvailable(isAvailable);
    setIsCheckingHandle(false);
    
    if (!isAvailable) {
      setErrors(prev => ({ ...prev, handle: 'This handle is already taken' }));
    } else {
      setErrors(prev => ({ ...prev, handle: '' }));
    }
  };

  const handleInputChange = (field: keyof RegistrationData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));

    if (field === 'handle') {
      let formattedValue = value;
      if (!value.startsWith('#') && value.length > 0) {
        formattedValue = '#' + value;
      }
      setData(prev => ({ ...prev, [field]: formattedValue }));
      setHandleAvailable(null);
      
      const timeoutId = setTimeout(() => {
        checkHandleAvailability(formattedValue);
      }, 500);
      
      return () => clearTimeout(timeoutId);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, profilePhoto: 'Please select an image file' }));
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, profilePhoto: 'Image must be less than 5MB' }));
        return;
      }
      
      setData(prev => ({ ...prev, profilePhoto: file }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      setErrors(prev => ({ ...prev, profilePhoto: '' }));
    }
  };

  const removeProfilePhoto = () => {
    setData(prev => ({ ...prev, profilePhoto: null }));
    setProfilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateCurrentStep = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    switch (currentStep) {
      case 1: // Contact info step
        if (data.registrationMethod === 'phone') {
          if (!data.mobileNumber) {
            newErrors.mobileNumber = 'Mobile number is required';
          } else if (!validatePhone(data.mobileNumber)) {
            newErrors.mobileNumber = 'Please enter a valid mobile number';
          }
        } else if (data.registrationMethod === 'email') {
          if (!data.email) {
            newErrors.email = 'Email is required';
          } else if (!validateEmail(data.email)) {
            newErrors.email = 'Please enter a valid email address';
          }
        }
        break;
      
      case 2: // OTP verification
        if (!data.otp) {
          newErrors.otp = 'OTP is required';
        } else if (!validateOTP(data.otp)) {
          newErrors.otp = 'Please enter a valid 6-digit OTP';
        }
        break;
      
      case 3: // Profile details
        if (!data.fullName) {
          newErrors.fullName = 'Full name is required';
        } else if (!validateFullName(data.fullName)) {
          newErrors.fullName = 'Please enter a valid full name';
        }
        
        if (!data.handle) {
          newErrors.handle = 'Handle is required';
        } else if (!validateHandle(data.handle)) {
          newErrors.handle = 'Handle must start with # and contain only letters, numbers, and underscores';
        } else if (handleAvailable === false) {
          newErrors.handle = 'This handle is already taken';
        }
        break;
      
      case 4: // Password setup
        if (!data.password) {
          newErrors.password = 'Password is required';
        } else if (!validatePassword(data.password)) {
          newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
        }
        
        if (!data.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (data.password !== data.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        break;
      
      case 5: // Optional details
        // No validation required for optional step
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOTP = async () => {
    if (!validateCurrentStep()) return;

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setOtpSent(true);
    setCurrentStep(2);
    
    // Start countdown
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const verifyOTP = async () => {
    if (!validateCurrentStep()) return;

    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
    setCurrentStep(3);
  };

  const nextStep = async () => {
    if (!validateCurrentStep()) return;
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const skipStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleComplete = async () => {
    if (currentStep === 5 && data.gender && data.dateOfBirth) {
      if (!validateCurrentStep()) return;
    }
    
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    onComplete(data);
  };

  const resendOTP = async () => {
    if (countdown > 0) return;
    
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsProcessing(false);
    
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const getMaxDate = () => {
    const today = new Date();
    const maxDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
    return maxDate.toISOString().split('T')[0];
  };

  // Handle face enrollment completion
  const handleFaceEnrollmentComplete = (faceData: { faceScanImages: string[]; faceScanCompleted: boolean }) => {
    setData(prev => ({
      ...prev,
      faceScanImages: faceData.faceScanImages,
      faceScanCompleted: faceData.faceScanCompleted
    }));
    setCurrentStep(7); // Move to final success step
  };

  const handleFaceEnrollmentSkip = () => {
    setCurrentStep(7); // Skip to final success step
  };

  // Step 6: Face Enrollment
  if (currentStep === 6) {
    return (
      <FaceEnrollment
        onComplete={handleFaceEnrollmentComplete}
        onSkip={handleFaceEnrollmentSkip}
        onBack={() => setCurrentStep(5)}
      />
    );
  }

  // Step 0: Registration Method Selection
  const renderMethodSelection = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 via-purple-700 to-black rounded-3xl mb-4 shadow-lg shadow-purple-900/70 border border-purple-500/40">
          <Users className="w-8 h-8 text-purple-200" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Join The Club</h2>
        <p className="text-purple-200/80">Choose how you'd like to sign up</p>
      </div>

      <div className="space-y-4">
        {/* Phone Registration */}
        <button
          onClick={() => {
            setData(prev => ({ ...prev, registrationMethod: 'phone' }));
            setCurrentStep(1);
          }}
          className="w-full bg-black/30 backdrop-blur-sm border border-purple-500/30 text-white p-4 rounded-2xl hover:bg-black/40 hover:border-purple-400/50 transition-all duration-300 text-left group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-600/20 rounded-2xl flex items-center justify-center border border-purple-500/30 group-hover:bg-purple-600/30 transition-colors">
              <Phone className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Continue with Phone</h3>
              <p className="text-purple-200/80 text-sm">We'll send you a verification code</p>
            </div>
          </div>
        </button>

        {/* Email Registration */}
        <button
          onClick={() => {
            setData(prev => ({ ...prev, registrationMethod: 'email' }));
            setCurrentStep(1);
          }}
          className="w-full bg-black/30 backdrop-blur-sm border border-purple-500/30 text-white p-4 rounded-2xl hover:bg-black/40 hover:border-purple-400/50 transition-all duration-300 text-left group"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-600/20 rounded-2xl flex items-center justify-center border border-purple-500/30 group-hover:bg-purple-600/30 transition-colors">
              <Mail className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Continue with Email</h3>
              <p className="text-purple-200/80 text-sm">Sign up using your email address</p>
            </div>
          </div>
        </button>

        {/* Gmail Registration */}
        <button
          onClick={onGoogleSignup}
          disabled={isLoading}
          className="w-full bg-black/30 backdrop-blur-sm border border-purple-500/30 text-white p-4 rounded-2xl hover:bg-black/40 hover:border-purple-400/50 transition-all duration-300 text-left group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-600/20 rounded-2xl flex items-center justify-center border border-purple-500/30 group-hover:bg-purple-600/30 transition-colors">
              <Users className="w-6 h-6 text-purple-300" />
            </div>
            <div>
              <h3 className="font-semibold text-white">Continue with Google</h3>
              <p className="text-purple-200/80 text-sm">Quick signup with your Google account</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );

  // Step 1: Contact Information Entry
  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 via-purple-700 to-black rounded-3xl mb-4 shadow-lg shadow-purple-900/70 border border-purple-500/40">
          {data.registrationMethod === 'phone' ? (
            <Phone className="w-8 h-8 text-purple-200" />
          ) : (
            <Mail className="w-8 h-8 text-purple-200" />
          )}
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          {data.registrationMethod === 'phone' ? 'Enter your mobile number' : 'Enter your email address'}
        </h2>
        <p className="text-purple-200/80">
          {data.registrationMethod === 'phone' ? "We'll send you a verification code" : "We'll send you a verification link"}
        </p>
      </div>

      <div className="space-y-4">
        {data.registrationMethod === 'phone' ? (
          <div className="flex space-x-3">
            {/* Country Code Dropdown */}
            <div className="relative">
              <select
                value={data.countryCode}
                onChange={(e) => handleInputChange('countryCode', e.target.value)}
                className="appearance-none bg-black/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl text-white px-4 py-4 pr-10 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60 transition-all duration-300 hover:bg-black/40 hover:border-purple-400/50"
              >
                {countryCodes.map((country) => (
                  <option key={country.code} value={country.code} className="bg-gray-800 text-white">
                    {country.flag} {country.code}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-300/60 pointer-events-none" />
            </div>

            {/* Mobile Number Input */}
            <div className="relative flex-1">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300/80" />
              <input
                type="tel"
                value={data.mobileNumber}
                onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                placeholder="Mobile number"
                className={`w-full pl-11 pr-4 py-4 bg-black/30 backdrop-blur-sm border ${
                  errors.mobileNumber ? 'border-orange-400/60' : 'border-purple-500/30'
                } rounded-2xl text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60 transition-all duration-300 hover:bg-black/40 hover:border-purple-400/50 text-lg`}
              />
            </div>
          </div>
        ) : (
          /* Email Input */
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300/80" />
            <input
              type="email"
              value={data.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Email address"
              className={`w-full pl-11 pr-4 py-4 bg-black/30 backdrop-blur-sm border ${
                errors.email ? 'border-orange-400/60' : 'border-purple-500/30'
              } rounded-2xl text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60 transition-all duration-300 hover:bg-black/40 hover:border-purple-400/50 text-lg`}
            />
          </div>
        )}
        
        {(errors.mobileNumber || errors.email) && (
          <p className="text-orange-300 text-sm">{errors.mobileNumber || errors.email}</p>
        )}
      </div>

      <button
        onClick={sendOTP}
        disabled={(!data.mobileNumber && !data.email) || isProcessing}
        className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-black text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:from-purple-700 hover:via-purple-800 hover:to-gray-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/60 border border-purple-500/40"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
            Sending code...
          </div>
        ) : (
          `Send verification ${data.registrationMethod === 'phone' ? 'code' : 'link'}`
        )}
      </button>
    </div>
  );

  // Step 2: OTP Verification
  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 via-purple-700 to-black rounded-3xl mb-4 shadow-lg shadow-purple-900/70 border border-purple-500/40">
          <Shield className="w-8 h-8 text-purple-200" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Enter verification code</h2>
        <p className="text-purple-200/80">
          We sent a 6-digit code to {data.registrationMethod === 'phone' 
            ? `${data.countryCode} ${data.mobileNumber}` 
            : data.email}
        </p>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={data.otp}
            onChange={(e) => handleInputChange('otp', e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            maxLength={6}
            className={`w-full px-4 py-4 bg-black/30 backdrop-blur-sm border ${
              errors.otp ? 'border-orange-400/60' : 'border-purple-500/30'
            } rounded-2xl text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60 transition-all duration-300 hover:bg-black/40 hover:border-purple-400/50 text-center text-2xl tracking-widest font-mono`}
          />
        </div>
        
        {errors.otp && (
          <p className="text-orange-300 text-sm">{errors.otp}</p>
        )}

        <div className="text-center">
          <p className="text-purple-200/80 text-sm mb-2">Didn't receive the code?</p>
          <button
            onClick={resendOTP}
            disabled={countdown > 0 || isProcessing}
            className="text-purple-300 hover:text-purple-200 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {countdown > 0 ? `Resend in ${countdown}s` : 'Resend code'}
          </button>
        </div>
      </div>

      <button
        onClick={verifyOTP}
        disabled={!data.otp || data.otp.length !== 6 || isProcessing}
        className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-black text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:from-purple-700 hover:via-purple-800 hover:to-gray-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/60 border border-purple-500/40"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
            Verifying...
          </div>
        ) : (
          'Verify'
        )}
      </button>
    </div>
  );

  // Step 3: User Details with Profile Photo
  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Create your profile</h2>
        <p className="text-purple-200/80">Tell us about yourself</p>
      </div>

      {/* Profile Photo Upload */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-28 h-28 rounded-full bg-black/30 backdrop-blur-sm border-2 border-purple-500/30 flex items-center justify-center cursor-pointer hover:bg-black/40 hover:border-purple-400/50 transition-all duration-300 overflow-hidden group"
          >
            {profilePreview ? (
              <>
                <img 
                  src={profilePreview} 
                  alt="Profile preview" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </>
            ) : (
              <div className="text-center">
                <Camera className="w-8 h-8 text-purple-300/60 mx-auto mb-2" />
                <p className="text-purple-300/60 text-xs">Add Photo</p>
              </div>
            )}
          </div>
          
          {/* Camera Icon Overlay */}
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center border-2 border-black/20 cursor-pointer hover:from-purple-700 hover:to-purple-800 transition-all duration-300">
            <Camera className="w-4 h-4 text-white" />
          </div>

          {/* Remove Photo Button */}
          {profilePreview && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeProfilePhoto();
              }}
              className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center border-2 border-black/20 hover:bg-red-600 transition-colors"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
      
      <div className="text-center -mt-4 mb-6">
        <p className="text-purple-200/80 text-sm">Add profile photo</p>
        <p className="text-purple-300/60 text-xs mt-1">Optional • Max 5MB • JPG, PNG, GIF</p>
      </div>

      {errors.profilePhoto && (
        <p className="text-orange-300 text-sm text-center -mt-4 mb-4">{errors.profilePhoto}</p>
      )}

      <div className="space-y-4">
        {/* Full Name */}
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300/80" />
          <input
            type="text"
            value={data.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="Full name"
            className={`w-full pl-11 pr-4 py-4 bg-black/30 backdrop-blur-sm border ${
              errors.fullName ? 'border-orange-400/60' : 'border-purple-500/30'
            } rounded-2xl text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60 transition-all duration-300 hover:bg-black/40 hover:border-purple-400/50`}
          />
        </div>
        {errors.fullName && (
          <p className="text-orange-300 text-sm">{errors.fullName}</p>
        )}

        {/* Handle */}
        <div className="relative">
          <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300/80" />
          <input
            type="text"
            value={data.handle}
            onChange={(e) => handleInputChange('handle', e.target.value)}
            placeholder="#username"
            className={`w-full pl-11 pr-12 py-4 bg-black/30 backdrop-blur-sm border ${
              errors.handle ? 'border-orange-400/60' : 
              handleAvailable === true ? 'border-green-400/60' :
              handleAvailable === false ? 'border-orange-400/60' :
              'border-purple-500/30'
            } rounded-2xl text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60 transition-all duration-300 hover:bg-black/40 hover:border-purple-400/50`}
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isCheckingHandle ? (
              <div className="w-5 h-5 border-2 border-purple-300/30 border-t-purple-600 rounded-full animate-spin"></div>
            ) : handleAvailable === true ? (
              <Check className="w-5 h-5 text-green-400" />
            ) : handleAvailable === false ? (
              <X className="w-5 h-5 text-orange-400" />
            ) : null}
          </div>
        </div>
        {errors.handle && (
          <p className="text-orange-300 text-sm">{errors.handle}</p>
        )}
        {handleAvailable === true && !errors.handle && (
          <p className="text-green-400 text-sm">Handle is available!</p>
        )}
      </div>

      <button
        onClick={nextStep}
        disabled={!data.fullName || !data.handle || handleAvailable === false || isCheckingHandle}
        className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-black text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:from-purple-700 hover:via-purple-800 hover:to-gray-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/60 border border-purple-500/40"
      >
        Next
      </button>
    </div>
  );

  // Step 4: Password Setup
  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Create a password</h2>
        <p className="text-purple-200/80">Make sure it's secure</p>
      </div>

      <div className="space-y-4">
        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={data.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Password"
            className={`w-full pl-4 pr-12 py-4 bg-black/30 backdrop-blur-sm border ${
              errors.password ? 'border-orange-400/60' : 'border-purple-500/30'
            } rounded-2xl text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60 transition-all duration-300 hover:bg-black/40 hover:border-purple-400/50`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300/80 hover:text-purple-200 transition-colors"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-orange-300 text-sm">{errors.password}</p>
        )}

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={data.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            placeholder="Confirm password"
            className={`w-full pl-4 pr-12 py-4 bg-black/30 backdrop-blur-sm border ${
              errors.confirmPassword ? 'border-orange-400/60' : 'border-purple-500/30'
            } rounded-2xl text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60 transition-all duration-300 hover:bg-black/40 hover:border-purple-400/50`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-300/80 hover:text-purple-200 transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-orange-300 text-sm">{errors.confirmPassword}</p>
        )}

        {/* Password requirements */}
        <div className="bg-black/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4">
          <p className="text-purple-200/80 text-sm mb-3">Password must contain:</p>
          <div className="space-y-2">
            <div className={`flex items-center text-sm ${data.password.length >= 8 ? 'text-green-400' : 'text-purple-300/60'}`}>
              <div className={`w-4 h-4 rounded-full mr-3 flex items-center justify-center ${data.password.length >= 8 ? 'bg-green-400' : 'bg-purple-600/20 border border-purple-500/30'}`}>
                {data.password.length >= 8 && <Check className="w-3 h-3 text-white" />}
              </div>
              At least 8 characters
            </div>
            <div className={`flex items-center text-sm ${/(?=.*[a-z])/.test(data.password) ? 'text-green-400' : 'text-purple-300/60'}`}>
              <div className={`w-4 h-4 rounded-full mr-3 flex items-center justify-center ${/(?=.*[a-z])/.test(data.password) ? 'bg-green-400' : 'bg-purple-600/20 border border-purple-500/30'}`}>
                {/(?=.*[a-z])/.test(data.password) && <Check className="w-3 h-3 text-white" />}
              </div>
              One lowercase letter
            </div>
            <div className={`flex items-center text-sm ${/(?=.*[A-Z])/.test(data.password) ? 'text-green-400' : 'text-purple-300/60'}`}>
              <div className={`w-4 h-4 rounded-full mr-3 flex items-center justify-center ${/(?=.*[A-Z])/.test(data.password) ? 'bg-green-400' : 'bg-purple-600/20 border border-purple-500/30'}`}>
                {/(?=.*[A-Z])/.test(data.password) && <Check className="w-3 h-3 text-white" />}
              </div>
              One uppercase letter
            </div>
            <div className={`flex items-center text-sm ${/(?=.*\d)/.test(data.password) ? 'text-green-400' : 'text-purple-300/60'}`}>
              <div className={`w-4 h-4 rounded-full mr-3 flex items-center justify-center ${/(?=.*\d)/.test(data.password) ? 'bg-green-400' : 'bg-purple-600/20 border border-purple-500/30'}`}>
                {/(?=.*\d)/.test(data.password) && <Check className="w-3 h-3 text-white" />}
              </div>
              One number
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={nextStep}
        disabled={!data.password || !data.confirmPassword || data.password !== data.confirmPassword || !validatePassword(data.password)}
        className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-black text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:from-purple-700 hover:via-purple-800 hover:to-gray-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/60 border border-purple-500/40"
      >
        Next
      </button>
    </div>
  );

  // Step 5: Optional Info
  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Almost done!</h2>
        <p className="text-purple-200/80">Add some optional details (you can skip this)</p>
      </div>

      <div className="space-y-4">
        {/* Gender */}
        <div className="relative">
          <select
            value={data.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className="w-full pl-4 pr-10 py-4 bg-black/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60 transition-all duration-300 hover:bg-black/40 hover:border-purple-400/50 appearance-none"
          >
            {genderOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300/60 pointer-events-none" />
        </div>

        {/* Date of Birth */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-300/80" />
          <input
            type="date"
            value={data.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            max={getMaxDate()}
            className="w-full pl-11 pr-4 py-4 bg-black/30 backdrop-blur-sm border border-purple-500/30 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60 transition-all duration-300 hover:bg-black/40 hover:border-purple-400/50"
          />
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => setCurrentStep(6)} // Go to face enrollment
          disabled={isProcessing}
          className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-black text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:from-purple-700 hover:via-purple-800 hover:to-gray-900 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-900/60 border border-purple-500/40"
        >
          Continue
        </button>

        <button
          onClick={() => setCurrentStep(6)} // Skip to face enrollment
          className="w-full bg-black/30 backdrop-blur-sm border border-purple-500/30 text-purple-200 py-4 px-6 rounded-2xl font-medium transition-all duration-300 hover:bg-black/40 hover:border-purple-400/50"
        >
          Skip for now
        </button>
      </div>
    </div>
  );

  // Final success screen
  const renderSuccess = () => (
    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Welcome to The Club!</h2>
      <p className="text-purple-200/80">Your account has been created successfully</p>
      
      <div className="bg-black/20 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-4">
        <p className="text-purple-200/80 text-sm">
          {data.faceScanCompleted 
            ? "Face authentication is enabled for secure login"
            : "You can set up face authentication later in settings"
          }
        </p>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Back button */}
      {currentStep > 0 && currentStep <= 6 && (
        <button
          onClick={currentStep === 1 ? () => setCurrentStep(0) : prevStep}
          className="flex items-center text-purple-300 hover:text-purple-200 transition-colors mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back
        </button>
      )}

      {/* Progress indicator */}
      {currentStep > 0 && currentStep <= 6 && (
        <div className="flex items-center justify-center mb-8">
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  step <= currentStep ? 'bg-gradient-to-r from-purple-600 to-purple-700' : 'bg-purple-600/20'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step content */}
      {currentStep === 0 && renderMethodSelection()}
      {currentStep === 1 && renderStep1()}
      {currentStep === 2 && renderStep2()}
      {currentStep === 3 && renderStep3()}
      {currentStep === 4 && renderStep4()}
      {currentStep === 5 && renderStep5()}
      {currentStep === 7 && renderSuccess()}

      {/* Login link */}
      {currentStep >= 0 && currentStep <= 6 && (
        <div className="text-center mt-6">
          <button
            onClick={onLoginClick}
            className="text-purple-200/80 hover:text-purple-100 transition-colors text-sm"
          >
            Already have an account? <span className="text-purple-300 hover:text-purple-200 font-semibold">Log in</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MultiStepRegistration;