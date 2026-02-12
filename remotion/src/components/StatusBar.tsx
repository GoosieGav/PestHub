import React from 'react';

export const StatusBar: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 24px 0 24px',
        height: 54,
        boxSizing: 'border-box',
      }}
    >
      {/* Time */}
      <span
        style={{
          fontSize: 15,
          fontWeight: '600',
          color: '#fff',
          fontFamily: 'SF Pro Display, -apple-system, sans-serif',
          letterSpacing: 0.5,
        }}
      >
        4:23
      </span>

      {/* Right indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        {/* Signal bars */}
        <svg width="17" height="12" viewBox="0 0 17 12">
          <rect x="0" y="9" width="3" height="3" rx="0.5" fill="#fff" />
          <rect x="4.5" y="6" width="3" height="6" rx="0.5" fill="#fff" />
          <rect x="9" y="3" width="3" height="9" rx="0.5" fill="#fff" />
          <rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="#fff" />
        </svg>

        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="#fff">
          <path d="M8 10.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM4.46 8.04a5 5 0 017.08 0l-.94.94a3.5 3.5 0 00-5.2 0l-.94-.94zM1.93 5.51a8.5 8.5 0 0112.14 0l-.94.94a7 7 0 00-10.26 0l-.94-.94z" transform="translate(0, -3)" />
        </svg>

        {/* Battery */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <div
            style={{
              width: 25,
              height: 12,
              borderRadius: 3,
              border: '1.2px solid rgba(255,255,255,0.5)',
              padding: 1.5,
              position: 'relative',
            }}
          >
            <div
              style={{
                width: '44%',
                height: '100%',
                borderRadius: 1.5,
                backgroundColor: '#FFD60A',
              }}
            />
          </div>
          <div
            style={{
              width: 1.5,
              height: 5,
              borderRadius: '0 1px 1px 0',
              backgroundColor: 'rgba(255,255,255,0.5)',
            }}
          />
        </div>
      </div>
    </div>
  );
};
