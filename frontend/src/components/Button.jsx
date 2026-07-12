import React from 'react';

export default function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  type = 'button', 
  className = '', 
  disabled = false,
  ...props
}) {
  const baseStyle = "px-5 py-2.5 rounded-xl font-medium transition-all duration-200 select-none text-sm active:scale-95 outline-none flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100";
  
  const variants = {
    primary: "bg-primary hover:bg-primary/95 text-white hover:shadow-lg hover:shadow-primary/20 border border-primary/20",
    secondary: "bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20",
    ghost: "bg-transparent hover:bg-white/5 text-muted hover:text-white",
    glow: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg hover:shadow-primary/30 border border-white/10 hover:brightness-110",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
