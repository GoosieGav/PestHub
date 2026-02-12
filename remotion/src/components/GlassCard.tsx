import React, { type CSSProperties, type ReactNode } from 'react';
import { interpolate, useCurrentFrame, spring, useVideoConfig } from 'remotion';
import { COLORS } from '../theme';

interface GlassCardProps {
  children: ReactNode;
  style?: CSSProperties;
  delay?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  delay = 0,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, mass: 0.8 },
  });

  const opacity = interpolate(progress, [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const translateY = interpolate(progress, [0, 1], [40, 0], {
    extrapolateRight: 'clamp',
  });
  const scale = interpolate(progress, [0, 1], [0.92, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        backgroundColor: COLORS.glass,
        border: `1px solid ${COLORS.glassBorder}`,
        borderRadius: 20,
        padding: 32,
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};
