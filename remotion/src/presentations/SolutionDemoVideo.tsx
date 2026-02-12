import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from 'remotion';
import { PhoneFrame } from '../components/PhoneFrame';
import { ClassifyResultsVideo } from '../screens/ClassifyResultsVideo';
import { PestDetailVideo } from '../screens/PestDetailVideo';

/**
 * DECA Presentation — Solution Demo Video
 *
 * Timeline (300 frames = 10s at 30fps):
 *  0-30    Phone fades in showing classify screen with ant image
 *  30-90   Scanner line sweeps across image
 *  90-130  Result card slides in
 *  130-160 Hold result
 *  160-190 Cross-dissolve: classify → pest detail
 *  190-250 Pest detail content animates in
 *  250-300 Hold pest detail
 */
export const SolutionDemoVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phone entrance
  const entranceProgress = spring({
    frame,
    fps,
    config: { damping: 16, mass: 0.8 },
  });
  const phoneOpacity = interpolate(entranceProgress, [0, 1], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const phoneScale = interpolate(entranceProgress, [0, 1], [0.92, 1], {
    extrapolateRight: 'clamp',
  });

  // Cross-dissolve between classify and pest detail
  const DISSOLVE_START = 155;
  const DISSOLVE_END = 185;

  const classifyOpacity = interpolate(
    frame,
    [DISSOLVE_START, DISSOLVE_END],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  const detailOpacity = interpolate(
    frame,
    [DISSOLVE_START, DISSOLVE_END],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  // Pest detail internal animations start when dissolve begins
  const DETAIL_ANIM_START = DISSOLVE_START + 5;

  return (
    <AbsoluteFill
      style={{
        background:
          'linear-gradient(135deg, #0d2818 0%, #1a472a 50%, #0a1f12 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '20%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          backgroundColor: 'rgba(74, 222, 128, 0.06)',
          filter: 'blur(80px)',
        }}
      />

      <div
        style={{
          opacity: phoneOpacity,
          transform: `scale(${phoneScale})`,
        }}
      >
        <PhoneFrame scale={1.15}>
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
            }}
          >
            {/* Classify screen */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: classifyOpacity,
              }}
            >
              <ClassifyResultsVideo
                scannerStartFrame={25}
                resultStartFrame={85}
              />
            </div>

            {/* Pest detail screen */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                opacity: detailOpacity,
              }}
            >
              <PestDetailVideo startFrame={DETAIL_ANIM_START} />
            </div>
          </div>
        </PhoneFrame>
      </div>
    </AbsoluteFill>
  );
};
