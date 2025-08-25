'use client';

import { DayPicker } from 'react-day-picker';
import { es } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';

interface Props {
  selectedDate: Date;
  onDateSelect: (d: Date) => void;
}

export default function DayPickerComponent({ selectedDate, onDateSelect }: Props) {
  return (
    <div className="w-full">
      <style jsx global>{`
        .rdp {
          --rdp-cell-size: 40px;
          --rdp-accent-color: #555BF6;
          --rdp-background-color: #555BF6;
          --rdp-accent-color-dark: #FD778B;
          --rdp-background-color-dark: #FD778B;
          font-family: inherit;
        }
        .rdp-day_selected {
          background-color: #555BF6;
          color: white;
        }
        .rdp-day_selected:hover {
          background-color: #4147D5;
        }
        .rdp-day:hover {
          background-color: #D2E9FF;
          color: #02145C;
        }
        .rdp-button:hover {
          background-color: #D2E9FF;
        }
      `}</style>
      <DayPicker
        mode="single"
        locale={es}
        selected={selectedDate}
        onSelect={(d) => d && onDateSelect(d)}
        className="mx-auto"
      />
    </div>
  );
}
