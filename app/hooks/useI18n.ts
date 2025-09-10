import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';

const LANGUAGE_KEY = 'app_language';

export const useI18n = () => {
  const { t, i18n: i18nInstance, ready } = useTranslation();

  // Load saved language on mount
  useEffect(() => {
    const loadSavedLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
        if (savedLanguage && savedLanguage !== i18nInstance.language) {
          i18nInstance.changeLanguage(savedLanguage);
        }
      } catch (error) {
        console.log('Error loading saved language:', error);
      }
    };
    
    loadSavedLanguage();
  }, []);

  const changeLanguage = async (lng: string) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, lng);
      i18nInstance.changeLanguage(lng);
    } catch (error) {
      console.log('Error saving language:', error);
      // Still change language even if saving fails
      i18nInstance.changeLanguage(lng);
    }
  };

  return {
    t: t || ((key: string) => key), // Fallback to key if t is not ready
    changeLanguage,
    currentLanguage: i18nInstance?.language || 'en',
    isReady: ready || true,
  };
};
