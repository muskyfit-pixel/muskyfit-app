
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '', title, subtitle }) => {
  return (
    <div className={`bg-musky-black border-2 border-white/30 rounded-none p-8 shadow-none ${className}`}>
      {(title || subtitle) && (
        <div className="mb-8 border-b-2 border-white/10 pb-6">
          {title && <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none">{title}</h3>}
          {subtitle && <p className="text-xs text-musky-teal font-black mt-4 uppercase tracking-[0.3em] leading-relaxed">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
