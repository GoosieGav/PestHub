// PestHub Premium Theme - Glassmorphic Dark Green Aesthetic
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  // Primary gradient colors (dark forest theme)
  gradientStart: '#0d2818',
  gradientMiddle: '#1a472a',
  gradientEnd: '#0a1f12',
  
  // Accent colors
  primary: '#4ade80',
  primaryDark: '#22c55e',
  primaryLight: '#86efac',
  accent: '#34d399',
  
  // Glass effects
  glass: 'rgba(255, 255, 255, 0.08)',
  glassBorder: 'rgba(255, 255, 255, 0.15)',
  glassLight: 'rgba(255, 255, 255, 0.12)',
  glassDark: 'rgba(0, 0, 0, 0.2)',
  
  // Text colors
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textMuted: 'rgba(255, 255, 255, 0.5)',
  textDark: '#1f2937',
  
  // Status colors
  success: '#4ade80',
  warning: '#fbbf24',
  danger: '#f87171',
  info: '#60a5fa',
  
  // Background
  background: '#0d2818',
  cardBackground: 'rgba(255, 255, 255, 0.06)',
  
  // Threat levels
  threatHigh: '#ef4444',
  threatMedium: '#f59e0b',
  threatLow: '#22c55e',
};

export const GRADIENTS = {
  primary: ['#0d2818', '#1a472a', '#0d2818'],
  card: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'],
  button: ['#22c55e', '#16a34a'],
  buttonSecondary: ['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.08)'],
  glow: ['rgba(74, 222, 128, 0.3)', 'rgba(74, 222, 128, 0)'],
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
};

export const GLASS_STYLE = {
  backgroundColor: COLORS.glass,
  borderWidth: 1,
  borderColor: COLORS.glassBorder,
  borderRadius: 20,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const FONTS = {
  // Sizes
  h1: 36,
  h2: 28,
  h3: 22,
  h4: 18,
  body: 16,
  bodySmall: 14,
  caption: 12,
  tiny: 10,
};

export const DIMENSIONS = {
  width,
  height,
  cardWidth: (width - 48) / 2,
};

export default {
  COLORS,
  GRADIENTS,
  SHADOWS,
  GLASS_STYLE,
  SPACING,
  FONTS,
  DIMENSIONS,
};
