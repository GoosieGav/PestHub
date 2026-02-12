import React, { type CSSProperties } from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS, FONTS, FONT_WEIGHTS } from '../theme';

interface AnimatedTextProps {
  text: string;
  delay?: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: string;
  color?: string;
  style?: CSSProperties;
  direction?: 'up' | 'left' | 'right' | 'scale';
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  delay = 0,
  fontSize = 48,
  fontFamily = FONTS.heading,
  fontWeight = FONT_WEIGHTS.bold,
  color = COLORS.textWhite,
  style,
  direction = 'up',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  let transform = '';
  switch (direction) {
    case 'up':
      transform = `translateY(${interpolate(progress, [0, 1], [50, 0], { extrapolateRight: 'clamp' })}px)`;
      break;
    case 'left':
      transform = `translateX(${interpolate(progress, [0, 1], [-60, 0], { extrapolateRight: 'clamp' })}px)`;
      break;
    case 'right':
      transform = `translateX(${interpolate(progress, [0, 1], [60, 0], { extrapolateRight: 'clamp' })}px)`;
      break;
    case 'scale':
      transform = `scale(${interpolate(progress, [0, 1], [0.8, 1], { extrapolateRight: 'clamp' })})`;
      break;
  }

  return (
    <div
      style={{
        opacity,
        transform,
        fontSize,
        fontFamily,
        fontWeight,
        color,
        ...style,
      }}
    >
      {text}
    </div>
  );
};
