import React from 'react';
import { AbsoluteFill, useCurrentFrame, random } from 'remotion';
import { COLORS } from '../theme';

interface ParticleFieldProps {
  count?: number;
}

export const ParticleField: React.FC<ParticleFieldProps> = ({ count = 30 }) => {
  const frame = useCurrentFrame();

  const particles = new Array(count).fill(null).map((_, i) => {
    const x = random(`x-${i}`) * 100;
    const baseY = random(`y-${i}`) * 100;
    const size = random(`size-${i}`) * 6 + 2;
    const speed = random(`speed-${i}`) * 0.3 + 0.1;
    const particleOpacity = random(`opacity-${i}`) * 0.3 + 0.05;

    const y = (baseY - frame * speed) % 110;
    const adjustedY = y < -10 ? y + 120 : y;

    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: `${x}%`,
          top: `${adjustedY}%`,
          width: size,
          height: size,
          borderRadius: '50%',
          backgroundColor: COLORS.accentGreen,
          opacity: particleOpacity,
        }}
      />
    );
  });

  return <AbsoluteFill>{particles}</AbsoluteFill>;
};
