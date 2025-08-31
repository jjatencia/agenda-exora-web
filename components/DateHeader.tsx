'use client';

import { formatHeaderDate } from '@/lib/date';

interface Props {
  date: Date;
  onChange: (d: Date) => void;
}

export default function DateHeader({ date, onChange }: Props) {
  const formatDate = (date: Date) => {
    return date.toLocaleString('es-ES', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'short' 
    });
  };

  return (
    <div className="flex items-center space-x-2 p-2 rounded-lg cursor-pointer transition bg-gray-100 hover:bg-gray-200">
      <span className="font-semibold text-md text-gray-700">
        {formatDate(date)}
      </span>
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    </div>
  );
}
