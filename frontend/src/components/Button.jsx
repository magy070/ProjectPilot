import React from 'react';
import { motion } from 'framer-motion';

export default function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  type = 'button', 
  className = '', 
  disabled = false,
  ...props
}) {
  const baseStyle = "px-6 py-2.5 rounded-[18px] font-sans font-semibold tracking-wide transition-all select-none text-sm outline-none flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-accent-green hover:shadow-lg hover:shadow-primary/20 text-white border border-primary/20 hover:brightness-110",
    secondary: "bg-secondary/15 hover:bg-secondary/25 text-text border border-secondary/30",
    ghost: "bg-transparent hover:bg-secondary/10 text-muted hover:text-text",
    danger: "bg-gradient-to-r from-danger via-danger to-red-700 text-white hover:shadow-lg hover:shadow-danger/25 border border-danger/30 hover:brightness-110",
    glow: "bg-gradient-to-r from-accent-orange to-secondary text-white hover:shadow-lg hover:shadow-accent-orange/30 border border-secondary/20 hover:brightness-115 shadow-hud",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
