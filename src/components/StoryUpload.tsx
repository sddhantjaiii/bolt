import React, { useState, useRef } from 'react';
import { X, Camera, Image, Type, Smile, Upload, ArrowLeft } from 'lucide-react';

interface StoryUploadProps {
  onClose: () => void;
  onUpload: (storyData: { type: 'image' | 'video'; content: string; text?: string; duration?: number }) => void;
}

const StoryUpload: React.FC<StoryUploadProps> = ({ onClose, onUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [storyText, setStoryText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
        alert('Please select an image or video file');
        return;
      }
      
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        alert('File must be less than 50MB');
        return;
      }
      
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !preview) return;
    
    setIsUploading(true);
    
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Create story data
    const storyData = {
      type: selectedFile.type.startsWith('video/') ? 'video' as const : 'image' as const,
      content: preview,
      text: storyText || undefined,
      duration: selectedFile.type.startsWith('video/') ? 15 : 5 // seconds
    };
    
    onUpload(storyData);
    setIsUploading(false);
  };

  const addEmoji = (emoji: string) => {
    setStoryText(prev => prev + emoji);
  };

  const popularEmojis = ['😍', '❤️', '🔥', '✨', '💜', '😘', '🥰', '💕', '🌟', '💫', '🦋', '🌸'];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/90 backdrop-blur-xl border border-purple-500/30 rounded-3xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-purple-500/30">
          <h3 className="text-xl font-bold text-white">Add to Story</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-purple-600/30 rounded-full flex items-center justify-center hover:bg-purple-600/50 transition-colors"
          >
            <X className="w-4 h-4 text-purple-300" />
          </button>
        </div>

        <div className="p-4">
          {!selectedFile ? (
            /* File Selection */
            <div className="space-y-4">
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-purple-300" />
                </div>
                <h4 className="text-white font-semibold mb-2">Share a moment</h4>
                <p className="text-purple-200/80 text-sm mb-6">Upload a photo or video to your story</p>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-2xl font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-300 flex items-center justify-center"
                >
                  <Image className="w-5 h-5 mr-2" />
                  Choose Photo/Video
                </button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              
              <div className="bg-purple-600/10 border border-purple-500/30 rounded-2xl p-4">
                <p className="text-purple-200/80 text-sm">
                  <strong>Tips:</strong> Stories disappear after 24 hours. Max file size: 50MB. Supported formats: JPG, PNG, GIF, MP4, MOV.
                </p>
              </div>
            </div>
          ) : (
            /* Story Editor */
            <div className="space-y-4">
              {/* Preview */}
              <div className="relative aspect-[9/16] bg-black rounded-2xl overflow-hidden">
                {selectedFile.type.startsWith('video/') ? (
                  <video
                    src={preview!}
                    className="w-full h-full object-cover"
                    controls
                    muted
                    autoPlay
                    loop
                  />
                ) : (
                  <img
                    src={preview!}
                    alt="Story preview"
                    className="w-full h-full object-cover"
                  />
                )}
                
                {/* Text Overlay */}
                {storyText && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black/50 backdrop-blur-sm rounded-2xl px-4 py-2 max-w-[80%]">
                      <p className="text-white text-center font-semibold text-lg">{storyText}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Text Input */}
              <div className="space-y-3">
                <div className="relative">
                  <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-300/80" />
                  <input
                    type="text"
                    value={storyText}
                    onChange={(e) => setStoryText(e.target.value)}
                    placeholder="Add text to your story..."
                    maxLength={100}
                    className="w-full pl-10 pr-4 py-3 bg-black/30 border border-purple-500/30 rounded-2xl text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/60"
                  />
                </div>
                
                <div className="text-right">
                  <span className="text-purple-300/60 text-xs">{storyText.length}/100</span>
                </div>
              </div>

              {/* Emoji Picker */}
              <div>
                <div className="flex items-center mb-2">
                  <Smile className="w-4 h-4 text-purple-300 mr-2" />
                  <span className="text-purple-200 text-sm font-medium">Quick Emojis</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => addEmoji(emoji)}
                      className="w-8 h-8 bg-black/30 border border-purple-500/30 rounded-lg flex items-center justify-center hover:bg-purple-600/20 hover:border-purple-400/50 transition-all duration-300"
                    >
                      <span className="text-lg">{emoji}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload Progress */}
              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-200 text-sm">Uploading...</span>
                    <span className="text-purple-300 text-sm">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-black/30 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-600 to-purple-700 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview(null);
                    setStoryText('');
                  }}
                  className="flex-1 bg-black/40 border border-purple-500/30 text-purple-200 py-3 rounded-2xl font-medium hover:bg-black/50 transition-colors flex items-center justify-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </button>
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-2xl font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Share Story
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryUpload;