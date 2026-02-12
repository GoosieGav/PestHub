import React from 'react';
import { IoHome, IoScan, IoLibrary, IoInformationCircle } from 'react-icons/io5';

interface TabBarProps {
  activeTab?: 'home' | 'classify' | 'directory' | 'about';
}

const tabs = [
  { id: 'home' as const, icon: IoHome, label: 'Home' },
  { id: 'classify' as const, icon: IoScan, label: 'Classify' },
  { id: 'directory' as const, icon: IoLibrary, label: 'Directory' },
  { id: 'about' as const, icon: IoInformationCircle, label: 'About' },
];

export const TabBar: React.FC<TabBarProps> = ({ activeTab = 'home' }) => {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 12,
        left: 12,
        right: 12,
        height: 64,
        borderRadius: 30,
        backgroundColor: 'rgba(10, 31, 18, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 8px',
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        const Icon = tab.icon;
        return (
          <div
            key={tab.id}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
              position: 'relative',
            }}
          >
            {isActive && (
              <div
                style={{
                  position: 'absolute',
                  top: -10,
                  width: 20,
                  height: 3,
                  borderRadius: 2,
                  background: 'linear-gradient(90deg, #22c55e, #4ade80)',
                }}
              />
            )}
            <Icon
              size={24}
              color={isActive ? '#4ade80' : 'rgba(255,255,255,0.4)'}
            />
            <span
              style={{
                fontSize: 9,
                color: isActive ? '#4ade80' : 'rgba(255,255,255,0.4)',
                fontWeight: isActive ? '600' : '400',
              }}
            >
              {tab.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
