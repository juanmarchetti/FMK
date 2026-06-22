import React from 'react';

// ─────────────────────────────────────────────────────────────
// ChecklistItem — done/not-done item with icon, label, value
// ─────────────────────────────────────────────────────────────

export interface ChecklistItemProps {
  label: string;
  value: string;
  done: boolean;
  /** If true, omits the bottom border (use on last item) */
  last?: boolean;
  className?: string;
}

export function ChecklistItem({
  label,
  value,
  done,
  last = false,
  className = '',
}: ChecklistItemProps): React.ReactElement {
  return (
    <div
      className={`flex items-center gap-3 py-3 ${!last ? 'border-b' : ''} ${className}`}
      style={{ borderColor: 'rgba(84,88,91,0.15)' }}
      role="listitem"
    >
      {/* Status icon circle */}
      <span
        className="flex-shrink-0 flex items-center justify-center rounded-full"
        style={{
          width: 28,
          height: 28,
          backgroundColor: done ? '#EAF5EF' : '#FFF1F2',
          border: `1.5px solid ${done ? '#2D6A4F' : '#BA1A1A'}`,
        }}
        aria-hidden="true"
      >
        {done ? (
          <span
            className="material-symbols-outlined"
            style={{ color: '#2D6A4F', fontSize: 16, fontVariationSettings: "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 20" }}
          >
            check
          </span>
        ) : (
          <span
            className="material-symbols-outlined"
            style={{ color: '#BA1A1A', fontSize: 16, fontVariationSettings: "'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 20" }}
          >
            priority_high
          </span>
        )}
      </span>

      {/* Label + value */}
      <div className="flex flex-1 items-center justify-between gap-2 min-w-0">
        <span
          className="text-[14px] font-[600] truncate"
          style={{ color: '#191C1D', fontFamily: 'Inter,sans-serif' }}
        >
          {label}
        </span>
        <span
          className="text-[13px] font-[400] flex-shrink-0"
          style={{ color: '#54585B', fontFamily: 'Inter,sans-serif' }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}
