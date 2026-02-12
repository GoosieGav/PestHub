import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
  staticFile,
  random,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';
import {
  IoScan,
  IoSparkles,
  IoLeaf,
  IoChevronForward,
  IoArrowForward,
  IoCheckmark,
} from 'react-icons/io5';
import { StatusBar } from '../components/StatusBar';

loadFont();

const C = {
  primary: '#4ade80',
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textMuted: 'rgba(255, 255, 255, 0.5)',
  glass: 'rgba(255, 255, 255, 0.08)',
  glassBorder: 'rgba(255, 255, 255, 0.15)',
  sliderBorder: 'rgba(74, 222, 128, 0.25)',
  logoBorder: 'rgba(74, 222, 128, 0.3)',
  pillBorder: 'rgba(255, 255, 255, 0.1)',
};

const SP = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

/* Phone design dimensions (scales 3x to 1170x2532) */
const PHONE_W = 390;
const PHONE_H = 844;

const FloatingLeaf: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const x = random(`lx-${index}`) * 90 + 5;
  const speed = random(`ls-${index}`) * 0.4 + 0.15;
  const baseY = random(`ly-${index}`) * 100;
  const y = (baseY + frame * speed) % 120;
  const opacity = y > 5 && y < 105 ? 0.5 : 0;
  const rot = (frame * 1.2 + index * 90) % 360;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        opacity,
        transform: `rotate(${rot}deg)`,
        zIndex: 1,
      }}
    >
      <IoLeaf size={20} color="rgba(74, 222, 128, 0.6)" />
    </div>
  );
};

interface MobileLandingDemoProps {
  slideStart?: number;
}

/**
 * Mobile Landing Page Demo Video
 *
 * slideStart controls when the slide-to-unlock animation begins (in frames).
 * Default 270 (9 seconds). The slide takes ~35 frames, then fades to white.
 */
export const MobileLandingDemo: React.FC<MobileLandingDemoProps> = ({
  slideStart: SLIDE_START_PROP = 270,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  /* ── Entrance animations (matching LandingScreenVideo) ── */
  const sp = (delay: number) =>
    spring({ frame: frame - delay, fps, config: { damping: 14, mass: 0.8 } });

  const logoScale = spring({
    frame,
    fps,
    config: { damping: 8, stiffness: 40 },
  });
  const fadeIn = interpolate(
    spring({ frame, fps, config: { damping: 12 } }),
    [0, 1],
    [0, 1],
    { extrapolateRight: 'clamp' },
  );

  const titleSlideY = interpolate(sp(18), [0, 1], [-25, 0], {
    extrapolateRight: 'clamp',
  });
  const titleOp = interpolate(sp(18), [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const heroSlideY = interpolate(sp(32), [0, 1], [40, 0], {
    extrapolateRight: 'clamp',
  });
  const heroOp = interpolate(sp(32), [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const pillOp = (i: number) =>
    interpolate(sp(44 + i * 6), [0, 1], [0, 1], {
      extrapolateRight: 'clamp',
    });
  const pillY = (i: number) =>
    interpolate(sp(44 + i * 6), [0, 1], [16, 0], {
      extrapolateRight: 'clamp',
    });

  const statsOp = interpolate(sp(52), [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const sliderOp = interpolate(sp(60), [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });

  /* ── Slide-to-unlock (starts at frame 150 = 5 seconds) ── */
  const THUMB = 60;
  // Content=342, slider=326, minus border=322, minus padding=312, minus thumb=252
  const THRESHOLD = 252;

  const SLIDE_START = SLIDE_START_PROP;
  const SLIDE_END = SLIDE_START + 35;
  const UNLOCKED_FRAME = SLIDE_START + 40;

  const thumbX = interpolate(frame, [SLIDE_START, SLIDE_END], [0, THRESHOLD], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const isUnlocked = frame >= UNLOCKED_FRAME;
  const sliderTextOp = interpolate(
    frame,
    [SLIDE_START, SLIDE_START + 20],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const thumbPulse =
    frame < SLIDE_START ? 1 + Math.sin(frame * 0.1) * 0.04 : 1;
  const arrowOp =
    frame < SLIDE_START
      ? 0.3 + Math.abs(Math.sin(frame * 0.13)) * 0.7
      : 0;

  /* ── White fade overlay after unlock ── */
  const whiteFade = interpolate(
    frame,
    [UNLOCKED_FRAME + 5, UNLOCKED_FRAME + 35],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#0d2818' }}>
      {/* 3x scale wrapper: designs at 390×844, renders at 1170×2532 */}
      <div
        style={{
          width: PHONE_W,
          height: PHONE_H,
          transform: 'scale(3)',
          transformOrigin: 'top left',
          position: 'relative',
          overflow: 'hidden',
          fontFamily: 'Inter, -apple-system, sans-serif',
          backgroundColor: '#0d2818',
        }}
      >
        {/* ── Background layers ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(10,31,18,0.6) 0%, rgba(10,31,18,0.8) 40%, rgba(10,31,18,0.95) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(135deg, #0d2818 0%, #1a472a 50%, #0a1f12 100%)',
            opacity: 0.85,
          }}
        />

        {/* Floating leaves */}
        {[0, 1, 2, 3].map((i) => (
          <FloatingLeaf key={i} index={i} />
        ))}

        {/* Glow top-right */}
        <div
          style={{
            position: 'absolute',
            top: -100,
            right: -100,
            width: 300,
            height: 300,
            borderRadius: 150,
            backgroundColor: 'rgba(74, 222, 128, 0.12)',
          }}
        />

        {/* Status bar */}
        <StatusBar />

        {/* ── Main content ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: `0 ${SP.lg}px 20px`,
            height: 'calc(100% - 54px)',
            boxSizing: 'border-box',
          }}
        >
          {/* ===== LOGO ===== */}
          <div
            style={{
              opacity: fadeIn,
              transform: `scale(${interpolate(logoScale, [0, 1], [0.5, 1], { extrapolateRight: 'clamp' })})`,
              width: 110,
              height: 110,
              borderRadius: 55,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              marginBottom: SP.md,
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 55,
                background:
                  'linear-gradient(135deg, rgba(74,222,128,0.4), rgba(74,222,128,0.1))',
              }}
            />
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: 45,
                overflow: 'hidden',
                border: `2px solid ${C.logoBorder}`,
                backgroundColor: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(20px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Img
                src={staticFile('logo.png')}
                style={{ width: 50, height: 50 }}
              />
            </div>
          </div>

          {/* ===== TITLE ===== */}
          <div
            style={{
              opacity: titleOp,
              transform: `translateY(${titleSlideY}px)`,
              textAlign: 'center',
              marginBottom: SP.lg,
            }}
          >
            <div
              style={{
                fontSize: 48,
                fontWeight: '700',
                color: C.textPrimary,
                letterSpacing: -1,
                lineHeight: 1.1,
              }}
            >
              PEST-Hub
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: SP.md,
                marginTop: SP.sm,
              }}
            >
              <div
                style={{
                  width: 24,
                  height: 1,
                  backgroundColor: 'rgba(74, 222, 128, 0.5)',
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  color: C.primary,
                  letterSpacing: 2.5,
                  textTransform: 'uppercase',
                  fontWeight: '400',
                }}
              >
                AI-Powered Protection
              </span>
              <div
                style={{
                  width: 24,
                  height: 1,
                  backgroundColor: 'rgba(74, 222, 128, 0.5)',
                }}
              />
            </div>
          </div>

          {/* ===== HERO ===== */}
          <div
            style={{
              opacity: heroOp,
              transform: `translateY(${heroSlideY}px)`,
              textAlign: 'center',
              marginBottom: SP.lg,
            }}
          >
            <div
              style={{
                fontSize: 32,
                fontWeight: '700',
                color: C.textPrimary,
                lineHeight: '40px',
              }}
            >
              Protect Your
              <br />
              <span style={{ color: C.primary }}>Crops</span> Instantly
            </div>
            <div
              style={{
                fontSize: 14,
                color: C.textSecondary,
                marginTop: SP.md,
                lineHeight: '22px',
              }}
            >
              Identify agricultural pests in seconds
              <br />
              using advanced AI technology
            </div>
          </div>

          {/* ===== FEATURE PILLS ===== */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: SP.sm,
              marginBottom: SP.xl,
            }}
          >
            {[
              { Icon: IoScan, text: 'Instant Scan', idx: 0 },
              { Icon: IoSparkles, text: 'AI Powered', idx: 1 },
              { Icon: IoLeaf, text: 'Eco Solutions', idx: 2 },
            ].map(({ Icon, text, idx }) => (
              <div
                key={text}
                style={{
                  opacity: pillOp(idx),
                  transform: `translateY(${pillY(idx)}px)`,
                  borderRadius: 20,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: 12,
                    paddingRight: 12,
                    paddingTop: 8,
                    paddingBottom: 8,
                    gap: 5,
                    border: `1px solid ${C.pillBorder}`,
                    borderRadius: 20,
                    backdropFilter: 'blur(20px)',
                    backgroundColor: 'rgba(255,255,255,0.04)',
                  }}
                >
                  <Icon size={16} color={C.primary} />
                  <span
                    style={{
                      fontSize: 11,
                      color: C.textPrimary,
                      fontWeight: '500',
                    }}
                  >
                    {text}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ===== STATS CARD ===== */}
          <div
            style={{
              width: '100%',
              opacity: statsOp,
              marginBottom: SP.xl,
              borderRadius: 20,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                border: `1px solid ${C.pillBorder}`,
                borderRadius: 20,
                backdropFilter: 'blur(25px)',
                backgroundColor: 'rgba(255,255,255,0.04)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingTop: SP.lg,
                  paddingBottom: SP.lg,
                  paddingLeft: SP.md,
                  paddingRight: SP.md,
                }}
              >
                {[
                  { value: '12+', label: 'Pest Types' },
                  { value: '95%', label: 'Accuracy' },
                  { value: '\u221E', label: 'Searches' },
                ].map((stat, i) => (
                  <React.Fragment key={stat.label}>
                    {i > 0 && (
                      <div
                        style={{
                          width: 1,
                          height: 36,
                          backgroundColor: 'rgba(255,255,255,0.1)',
                        }}
                      />
                    )}
                    <div style={{ textAlign: 'center', flex: 1 }}>
                      <div
                        style={{
                          fontSize: 26,
                          fontWeight: '700',
                          color: C.primary,
                        }}
                      >
                        {stat.value}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: C.textMuted,
                          marginTop: 4,
                        }}
                      >
                        {stat.label}
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Spacer */}
          <div style={{ flex: 1, minHeight: SP.lg }} />

          {/* ===== SLIDE TO UNLOCK ===== */}
          <div
            style={{
              width: `calc(100% - ${SP.sm * 2}px)`,
              opacity: sliderOp,
            }}
          >
            <div
              style={{
                borderRadius: 35,
                border: `2px solid ${C.sliderBorder}`,
                overflow: 'hidden',
                backdropFilter: 'blur(30px)',
              }}
            >
              <div
                style={{
                  height: 70,
                  borderRadius: 35,
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingLeft: 5,
                  paddingRight: 5,
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
                }}
              >
                {/* Progress fill */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    right: 0,
                    borderRadius: 35,
                    overflow: 'hidden',
                    transformOrigin: 'left',
                    transform: `scaleX(${thumbX / THRESHOLD})`,
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background:
                        'linear-gradient(90deg, rgba(74,222,128,0.5), rgba(74,222,128,0.2))',
                    }}
                  />
                </div>

                {/* Text + arrows */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 2,
                    opacity: sliderTextOp,
                  }}
                >
                  <IoChevronForward
                    size={18}
                    color="rgba(255,255,255,0.3)"
                    style={{ opacity: arrowOp }}
                  />
                  <IoChevronForward
                    size={18}
                    color="rgba(255,255,255,0.5)"
                    style={{ marginLeft: -10, opacity: arrowOp }}
                  />
                  <span
                    style={{
                      fontSize: 15,
                      color: 'rgba(255,255,255,0.6)',
                      fontWeight: '500',
                      marginLeft: SP.sm,
                      marginRight: SP.sm,
                    }}
                  >
                    Slide to explore
                  </span>
                  <IoChevronForward
                    size={18}
                    color="rgba(255,255,255,0.5)"
                    style={{ marginRight: -10, opacity: arrowOp }}
                  />
                  <IoChevronForward
                    size={18}
                    color="rgba(255,255,255,0.3)"
                    style={{ opacity: arrowOp }}
                  />
                </div>

                {/* Thumb */}
                <div
                  style={{
                    position: 'absolute',
                    left: 5 + thumbX,
                    width: THUMB,
                    height: THUMB,
                    borderRadius: THUMB / 2,
                    overflow: 'hidden',
                    transform: `scale(${isUnlocked ? 1.15 : thumbPulse})`,
                    boxShadow: '0 4px 10px rgba(74, 222, 128, 0.4)',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: isUnlocked
                        ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                        : 'linear-gradient(135deg, #4ade80, #22c55e)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isUnlocked ? (
                      <IoCheckmark size={26} color="#fff" />
                    ) : (
                      <IoArrowForward size={26} color="#fff" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skip text */}
          <div
            style={{
              opacity: sliderOp * sliderTextOp * 0.5,
              fontSize: 12,
              color: C.textMuted,
              paddingTop: SP.md,
              paddingBottom: SP.md,
              marginTop: SP.sm,
            }}
          >
            or tap to skip
          </div>
        </div>

        {/* ── WHITE FADE OVERLAY ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#ffffff',
            opacity: whiteFade,
            zIndex: 100,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
