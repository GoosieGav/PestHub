import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { HeroScene } from '../scenes/HeroScene';
import { FeaturesScene } from '../scenes/FeaturesScene';
import { HowItWorksScene } from '../scenes/HowItWorksScene';
import { StatsScene } from '../scenes/StatsScene';
import { PestGalleryScene } from '../scenes/PestGalleryScene';
import { OutroScene } from '../scenes/OutroScene';
import { SCENE_DURATIONS } from '../theme';

const scenes = [
  { Component: HeroScene, duration: SCENE_DURATIONS.hero },
  { Component: FeaturesScene, duration: SCENE_DURATIONS.features },
  { Component: HowItWorksScene, duration: SCENE_DURATIONS.howItWorks },
  { Component: StatsScene, duration: SCENE_DURATIONS.stats },
  { Component: PestGalleryScene, duration: SCENE_DURATIONS.pestGallery },
  { Component: OutroScene, duration: SCENE_DURATIONS.outro },
];

export const PromoVideo: React.FC = () => {
  let offset = 0;

  return (
    <AbsoluteFill>
      {scenes.map(({ Component, duration }, index) => {
        const from = offset;
        offset += duration;
        return (
          <Sequence key={index} from={from} durationInFrames={duration}>
            <Component />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
