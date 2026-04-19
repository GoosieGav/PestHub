import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
  staticFile,
} from 'remotion';

const PHONE_W = 390;
const PHONE_H = 844;
const SCALE = 3;

export const ImageScanVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timeline
  const IMAGE_FADE_END = 12;
  const SCAN_START = 15;
  const SCAN_END = 75;
  const CHECK_START = 80;
  const HOLD_END = 135;

  // Image fade in
  const imageOpacity = interpolate(frame, [0, IMAGE_FADE_END], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Scanner line position (top to bottom)
  const scanActive = frame >= SCAN_START && frame <= SCAN_END;
  const scanProgress = interpolate(
    frame,
    [SCAN_START, SCAN_END],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Scanner line opacity (fade in at start, fade out at end)
  const scanOpacity = scanActive
    ? interpolate(
        frame,
        [SCAN_START, SCAN_START + 5, SCAN_END - 5, SCAN_END],
        [0, 1, 1, 0],
        { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
      )
    : 0;

  // Scanned region blue tint (follows the line)
  const tintHeight = scanActive || frame > SCAN_END ? scanProgress * 100 : 0;

  // Checkmark animation
  const checkSpring = spring({
    frame: frame - CHECK_START,
    fps,
    config: { damping: 12, mass: 0.8 },
  });
  const checkScale = interpolate(checkSpring, [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const checkOpacity = interpolate(checkSpring, [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Green flash behind checkmark
  const flashOpacity =
    frame >= CHECK_START
      ? interpolate(
          frame,
          [CHECK_START, CHECK_START + 8, CHECK_START + 20],
          [0, 0.15, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
        )
      : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#0d2818' }}>
      <div
        style={{
          width: PHONE_W,
          height: PHONE_H,
          transform: `scale(${SCALE})`,
          transformOrigin: 'top left',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#0d2818',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Dark forest gradient background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(135deg, #0d2818 0%, #1a472a 50%, #0a1f12 100%)',
          }}
        />

        {/* Image container */}
        <div
          style={{
            position: 'relative',
            width: 340,
            borderRadius: 24,
            overflow: 'hidden',
            opacity: imageOpacity,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
          }}
        >
          <Img
            src={staticFile('example.png')}
            style={{
              width: '100%',
              display: 'block',
              borderRadius: 24,
            }}
          />

          {/* Blue tint overlay that follows scan line */}
          {tintHeight > 0 && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: `${Math.min(tintHeight, 100)}%`,
                background:
                  'linear-gradient(180deg, rgba(37, 99, 235, 0.08) 0%, rgba(37, 99, 235, 0.05) 100%)',
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Blue scanning line */}
          {scanActive && (
            <>
              {/* Main line */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: `${scanProgress * 100}%`,
                  height: 3,
                  opacity: scanOpacity,
                  background:
                    'linear-gradient(90deg, transparent 0%, #3b82f6 20%, #60a5fa 50%, #3b82f6 80%, transparent 100%)',
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.3)',
                }}
              />
              {/* Glow above line */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: `${scanProgress * 100}%`,
                  height: 30,
                  marginTop: -15,
                  opacity: scanOpacity * 0.4,
                  background:
                    'linear-gradient(180deg, transparent, rgba(59, 130, 246, 0.3), transparent)',
                  pointerEvents: 'none',
                }}
              />
            </>
          )}

          {/* Corner brackets */}
          {[
            { top: 12, left: 12, borderTop: '3px solid #3b82f6', borderLeft: '3px solid #3b82f6', borderTopLeftRadius: 8 },
            { top: 12, right: 12, borderTop: '3px solid #3b82f6', borderRight: '3px solid #3b82f6', borderTopRightRadius: 8 },
            { bottom: 12, left: 12, borderBottom: '3px solid #3b82f6', borderLeft: '3px solid #3b82f6', borderBottomLeftRadius: 8 },
            { bottom: 12, right: 12, borderBottom: '3px solid #3b82f6', borderRight: '3px solid #3b82f6', borderBottomRightRadius: 8 },
          ].map((style, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: 28,
                height: 28,
                opacity: interpolate(
                  frame,
                  [SCAN_START - 5, SCAN_START],
                  [0, 0.8],
                  { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
                ),
                ...style,
              }}
            />
          ))}
        </div>

        {/* Green flash overlay */}
        {flashOpacity > 0 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: '#4ade80',
              opacity: flashOpacity,
              pointerEvents: 'none',
            }}
          />
        )}

        {/* Green checkmark */}
        {frame >= CHECK_START && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                opacity: checkOpacity,
                transform: `scale(${checkScale})`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                marginTop: 360,
              }}
            >
              {/* Circle background */}
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: '#4ade80',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow:
                    '0 0 30px rgba(74, 222, 128, 0.5), 0 0 60px rgba(74, 222, 128, 0.2)',
                }}
              >
                {/* Checkmark SVG */}
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#0d2818"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              {/* Label */}
              <div
                style={{
                  marginTop: 16,
                  fontSize: 18,
                  fontWeight: 700,
                  color: '#4ade80',
                  fontFamily: 'Inter, -apple-system, sans-serif',
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                }}
              >
                Scan Complete
              </div>
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
