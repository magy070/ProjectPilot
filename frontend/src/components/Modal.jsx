import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import Card from './Card.jsx';

export default function Modal({ isOpen, onClose, title, children, className = '' }) {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0 cursor-default" onClick={onClose}></div>
      <Card className={`w-full max-w-lg z-10 border border-border shadow-2xl rounded-[18px] relative ${className}`}>
        {/* Header section with styling */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <h3 className="font-heading font-black tracking-wide text-xl text-text uppercase">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-muted hover:text-secondary hover:bg-secondary/15 transition p-1.5 rounded-xl cursor-pointer"
            aria-label="Close panel"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Scrollable details view */}
        <div className="mt-4 max-h-[70vh] overflow-y-auto pr-1">
          {children}
        </div>
      </Card>
    </div>
  );
}
