// Constants for the AgriSense app

export const APP_CONFIG = {
  name: 'AgriSense',
  version: '1.0.0',
  supportEmail: 'support@agrisense.com',
  website: 'https://agrisense.com',
} as const;

export const API_CONFIG = {
  baseUrl: 'https://api.agrisense.com',
  timeout: 10000,
  retryAttempts: 3,
} as const;

export const STORAGE_KEYS = {
  auth: 'auth-storage',
  fields: 'fields-storage',
  settings: 'settings-storage',
  cache: 'cache-storage',
} as const;

export const SOIL_PARAMETERS = {
  ph: {
    min: 3.0,
    max: 10.0,
    optimal: { min: 6.0, max: 7.0 },
    warning: { min: 5.5, max: 7.5 },
  },
  nitrogen: {
    min: 0,
    max: 100,
    optimal: { min: 20, max: 30 },
    warning: { min: 15, max: 35 },
  },
  phosphorus: {
    min: 0,
    max: 50,
    optimal: { min: 15, max: 25 },
    warning: { min: 10, max: 30 },
  },
  potassium: {
    min: 0,
    max: 300,
    optimal: { min: 100, max: 150 },
    warning: { min: 80, max: 170 },
  },
  moisture: {
    min: 0,
    max: 100,
    optimal: { min: 20, max: 30 },
    warning: { min: 15, max: 35 },
  },
  ec: {
    min: 0,
    max: 5.0,
    optimal: { min: 0.8, max: 1.5 },
    warning: { min: 0.5, max: 2.0 },
  },
} as const;

export const CROP_TYPES = [
  'Wheat',
  'Rice',
  'Maize',
  'Sugarcane',
  'Cotton',
  'Soybean',
  'Potato',
  'Tomato',
  'Onion',
  'Chili',
] as const;

export const SEASONS = {
  kharif: {
    name: 'Kharif',
    months: ['June', 'July', 'August', 'September', 'October'],
    description: 'Monsoon season crops',
  },
  rabi: {
    name: 'Rabi',
    months: ['October', 'November', 'December', 'January', 'February', 'March'],
    description: 'Winter season crops',
  },
  zaid: {
    name: 'Zaid',
    months: ['March', 'April', 'May', 'June'],
    description: 'Summer season crops',
  },
} as const;

export const ALERT_TYPES = {
  weather: 'weather',
  irrigation: 'irrigation',
  soil: 'soil',
  pest: 'pest',
  disease: 'disease',
} as const;

export const ALERT_SEVERITY = {
  low: 'low',
  medium: 'medium',
  high: 'high',
  critical: 'critical',
} as const;

export const COLORS = {
  primary: '#2E7D32',
  primaryLight: '#4CAF50',
  primaryDark: '#1B5E20',
  secondary: '#1976D2',
  accent: '#F57C00',
  error: '#D32F2F',
  warning: '#F57C00',
  success: '#4CAF50',
  info: '#2196F3',
  text: '#333333',
  textSecondary: '#666666',
  textLight: '#999999',
  background: '#F5F5F5',
  surface: '#FFFFFF',
  border: '#E0E0E0',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;


