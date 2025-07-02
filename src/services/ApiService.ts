import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ApiServiceClass {
  private api: AxiosInstance;
  private baseURL = 'http://localhost:3000/api'; // Change this to your backend URL

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle errors
    this.api.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, logout user
          await AsyncStorage.multiRemove(['authToken', 'user']);
          // Navigate to login screen
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
  }

  async register(userData: any) {
    const response = await this.api.post('/auth/register', userData);
    return response.data;
  }

  async verifyToken(token: string) {
    const response = await this.api.post('/auth/verify', { token });
    return response.data;
  }

  async sendOTP(phoneNumber: string) {
    const response = await this.api.post('/auth/send-otp', { phoneNumber });
    return response.data;
  }

  async verifyOTP(phoneNumber: string, otp: string) {
    const response = await this.api.post('/auth/verify-otp', { phoneNumber, otp });
    return response.data;
  }

  // Face authentication endpoints
  async enrollFace(userId: string, faceImages: string[]) {
    const response = await this.api.post('/face-auth/enroll', {
      userId,
      faceImages,
    });
    return response.data;
  }

  async authenticateWithFace(userId: string, faceImage: string) {
    const response = await this.api.post('/face-auth/authenticate', {
      userId,
      faceImage,
    });
    return response.data;
  }

  // User endpoints
  async getProfile(userId: string) {
    const response = await this.api.get(`/users/${userId}`);
    return response.data;
  }

  async updateProfile(userId: string, profileData: any) {
    const response = await this.api.put(`/users/${userId}`, profileData);
    return response.data;
  }

  async uploadProfileImage(userId: string, imageUri: string) {
    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    } as any);

    const response = await this.api.post(`/users/${userId}/upload-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Posts endpoints
  async getFeed(page: number = 1, limit: number = 10) {
    const response = await this.api.get(`/posts/feed?page=${page}&limit=${limit}`);
    return response.data;
  }

  async getTrendingPosts(page: number = 1, limit: number = 10) {
    const response = await this.api.get(`/posts/trending?page=${page}&limit=${limit}`);
    return response.data;
  }

  async createPost(postData: any) {
    const response = await this.api.post('/posts', postData);
    return response.data;
  }

  async likePost(postId: string) {
    const response = await this.api.post(`/posts/${postId}/like`);
    return response.data;
  }

  async savePost(postId: string) {
    const response = await this.api.post(`/posts/${postId}/save`);
    return response.data;
  }

  // Search endpoints
  async searchUsers(query: string, filters?: any) {
    const response = await this.api.get(`/search/users?q=${query}`, { params: filters });
    return response.data;
  }

  async searchPosts(query: string, filters?: any) {
    const response = await this.api.get(`/search/posts?q=${query}`, { params: filters });
    return response.data;
  }

  // Messages endpoints
  async getConversations() {
    const response = await this.api.get('/messages/conversations');
    return response.data;
  }

  async getMessages(conversationId: string, page: number = 1) {
    const response = await this.api.get(`/messages/${conversationId}?page=${page}`);
    return response.data;
  }

  async sendMessage(conversationId: string, content: string, type: string = 'text') {
    const response = await this.api.post(`/messages/${conversationId}`, {
      content,
      type,
    });
    return response.data;
  }

  // Host endpoints
  async getHosts(location?: any, filters?: any) {
    const response = await this.api.get('/hosts', { params: { ...location, ...filters } });
    return response.data;
  }

  async bookSession(hostId: string, sessionData: any) {
    const response = await this.api.post(`/hosts/${hostId}/book`, sessionData);
    return response.data;
  }

  async getBookings() {
    const response = await this.api.get('/bookings');
    return response.data;
  }
}

export const ApiService = new ApiServiceClass();