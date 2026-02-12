import React, { type ReactNode } from 'react';

interface PhoneFrameProps {
  children: ReactNode;
  scale?: number;
}

const PHONE_WIDTH = 375;
const PHONE_HEIGHT = 812;
const BEZEL = 12;
const CORNER_RADIUS = 50;

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  children,
  scale = 1,
}) => {
  const outerWidth = PHONE_WIDTH + BEZEL * 2;
  const outerHeight = PHONE_HEIGHT + BEZEL * 2;

  return (
    <div
      style={{
        width: outerWidth,
        height: outerHeight,
        transform: `scale(${scale})`,
        transformOrigin: 'center center',
        position: 'relative',
      }}
    >
      {/* Phone body */}
      <div
        style={{
          width: outerWidth,
          height: outerHeight,
          borderRadius: CORNER_RADIUS,
          backgroundColor: '#1a1a1a',
          border: '2px solid #333',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 25px 80px rgba(0,0,0,0.5), 0 8px 30px rgba(0,0,0,0.3)',
        }}
      >
        {/* Screen area */}
        <div
          style={{
            position: 'absolute',
            top: BEZEL,
            left: BEZEL,
            width: PHONE_WIDTH,
            height: PHONE_HEIGHT,
            borderRadius: CORNER_RADIUS - BEZEL,
            overflow: 'hidden',
            backgroundColor: '#0a1f12',
          }}
        >
          {children}
        </div>

        {/* Dynamic Island */}
        <div
          style={{
            position: 'absolute',
            top: BEZEL + 10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 120,
            height: 34,
            borderRadius: 20,
            backgroundColor: '#000',
            zIndex: 10,
          }}
        />
      </div>

      {/* Side button - power */}
      <div
        style={{
          position: 'absolute',
          right: -2,
          top: 160,
          width: 3,
          height: 64,
          borderRadius: '0 2px 2px 0',
          backgroundColor: '#333',
        }}
      />

      {/* Side buttons - volume */}
      <div
        style={{
          position: 'absolute',
          left: -2,
          top: 140,
          width: 3,
          height: 32,
          borderRadius: '2px 0 0 2px',
          backgroundColor: '#333',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: -2,
          top: 185,
          width: 3,
          height: 32,
          borderRadius: '2px 0 0 2px',
          backgroundColor: '#333',
        }}
      />
    </div>
  );
};

export { PHONE_WIDTH, PHONE_HEIGHT };
