import React from 'react';
import { AbsoluteFill } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Poppins';
import { loadFont as loadBodyFont } from '@remotion/google-fonts/Inter';
import { GradientBackground } from '../components/GradientBackground';
import { ParticleField } from '../components/ParticleField';
import { AnimatedText } from '../components/AnimatedText';
import { GlassCard } from '../components/GlassCard';
import { COLORS, FONTS, FONT_WEIGHTS, FEATURES } from '../theme';

loadFont();
loadBodyFont();

export const FeaturesScene: React.FC = () => {
  return (
    <AbsoluteFill>
      <GradientBackground />
      <ParticleField count={20} />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '60px 80px',
        }}
      >
        <AnimatedText
          text="Why Choose PEST-Hub?"
          delay={0}
          fontSize={56}
          fontFamily={FONTS.heading}
          fontWeight={FONT_WEIGHTS.bold}
          color={COLORS.textWhite}
          style={{ marginBottom: 48 }}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 28,
            width: '100%',
            maxWidth: 1600,
          }}
        >
          {FEATURES.map((feature, i) => (
            <GlassCard
              key={feature.title}
              delay={20 + i * 8}
              style={{ padding: 28 }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accentGreen})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  marginBottom: 16,
                }}
              >
                {feature.icon}
              </div>
              <div
                style={{
                  fontFamily: FONTS.heading,
                  fontWeight: FONT_WEIGHTS.semibold,
                  fontSize: 22,
                  color: COLORS.textWhite,
                  marginBottom: 8,
                }}
              >
                {feature.title}
              </div>
              <div
                style={{
                  fontFamily: FONTS.body,
                  fontWeight: FONT_WEIGHTS.regular,
                  fontSize: 16,
                  color: COLORS.textMuted,
                  lineHeight: 1.5,
                }}
              >
                {feature.description}
              </div>
            </GlassCard>
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
