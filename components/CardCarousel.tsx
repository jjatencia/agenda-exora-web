'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import AppointmentCard from './AppointmentCard';
import { Appointment } from '@/types';
import { markNoShow } from '@/lib/api';

interface Props {
  appointments: Appointment[];
  onRefresh: () => void;
}

export default function CardCarousel({ appointments, onRefresh }: Props) {
  const [index, setIndex] = useState(0);
  const width = 288; // w-72 + gap

  async function handleNoShow(id: string) {
    try {
      await markNoShow(id);
      onRefresh();
    } catch (e) {
      alert('Failed to mark appointment as no show');
    }
  }

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-4"
        drag="x"
        dragConstraints={{ left: -(appointments.length - 1) * width, right: 0 }}
        animate={{ x: -index * width }}
        transition={{ type: 'spring', stiffness: 200, damping: 30 }}
        onDragEnd={(_, info) => {
          const offset = info.offset.x;
          const velocity = info.velocity.x;
          if (offset < -50 || velocity < -500) {
            setIndex(Math.min(index + 1, appointments.length - 1));
          } else if (offset > 50 || velocity > 500) {
            setIndex(Math.max(index - 1, 0));
          }
        }}
      >
        {appointments.map((a) => (
          <AppointmentCard key={a.id} appointment={a} onNoShow={handleNoShow} />
        ))}
      </motion.div>
    </div>
  );
}
