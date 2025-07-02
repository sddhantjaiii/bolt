import { ApiService } from './ApiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class AuthService {
  static async login(email: string, password: string) {
    try {
      const response = await ApiService.login(email, password);
      return {
        success: true,
        token: response.token,
        user: response.user,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed',
      };
    }
  }

  static async register(userData: any) {
    try {
      const response = await ApiService.register(userData);
      return {
        success: true,
        token: response.token,
        user: response.user,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed',
      };
    }
  }

  static async verifyToken(token: string) {
    try {
      const response = await ApiService.verifyToken(token);
      return response.valid;
    } catch (error) {
      return false;
    }
  }

  static async sendOTP(phoneNumber: string) {
    try {
      const response = await ApiService.sendOTP(phoneNumber);
      return {
        success: true,
        message: response.message,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to send OTP',
      };
    }
  }

  static async verifyOTP(phoneNumber: string, otp: string) {
    try {
      const response = await ApiService.verifyOTP(phoneNumber, otp);
      return {
        success: true,
        verified: response.verified,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || 'OTP verification failed',
      };
    }
  }

  static async logout() {
    try {
      await AsyncStorage.multiRemove(['authToken', 'user']);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Logout failed' };
    }
  }
}