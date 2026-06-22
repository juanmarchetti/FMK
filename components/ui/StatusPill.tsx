import React from 'react';

// ─────────────────────────────────────────────────────────────
// StatusPill — renders a status badge with correct design-system colors
// ─────────────────────────────────────────────────────────────

export type StatusValue =
  | 'En revisión'
  | 'Pendiente'
  | 'Validada'
  | 'Incompleta'
  | 'Rechazada'
  | 'Programada'
  | 'Apto'
  | 'No Apto'
  | 'Borrador'
  | 'Abierta'
  | 'Cerrada'
  | 'Finalizada'
  | 'En curso'
  | string; // allow arbitrary strings — will fall back to Pendiente styles

interface StatusConfig {
  bg: string;
  text: string;
  border: string;
}

const STATUS_MAP: Record<string, StatusConfig> = {
  'En revisión': {
    bg: '#F8E9EB',
    text: '#7A1F2A',
    border: '#7A1F2A',
  },
  'Pendiente': {
    bg: '#EEF0F1',
    text: '#54585B',
    border: '#54585B',
  },
  'Validada': {
    bg: '#EAF5EF',
    text: '#2D6A4F',
    border: '#2D6A4F',
  },
  'Incompleta': {
    bg: '#FFF1F2',
    text: '#BA1A1A',
    border: '#BA1A1A',
  },
  'Rechazada': {
    bg: '#FFF1F2',
    text: '#BA1A1A',
    border: '#BA1A1A',
  },
  'Programada': {
    bg: '#EAF5EF',
    text: '#2D6A4F',
    border: '#2D6A4F',
  },
  'Apto': {
    bg: '#EAF5EF',
    text: '#2D6A4F',
    border: '#2D6A4F',
  },
  'No Apto': {
    bg: '#FFF1F2',
    text: '#BA1A1A',
    border: '#BA1A1A',
  },
  'Borrador': {
    bg: '#EEF0F1',
    text: '#54585B',
    border: '#54585B',
  },
  'Abierta': {
    bg: '#EAF5EF',
    text: '#2D6A4F',
    border: '#2D6A4F',
  },
  'Cerrada': {
    bg: '#EEF0F1',
    text: '#54585B',
    border: '#54585B',
  },
  'Finalizada': {
    bg: '#EEF0F1',
    text: '#54585B',
    border: '#54585B',
  },
  'En curso': {
    bg: '#F8E9EB',
    text: '#7A1F2A',
    border: '#7A1F2A',
  },
};

const FALLBACK_CONFIG: StatusConfig = {
  bg: '#EEF0F1',
  text: '#54585B',
  border: '#54585B',
};

interface StatusPillProps {
  status: StatusValue;
  className?: string;
}

export function StatusPill({ status, className = '' }: StatusPillProps): React.ReactElement {
  const config = STATUS_MAP[status] ?? FALLBACK_CONFIG;

  return (
    <span
      className={`pill ${className}`}
      style={{
        backgroundColor: config.bg,
        color: config.text,
        borderColor: config.border,
      }}
      role="status"
      aria-label={`Estado: ${status}`}
    >
      {status}
    </span>
  );
}
