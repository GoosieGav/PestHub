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
import { loadFont } from '@remotion/google-fonts/Inter';
import {
  IoScan,
  IoCheckmarkCircle,
  IoSunny,
  IoResize,
  IoEye,
  IoCamera,
  IoChevronBack,
  IoWarning,
  IoPricetag,
  IoInformationCircle,
} from 'react-icons/io5';
import { StatusBar } from '../components/StatusBar';
import { TabBar } from '../components/TabBar';

loadFont();

const C = {
  primary: '#4ade80',
  primaryDark: '#22c55e',
  success: '#4ade80',
  textPrimary: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textMuted: 'rgba(255, 255, 255, 0.5)',
  glass: 'rgba(255, 255, 255, 0.08)',
  glassBorder: 'rgba(255, 255, 255, 0.15)',
  danger: '#f87171',
  threatMedium: '#f97316',
};
const SP = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
const F = { h2: 28, h3: 22, h4: 18, body: 16, bodySmall: 14, caption: 12 };

/* iPhone 15 Pro logical dimensions */
const PHONE_W = 393;
const PHONE_H = 852;

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

/* ─── CLASSIFY SCREEN (uses tuffants.jpeg for scanning image) ─── */
const ClassifyScreen: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const SCANNER_START = 25;
  const RESULT_START = 85;

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

  const scannerActive = frame >= SCANNER_START && frame < RESULT_START;
  const scannerY = scannerActive
    ? (((frame - SCANNER_START) % 60) / 60) * 260
    : 0;

  const rp = spring({
    frame: frame - RESULT_START,
    fps,
    config: { damping: 14, mass: 0.8 },
  });
  const resultOp = interpolate(rp, [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Inter, -apple-system, sans-serif',
        background:
          'linear-gradient(135deg, #0d2818 0%, #1a472a 50%, #0d2818 100%)',
      }}
    >
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
          position: 'relative',
          zIndex: 2,
          opacity: mainOp,
          transform: `translateY(${mainSlide}px)`,
        }}
      >
        {/* Header */}
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
          <div
            style={{
              fontSize: F.h2,
              fontWeight: '700',
              color: C.textPrimary,
            }}
          >
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

        {/* Image card - uses tuffants.jpeg */}
        <GlassCard style={{ borderRadius: 28, marginBottom: SP.xl }}>
          <div
            style={{
              position: 'relative',
              borderRadius: 20,
              overflow: 'hidden',
            }}
          >
            <Img
              src={staticFile('tuffants.jpeg')}
              style={{
                width: '100%',
                height: 280,
                objectFit: 'cover',
                display: 'block',
                borderRadius: 20,
              }}
            />

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

            {/* Corner decorations */}
            <div
              style={{
                position: 'absolute',
                top: 12,
                left: 12,
                width: 24,
                height: 24,
                borderTop: `3px solid ${C.primary}`,
                borderLeft: `3px solid ${C.primary}`,
                borderTopLeftRadius: 8,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 12,
                right: 12,
                width: 24,
                height: 24,
                borderTop: `3px solid ${C.primary}`,
                borderRight: `3px solid ${C.primary}`,
                borderTopRightRadius: 8,
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 12,
                left: 12,
                width: 24,
                height: 24,
                borderBottom: `3px solid ${C.primary}`,
                borderLeft: `3px solid ${C.primary}`,
                borderBottomLeftRadius: 8,
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                width: 24,
                height: 24,
                borderBottom: `3px solid ${C.primary}`,
                borderRight: `3px solid ${C.primary}`,
                borderBottomRightRadius: 8,
              }}
            />
          </div>
        </GlassCard>

      </div>

      {/* Standalone checkmark overlay */}
      {frame >= RESULT_START && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            paddingBottom: 20,
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              opacity: resultOp,
              transform: `scale(${interpolate(rp, [0, 1], [0.3, 1], { extrapolateRight: 'clamp' })})`,
            }}
          >
            <IoCheckmarkCircle size={56} color={C.success} />
          </div>
        </div>
      )}

      <TabBar activeTab="classify" />
    </div>
  );
};

/* ─── PEST DETAIL SCREEN (uses pests/ants.jpg for hero image) ─── */
const PestDetailScreen: React.FC<{ frame: number; fps: number }> = ({
  frame,
  fps,
}) => {
  const appear = (delay: number) => {
    const p = spring({
      frame: frame - delay,
      fps,
      config: { damping: 14, mass: 0.8 },
    });
    return {
      opacity: interpolate(p, [0, 1], [0, 1], { extrapolateRight: 'clamp' }),
      translateY: interpolate(p, [0, 1], [25, 0], {
        extrapolateRight: 'clamp',
      }),
    };
  };

  const hero = appear(0);
  const info = appear(12);
  const badges = appear(20);
  const desc = appear(30);
  const symptoms = appear(42);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'Inter, -apple-system, sans-serif',
        background:
          'linear-gradient(135deg, #0d2818 0%, #1a472a 50%, #0a1f12 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: -40,
          right: -40,
          width: 160,
          height: 160,
          borderRadius: '50%',
          backgroundColor: 'rgba(74, 222, 128, 0.12)',
        }}
      />

      <StatusBar />

      {/* Back button */}
      <div
        style={{
          position: 'absolute',
          top: 56,
          left: 20,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          padding: '7px 12px',
          borderRadius: 16,
          backgroundColor: 'rgba(255,255,255,0.08)',
          border: `1px solid ${C.glassBorder}`,
          backdropFilter: 'blur(10px)',
        }}
      >
        <IoChevronBack size={18} color={C.textPrimary} />
        <span
          style={{ fontSize: 13, color: C.textPrimary, fontWeight: '500' }}
        >
          Back
        </span>
      </div>

      {/* Content (no scroll) */}
      <div
        style={{
          padding: '0 20px',
          paddingTop: 54,
          height: 'calc(100% - 54px)',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {/* Hero Image - pests/ants.jpg */}
        <div
          style={{
            opacity: hero.opacity,
            transform: `translateY(${hero.translateY}px)`,
            height: 220,
            borderRadius: 22,
            overflow: 'hidden',
            position: 'relative',
            marginBottom: 0,
          }}
        >
          <Img
            src={staticFile('pests/ants.jpg')}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to bottom, transparent 40%, rgba(13, 40, 24, 0.8) 100%)',
            }}
          />
        </div>

        {/* Pest name */}
        <div
          style={{
            opacity: info.opacity,
            transform: `translateY(${info.translateY}px)`,
            textAlign: 'center',
            marginTop: -50,
            position: 'relative',
            zIndex: 2,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              fontSize: 32,
              fontWeight: '700',
              color: C.textPrimary,
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}
          >
            Ants
          </div>
          <div
            style={{
              fontSize: 13,
              fontStyle: 'italic',
              color: C.textSecondary,
              marginTop: 2,
            }}
          >
            Formicidae
          </div>
        </div>

        {/* Badges */}
        <div
          style={{
            opacity: badges.opacity,
            transform: `translateY(${badges.translateY}px)`,
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              backgroundColor: C.threatMedium,
              padding: '6px 12px',
              borderRadius: 10,
            }}
          >
            <IoWarning size={14} color="#fff" />
            <span
              style={{ fontSize: 10, fontWeight: '600', color: '#fff' }}
            >
              Medium Threat
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              backgroundColor: 'rgba(74, 222, 128, 0.15)',
              border: '1px solid rgba(74, 222, 128, 0.3)',
              padding: '6px 12px',
              borderRadius: 10,
            }}
          >
            <IoPricetag size={14} color={C.primary} />
            <span
              style={{
                fontSize: 10,
                fontWeight: '600',
                color: C.primary,
              }}
            >
              Crawling Pest
            </span>
          </div>
        </div>

        {/* Description */}
        <div
          style={{
            opacity: desc.opacity,
            transform: `translateY(${desc.translateY}px)`,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: 'rgba(74, 222, 128, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IoInformationCircle size={18} color={C.primary} />
            </div>
            <span
              style={{
                fontSize: 15,
                fontWeight: '700',
                color: C.textPrimary,
              }}
            >
              Description
            </span>
          </div>
          <div
            style={{
              backgroundColor: C.glass,
              border: `1px solid ${C.glassBorder}`,
              borderRadius: 16,
              padding: 16,
              backdropFilter: 'blur(10px)',
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: C.textSecondary,
                lineHeight: 1.7,
              }}
            >
              Ants are social insects that live in colonies. Some species can
              damage plants by farming aphids or directly feeding on plant
              matter. They create underground tunnels that can disturb root
              systems and protect harmful aphid populations.
            </div>
          </div>
        </div>

        {/* Damage Symptoms */}
        <div
          style={{
            opacity: symptoms.opacity,
            transform: `translateY(${symptoms.translateY}px)`,
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: 'rgba(248, 113, 113, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IoWarning size={18} color={C.danger} />
            </div>
            <span
              style={{
                fontSize: 15,
                fontWeight: '700',
                color: C.textPrimary,
              }}
            >
              Damage Symptoms
            </span>
          </div>
          <div
            style={{
              backgroundColor: C.glass,
              border: `1px solid ${C.glassBorder}`,
              borderRadius: 16,
              padding: 16,
              backdropFilter: 'blur(10px)',
            }}
          >
            {[
              'Visible ant trails on plants and soil',
              'Aphid colonies protected by ants on leaves',
              'Small mounds of displaced soil near plant bases',
              'Wilting or yellowing from root disturbance',
              'Honeydew deposits causing sooty mold on leaves',
              'Seed dispersal and germination disruption',
              'Structural damage to wooden garden beds',
              'Weakened stems from tunneling at plant base',
            ].map((symptom, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  marginBottom: i < 7 ? 10 : 0,
                }}
              >
                <div
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: 3,
                    marginTop: 5,
                    flexShrink: 0,
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    color: C.textSecondary,
                    lineHeight: 1.6,
                  }}
                >
                  {symptom}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Solution Demo — iPhone 15 Pro dimensions, no phone frame
 *
 * Timeline (270 frames = 9s at 30fps):
 *   0-25     Classify screen entrance
 *   25-85    Scanner sweeps across tuffants.jpeg
 *   85-130   Checkmark appears (standalone overlay)
 *   130-160  Hold result
 *   160-190  Cross-dissolve → pest detail
 *   190-230  Pest detail animates in
 *   230-380  Hold final state (~5s)
 */
export const SolutionDemoMobile: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const DISSOLVE_START = 190;
  const DISSOLVE_END = 220;

  const classifyOpacity = interpolate(
    frame,
    [DISSOLVE_START, DISSOLVE_END],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const detailOpacity = interpolate(
    frame,
    [DISSOLVE_START, DISSOLVE_END],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  const detailInternalFrame = Math.max(0, frame - (DISSOLVE_START + 5));

  return (
    <AbsoluteFill style={{ backgroundColor: '#0d2818' }}>
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
        {/* Classify screen */}
        <div style={{ position: 'absolute', inset: 0, opacity: classifyOpacity }}>
          <ClassifyScreen frame={frame} fps={fps} />
        </div>

        {/* Pest detail screen */}
        <div style={{ position: 'absolute', inset: 0, opacity: detailOpacity }}>
          <PestDetailScreen frame={detailInternalFrame} fps={fps} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
