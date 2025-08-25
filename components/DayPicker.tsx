'use client';

import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { es } from 'date-fns/locale';

interface Props {
  selected: Date;
  onSelect: (d: Date) => void;
}

export default function DayPickerModal({ selected, onSelect }: Props) {
  return (
    <DayPicker mode="single" locale={es} selected={selected} onSelect={(d) => d && onSelect(d)} />
  );
}
