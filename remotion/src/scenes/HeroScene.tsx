import React from 'react';
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Poppins';
import { loadFont as loadBodyFont } from '@remotion/google-fonts/Inter';
import { GradientBackground } from '../components/GradientBackground';
import { ParticleField } from '../components/ParticleField';
import { Logo } from '../components/Logo';
import { AnimatedText } from '../components/AnimatedText';
import { COLORS, FONTS, FONT_WEIGHTS } from '../theme';

loadFont();
loadBodyFont();

export const HeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const heroProgress = spring({
    frame: frame - 40,
    fps,
    config: { damping: 14, mass: 0.9 },
  });
  const heroOpacity = interpolate(heroProgress, [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const heroTranslateX = interpolate(heroProgress, [0, 1], [80, 0], {
    extrapolateRight: 'clamp',
  });

  const glowOpacity = interpolate(
    frame,
    [0, 30, 60],
    [0, 0.3, 0.5],
    { extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill>
      <GradientBackground />
      <ParticleField count={25} />

      {/* Green glow behind logo */}
      <div
        style={{
          position: 'absolute',
          top: '22%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          height: 300,
          borderRadius: '50%',
          backgroundColor: COLORS.accentGreen,
          filter: 'blur(100px)',
          opacity: glowOpacity,
        }}
      />

      {/* Content */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 80,
        }}
      >
        <div style={{ marginBottom: 40 }}>
          <Logo delay={5} size="large" />
        </div>

        <AnimatedText
          text="Protect Your Crops with"
          delay={20}
          fontSize={44}
          fontFamily={FONTS.body}
          fontWeight={FONT_WEIGHTS.medium}
          color={COLORS.textLight}
          style={{ textAlign: 'center', marginBottom: 8 }}
        />

        <AnimatedText
          text="AI-Powered Pest Detection"
          delay={28}
          fontSize={60}
          fontFamily={FONTS.heading}
          fontWeight={FONT_WEIGHTS.bold}
          color={COLORS.accentGreen}
          style={{ textAlign: 'center', marginBottom: 48 }}
        />

        <div
          style={{
            opacity: heroOpacity,
            transform: `translateX(${heroTranslateX}px)`,
            borderRadius: 20,
            overflow: 'hidden',
            boxShadow: `0 20px 60px rgba(0, 0, 0, 0.4)`,
            border: `1px solid ${COLORS.glassBorder}`,
          }}
        >
          <Img
            src={staticFile('ui/hero-pest-detection.png')}
            style={{ width: 600, height: 'auto', display: 'block' }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
