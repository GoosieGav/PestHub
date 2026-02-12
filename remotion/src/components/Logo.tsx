import React from 'react';
import {
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { COLORS, FONTS, FONT_WEIGHTS } from '../theme';

interface LogoProps {
  delay?: number;
  size?: 'small' | 'large';
}

export const Logo: React.FC<LogoProps> = ({ delay = 0, size = 'large' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12 },
  });
  const opacity = interpolate(progress, [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(progress, [0, 1], [0.5, 1], {
    extrapolateRight: 'clamp',
  });

  const iconSize = size === 'large' ? 72 : 40;
  const textSize = size === 'large' ? 56 : 32;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        opacity,
        transform: `scale(${scale})`,
      }}
    >
      <Img
        src={staticFile('ui/favicon.svg')}
        style={{ width: iconSize, height: iconSize }}
      />
      <span
        style={{
          fontFamily: FONTS.heading,
          fontWeight: FONT_WEIGHTS.bold,
          fontSize: textSize,
          color: COLORS.textWhite,
          letterSpacing: '-0.02em',
        }}
      >
        PEST-Hub
      </span>
    </div>
  );
};
