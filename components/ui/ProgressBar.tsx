import React from 'react';

// ─────────────────────────────────────────────────────────────
// ProgressBar — linear progress with animation + percentage label
// ─────────────────────────────────────────────────────────────

export type ProgressBarColor = 'red' | 'green';

export interface ProgressBarProps {
  /** Value from 0 to 100 */
  value: number;
  color?: ProgressBarColor;
  /** Show the percentage label */
  showLabel?: boolean;
  /** Accessible label for the progress bar */
  label?: string;
  className?: string;
}

const COLOR_MAP: Record<ProgressBarColor, string> = {
  red: '#7A1F2A',
  green: '#2D6A4F',
};

const TRACK_COLOR_MAP: Record<ProgressBarColor, string> = {
  red: '#F8E9EB',
  green: '#EAF5EF',
};

export function ProgressBar({
  value,
  color = 'red',
  showLabel = true,
  label,
  className = '',
}: ProgressBarProps): React.ReactElement {
  // Clamp value between 0 and 100
  const clamped = Math.min(100, Math.max(0, value));
  const fillColor = COLOR_MAP[color];
  const trackColor = TRACK_COLOR_MAP[color];

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between">
          {label && (
            <span
              className="text-[12px] font-[500]"
              style={{ color: '#54585B', fontFamily: 'Inter,sans-serif' }}
            >
              {label}
            </span>
          )}
          <span
            className="text-[12px] font-[600] ml-auto"
            style={{ color: fillColor, fontFamily: 'Inter,sans-serif' }}
          >
            {clamped}%
          </span>
        </div>
      )}

      {/* Track */}
      <div
        className="w-full overflow-hidden rounded-full"
        style={{ height: 8, backgroundColor: trackColor }}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? `Progreso: ${clamped}%`}
      >
        {/* Fill */}
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${clamped}%`,
            backgroundColor: fillColor,
            animation: 'progress-fill 0.7s ease-out',
          }}
        />
      </div>
    </div>
  );
}
