import React, { useState } from 'react';

export default function Input({ 
  label, 
  id, 
  type = 'text', 
  value = '', 
  onChange, 
  placeholder = '', 
  required = false, 
  className = '',
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  
  // Floating trigger checks if active focus or text is present
  const isFloating = isFocused || (value !== undefined && value !== null && value.toString().length > 0);

  return (
    <div className="relative w-full mt-2 font-sans group">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={isFocused ? placeholder : ""}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`w-full bg-card/60 dark:bg-black/20 border border-border rounded-[18px] px-4 pt-5 pb-2 text-sm text-text placeholder-muted/60 outline-none transition-all duration-300 focus:border-secondary focus:ring-2 focus:ring-secondary/15 group-hover:border-border/80 ${className}`}
        {...props}
      />
      {label && (
        <label 
          htmlFor={id} 
          className={`absolute left-4 pointer-events-none text-[10px] font-bold uppercase tracking-widest transition-all duration-300 select-none ${
            isFloating 
              ? 'top-2 text-[8px] text-secondary' 
              : 'top-1/2 -translate-y-1/2 text-muted'
          }`}
        >
          {label}
        </label>
      )}
    </div>
  );
}
