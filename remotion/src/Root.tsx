import React from 'react';
import { Composition } from 'remotion';
import { PromoVideo } from './compositions/PromoVideo';
import { HeroScene } from './scenes/HeroScene';
import { FeaturesScene } from './scenes/FeaturesScene';
import { HowItWorksScene } from './scenes/HowItWorksScene';
import { StatsScene } from './scenes/StatsScene';
import { PestGalleryScene } from './scenes/PestGalleryScene';
import { OutroScene } from './scenes/OutroScene';
import { VIDEO_CONFIG, SCENE_DURATIONS, TOTAL_DURATION } from './theme';
import { LandingPageVideo } from './presentations/LandingPageVideo';
import { SolutionDemoVideo } from './presentations/SolutionDemoVideo';
import { MobileLandingDemo } from './presentations/MobileLandingDemo';
import { SolutionDemoMobile } from './presentations/SolutionDemoMobile';
import { ImageScanVideo } from './presentations/ImageScanVideo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* === Mobile Landing Demo (phone dimensions, no frame) === */}
      <Composition
        id="MobileLandingDemo"
        component={MobileLandingDemo}
        durationInFrames={360}
        fps={VIDEO_CONFIG.fps}
        width={1170}
        height={2532}
      />

      <Composition
        id="MobileLandingShort"
        component={MobileLandingDemo}
        durationInFrames={180}
        fps={VIDEO_CONFIG.fps}
        width={1170}
        height={2532}
        defaultProps={{ slideStart: 90 }}
      />

      {/* === Solution Demo (iPhone 15 Pro dimensions, no frame) === */}
      <Composition
        id="SolutionDemoMobile"
        component={SolutionDemoMobile}
        durationInFrames={410}
        fps={VIDEO_CONFIG.fps}
        width={1180}
        height={2556}
      />

      {/* === Image Scan Demo (phone dimensions, no frame) === */}
      <Composition
        id="ImageScanVideo"
        component={ImageScanVideo}
        durationInFrames={135}
        fps={VIDEO_CONFIG.fps}
        width={1170}
        height={2532}
      />

      {/* === DECA Presentation Videos === */}
      <Composition
        id="LandingPageVideo"
        component={LandingPageVideo}
        durationInFrames={240}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />
      <Composition
        id="SolutionDemoVideo"
        component={SolutionDemoVideo}
        durationInFrames={300}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />

      {/* === Promo Video === */}
      <Composition
        id="PromoVideo"
        component={PromoVideo}
        durationInFrames={TOTAL_DURATION}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />

      <Composition
        id="HeroScene"
        component={HeroScene}
        durationInFrames={SCENE_DURATIONS.hero}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />
      <Composition
        id="FeaturesScene"
        component={FeaturesScene}
        durationInFrames={SCENE_DURATIONS.features}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />
      <Composition
        id="HowItWorksScene"
        component={HowItWorksScene}
        durationInFrames={SCENE_DURATIONS.howItWorks}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />
      <Composition
        id="StatsScene"
        component={StatsScene}
        durationInFrames={SCENE_DURATIONS.stats}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />
      <Composition
        id="PestGalleryScene"
        component={PestGalleryScene}
        durationInFrames={SCENE_DURATIONS.pestGallery}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />
      <Composition
        id="OutroScene"
        component={OutroScene}
        durationInFrames={SCENE_DURATIONS.outro}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
      />
    </>
  );
};
