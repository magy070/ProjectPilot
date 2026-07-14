import React from 'react';

export default function Badge({ children, type = 'tech', className = '' }) {
  const baseStyle = "px-3 py-1 rounded-xl text-xs font-heading font-black tracking-wider uppercase select-none border";
  
  const types = {
    tech: "bg-primary/10 text-accent-green dark:text-accent-green border-accent-green/20",
    difficulty: {
      Beginner: "bg-success/10 text-success border-success/30 shadow-[0_0_8px_rgba(95,191,80,0.1)]",
      Intermediate: "bg-secondary/10 text-secondary border-secondary/30 shadow-[0_0_8px_rgba(196,154,74,0.1)]",
      Advanced: "bg-danger/10 text-danger border-danger/30 shadow-[0_0_8px_rgba(214,69,69,0.1)]",
    },
    meta: "bg-card border-border text-muted"
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
