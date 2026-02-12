import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { loadFont } from '@remotion/google-fonts/Poppins';
import { loadFont as loadBodyFont } from '@remotion/google-fonts/Inter';
import { GradientBackground } from '../components/GradientBackground';
import { ParticleField } from '../components/ParticleField';
import { AnimatedText } from '../components/AnimatedText';
import { Logo } from '../components/Logo';
import { COLORS, FONTS, FONT_WEIGHTS } from '../theme';

loadFont();
loadBodyFont();

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();

  const buttonScale = Math.sin(frame * 0.08) * 0.03 + 1;
  const glowIntensity = Math.sin(frame * 0.08) * 10 + 20;

  return (
    <AbsoluteFill>
      <GradientBackground />
      <ParticleField count={25} />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 36,
        }}
      >
        <AnimatedText
          text="Ready to Protect Your Crops?"
          delay={0}
          fontSize={64}
          fontFamily={FONTS.heading}
          fontWeight={FONT_WEIGHTS.bold}
          color={COLORS.textWhite}
          direction="scale"
          style={{ textAlign: 'center' }}
        />

        <AnimatedText
          text="Join thousands of farmers using AI for smarter pest management"
          delay={15}
          fontSize={24}
          fontFamily={FONTS.body}
          fontWeight={FONT_WEIGHTS.regular}
          color={COLORS.textMuted}
          style={{ textAlign: 'center', maxWidth: 700 }}
        />

        <div
          style={{
            marginTop: 12,
            padding: '20px 64px',
            backgroundColor: COLORS.primary,
            borderRadius: 16,
            fontFamily: FONTS.heading,
            fontWeight: FONT_WEIGHTS.semibold,
            fontSize: 24,
            color: COLORS.textWhite,
            transform: `scale(${buttonScale})`,
            boxShadow: `0 0 ${glowIntensity}px rgba(5, 150, 105, 0.6)`,
          }}
        >
          Get Started
        </div>

        <div style={{ marginTop: 24 }}>
          <Logo delay={35} size="small" />
        </div>

        <AnimatedText
          text="AI-Powered Pest Detection"
          delay={50}
          fontSize={20}
          fontFamily={FONTS.body}
          fontWeight={FONT_WEIGHTS.regular}
          color={COLORS.textMuted}
          style={{ textAlign: 'center' }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
