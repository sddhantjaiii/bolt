import * as FaceDetector from 'expo-face-detector';
import * as FileSystem from 'expo-file-system';
import { ApiService } from './ApiService';

export class FaceAuthService {
  static async detectFaces(imageUri: string) {
    try {
      const options = {
        mode: FaceDetector.FaceDetectorMode.accurate,
        detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
        runClassifications: FaceDetector.FaceDetectorClassifications.all,
      };

      const result = await FaceDetector.detectFacesAsync(imageUri, options);
      return result;
    } catch (error) {
      console.error('Face detection failed:', error);
      throw error;
    }
  }

  static async enrollFace(userId: string, faceImages: string[]) {
    try {
      // Convert images to base64
      const base64Images = await Promise.all(
        faceImages.map(async (imageUri) => {
          const base64 = await FileSystem.readAsStringAsync(imageUri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          return base64;
        })
      );

      const response = await ApiService.enrollFace(userId, base64Images);
      return {
        success: true,
        enrollmentId: response.enrollmentId,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Face enrollment failed',
      };
    }
  }

  static async authenticateWithFace(userId: string, imageUri: string) {
    try {
      // Convert image to base64
      const base64Image = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const response = await ApiService.authenticateWithFace(userId, base64Image);
      return {
        success: true,
        authenticated: response.authenticated,
        confidence: response.confidence,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Face authentication failed',
      };
    }
  }

  static validateFaceImage(faceDetectionResult: any) {
    if (!faceDetectionResult.faces || faceDetectionResult.faces.length === 0) {
      return { valid: false, error: 'No face detected' };
    }

    if (faceDetectionResult.faces.length > 1) {
      return { valid: false, error: 'Multiple faces detected' };
    }

    const face = faceDetectionResult.faces[0];
    
    // Check face size (should be at least 100x100 pixels)
    const faceWidth = face.bounds.size.width;
    const faceHeight = face.bounds.size.height;
    
    if (faceWidth < 100 || faceHeight < 100) {
      return { valid: false, error: 'Face too small' };
    }

    // Check if face is looking straight (optional)
    if (face.yawAngle && Math.abs(face.yawAngle) > 30) {
      return { valid: false, error: 'Please look straight at the camera' };
    }

    if (face.rollAngle && Math.abs(face.rollAngle) > 30) {
      return { valid: false, error: 'Please keep your head straight' };
    }

    return { valid: true };
  }

  static async preprocessImage(imageUri: string) {
    try {
      // Here you could add image preprocessing like:
      // - Resize to standard dimensions
      // - Adjust brightness/contrast
      // - Crop to face region
      // For now, we'll just return the original URI
      return imageUri;
    } catch (error) {
      console.error('Image preprocessing failed:', error);
      throw error;
    }
  }
}