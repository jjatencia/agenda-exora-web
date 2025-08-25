'use client';

import { DayPicker } from 'react-day-picker';
import { es } from 'date-fns/locale';
import styles from './DayPicker.module.css';

interface Props {
  selected: Date;
  onSelect: (d: Date) => void;
}

export default function DayPickerModal({ selected, onSelect }: Props) {
  return (
    <div className={styles.container}>
      <DayPicker
        mode="single"
        locale={es}
        selected={selected}
        onSelect={(d) => d && onSelect(d)}
      />
    </div>
  );
}
