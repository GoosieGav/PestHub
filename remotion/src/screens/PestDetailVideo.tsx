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
  IoChevronBack,
  IoWarning,
  IoPricetag,
  IoInformationCircle,
} from 'react-icons/io5';
import { StatusBar } from '../components/StatusBar';

loadFont();

const COLORS = {
  primary: '#4ade80',
  textWhite: '#ffffff',
  textSecondary: 'rgba(255,255,255,0.7)',
  textMuted: 'rgba(255,255,255,0.5)',
  glass: 'rgba(255,255,255,0.08)',
  glassBorder: 'rgba(255,255,255,0.15)',
  danger: '#f87171',
  threatMedium: '#f97316',
};

interface PestDetailVideoProps {
  startFrame?: number;
}

export const PestDetailVideo: React.FC<PestDetailVideoProps> = ({
  startFrame = 0,
}) => {
  const frame = useCurrentFrame() - startFrame;
  const { fps } = useVideoConfig();

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

  // Scroll simulation: gently translate content up over time
  const scrollY = interpolate(frame, [50, 120], [0, -40], {
    extrapolateLeft: 'clamp',
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
          'linear-gradient(135deg, #0d2818 0%, #1a472a 50%, #0a1f12 100%)',
      }}
    >
      {/* Glow effects */}
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
          border: `1px solid ${COLORS.glassBorder}`,
          backdropFilter: 'blur(10px)',
        }}
      >
        <IoChevronBack size={18} color={COLORS.textWhite} />
        <span
          style={{ fontSize: 13, color: COLORS.textWhite, fontWeight: '500' }}
        >
          Back
        </span>
      </div>

      {/* Scrollable content */}
      <div
        style={{
          padding: '0 20px',
          paddingTop: 54,
          height: 'calc(100% - 54px)',
          boxSizing: 'border-box',
          overflow: 'hidden',
          transform: `translateY(${scrollY}px)`,
        }}
      >
        {/* Hero Image */}
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

        {/* Pest name overlapping image */}
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
              color: COLORS.textWhite,
              textShadow: '0 2px 8px rgba(0,0,0,0.5)',
            }}
          >
            Ants
          </div>
          <div
            style={{
              fontSize: 13,
              fontStyle: 'italic',
              color: COLORS.textSecondary,
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
              backgroundColor: COLORS.threatMedium,
              padding: '6px 12px',
              borderRadius: 10,
            }}
          >
            <IoWarning size={14} color="#fff" />
            <span style={{ fontSize: 10, fontWeight: '600', color: '#fff' }}>
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
            <IoPricetag size={14} color={COLORS.primary} />
            <span
              style={{
                fontSize: 10,
                fontWeight: '600',
                color: COLORS.primary,
              }}
            >
              Crawling Pest
            </span>
          </div>
        </div>

        {/* Description section */}
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
              <IoInformationCircle size={18} color={COLORS.primary} />
            </div>
            <span
              style={{
                fontSize: 15,
                fontWeight: '700',
                color: COLORS.textWhite,
              }}
            >
              Description
            </span>
          </div>
          <div
            style={{
              backgroundColor: COLORS.glass,
              border: `1px solid ${COLORS.glassBorder}`,
              borderRadius: 16,
              padding: 16,
              backdropFilter: 'blur(10px)',
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: COLORS.textSecondary,
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

        {/* Damage Symptoms section */}
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
              <IoWarning size={18} color={COLORS.danger} />
            </div>
            <span
              style={{
                fontSize: 15,
                fontWeight: '700',
                color: COLORS.textWhite,
              }}
            >
              Damage Symptoms
            </span>
          </div>
          <div
            style={{
              backgroundColor: COLORS.glass,
              border: `1px solid ${COLORS.glassBorder}`,
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
            ].map((symptom, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  marginBottom: i < 3 ? 10 : 0,
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
                    color: COLORS.textSecondary,
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
