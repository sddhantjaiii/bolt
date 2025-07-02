const faceapi = require('face-api.js');
const canvas = require('canvas');
const tf = require('@tensorflow/tfjs-node');
const path = require('path');
const fs = require('fs').promises;
const sharp = require('sharp');
const logger = require('../utils/logger');

// Patch environment for face-api.js
const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

class FaceRecognitionService {
  constructor() {
    this.isInitialized = false;
    this.modelsPath = path.join(__dirname, '../models/face-recognition');
  }

  async initializeModels() {
    try {
      logger.info('Initializing face recognition models...');
      
      // Load face-api.js models
      await faceapi.nets.ssdMobilenetv1.loadFromDisk(this.modelsPath);
      await faceapi.nets.faceLandmark68Net.loadFromDisk(this.modelsPath);
      await faceapi.nets.faceRecognitionNet.loadFromDisk(this.modelsPath);
      await faceapi.nets.faceExpressionNet.loadFromDisk(this.modelsPath);
      
      this.isInitialized = true;
      logger.info('Face recognition models loaded successfully');
    } catch (error) {
      logger.error('Failed to initialize face recognition models:', error);
      throw error;
    }
  }

  async preprocessImage(imageBuffer) {
    try {
      // Resize and normalize image
      const processedBuffer = await sharp(imageBuffer)
        .resize(640, 480, { fit: 'cover' })
        .jpeg({ quality: 90 })
        .toBuffer();

      return processedBuffer;
    } catch (error) {
      logger.error('Image preprocessing failed:', error);
      throw new Error('Failed to preprocess image');
    }
  }

  async detectFaces(imageBuffer) {
    if (!this.isInitialized) {
      throw new Error('Face recognition service not initialized');
    }

    try {
      const processedBuffer = await this.preprocessImage(imageBuffer);
      const img = await canvas.loadImage(processedBuffer);
      
      // Detect faces with landmarks and descriptors
      const detections = await faceapi
        .detectAllFaces(img)
        .withFaceLandmarks()
        .withFaceDescriptors()
        .withFaceExpressions();

      return {
        success: true,
        faces: detections.map(detection => ({
          box: detection.detection.box,
          landmarks: detection.landmarks.positions,
          descriptor: Array.from(detection.descriptor),
          expressions: detection.expressions,
          confidence: detection.detection.score
        }))
      };
    } catch (error) {
      logger.error('Face detection failed:', error);
      return {
        success: false,
        error: 'Face detection failed'
      };
    }
  }

  validateFaceForEnrollment(faceData) {
    if (!faceData.faces || faceData.faces.length === 0) {
      return { valid: false, error: 'No face detected in image' };
    }

    if (faceData.faces.length > 1) {
      return { valid: false, error: 'Multiple faces detected. Please ensure only one face is visible' };
    }

    const face = faceData.faces[0];
    
    // Check confidence score
    if (face.confidence < 0.7) {
      return { valid: false, error: 'Face detection confidence too low. Please ensure good lighting' };
    }

    // Check face size
    const faceArea = face.box.width * face.box.height;
    if (faceArea < 10000) { // Minimum face area
      return { valid: false, error: 'Face too small. Please move closer to the camera' };
    }

    // Check if face is looking straight (using landmarks)
    if (face.landmarks) {
      const leftEye = face.landmarks[36]; // Left eye outer corner
      const rightEye = face.landmarks[45]; // Right eye outer corner
      const nose = face.landmarks[30]; // Nose tip
      
      // Calculate face angle (simplified)
      const eyeDistance = Math.abs(leftEye.x - rightEye.x);
      const noseOffset = Math.abs(nose.x - (leftEye.x + rightEye.x) / 2);
      const angleRatio = noseOffset / eyeDistance;
      
      if (angleRatio > 0.3) {
        return { valid: false, error: 'Please look straight at the camera' };
      }
    }

    return { valid: true };
  }

  async enrollFace(userId, faceImages) {
    try {
      const faceDescriptors = [];
      
      for (const imageBase64 of faceImages) {
        const imageBuffer = Buffer.from(imageBase64, 'base64');
        const faceData = await this.detectFaces(imageBuffer);
        
        const validation = this.validateFaceForEnrollment(faceData);
        if (!validation.valid) {
          throw new Error(validation.error);
        }
        
        faceDescriptors.push(faceData.faces[0].descriptor);
      }

      // Calculate average descriptor for better accuracy
      const avgDescriptor = this.calculateAverageDescriptor(faceDescriptors);
      
      return {
        success: true,
        enrollmentId: `face_${userId}_${Date.now()}`,
        descriptor: avgDescriptor
      };
    } catch (error) {
      logger.error('Face enrollment failed:', error);
      return {
        success: false,
        error: error.message || 'Face enrollment failed'
      };
    }
  }

  async authenticateFace(storedDescriptor, authImageBase64) {
    try {
      const imageBuffer = Buffer.from(authImageBase64, 'base64');
      const faceData = await this.detectFaces(imageBuffer);
      
      if (!faceData.success || faceData.faces.length === 0) {
        return {
          success: false,
          error: 'No face detected in authentication image'
        };
      }

      if (faceData.faces.length > 1) {
        return {
          success: false,
          error: 'Multiple faces detected. Please ensure only one face is visible'
        };
      }

      const authDescriptor = faceData.faces[0].descriptor;
      const distance = this.calculateEuclideanDistance(storedDescriptor, authDescriptor);
      
      // Threshold for face matching (lower = more strict)
      const threshold = 0.6;
      const isMatch = distance < threshold;
      const confidence = Math.max(0, (1 - distance) * 100);

      return {
        success: true,
        authenticated: isMatch,
        confidence: Math.round(confidence),
        distance: distance
      };
    } catch (error) {
      logger.error('Face authentication failed:', error);
      return {
        success: false,
        error: 'Face authentication failed'
      };
    }
  }

  calculateAverageDescriptor(descriptors) {
    if (descriptors.length === 0) return null;
    if (descriptors.length === 1) return descriptors[0];

    const avgDescriptor = new Array(descriptors[0].length).fill(0);
    
    for (const descriptor of descriptors) {
      for (let i = 0; i < descriptor.length; i++) {
        avgDescriptor[i] += descriptor[i];
      }
    }
    
    for (let i = 0; i < avgDescriptor.length; i++) {
      avgDescriptor[i] /= descriptors.length;
    }
    
    return avgDescriptor;
  }

  calculateEuclideanDistance(desc1, desc2) {
    if (!desc1 || !desc2 || desc1.length !== desc2.length) {
      return 1; // Maximum distance if descriptors are invalid
    }

    let sum = 0;
    for (let i = 0; i < desc1.length; i++) {
      const diff = desc1[i] - desc2[i];
      sum += diff * diff;
    }
    
    return Math.sqrt(sum);
  }

  async downloadModels() {
    try {
      logger.info('Downloading face recognition models...');
      
      // Create models directory if it doesn't exist
      await fs.mkdir(this.modelsPath, { recursive: true });
      
      // In a real implementation, you would download the models from a CDN
      // For now, we'll assume they're already present or downloaded separately
      logger.info('Face recognition models ready');
    } catch (error) {
      logger.error('Failed to download models:', error);
      throw error;
    }
  }
}

const faceRecognitionService = new FaceRecognitionService();

// Initialize the service
const initializeFaceRecognition = async () => {
  try {
    await faceRecognitionService.downloadModels();
    await faceRecognitionService.initializeModels();
  } catch (error) {
    logger.error('Face recognition initialization failed:', error);
  }
};

module.exports = {
  faceRecognitionService,
  initializeFaceRecognition
};