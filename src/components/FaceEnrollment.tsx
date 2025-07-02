import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, RotateCcw, CheckCircle, X, AlertCircle, Loader, Shield, Eye } from 'lucide-react';

interface FaceEnrollmentProps {
  onComplete: (faceData: { faceScanImages: string[]; faceScanCompleted: boolean }) => void;
  onSkip: () => void;
  onBack: () => void;
}

const FaceEnrollment: React.FC<FaceEnrollmentProps> = ({ onComplete, onSkip, onBack }) => {
  const [step, setStep] = useState<'intro' | 'scanning' | 'processing' | 'complete'>('intro');
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [currentAngle, setCurrentAngle] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [scanningProgress, setScanningProgress] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const captureIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);

  const targetAngles = [0, 60, 120, 180, 240, 300]; // 6 angles around the circle
  const requiredCaptures = 6;

  // Initialize camera
  const initializeCamera = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Unable to access camera. Please check permissions and try again.');
    }
  }, []);

  // Cleanup camera
  const cleanupCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  // Capture image from video
  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return null;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Flip horizontally for selfie effect
    ctx.scale(-1, 1);
    ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    ctx.scale(-1, 1);
    
    return canvas.toDataURL('image/jpeg', 0.8);
  }, []);

  // Start face scanning process
  const startScanning = useCallback(async () => {
    setStep('scanning');
    setIsCapturing(true);
    setCapturedImages([]);
    setCurrentAngle(0);
    setScanningProgress(0);
    
    let captureCount = 0;
    const images: string[] = [];
    
    // Animate the scanning circle
    const animateCircle = () => {
      setCurrentAngle(prev => (prev + 2) % 360);
      animationRef.current = requestAnimationFrame(animateCircle);
    };
    animateCircle();
    
    // Capture images at intervals
    captureIntervalRef.current = setInterval(() => {
      const imageData = captureImage();
      if (imageData) {
        images.push(imageData);
        setCapturedImages([...images]);
        captureCount++;
        
        const progress = (captureCount / requiredCaptures) * 100;
        setScanningProgress(progress);
        
        if (captureCount >= requiredCaptures) {
          setIsCapturing(false);
          if (captureIntervalRef.current) {
            clearInterval(captureIntervalRef.current);
          }
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
          }
          
          // Process the captured images
          setStep('processing');
          setTimeout(() => {
            setStep('complete');
          }, 2000);
        }
      }
    }, 1000); // Capture every second
  }, [captureImage]);

  // Handle completion
  const handleComplete = () => {
    const faceData = {
      faceScanImages: capturedImages,
      faceScanCompleted: true
    };
    cleanupCamera();
    onComplete(faceData);
  };

  // Handle skip
  const handleSkip = () => {
    cleanupCamera();
    onSkip();
  };

  // Initialize camera when component mounts
  useEffect(() => {
    if (step === 'scanning') {
      initializeCamera();
    }
    
    return () => {
      cleanupCamera();
    };
  }, [step, initializeCamera, cleanupCamera]);

  // Intro step
  if (step === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-black/50 backdrop-blur-xl border border-purple-500/40 rounded-3xl shadow-2xl shadow-purple-900/80 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 via-purple-700 to-black rounded-3xl mb-6 shadow-lg shadow-purple-900/80 border border-purple-500/50">
                <Shield className="w-10 h-10 text-purple-200 fill-current drop-shadow-lg" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-200 via-purple-100 to-white bg-clip-text text-transparent mb-3 drop-shadow-sm">
                Secure Face Scan
              </h1>
              <p className="text-purple-200/90 text-base font-light leading-relaxed">
                Set up face authentication for secure, hands-free login
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {[
                {
                  icon: Eye,
                  title: 'Multi-angle capture',
                  description: 'We scan your face from different angles for better security'
                },
                {
                  icon: Shield,
                  title: 'Secure & private',
                  description: 'Your face data is encrypted and stored locally'
                },
                {
                  icon: RotateCcw,
                  title: 'Quick setup',
                  description: 'Takes just 6 seconds to complete the scan'
                }
              ].map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-purple-600/20 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1">
                    <feature.icon className="w-4 h-4 text-purple-300" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium text-sm mb-1">{feature.title}</h3>
                    <p className="text-purple-200/80 text-xs leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 border border-purple-500/40 rounded-2xl p-4 mb-8">
              <h4 className="text-purple-200 font-semibold text-sm mb-2">What to expect:</h4>
              <ol className="space-y-1 text-purple-200/80 text-xs">
                <li>1. Position your face in the center of the frame</li>
                <li>2. Slowly move your head in a circle</li>
                <li>3. We'll capture 6 images from different angles</li>
                <li>4. Keep your face visible throughout the process</li>
              </ol>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setStep('scanning')}
                className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-black text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:from-purple-700 hover:via-purple-800 hover:to-gray-900 shadow-lg shadow-purple-900/60 border border-purple-500/40 flex items-center justify-center"
              >
                <Camera className="w-5 h-5 mr-3" />
                Start Face Scan
              </button>
              
              <button
                onClick={handleSkip}
                className="w-full bg-black/40 backdrop-blur-sm border border-purple-500/30 text-purple-200 py-3 px-6 rounded-2xl font-medium transition-all duration-300 hover:bg-black/50 hover:border-purple-400/50"
              >
                Skip for now
              </button>
            </div>

            {/* Back Button */}
            <div className="text-center mt-6">
              <button
                onClick={onBack}
                className="text-purple-200/80 hover:text-purple-100 transition-colors text-sm flex items-center justify-center mx-auto"
              >
                <X className="w-4 h-4 mr-2" />
                Back to registration
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Scanning step
  if (step === 'scanning') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-black/50 backdrop-blur-xl border border-purple-500/40 rounded-3xl shadow-2xl shadow-purple-900/80 p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Face Scanning</h2>
              <p className="text-purple-200/80 text-sm">
                Move your head slowly in a circle
              </p>
            </div>

            {/* Camera View */}
            <div className="relative mb-6">
              <div className="aspect-square rounded-3xl overflow-hidden bg-black/60 border-2 border-purple-500/30 relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                
                {/* Scanning Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Scanning Circle */}
                    <div 
                      className="w-48 h-48 rounded-full border-4 border-purple-500/30 relative"
                      style={{
                        background: `conic-gradient(from ${currentAngle}deg, transparent 0deg, rgba(168, 85, 247, 0.3) 60deg, transparent 120deg)`
                      }}
                    >
                      {/* Center Guide */}
                      <div className="absolute inset-4 rounded-full border-2 border-purple-400/60 border-dashed"></div>
                      
                      {/* Progress Indicator */}
                      <div 
                        className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-purple-500 rounded-full transition-all duration-300"
                        style={{
                          transform: `translate(-50%, 0) rotate(${currentAngle}deg) translateY(-100px) rotate(-${currentAngle}deg)`
                        }}
                      ></div>
                    </div>
                    
                    {/* Center Dot */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-purple-400 rounded-full"></div>
                  </div>
                </div>

                {/* Error Overlay */}
                {error && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <div className="text-center">
                      <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                      <p className="text-red-300 text-sm">{error}</p>
                      <button
                        onClick={initializeCamera}
                        className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-xl text-sm hover:bg-purple-700 transition-colors"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-200 text-sm">Scanning progress</span>
                <span className="text-purple-300 text-sm font-medium">{Math.round(scanningProgress)}%</span>
              </div>
              <div className="w-full bg-black/30 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-purple-700 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${scanningProgress}%` }}
                />
              </div>
            </div>

            {/* Captured Images Preview */}
            {capturedImages.length > 0 && (
              <div className="mb-6">
                <p className="text-purple-200 text-sm mb-3">Captured angles ({capturedImages.length}/{requiredCaptures})</p>
                <div className="flex space-x-2 overflow-x-auto">
                  {capturedImages.map((image, index) => (
                    <div key={index} className="flex-shrink-0">
                      <img
                        src={image}
                        alt={`Capture ${index + 1}`}
                        className="w-12 h-12 rounded-lg object-cover border border-purple-500/30"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="text-center">
              <p className="text-purple-200/80 text-sm">
                {isCapturing ? 'Keep moving your head slowly...' : 'Position your face in the center'}
              </p>
            </div>

            {/* Cancel Button */}
            <div className="text-center mt-6">
              <button
                onClick={handleSkip}
                className="text-purple-200/80 hover:text-purple-100 transition-colors text-sm"
              >
                Cancel scan
              </button>
            </div>
          </div>
        </div>

        {/* Hidden canvas for image capture */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  // Processing step
  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-black/50 backdrop-blur-xl border border-purple-500/40 rounded-3xl shadow-2xl shadow-purple-900/80 p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader className="w-8 h-8 text-white animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Processing Face Data</h3>
            <p className="text-purple-200/80 text-sm">
              Creating your secure face profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Complete step
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-black/50 backdrop-blur-xl border border-purple-500/40 rounded-3xl shadow-2xl shadow-purple-900/80 p-8 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Face Scan Complete!</h3>
          <p className="text-purple-200/80 text-sm mb-6">
            Your face authentication is now set up. You can use face login for secure access.
          </p>
          
          {/* Captured Images Summary */}
          <div className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 border border-purple-500/40 rounded-2xl p-4 mb-6">
            <p className="text-purple-200 text-sm mb-3">Captured {capturedImages.length} face angles</p>
            <div className="flex justify-center space-x-2">
              {capturedImages.slice(0, 6).map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Face angle ${index + 1}`}
                  className="w-8 h-8 rounded-lg object-cover border border-purple-500/30"
                />
              ))}
            </div>
          </div>

          <button
            onClick={handleComplete}
            className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-black text-white py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:from-purple-700 hover:via-purple-800 hover:to-gray-900 shadow-lg shadow-purple-900/60 border border-purple-500/40"
          >
            Continue to App
          </button>
        </div>
      </div>
    </div>
  );
};

export default FaceEnrollment;