import React from 'react';

export default function Badge({ children, type = 'tech', className = '' }) {
  const baseStyle = "px-2.5 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider select-none";
  
  const types = {
    tech: "bg-primary/10 text-primary border border-primary/20",
    difficulty: {
      Beginner: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
      Intermediate: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
      Advanced: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
    },
    meta: "bg-white/5 text-muted border border-white/10"
  };

  const badgeStyle = type === 'difficulty' 
    ? (types.difficulty[children] || types.meta) 
    : (types[type] || types.tech);

  return (
    <span className={`${baseStyle} ${badgeStyle} ${className}`}>
      {children}
    </span>
  );
}
