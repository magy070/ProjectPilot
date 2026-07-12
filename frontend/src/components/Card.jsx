import React from 'react';

export default function Card({ children, className = '', hoverGlow = false, ...props }) {
  const hoverClass = hoverGlow ? "glass-card-hover" : "";
  return (
    <div 
      className={`glass-card rounded-2xl p-6 relative overflow-hidden ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
