import React from 'react';
import { AbsoluteFill } from 'remotion';
import { COLORS } from '../theme';

export const GradientBackground: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${COLORS.forestDark} 0%, ${COLORS.forestMid} 50%, ${COLORS.forestDarkest} 100%)`,
      }}
    />
  );
};
