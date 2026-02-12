import React from 'react';
import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  interpolate,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Poppins';
import { loadFont as loadBodyFont } from '@remotion/google-fonts/Inter';
import { GradientBackground } from '../components/GradientBackground';
import { ParticleField } from '../components/ParticleField';
import { AnimatedText } from '../components/AnimatedText';
import { COLORS, FONTS, FONT_WEIGHTS, PEST_IMAGES } from '../theme';

loadFont();
loadBodyFont();

const formatName = (filename: string) =>
  filename.replace('.jpg', '').replace(/^\w/, (c) => c.toUpperCase());

export const PestGalleryScene: React.FC = () => {
  const frame = useCurrentFrame();

  const translateX = interpolate(
    frame,
    [15, 60, 90, 120, 150],
    [0, 0, -1080, -1080, -2160],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const fadeIn = interpolate(frame, [0, 15], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <GradientBackground />
      <ParticleField count={15} />

      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '60px 80px',
        }}
      >
        <AnimatedText
          text="Pest Database"
          delay={0}
          fontSize={56}
          fontFamily={FONTS.heading}
          fontWeight={FONT_WEIGHTS.bold}
          color={COLORS.textWhite}
          style={{ marginBottom: 48 }}
        />

        <div
          style={{
            overflow: 'hidden',
            width: '100%',
            maxWidth: 1200,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: 24,
              transform: `translateX(${translateX}px)`,
              opacity: fadeIn,
            }}
          >
            {PEST_IMAGES.map((img) => (
              <div
                key={img}
                style={{
                  flexShrink: 0,
                  width: 256,
                  borderRadius: 16,
                  overflow: 'hidden',
                  border: `1px solid ${COLORS.glassBorder}`,
                  backgroundColor: COLORS.glass,
                }}
              >
                <Img
                  src={staticFile(`pests/${img}`)}
                  style={{
                    width: 256,
                    height: 256,
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                <div
                  style={{
                    padding: '12px 16px',
                    fontFamily: FONTS.heading,
                    fontWeight: FONT_WEIGHTS.semibold,
                    fontSize: 18,
                    color: COLORS.textWhite,
                    textAlign: 'center',
                  }}
                >
                  {formatName(img)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
