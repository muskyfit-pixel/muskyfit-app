
import React from 'react';

interface LogoProps {
  className?: string;
  glow?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = "w-12 h-12", glow = true }) => {
  return (
    <div className={`relative ${className}`}>
      {glow && (
        <div className="absolute inset-0 bg-musky-teal/10 blur-3xl rounded-full scale-150 animate-pulse"></div>
      )}
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 w-full h-full drop-shadow-2xl">
        <defs>
          <linearGradient id="chrome-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#A0A0A0" />
            <stop offset="60%" stopColor="#707070" />
            <stop offset="100%" stopColor="#202020" />
          </linearGradient>
          
          <linearGradient id="inner-shadow" x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </linearGradient>

          <filter id="bevel">
            <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
            <feSpecularLighting in="blur" surfaceScale="5" specularConstant="0.75" specularExponent="20" lightingColor="#white" result="spec">
              <fePointLight x="-5000" y="-10000" z="20000" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceAlpha" operator="in" result="specOut" />
            <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="lit" />
          </filter>
        </defs>

        {/* The Geometric 'M' Shape - Left Half */}
        <path 
          d="M15 20 L50 45 L50 60 L35 50 L35 75 L15 65 Z" 
          fill="url(#chrome-gradient)" 
          filter="url(#bevel)"
        />
        
        {/* The Geometric 'M' Shape - Right Half (Mirrored) */}
        <path 
          d="M85 20 L50 45 L50 60 L65 50 L65 75 L85 65 Z" 
          fill="url(#chrome-gradient)" 
          filter="url(#bevel)"
        />

        {/* The Teal Core Highlight */}
        <path 
          d="M50 45 L65 55 L50 65 L35 55 Z" 
          fill="#00E5FF" 
          className="animate-pulse"
        />

        {/* Dark Accents for Depth */}
        <path d="M15 20 L30 30 L30 55 L15 65 Z" fill="black" fillOpacity="0.3" />
        <path d="M85 20 L70 30 L70 55 L85 65 Z" fill="black" fillOpacity="0.3" />
        
        {/* Mirroring lines */}
        <path d="M50 45 L50 60" stroke="black" strokeWidth="1" strokeOpacity="0.5" />
      </svg>
    </div>
  );
};

export default Logo;
