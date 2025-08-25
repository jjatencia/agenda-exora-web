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
      <button 
        aria-label="Día anterior" 
        onClick={() => shift(-1)} 
        className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-primary font-bold"
      >
        ◀︎
      </button>
      <div className="text-center">
        <span className="font-heading text-lg font-semibold text-gray-800 capitalize">
          {formatHeaderDate(date)}
        </span>
      </div>
      <button 
        aria-label="Día siguiente" 
        onClick={() => shift(1)} 
        className="p-2 rounded-lg hover:bg-white hover:shadow-sm transition-all text-primary font-bold"
      >
        ▶︎
      </button>
    </header>
  );
}
