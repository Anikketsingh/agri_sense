import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useI18n } from '../../hooks/useI18n';
import { useAuthStore } from '../../store/authStore';
import { useTutorialStore } from '../../store/tutorialStore';

export default function AuthScreen() {
  const { t } = useI18n();
  const { login } = useAuthStore();
  const { setTutorialCompleted } = useTutorialStore();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestOtp = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert(t('common.error'), 'Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement actual OTP request API call
      // For now, just simulate success
      setTimeout(() => {
        setStep('otp');
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      Alert.alert(t('common.error'), 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode.trim() || otpCode.length !== 6) {
      Alert.alert(t('common.error'), 'Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement actual OTP verification API call
      // For now, just simulate success and create a mock farmer
      setTimeout(() => {
        const mockFarmer = {
          id: 'F-92A7C3',
          phone: phoneNumber,
          name: 'Farmer Name',
          language: 'en' as const,
          createdAt: new Date().toISOString(),
        };
        const mockToken = 'mock-jwt-token';
        
        login(mockFarmer, mockToken);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      Alert.alert(t('common.error'), 'Invalid OTP code');
    }
  };

  const handleResendOtp = () => {
    handleRequestOtp();
  };

  const handleSkipToHome = () => {
    Alert.alert(
      'Skip Login',
      'Are you sure you want to skip login and go directly to the home screen? You can always login later from settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Skip', 
          onPress: () => {
            // Create a mock farmer for demo purposes
            const mockFarmer = {
              id: 'DEMO-USER',
              phone: 'demo@agrisense.com',
              name: 'Demo User',
              language: 'en' as const,
              createdAt: new Date().toISOString(),
            };
            const mockToken = 'demo-token';
            
            // Login with demo user
            login(mockFarmer, mockToken);
            
            // Skip tutorial and go directly to home
            setTutorialCompleted(true);
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('auth.title')}</Text>
            <Text style={styles.subtitle}>{t('auth.subtitle')}</Text>
          </View>

          <View style={styles.form}>
            {step === 'phone' ? (
              <>
                <Text style={styles.label}>{t('auth.phoneNumber')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('auth.enterPhone')}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  autoFocus
                />
                <TouchableOpacity
                  style={[styles.button, isLoading && styles.buttonDisabled]}
                  onPress={handleRequestOtp}
                  disabled={isLoading}
                >
                  <Text style={styles.buttonText}>
                    {isLoading ? t('common.loading') : t('auth.verifyOtp')}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={handleSkipToHome}
                >
                  <Text style={styles.skipButtonText}>Skip to Home</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.label}>{t('auth.otpCode')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('auth.enterOtp')}
                  value={otpCode}
                  onChangeText={setOtpCode}
                  keyboardType="number-pad"
                  maxLength={6}
                  autoFocus
                />
                <TouchableOpacity
                  style={[styles.button, isLoading && styles.buttonDisabled]}
                  onPress={handleVerifyOtp}
                  disabled={isLoading}
                >
                  <Text style={styles.buttonText}>
                    {isLoading ? t('common.loading') : t('auth.verifyOtp')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.resendButton}
                  onPress={handleResendOtp}
                >
                  <Text style={styles.resendText}>{t('auth.resendOtp')}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.skipButton}
                  onPress={handleSkipToHome}
                >
                  <Text style={styles.skipButtonText}>Skip to Home</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2E7D32',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendButton: {
    alignItems: 'center',
  },
  resendText: {
    color: '#2E7D32',
    fontSize: 14,
  },
  skipButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2E7D32',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  skipButtonText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '600',
  },
});

