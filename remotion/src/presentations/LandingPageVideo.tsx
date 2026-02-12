import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { PhoneFrame } from '../components/PhoneFrame';
import { LandingScreenVideo } from '../screens/LandingScreenVideo';

/**
 * DECA Presentation — Title Slide Video
 *
 * Timeline (240 frames = 8s at 30fps):
 *  0-60   Phone rises from below viewport to center
 *  30-90  Landing screen content animates in
 *  90-120 Hold — everything visible
 *  120-170 Slide-to-unlock thumb animates across
 *  170-180 Checkmark appears
 *  180-240 Hold
 */
export const LandingPageVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phone rise animation
  const riseProgress = spring({
    frame,
    fps,
    config: { damping: 18, mass: 1.2, stiffness: 80 },
  });

  // Phone starts 500px below center, rises to center
  const phoneY = interpolate(riseProgress, [0, 1], [550, 0], {
    extrapolateRight: 'clamp',
  });

  // Landing screen internal animations start after phone has mostly risen
  const screenStartFrame = 25;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          transform: `translateY(${phoneY}px)`,
        }}
      >
        <PhoneFrame scale={1.15}>
          <LandingScreenVideo startFrame={screenStartFrame} />
        </PhoneFrame>
      </div>
    </AbsoluteFill>
  );
};
