import { Platform } from 'react-native';

export const Colors = {
  // Brand
  primary: '#2D6A4F',       // Forest Green — buttons, active states
  primaryPressed: '#245840', // Darker green for pressed
  primarySubtle: '#E8F2EC',  // Very light green tint — avatars, success bg

  // Backgrounds
  background: '#FAF7F0',    // Warm Cream — primary screen background
  surface: '#FFFFFF',        // Cards, inputs, modals

  // Text
  textPrimary: '#1C1917',   // Deep Charcoal
  textSecondary: '#57534E',  // Medium warm gray
  textMuted: '#78716C',     // Labels, secondary actions
  textSubtle: '#A8A29E',    // Placeholders, very subtle text

  // Borders
  border: '#E7E5E0',        // Default light warm-gray border
  borderMedium: '#D6D3CF',  // Input borders (slightly more visible)

  // Accent — muted gold: success confirmations and subtle highlights ONLY
  gold: '#B8975A',
  goldSubtle: '#FBF5EC',

  // Semantic states
  error: '#DC2626',

  // Card state tints
  cardSuccess: '#E8F2EC',
  cardSuccessBorder: '#86BFA3',
  cardWarning: '#FFFBEB',
  cardWarningBorder: '#D97706',
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
