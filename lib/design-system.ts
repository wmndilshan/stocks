/**
 * Professional Design System
 * Central configuration for colors, spacing, typography, and design tokens
 */

export const designSystem = {
  colors: {
    // Primary brand colors
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    // Trading colors
    trading: {
      bullish: '#10b981',
      bearish: '#ef4444',
      neutral: '#6b7280',
      bullishBg: '#d1fae5',
      bearishBg: '#fee2e2',
      neutralBg: '#f3f4f6',
    },
    // Risk levels
    risk: {
      low: {
        text: '#059669',
        bg: '#d1fae5',
        border: '#10b981',
      },
      medium: {
        text: '#d97706',
        bg: '#fef3c7',
        border: '#f59e0b',
      },
      high: {
        text: '#dc2626',
        bg: '#fee2e2',
        border: '#ef4444',
      },
    },
    // UI colors
    background: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      tertiary: '#f3f4f6',
      dark: '#111827',
    },
    text: {
      primary: '#111827',
      secondary: '#6b7280',
      tertiary: '#9ca3af',
      inverse: '#ffffff',
    },
    border: {
      light: '#e5e7eb',
      medium: '#d1d5db',
      dark: '#9ca3af',
    },
  },
  
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },
  
  typography: {
    fontFamily: {
      sans: 'var(--font-geist-sans)',
      mono: 'var(--font-geist-mono)',
    },
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  
  borderRadius: {
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  },
  
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    },
  },
} as const;

// Helper functions for consistent styling
export const getRiskColor = (riskScore: number) => {
  if (riskScore < 30) return designSystem.colors.risk.low;
  if (riskScore < 70) return designSystem.colors.risk.medium;
  return designSystem.colors.risk.high;
};

export const getTradingColor = (type: 'bullish' | 'bearish' | 'neutral') => {
  return {
    bullish: {
      text: designSystem.colors.trading.bullish,
      bg: designSystem.colors.trading.bullishBg,
    },
    bearish: {
      text: designSystem.colors.trading.bearish,
      bg: designSystem.colors.trading.bearishBg,
    },
    neutral: {
      text: designSystem.colors.trading.neutral,
      bg: designSystem.colors.trading.neutralBg,
    },
  }[type];
};

export const formatCurrency = (value: number, decimals: number = 2): string => {
  return `$${value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
};

export const formatPercentage = (value: number, decimals: number = 2): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
};

export const formatNumber = (value: number, decimals: number = 0): string => {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};
