import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

const AuthScreen = () => {
  const navigation = useNavigation();
  const { login } = useAuth();
  const { theme } = useTheme();
  
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        navigation.navigate('Main' as never);
      } else {
        Alert.alert('Error', 'Invalid email or password');
      }
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleJoinClick = () => {
    navigation.navigate('Registration' as never);
  };

  return (
    <LinearGradient
      colors={['#000000', '#1a1a2e', '#16213e']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={[styles.iconContainer, { borderColor: theme.colors.border }]}>
                <Icon name="moon" size={32} color={theme.colors.primary} />
              </View>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                Welcome Back
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                Enter the forbidden realm
              </Text>
            </View>

            {/* Toggle Buttons */}
            <View style={[styles.toggleContainer, { backgroundColor: theme.colors.surface }]}>
              <TouchableOpacity
                onPress={() => setAuthMode('signin')}
                style={[
                  styles.toggleButton,
                  authMode === 'signin' && [styles.activeToggle, { backgroundColor: theme.colors.primary }],
                ]}
              >
                <Text
                  style={[
                    styles.toggleText,
                    { color: authMode === 'signin' ? '#FFFFFF' : theme.colors.textSecondary },
                  ]}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setAuthMode('signup')}
                style={[
                  styles.toggleButton,
                  authMode === 'signup' && [styles.activeToggle, { backgroundColor: theme.colors.primary }],
                ]}
              >
                <Text
                  style={[
                    styles.toggleText,
                    { color: authMode === 'signup' ? '#FFFFFF' : theme.colors.textSecondary },
                  ]}
                >
                  Join Club
                </Text>
              </TouchableOpacity>
            </View>

            {authMode === 'signin' ? (
              /* Sign In Form */
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <View style={[styles.inputWrapper, { borderColor: errors.email ? theme.colors.error : theme.colors.border }]}>
                    <Icon name="mail" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: theme.colors.text }]}
                      placeholder="Email Address"
                      placeholderTextColor={theme.colors.textSecondary}
                      value={formData.email}
                      onChangeText={(text) => handleInputChange('email', text)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                  {errors.email && (
                    <Text style={[styles.errorText, { color: theme.colors.error }]}>
                      {errors.email}
                    </Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <View style={[styles.inputWrapper, { borderColor: errors.password ? theme.colors.error : theme.colors.border }]}>
                    <Icon name="lock" size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      style={[styles.input, { color: theme.colors.text }]}
                      placeholder="Password"
                      placeholderTextColor={theme.colors.textSecondary}
                      value={formData.password}
                      onChangeText={(text) => handleInputChange('password', text)}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      <Icon
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={20}
                        color={theme.colors.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>
                  {errors.password && (
                    <Text style={[styles.errorText, { color: theme.colors.error }]}>
                      {errors.password}
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={isLoading}
                  style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
                >
                  {isLoading ? (
                    <View style={styles.loadingContainer}>
                      <Animated.View style={styles.loadingSpinner} />
                      <Text style={styles.submitButtonText}>Entering...</Text>
                    </View>
                  ) : (
                    <View style={styles.submitContent}>
                      <Icon name="zap" size={20} color="#FFFFFF" style={styles.submitIcon} />
                      <Text style={styles.submitButtonText}>Enter Now</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              /* Join Club Placeholder */
              <View style={styles.joinContainer}>
                <View style={[styles.joinIconContainer, { borderColor: theme.colors.border }]}>
                  <Icon name="users" size={32} color={theme.colors.primary} />
                </View>
                <Text style={[styles.joinTitle, { color: theme.colors.text }]}>
                  Join The Club
                </Text>
                <Text style={[styles.joinDescription, { color: theme.colors.textSecondary }]}>
                  Create your account to access our exclusive community
                </Text>
                <TouchableOpacity
                  onPress={handleJoinClick}
                  style={[styles.joinButton, { backgroundColor: theme.colors.primary }]}
                >
                  <Icon name="users" size={20} color="#FFFFFF" style={styles.submitIcon} />
                  <Text style={styles.submitButtonText}>Start Registration</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Features */}
            <View style={styles.features}>
              {[
                { icon: 'heart', title: 'Intimate Support' },
                { icon: 'lock', title: 'Private & Secure' },
                { icon: 'moon', title: 'Night Mode' },
              ].map((feature, index) => (
                <View
                  key={index}
                  style={[styles.featureItem, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                >
                  <Icon name={feature.icon} size={24} color={theme.colors.primary} />
                  <Text style={[styles.featureText, { color: theme.colors.textSecondary }]}>
                    {feature.title}
                  </Text>
                </View>
              ))}
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 4,
    marginBottom: 32,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  activeToggle: {
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  form: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
  },
  submitButton: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingSpinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderTopColor: 'transparent',
    marginRight: 8,
  },
  joinContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  joinIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  joinTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  joinDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  featureItem: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 16,
    borderWidth: 1,
  },
  featureText: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default AuthScreen;