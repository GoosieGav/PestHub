export const COLORS = {
  primary: '#059669',
  primaryDark: '#047857',
  primaryLight: '#10b981',

  forestDarkest: '#0a1f12',
  forestDark: '#0d2818',
  forestMid: '#1a472a',

  accentGreen: '#4ade80',
  accentBlue: '#2563eb',
  accentOrange: '#d97706',

  textWhite: '#ffffff',
  textLight: 'rgba(255, 255, 255, 0.85)',
  textMuted: 'rgba(255, 255, 255, 0.6)',

  glass: 'rgba(255, 255, 255, 0.08)',
  glassBorder: 'rgba(255, 255, 255, 0.15)',
  glassLight: 'rgba(255, 255, 255, 0.12)',
} as const;

export const FONTS = {
  heading: 'Poppins',
  body: 'Inter',
} as const;

export const FONT_WEIGHTS = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const VIDEO_CONFIG = {
  width: 1920,
  height: 1080,
  fps: 30,
} as const;

export const SCENE_DURATIONS = {
  hero: 150,
  features: 240,
  howItWorks: 210,
  stats: 150,
  pestGallery: 180,
  outro: 120,
} as const;

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce(
  (a, b) => a + b,
  0
);

export const FEATURES = [
  {
    icon: '\u{1F52C}',
    title: 'AI-Powered Detection',
    description:
      'Advanced neural network trained on thousands of pest images for accurate identification',
  },
  {
    icon: '\u{1F6E1}',
    title: 'Crop Protection',
    description:
      'Early detection prevents extensive damage, protecting your yield and maximizing profits',
  },
  {
    icon: '\u{1F33F}',
    title: 'Sustainable Farming',
    description:
      'Targeted treatment recommendations reduce unnecessary pesticide use',
  },
  {
    icon: '\u26A1',
    title: 'Instant Results',
    description:
      'Get identification and treatment recommendations in seconds, not days',
  },
  {
    icon: '\u{1F393}',
    title: 'Expert Knowledge',
    description:
      'Comprehensive pest information with detailed treatment and prevention strategies',
  },
  {
    icon: '\u{1F4F1}',
    title: 'Easy to Use',
    description:
      'Simple upload interface works on any device \u2014 no special equipment needed',
  },
] as const;

export const STEPS = [
  {
    number: 1,
    title: 'Capture Image',
    description:
      'Take a clear photo of the pest using your smartphone or camera',
    icon: '\u{1F4F7}',
  },
  {
    number: 2,
    title: 'AI Analysis',
    description:
      'Our advanced neural network processes and identifies the pest in seconds',
    icon: '\u{1F9E0}',
  },
  {
    number: 3,
    title: 'Get Treatment',
    description:
      'Receive detailed identification, treatment options, and prevention',
    icon: '\u{1F48A}',
  },
] as const;

export const STATS = [
  { value: 12, label: 'Pest Types', suffix: '' },
  { value: 95, label: 'Accuracy', suffix: '%' },
  { value: 3, label: 'Detection Time', prefix: '<', suffix: 's' },
] as const;

export const PEST_IMAGES = [
  'ants.jpg',
  'bees.jpg',
  'beetles.jpg',
  'caterpillars.jpg',
  'earthworms.jpg',
  'earwigs.jpg',
  'grasshoppers.jpg',
  'moths.jpg',
  'slugs.jpg',
  'snails.jpg',
  'wasps.jpg',
  'weevils.jpg',
] as const;
