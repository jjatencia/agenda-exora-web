'use client';

import { formatHeaderDate } from '@/lib/date';

interface Props {
  date: Date;
  onChange: (d: Date) => void;
}

export default function DateHeader({ date, onChange }: Props) {
  function shift(days: number) {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    onChange(d);
  }
  return (
    <header className="flex items-center justify-between" aria-live="polite">
      <button aria-label="Día anterior" onClick={() => shift(-1)} className="p-2">
        ◀︎
      </button>
      <span className="font-heading text-lg">{formatHeaderDate(date)}</span>
      <button aria-label="Día siguiente" onClick={() => shift(1)} className="p-2">
        ▶︎
      </button>
    </header>
  );
}
