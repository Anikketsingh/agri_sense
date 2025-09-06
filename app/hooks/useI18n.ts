import { useTranslation } from 'react-i18next';

export const useI18n = () => {
  const { t, i18n: i18nInstance } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18nInstance.changeLanguage(lng);
  };

  return {
    t,
    changeLanguage,
    currentLanguage: i18nInstance.language || 'en',
    isReady: true, // Simplified - i18n is initialized synchronously
  };
};
