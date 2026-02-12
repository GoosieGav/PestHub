import React from 'react';
import { useCurrentFrame, useVideoConfig, spring, interpolate } from 'remotion';
import { COLORS } from '../theme';

interface ProgressBarProps {
  delay?: number;
  width?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  delay = 0,
  width = 400,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, mass: 1.2 },
  });
  const fillWidth = interpolate(progress, [0, 1], [0, width], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: fillWidth,
          height: '100%',
          borderRadius: 4,
          background: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accentGreen})`,
        }}
      />
    </div>
  );
};
