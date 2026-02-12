import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Img,
  staticFile,
} from 'remotion';
import { loadFont } from '@remotion/google-fonts/Inter';
import {
  IoScan,
  IoCheckmarkCircle,
  IoArrowForward,
  IoCameraOutline,
  IoSunny,
  IoResize,
  IoEye,
  IoCamera,
} from 'react-icons/io5';
import { StatusBar } from '../components/StatusBar';
import { TabBar } from '../components/TabBar';

loadFont();

/* Exact colors from mobile/theme.js */
const C = {
  primary: '#4ade80',
  primaryDark: '#22c55e',
  success: '#4ade80', // theme.js: success: '#4ade80'
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textMuted: 'rgba(255, 255, 255, 0.5)',
  glass: 'rgba(255, 255, 255, 0.08)',
  glassBorder: 'rgba(255, 255, 255, 0.15)',
  danger: '#f87171',
};
const SP = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
/* Font sizes from theme.js */
const F = { h2: 28, h3: 22, h4: 18, body: 16, bodySmall: 14, caption: 12 };

/* GlassCard matching ClassifyScreen.js */
const GlassCard: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <div
    style={{
      borderRadius: 24,
      overflow: 'hidden',
      border: `1px solid ${C.glassBorder}`,
      backdropFilter: 'blur(20px)',
      ...style,
    }}
  >
    <div
      style={{
        padding: SP.lg,
        background:
          'linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))',
      }}
    >
      {children}
    </div>
  </div>
);

interface Props {
  scannerStartFrame?: number;
  resultStartFrame?: number;
}

export const ClassifyResultsVideo: React.FC<Props> = ({
  scannerStartFrame = 0,
  resultStartFrame = 60,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animation (matches 600ms fade + slide)
  const entranceP = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });
  const mainOp = interpolate(entranceP, [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const mainSlide = interpolate(entranceP, [0, 1], [25, 0], {
    extrapolateRight: 'clamp',
  });

  // Scanner line
  const scannerActive = frame >= scannerStartFrame && frame < resultStartFrame;
  const scannerY = scannerActive
    ? ((frame - scannerStartFrame) % 60) / 60 * 260
    : 0;

  // Result entrance
  const rp = spring({
    frame: frame - resultStartFrame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });
  const resultOp = interpolate(rp, [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const resultY = interpolate(rp, [0, 1], [50, 0], {
    extrapolateRight: 'clamp',
  });

  // Button glow
  const glow =
    frame > resultStartFrame + 25
      ? 8 + Math.sin((frame - resultStartFrame) * 0.1) * 8
      : 0;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Inter, -apple-system, sans-serif',
        /* GRADIENTS.primary: ['#0d2818', '#1a472a', '#0d2818'] */
        background: 'linear-gradient(135deg, #0d2818 0%, #1a472a 50%, #0d2818 100%)',
      }}
    >
      {/* Glow effects matching ClassifyScreen.js */}
      <div
        style={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: 150,
          backgroundColor: 'rgba(74, 222, 128, 0.1)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 100,
          left: -100,
          width: 250,
          height: 250,
          borderRadius: 125,
          backgroundColor: 'rgba(96, 165, 250, 0.08)',
        }}
      />

      <StatusBar />

      <div
        style={{
          padding: `0 ${SP.lg}px 90px`,
          height: 'calc(100% - 54px)',
          boxSizing: 'border-box',
          overflow: 'hidden',
          opacity: mainOp,
          transform: `translateY(${mainSlide}px)`,
        }}
      >
        {/* Header: icon 64px circle + title + subtitle */}
        <div style={{ textAlign: 'center', marginBottom: SP.xl }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: 'rgba(74, 222, 128, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              marginBottom: SP.md,
            }}
          >
            <IoScan size={32} color={C.primary} />
          </div>
          <div style={{ fontSize: F.h2, fontWeight: '700', color: C.textPrimary }}>
            AI Pest Detection
          </div>
          <div
            style={{
              fontSize: F.bodySmall,
              color: C.textSecondary,
              marginTop: SP.sm,
              lineHeight: '22px',
            }}
          >
            Identify pests instantly using advanced AI technology
          </div>
        </div>

        {/* Tips row */}
        <div style={{ marginBottom: SP.xl }}>
          <div
            style={{
              fontSize: F.bodySmall,
              fontWeight: '600',
              color: C.textSecondary,
              marginBottom: SP.md,
            }}
          >
            Tips for Best Results
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: SP.sm }}>
            {[
              { Icon: IoSunny, text: 'Good lighting' },
              { Icon: IoResize, text: 'Close-up shot' },
              { Icon: IoEye, text: 'Clear focus' },
              { Icon: IoCamera, text: 'Steady hand' },
            ].map(({ Icon, text }) => (
              <div
                key={text}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(74, 222, 128, 0.1)',
                  paddingLeft: 14,
                  paddingRight: 14,
                  paddingTop: 10,
                  paddingBottom: 10,
                  borderRadius: 20,
                  gap: SP.xs,
                  border: '1px solid rgba(74, 222, 128, 0.2)',
                }}
              >
                <Icon size={18} color={C.primary} style={{ opacity: 0.9 }} />
                <span
                  style={{
                    fontSize: F.caption,
                    color: C.primary,
                    fontWeight: '500',
                  }}
                >
                  {text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Image card: borderRadius 28 */}
        <GlassCard style={{ borderRadius: 28, marginBottom: SP.xl }}>
          {/* imageWrapper: borderRadius 20 */}
          <div
            style={{
              position: 'relative',
              borderRadius: 20,
              overflow: 'hidden',
            }}
          >
            <Img
              src={staticFile('pests/ants.jpg')}
              style={{
                width: '100%',
                height: 280,
                objectFit: 'cover',
                display: 'block',
                borderRadius: 20,
              }}
            />

            {/* Scanner line: height 3 */}
            {scannerActive && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: scannerY,
                  height: 3,
                  background:
                    'linear-gradient(90deg, transparent, #4ade80, transparent)',
                }}
              />
            )}

            {/* Corner decorations: 24x24, border 3px, radius 8 */}
            <div style={{ position: 'absolute', top: 12, left: 12, width: 24, height: 24, borderTop: `3px solid ${C.primary}`, borderLeft: `3px solid ${C.primary}`, borderTopLeftRadius: 8 }} />
            <div style={{ position: 'absolute', top: 12, right: 12, width: 24, height: 24, borderTop: `3px solid ${C.primary}`, borderRight: `3px solid ${C.primary}`, borderTopRightRadius: 8 }} />
            <div style={{ position: 'absolute', bottom: 12, left: 12, width: 24, height: 24, borderBottom: `3px solid ${C.primary}`, borderLeft: `3px solid ${C.primary}`, borderBottomLeftRadius: 8 }} />
            <div style={{ position: 'absolute', bottom: 12, right: 12, width: 24, height: 24, borderBottom: `3px solid ${C.primary}`, borderRight: `3px solid ${C.primary}`, borderBottomRightRadius: 8 }} />
          </div>
        </GlassCard>

        {/* Result card: borderRadius 28 */}
        <div
          style={{
            opacity: resultOp,
            transform: `translateY(${resultY}px)`,
          }}
        >
          <GlassCard style={{ borderRadius: 28 }}>
            {/* resultHeader */}
            <div style={{ textAlign: 'center', marginBottom: SP.lg }}>
              <IoCheckmarkCircle size={48} color={C.success} />
              <div
                style={{
                  fontSize: F.h3,
                  fontWeight: '700',
                  color: C.textPrimary,
                  marginTop: SP.sm,
                }}
              >
                Pest Detected!
              </div>
            </div>

            {/* resultContent: bg rgba(0,0,0,0.2), borderRadius 16, padding 24 */}
            <div
              style={{
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: 16,
                padding: SP.lg,
                marginBottom: SP.lg,
              }}
            >
              {/* Pest Name row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: SP.md,
                  paddingBottom: SP.md,
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <span style={{ fontSize: F.bodySmall, color: C.textSecondary }}>
                  Pest Name
                </span>
                <span
                  style={{
                    fontSize: F.body,
                    fontWeight: '600',
                    color: C.textPrimary,
                  }}
                >
                  Ants
                </span>
              </div>

              {/* Confidence row */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: SP.md,
                  paddingBottom: SP.md,
                  borderBottom: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <span style={{ fontSize: F.bodySmall, color: C.textSecondary }}>
                  Confidence
                </span>
                <div
                  style={{
                    backgroundColor: 'rgba(74, 222, 128, 0.2)',
                    paddingLeft: 12,
                    paddingRight: 12,
                    paddingTop: 6,
                    paddingBottom: 6,
                    borderRadius: 8,
                  }}
                >
                  <span
                    style={{
                      fontSize: F.bodySmall,
                      fontWeight: '600',
                      color: C.primary,
                    }}
                  >
                    100.00%
                  </span>
                </div>
              </div>

              {/* Message */}
              <div
                style={{
                  fontSize: F.bodySmall,
                  fontWeight: '500',
                  color: C.primary,
                  textAlign: 'center',
                  marginTop: SP.md,
                }}
              >
                PEST DETECTED!
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: SP.md }}>
              {/* View Full Information: borderRadius 16, gradient button */}
              <div
                style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  background: 'linear-gradient(90deg, #22c55e, #16a34a)',
                  padding: '16px 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: SP.sm,
                  boxShadow: `0 0 ${glow}px rgba(74, 222, 128, 0.5)`,
                }}
              >
                <span style={{ fontSize: F.body, fontWeight: '600', color: '#fff' }}>
                  View Full Information
                </span>
                <IoArrowForward size={20} color="#fff" />
              </div>

              {/* Scan Another */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: SP.sm,
                  paddingTop: 14,
                  paddingBottom: 14,
                }}
              >
                <IoCameraOutline size={20} color={C.primary} />
                <span style={{ fontSize: F.body, fontWeight: '600', color: C.primary }}>
                  Scan Another
                </span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <TabBar activeTab="classify" />
    </div>
  );
};
