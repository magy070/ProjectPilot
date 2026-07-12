import React from 'react';

export default function Logo({ size = 'md', showText = true, showSubtitle = false }) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-14 h-14'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Custom Vector SVG Logo Icon */}
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className={`${iconSizes[size] || iconSizes.md} text-white shrink-0`}
      >
        {/* Concentric radar circles */}
        <circle cx="45" cy="55" r="38" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 6" className="text-primary/20" />
        <circle cx="45" cy="55" r="28" stroke="currentColor" strokeWidth="2" strokeDasharray="8 4" className="text-secondary/30" />
        <circle cx="45" cy="55" r="18" stroke="currentColor" strokeWidth="2.5" className="text-primary/45" />
        
        {/* Network node 'P' connection lines */}
        <path 
          d="M 30 80 L 30 35 L 52 35 C 64 35, 64 53, 52 53 L 30 53" 
          stroke="currentColor" 
          strokeWidth="4" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="text-white"
        />
        
        {/* Node joint dots */}
        <circle cx="30" cy="35" r="4.5" fill="#6366F1" />
        <circle cx="30" cy="53" r="4.5" fill="#8B5CF6" />
        <circle cx="30" cy="80" r="4.5" fill="#6366F1" />
        <circle cx="52" cy="35" r="4.5" fill="#8B5CF6" />
        <circle cx="56" cy="44" r="4.5" fill="#6366F1" />
        <circle cx="52" cy="53" r="4.5" fill="#8B5CF6" />

        {/* Diagonal Arrow representing Project "Pilot" / growth */}
        <path d="M 40 60 L 78 22" stroke="url(#logo-grad)" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M 58 22 L 78 22 L 78 42" stroke="url(#logo-grad)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
        
        <defs>
          <linearGradient id="logo-grad" x1="40" y1="60" x2="78" y2="22" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#6366F1" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>

      {showText && (
        <div className="flex flex-col text-left leading-none">
          <span className={`font-extrabold tracking-tight bg-gradient-to-r from-white via-white to-muted bg-clip-text text-transparent ${textSizes[size] || textSizes.md}`}>
            Project<span className="text-primary font-black">Pilot</span>
          </span>
          {showSubtitle && (
            <span className="text-[7px] md:text-[8px] tracking-[0.12em] font-bold text-muted mt-1.5 uppercase opacity-85">
              AI Guidance for Innovation
            </span>
          )}
        </div>
      )}
    </div>
  );
}
