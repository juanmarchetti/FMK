'use client';

import React from 'react';

// ─────────────────────────────────────────────────────────────
// Button — primary, secondary, ghost variants + loading state
// ─────────────────────────────────────────────────────────────

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  className?: string;
}

// Spinner rendered inline — no external icon dependency
function Spinner(): React.ReactElement {
  return (
    <svg
      className="animate-spin"
      style={{ width: '1em', height: '1em' }}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

const SIZE_STYLES: Record<ButtonSize, { padding: string; fontSize: string; minHeight: string }> = {
  sm: { padding: '0 14px', fontSize: '13px', minHeight: '36px' },
  md: { padding: '0 20px', fontSize: '14px', minHeight: '44px' },
  lg: { padding: '0 28px', fontSize: '15px', minHeight: '48px' },
};

const VARIANT_STYLES: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    backgroundColor: '#7A1F2A',
    color: '#FFFFFF',
    border: '1px solid transparent',
  },
  secondary: {
    backgroundColor: 'transparent',
    color: '#54585B',
    border: '1px solid #54585B',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: '#54585B',
    border: '1px solid transparent',
  },
};

const VARIANT_HOVER_CLASS: Record<ButtonVariant, string> = {
  primary: 'hover:brightness-90 active:brightness-75',
  secondary: 'hover:bg-[#EEF0F1] active:bg-[#DDE0E3]',
  ghost: 'hover:bg-[#EEF0F1] active:bg-[#DDE0E3]',
};

export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  children,
  className = '',
}: ButtonProps): React.ReactElement {
  const sizeStyle = SIZE_STYLES[size];
  const variantStyle = VARIANT_STYLES[variant];
  const hoverClass = VARIANT_HOVER_CLASS[variant];

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={[
        'inline-flex items-center justify-center gap-2 rounded-[4px] font-[600] select-none transition-all duration-150',
        'font-[Inter,sans-serif]',
        hoverClass,
        isDisabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        ...variantStyle,
        padding: sizeStyle.padding,
        fontSize: sizeStyle.fontSize,
        minHeight: sizeStyle.minHeight,
        letterSpacing: '0.01em',
      }}
      aria-busy={loading}
      aria-disabled={isDisabled}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}
