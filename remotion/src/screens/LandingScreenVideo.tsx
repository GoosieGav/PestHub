import React from 'react';
import {
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

/*
 * Exact values from mobile/theme.js and mobile/screens/LandingScreen.js
 */
const C = {
  primary: '#4ade80',
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textMuted: 'rgba(255, 255, 255, 0.5)',
  glass: 'rgba(255, 255, 255, 0.08)',
  glassBorder: 'rgba(255, 255, 255, 0.15)',
  // slider specific
  sliderBorder: 'rgba(74, 222, 128, 0.25)',
  logoBorder: 'rgba(74, 222, 128, 0.3)',
  pillBorder: 'rgba(255, 255, 255, 0.1)',
};

/* SPACING from theme.js */
const SP = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };

/* Floating leaf - matches FloatingLeaf component using Ionicons leaf */
const FloatingLeaf: React.FC<{ index: number }> = ({ index }) => {
  const frame = useCurrentFrame();
  const x = random(`lx-${index}`) * 90 + 5; // 5-95%
  const speed = random(`ls-${index}`) * 0.4 + 0.15;
  const baseY = random(`ly-${index}`) * 100;
  const y = (baseY + frame * speed) % 120;
  const opacity = y > 5 && y < 105 ? 0.5 : 0;
  const rot = ((frame * 1.2 + index * 90) % 360);

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

interface LandingScreenVideoProps {
  startFrame?: number;
}

export const LandingScreenVideo: React.FC<LandingScreenVideoProps> = ({
  startFrame = 0,
}) => {
  const rawFrame = useCurrentFrame();
  const frame = rawFrame - startFrame;
  const { fps } = useVideoConfig();

  /* Entrance helpers matching the real app's staggered sequence:
     Logo + fade (800ms) → title slide (500ms) → hero slide (600ms)
     At 30fps: logo ~24f, title starts ~24f, hero starts ~39f */
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
    { extrapolateRight: 'clamp' }
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

  // Feature pills cascade - delays 800/1000/1200ms ≈ 24/30/36 frames
  const pillOp = (i: number) =>
    interpolate(sp(44 + i * 6), [0, 1], [0, 1], { extrapolateRight: 'clamp' });
  const pillY = (i: number) =>
    interpolate(sp(44 + i * 6), [0, 1], [16, 0], { extrapolateRight: 'clamp' });

  const statsOp = interpolate(sp(52), [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const sliderOp = interpolate(sp(60), [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Slide-to-unlock: THUMB_SIZE=60, SLIDER_WIDTH ≈ 375-80=295, threshold = 295-60-16=219
  const THUMB = 60;
  const TRACK_W = 295; // approximate slider width inside padding
  const THRESHOLD = TRACK_W - THUMB - 16;

  const thumbX = interpolate(frame, [115, 158], [0, THRESHOLD], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const isUnlocked = frame >= 163;
  const sliderTextOp = interpolate(frame, [115, 135], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const thumbPulse = frame < 115 ? 1 + Math.sin(frame * 0.1) * 0.04 : 1;

  // Arrow chevron pulse
  const arrowOp =
    frame < 115
      ? 0.3 + Math.abs(Math.sin(frame * 0.13)) * 0.7
      : 0;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Inter, -apple-system, sans-serif',
        backgroundColor: '#0d2818',
      }}
    >
      {/* Background: matches ImageBackground with dark gradient overlay */}
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

      {/* Floating leaves (4 like the real app) */}
      {[0, 1, 2, 3].map((i) => (
        <FloatingLeaf key={i} index={i} />
      ))}

      {/* Glow top-right: 300x300 circle, top:-100, right:-100 */}
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

      {/* Content: paddingHorizontal=24 (SPACING.lg), paddingTop=30 after status */}
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
        {/* ===== LOGO SECTION ===== */}
        {/* logoContainer: 110x110, borderRadius 55 */}
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
            marginBottom: SP.md, // 16
          }}
        >
          {/* logoGlow gradient behind */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 55,
              background:
                'linear-gradient(135deg, rgba(74,222,128,0.4), rgba(74,222,128,0.1))',
            }}
          />
          {/* logoBlur: 90x90, borderRadius 45, border 2px green */}
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
            {/* logoImage: 50x50 - THE ACTUAL GREEN LEAF LOGO */}
            <Img
              src={staticFile('logo.png')}
              style={{ width: 50, height: 50 }}
            />
          </div>
        </div>

        {/* ===== TITLE SECTION ===== */}
        <div
          style={{
            opacity: titleOp,
            transform: `translateY(${titleSlideY}px)`,
            textAlign: 'center',
            marginBottom: SP.lg, // 24
          }}
        >
          {/* appName: fontSize 48, bold, white, letterSpacing -1 */}
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
          {/* taglineContainer: row, marginTop 8, gap 16 */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: SP.md, // 16
              marginTop: SP.sm, // 8
            }}
          >
            {/* taglineLine: 24x1 */}
            <div
              style={{
                width: 24,
                height: 1,
                backgroundColor: 'rgba(74, 222, 128, 0.5)',
              }}
            />
            {/* tagline: 11px, #4ade80, letterSpacing 2.5, uppercase */}
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

        {/* ===== HERO SECTION ===== */}
        <div
          style={{
            opacity: heroOp,
            transform: `translateY(${heroSlideY}px)`,
            textAlign: 'center',
            marginBottom: SP.lg, // 24
          }}
        >
          {/* heroTitle: 32px bold, white, lineHeight 40 */}
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
            {/* heroHighlight: #4ade80 */}
            <span style={{ color: C.primary }}>Crops</span> Instantly
          </div>
          {/* heroDescription: 14px, secondary, marginTop 16, lineHeight 22 */}
          <div
            style={{
              fontSize: 14,
              color: C.textSecondary,
              marginTop: SP.md, // 16
              lineHeight: '22px',
            }}
          >
            Identify agricultural pests in seconds
            <br />
            using advanced AI technology
          </div>
        </div>

        {/* ===== FEATURE PILLS ===== */}
        {/* gap 8 (SP.sm), marginBottom 32 (SP.xl) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: SP.sm, // 8
            marginBottom: SP.xl, // 32
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
              {/* featurePillBlur: row, px 12, py 8, gap 5, border 1px */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: 12,
                  paddingRight: 12,
                  paddingTop: 8,
                  paddingBottom: 8,
                  gap: 5,
                  borderWidth: 1,
                  border: `1px solid ${C.pillBorder}`,
                  borderRadius: 20,
                  backdropFilter: 'blur(20px)',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                }}
              >
                {/* icon: size 16, color #4ade80 */}
                <Icon size={16} color={C.primary} />
                {/* text: 11px, white, fontWeight 500 */}
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
        {/* marginBottom 32 (SP.xl), borderRadius 20 */}
        <div
          style={{
            width: '100%',
            opacity: statsOp,
            marginBottom: SP.xl, // 32
            borderRadius: 20,
            overflow: 'hidden',
          }}
        >
          {/* statsBlur: border 1px, borderRadius 20 */}
          <div
            style={{
              border: `1px solid ${C.pillBorder}`,
              borderRadius: 20,
              backdropFilter: 'blur(25px)',
              backgroundColor: 'rgba(255,255,255,0.04)',
            }}
          >
            {/* statsRow: row, center, py 24, px 16 */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                paddingTop: SP.lg, // 24
                paddingBottom: SP.lg,
                paddingLeft: SP.md, // 16
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
                    /* statDivider: 1px wide, 36px tall */
                    <div
                      style={{
                        width: 1,
                        height: 36,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                      }}
                    />
                  )}
                  <div style={{ textAlign: 'center', flex: 1 }}>
                    {/* statValue: 26px bold, #4ade80 */}
                    <div
                      style={{
                        fontSize: 26,
                        fontWeight: '700',
                        color: C.primary,
                      }}
                    >
                      {stat.value}
                    </div>
                    {/* statLabel: 10px, muted, marginTop 4 */}
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

        {/* Spacer - flex 1, minHeight 24 */}
        <div style={{ flex: 1, minHeight: SP.lg }} />

        {/* ===== SLIDE TO UNLOCK ===== */}
        {/* marginHorizontal 8 (SP.sm) */}
        <div
          style={{
            width: `calc(100% - ${SP.sm * 2}px)`,
            opacity: sliderOp,
          }}
        >
          {/* sliderBlur: borderRadius 35, border 2px green */}
          <div
            style={{
              borderRadius: 35,
              border: `2px solid ${C.sliderBorder}`,
              overflow: 'hidden',
              backdropFilter: 'blur(30px)',
            }}
          >
            {/* sliderTrack: height 70, borderRadius 35, paddingHorizontal 5 */}
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
              {/* progressFill */}
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

              {/* slideTextContainer with arrows */}
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
                {/* slideText: 15px, rgba(255,255,255,0.6), 500 */}
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

              {/* Thumb: THUMB_SIZE=60, left 5 */}
              <div
                style={{
                  position: 'absolute',
                  left: 5 + thumbX,
                  width: THUMB,
                  height: THUMB,
                  borderRadius: THUMB / 2,
                  overflow: 'hidden',
                  transform: `scale(${isUnlocked ? 1.15 : thumbPulse})`,
                  boxShadow: `0 4px 10px rgba(74, 222, 128, 0.4)`,
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

        {/* Skip: fontSize 12, muted, paddingVertical 16, marginTop 8 */}
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
    </div>
  );
};
