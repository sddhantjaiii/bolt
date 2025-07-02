const logger = require('../utils/logger');

// In-memory OTP store for development purposes
// In production, use Redis or a database for persistence
const otpStore = new Map(); // Stores: phoneNumber -> { otp, expiresAt }

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
};

const sendOTP = async (phoneNumber) => {
  try {
    const otp = generateOTP();
    const expiresAt = Date.now() + 5 * 60 * 1000; // OTP valid for 5 minutes
    
    // Store OTP in memory
    otpStore.set(phoneNumber, { otp, expiresAt });
    
    // For development, log the OTP instead of sending SMS
    logger.info(`OTP for ${phoneNumber}: ${otp} (expires in 5 minutes)`);
    
    // In production, integrate with SMS service like Twilio:
    // const twilio = require('twilio');
    // const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    // await client.messages.create({
    //   body: `Your verification code is ${otp}`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phoneNumber,
    // });
    
    return { 
      success: true, 
      message: 'OTP sent successfully',
      // For development only - remove in production
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    };
  } catch (error) {
    logger.error(`Failed to send OTP to ${phoneNumber}:`, error);
    return { 
      success: false, 
      error: 'Failed to send OTP' 
    };
  }
};

const verifyOTP = async (phoneNumber, otp) => {
  try {
    const storedOtpData = otpStore.get(phoneNumber);

    if (!storedOtpData) {
      return { 
        success: false, 
        error: 'OTP not found or expired' 
      };
    }

    if (storedOtpData.expiresAt < Date.now()) {
      otpStore.delete(phoneNumber); // Clean up expired OTP
      return { 
        success: false, 
        error: 'OTP expired' 
      };
    }

    if (storedOtpData.otp === otp) {
      otpStore.delete(phoneNumber); // OTP successfully verified, remove it
      logger.info(`OTP verified successfully for ${phoneNumber}`);
      return { 
        success: true, 
        message: 'OTP verified successfully' 
      };
    } else {
      return { 
        success: false, 
        error: 'Invalid OTP' 
      };
    }
  } catch (error) {
    logger.error(`Failed to verify OTP for ${phoneNumber}:`, error);
    return { 
      success: false, 
      error: 'Failed to verify OTP' 
    };
  }
};

// Clean up expired OTPs periodically
const cleanupExpiredOTPs = () => {
  const now = Date.now();
  for (const [phoneNumber, otpData] of otpStore.entries()) {
    if (otpData.expiresAt < now) {
      otpStore.delete(phoneNumber);
    }
  }
};

// Run cleanup every 5 minutes
setInterval(cleanupExpiredOTPs, 5 * 60 * 1000);

module.exports = {
  sendOTP,
  verifyOTP,
};