const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { faceRecognitionService } = require('../services/faceRecognitionService');
const logger = require('../utils/logger');

const router = express.Router();

// Enroll face for user
router.post('/enroll', [
  body('faceImages').isArray({ min: 3, max: 6 }).withMessage('Please provide 3-6 face images'),
  body('faceImages.*').isBase64().withMessage('Each image must be a valid base64 string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { faceImages } = req.body;
    const userId = req.user.id;

    // Check if user already has face authentication enabled
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.faceAuth.isEnabled) {
      return res.status(400).json({
        success: false,
        message: 'Face authentication is already enabled for this user'
      });
    }

    // Enroll face using face recognition service
    const enrollmentResult = await faceRecognitionService.enrollFace(userId, faceImages);
    
    if (!enrollmentResult.success) {
      return res.status(400).json({
        success: false,
        message: enrollmentResult.error
      });
    }

    // Update user with face authentication data
    user.faceAuth = {
      isEnabled: true,
      enrollmentId: enrollmentResult.enrollmentId,
      faceDescriptors: [enrollmentResult.descriptor],
      enrolledAt: new Date()
    };

    await user.save();

    logger.info(`Face authentication enrolled for user ${userId}`);

    res.status(200).json({
      success: true,
      message: 'Face authentication enrolled successfully',
      enrollmentId: enrollmentResult.enrollmentId
    });

  } catch (error) {
    logger.error('Face enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Face enrollment failed'
    });
  }
});

// Authenticate user with face
router.post('/authenticate', [
  body('faceImage').isBase64().withMessage('Face image must be a valid base64 string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { faceImage } = req.body;
    const userId = req.user.id;

    // Get user's face authentication data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.faceAuth.isEnabled || !user.faceAuth.faceDescriptors.length) {
      return res.status(400).json({
        success: false,
        message: 'Face authentication not enabled for this user'
      });
    }

    // Authenticate face using the stored descriptor
    const storedDescriptor = user.faceAuth.faceDescriptors[0];
    const authResult = await faceRecognitionService.authenticateFace(storedDescriptor, faceImage);
    
    if (!authResult.success) {
      return res.status(400).json({
        success: false,
        message: authResult.error
      });
    }

    // Log authentication attempt
    logger.info(`Face authentication attempt for user ${userId}: ${authResult.authenticated ? 'SUCCESS' : 'FAILED'} (confidence: ${authResult.confidence}%)`);

    res.status(200).json({
      success: true,
      authenticated: authResult.authenticated,
      confidence: authResult.confidence,
      message: authResult.authenticated ? 'Face authentication successful' : 'Face authentication failed'
    });

  } catch (error) {
    logger.error('Face authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Face authentication failed'
    });
  }
});

// Disable face authentication
router.delete('/disable', async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Disable face authentication
    user.faceAuth = {
      isEnabled: false,
      enrollmentId: null,
      faceDescriptors: [],
      enrolledAt: null
    };

    await user.save();

    logger.info(`Face authentication disabled for user ${userId}`);

    res.status(200).json({
      success: true,
      message: 'Face authentication disabled successfully'
    });

  } catch (error) {
    logger.error('Face authentication disable error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to disable face authentication'
    });
  }
});

// Get face authentication status
router.get('/status', async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('faceAuth');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      faceAuth: {
        isEnabled: user.faceAuth.isEnabled,
        enrolledAt: user.faceAuth.enrolledAt,
        hasEnrollment: !!user.faceAuth.enrollmentId
      }
    });

  } catch (error) {
    logger.error('Face authentication status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get face authentication status'
    });
  }
});

// Re-enroll face (update existing enrollment)
router.put('/re-enroll', [
  body('faceImages').isArray({ min: 3, max: 6 }).withMessage('Please provide 3-6 face images'),
  body('faceImages.*').isBase64().withMessage('Each image must be a valid base64 string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { faceImages } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (!user.faceAuth.isEnabled) {
      return res.status(400).json({
        success: false,
        message: 'Face authentication is not enabled for this user'
      });
    }

    // Re-enroll face
    const enrollmentResult = await faceRecognitionService.enrollFace(userId, faceImages);
    
    if (!enrollmentResult.success) {
      return res.status(400).json({
        success: false,
        message: enrollmentResult.error
      });
    }

    // Update user with new face authentication data
    user.faceAuth.enrollmentId = enrollmentResult.enrollmentId;
    user.faceAuth.faceDescriptors = [enrollmentResult.descriptor];
    user.faceAuth.enrolledAt = new Date();

    await user.save();

    logger.info(`Face authentication re-enrolled for user ${userId}`);

    res.status(200).json({
      success: true,
      message: 'Face authentication re-enrolled successfully',
      enrollmentId: enrollmentResult.enrollmentId
    });

  } catch (error) {
    logger.error('Face re-enrollment error:', error);
    res.status(500).json({
      success: false,
      message: 'Face re-enrollment failed'
    });
  }
});

module.exports = router;