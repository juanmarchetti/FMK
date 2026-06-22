'use client';

import React, { useEffect, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────
// Modal — overlay dialog with title, body slot, and close button
// ─────────────────────────────────────────────────────────────

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /** Max width of the modal card (default 480px) */
  maxWidth?: number | string;
  className?: string;
}

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = 480,
  className = '',
}: ModalProps): React.ReactElement | null {
  // Close on Escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll while modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(25,28,29,0.60)', backdropFilter: 'blur(2px)' }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        // Close when clicking the backdrop (not the card itself)
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Card */}
      <div
        className={`relative bg-white rounded-[8px] w-full flex flex-col shadow-sm ${className}`}
        style={{
          maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
          border: '1px solid rgba(84,88,91,0.20)',
          maxHeight: 'calc(100vh - 2rem)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(84,88,91,0.15)' }}
        >
          <h2
            id="modal-title"
            className="text-[16px] font-[700] leading-snug"
            style={{ color: '#191C1D', fontFamily: 'Montserrat,sans-serif' }}
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center rounded-[4px] transition-colors duration-150 hover:bg-[#EEF0F1] active:bg-[#DDE0E3]"
            style={{ width: 32, height: 32, color: '#54585B' }}
            aria-label="Cerrar"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontSize: 20 }}
            >
              close
            </span>
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}
