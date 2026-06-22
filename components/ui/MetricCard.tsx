import React from 'react';

// ─────────────────────────────────────────────────────────────
// MetricCard — big number metric with label, value, detail
// ─────────────────────────────────────────────────────────────

export type MetricTone = 'red' | 'slate' | 'green' | 'error';

export interface MetricCardProps {
  label: string;
  value: string;
  detail?: string;
  tone?: MetricTone;
  className?: string;
}

const TONE_COLORS: Record<MetricTone, string> = {
  red: '#7A1F2A',
  slate: '#54585B',
  green: '#2D6A4F',
  error: '#BA1A1A',
};

export function MetricCard({
  label,
  value,
  detail,
  tone = 'slate',
  className = '',
}: MetricCardProps): React.ReactElement {
  const valueColor = TONE_COLORS[tone];

  return (
    <article
      className={`bg-white rounded-lg p-4 flex flex-col gap-1 ${className}`}
      style={{ border: '1px solid rgba(84,88,91,0.20)' }}
    >
      {/* Label */}
      <p
        className="text-[12px] font-[500] uppercase tracking-[0.06em]"
        style={{ color: '#54585B', fontFamily: 'Inter,sans-serif' }}
      >
        {label}
      </p>

      {/* Big value */}
      <p
        className="text-[2rem] leading-none font-[700]"
        style={{
          color: valueColor,
          fontFamily: 'Montserrat,sans-serif',
          letterSpacing: '-0.01em',
        }}
        aria-label={`${label}: ${value}`}
      >
        {value}
      </p>

      {/* Detail */}
      {detail && (
        <p
          className="text-[12px] font-[400] leading-snug mt-0.5"
          style={{ color: '#897172', fontFamily: 'Inter,sans-serif' }}
        >
          {detail}
        </p>
      )}
    </article>
  );
}
