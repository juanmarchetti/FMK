import React from 'react';

// ─────────────────────────────────────────────────────────────
// SectionTitle — eyebrow label + bold section heading
// ─────────────────────────────────────────────────────────────

export interface SectionTitleProps {
  title: string;
  eyebrow?: string;
  className?: string;
}

export function SectionTitle({
  title,
  eyebrow,
  className = '',
}: SectionTitleProps): React.ReactElement {
  return (
    <div className={`flex flex-col gap-0.5 ${className}`}>
      {eyebrow && (
        <p
          className="text-[12px] font-[600] uppercase tracking-[0.08em]"
          style={{ color: '#54585B', fontFamily: 'Inter,sans-serif' }}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className="text-[20px] font-[700] leading-tight"
        style={{
          color: '#191C1D',
          fontFamily: 'Montserrat,sans-serif',
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </h2>
    </div>
  );
}
