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
import { ProgressBar } from '../components/ProgressBar';
import { COLORS, FONTS, FONT_WEIGHTS, STEPS } from '../theme';

loadFont();
loadBodyFont();

const Arrow: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 18 },
  });
  const width = interpolate(progress, [0, 1], [0, 80], {
    extrapolateRight: 'clamp',
  });
  const opacity = interpolate(progress, [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        opacity,
      }}
    >
      <div
        style={{
          width,
          height: 3,
          background: `linear-gradient(90deg, ${COLORS.accentGreen}, ${COLORS.primary})`,
          borderRadius: 2,
        }}
      />
      <div
        style={{
          width: 0,
          height: 0,
          borderTop: '8px solid transparent',
          borderBottom: '8px solid transparent',
          borderLeft: `12px solid ${COLORS.primary}`,
        }}
      />
    </div>
  );
};

export const HowItWorksScene: React.FC = () => {
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
          text="How It Works"
          delay={0}
          fontSize={56}
          fontFamily={FONTS.heading}
          fontWeight={FONT_WEIGHTS.bold}
          color={COLORS.textWhite}
          style={{ marginBottom: 60 }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
          }}
        >
          {STEPS.map((step, i) => (
            <React.Fragment key={step.number}>
              <GlassCard
                delay={25 + i * 35}
                style={{
                  padding: 36,
                  width: 360,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    backgroundColor: COLORS.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: FONTS.heading,
                    fontWeight: FONT_WEIGHTS.bold,
                    fontSize: 28,
                    color: COLORS.textWhite,
                    marginBottom: 16,
                  }}
                >
                  {step.number}
                </div>
                <div style={{ fontSize: 32, marginBottom: 12 }}>
                  {step.icon}
                </div>
                <div
                  style={{
                    fontFamily: FONTS.heading,
                    fontWeight: FONT_WEIGHTS.semibold,
                    fontSize: 24,
                    color: COLORS.textWhite,
                    marginBottom: 8,
                  }}
                >
                  {step.title}
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
                  {step.description}
                </div>
              </GlassCard>
              {i < STEPS.length - 1 && <Arrow delay={45 + i * 35} />}
            </React.Fragment>
          ))}
        </div>

        <div style={{ marginTop: 48 }}>
          <ProgressBar delay={130} width={600} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
