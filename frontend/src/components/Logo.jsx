import React from 'react';

export default function Logo({ size = 'md', showText = true, showSubtitle = false }) {
  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <div className="flex items-center gap-3 select-none">
      {/* GTA Los Santos style compass/sunset radar SVG */}
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className={`${iconSizes[size] || iconSizes.md} shrink-0 filter drop-shadow-[0_0_8px_rgba(196,154,74,0.3)]`}
      >
        {/* Outer classic radar scope circle */}
        <circle cx="50" cy="50" r="45" stroke="#C49A4A" strokeWidth="2.5" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="38" stroke="#3A5F0B" strokeWidth="2" opacity="0.6" />
        
        {/* Palm tree and sunset vectors inside scope */}
        <path 
          d="M 50 15 L 50 85 M 15 50 L 85 50" 
          stroke="#C49A4A" 
          strokeWidth="1" 
          opacity="0.3" 
        />
        
        {/* Half Sun (Sunset horizon) */}
        <path 
          d="M 22 55 C 22 35, 78 35, 78 55 Z" 
          fill="url(#sunset-grad)" 
          opacity="0.85"
        />

        {/* Floating Lowrider / Custom Car outline */}
        <path 
          d="M 28 65 L 30 60 L 36 59 L 42 55 L 60 55 L 68 59 L 74 61 L 76 65 L 72 67 L 68 67 C 67 63, 61 63, 60 67 L 44 67 C 43 63, 37 63, 36 67 L 28 67 Z" 
          fill="#3A5F0B" 
          stroke="#C49A4A" 
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        
        {/* Wheels */}
        <circle cx="36" cy="67" r="4.5" fill="#121212" stroke="#C49A4A" strokeWidth="1.5" />
        <circle cx="60" cy="67" r="4.5" fill="#121212" stroke="#C49A4A" strokeWidth="1.5" />

        {/* Crosshair indicator */}
        <circle cx="50" cy="50" r="2" fill="#E47A2E" />
        <path d="M 50 42 L 50 46 M 50 54 L 50 58 M 42 50 L 46 50 M 54 50 L 58 50" stroke="#E47A2E" strokeWidth="1.5" strokeLinecap="round" />

        <defs>
          <linearGradient id="sunset-grad" x1="50" y1="35" x2="50" y2="55" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E47A2E" />
            <stop offset="100%" stopColor="#C49A4A" />
          </linearGradient>
        </defs>
      </svg>

      {showText && (
        <div className="flex flex-col text-left leading-none">
          <span className={`font-heading tracking-wider uppercase font-black text-text ${textSizes[size] || textSizes.md}`}>
            PROJECT<span className="text-secondary ml-1">PILOT</span>
          </span>
          {showSubtitle && (
            <span className="text-[9px] tracking-[0.25em] font-semibold text-accent-orange font-sans mt-1 uppercase opacity-90">
              BUILD BIGGER. BUILD SMARTER.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
