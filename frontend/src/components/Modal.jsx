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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-0" onClick={onClose}></div>
      <Card className={`w-full max-w-lg z-10 border border-white/10 ${className}`}>
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <h3 className="font-bold text-lg text-white">{title}</h3>
          <button 
            onClick={onClose} 
            className="text-muted hover:text-white transition p-1 hover:bg-white/5 rounded-lg"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-4 max-h-[70vh] overflow-y-auto pr-1">
          {children}
        </div>
      </Card>
    </div>
  );
}
