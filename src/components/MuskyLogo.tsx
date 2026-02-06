
import React from 'react';

export const MuskyLogo: React.FC<{ className?: string; size?: number }> = ({ className, size = 48 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 400 400" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="chromeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="20%" stopColor="#94A3B8" />
          <stop offset="40%" stopColor="#F8FAFC" />
          <stop offset="60%" stopColor="#475569" />
          <stop offset="80%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
        
        <linearGradient id="cyanCore" x1="200" y1="130" x2="200" y2="170" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#0891B2" />
        </linearGradient>
        
        <filter id="cyanGlow" x="150" y="100" width="100" height="100">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Left 'F' Component of the M */}
      <path 
        d="M60 60 L195 140 L195 175 L115 130 L115 200 L180 235 L180 270 L115 235 L115 340 L60 310 Z" 
        fill="url(#chromeGradient)"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
      />

      {/* Right 'F' Component (Mirrored) */}
      <path 
        d="M340 60 L205 140 L205 175 L285 130 L285 200 L220 235 L220 270 L285 235 L285 340 L340 310 Z" 
        fill="url(#chromeGradient)"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
      />

      {/* Central Cyan Accent Chevron */}
      <path 
        d="M195 145 L200 142 L205 145 L205 170 L200 175 L195 170 Z" 
        fill="url(#cyanCore)"
        filter="url(#cyanGlow)"
      />
      
      {/* Subtle top edge highlighting */}
      <path 
        d="M60 60 L195 140 M205 140 L340 60" 
        stroke="white" 
        strokeWidth="2" 
        strokeOpacity="0.5" 
      />
    </svg>
  );
};
