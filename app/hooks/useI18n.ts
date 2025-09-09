import { useTranslation } from 'react-i18next';

export const useI18n = () => {
  const { t, i18n: i18nInstance, ready } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18nInstance.changeLanguage(lng);
  };

  return {
    t: t || ((key: string) => key), // Fallback to key if t is not ready
    changeLanguage,
    currentLanguage: i18nInstance?.language || 'en',
    isReady: ready || true,
  };
};
