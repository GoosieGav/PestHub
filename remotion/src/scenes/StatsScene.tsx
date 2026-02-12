import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Poppins';
import { loadFont as loadBodyFont } from '@remotion/google-fonts/Inter';
import { GradientBackground } from '../components/GradientBackground';
import { ParticleField } from '../components/ParticleField';
import { AnimatedText } from '../components/AnimatedText';
import { GlassCard } from '../components/GlassCard';
import { COLORS, FONTS, FONT_WEIGHTS, STATS } from '../theme';

loadFont();
loadBodyFont();

const AnimatedCounter: React.FC<{
  value: number;
  prefix?: string;
  suffix: string;
  label: string;
  delay: number;
}> = ({ value, prefix, suffix, label, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, mass: 1 },
  });

  const displayValue = Math.round(
    interpolate(progress, [0, 1], [0, value], { extrapolateRight: 'clamp' })
  );

  const glowIntensity = interpolate(
    Math.sin(frame * 0.06),
    [-1, 1],
    [0.2, 0.5],
  );

  return (
    <GlassCard
      delay={delay}
      style={{
        padding: '40px 48px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        minWidth: 280,
      }}
    >
      <div
        style={{
          fontFamily: FONTS.heading,
          fontWeight: FONT_WEIGHTS.bold,
          fontSize: 100,
          color: COLORS.accentGreen,
          lineHeight: 1,
          marginBottom: 12,
          textShadow: `0 0 40px rgba(74, 222, 128, ${glowIntensity})`,
        }}
      >
        {prefix}
        {displayValue}
        {suffix}
      </div>
      <div
        style={{
          fontFamily: FONTS.body,
          fontWeight: FONT_WEIGHTS.medium,
          fontSize: 24,
          color: COLORS.textMuted,
        }}
      >
        {label}
      </div>
    </GlassCard>
  );
};

export const StatsScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <GradientBackground />
      <ParticleField count={20} />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 80px',
        }}
      >
        <AnimatedText
          text="PEST-Hub at a Glance"
          delay={0}
          fontSize={56}
          fontFamily={FONTS.heading}
          fontWeight={FONT_WEIGHTS.bold}
          color={COLORS.textWhite}
          style={{ marginBottom: 60 }}
        />

        <div style={{ display: 'flex', gap: 40 }}>
          {STATS.map((stat, i) => (
            <AnimatedCounter
              key={stat.label}
              value={stat.value}
              prefix={'prefix' in stat ? (stat as { prefix: string }).prefix : undefined}
              suffix={stat.suffix}
              label={stat.label}
              delay={15 + i * 10}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
