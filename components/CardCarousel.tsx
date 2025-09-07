'use client';

import { useState } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import AppointmentCard from './AppointmentCard';
import { Appointment } from '@/types';
import { markNoShow } from '@/lib/api';

interface Props {
  appointments: Appointment[];
  onRefresh: () => void;
}

export default function CardCarousel({ appointments, onRefresh }: Props) {
  const [index, setIndex] = useState(0);
  const cardWidth = 288; // w-72 (18rem = 288px)
  const gap = 16; // gap-4 (1rem = 16px)
  const itemWidth = cardWidth + gap;
  const maxIndex = Math.max(appointments.length - 1, 0);
  
  const x = useMotionValue(0);
  const constrainedX = useTransform(x, (value: number) => {
    const min = -maxIndex * itemWidth;
    const max = 0;
    return Math.min(Math.max(value, min), max);
  });

  if (appointments.length === 0) {
    return null;
  }

  async function handleNoShow(id: string) {
    try {
      await markNoShow(id);
      onRefresh();
    } catch (e) {
      alert('Failed to mark appointment as no show');
    }
  }

  function handleDragEnd(_: any, info: { offset: { x: number }; velocity: { x: number } }) {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    
    // Determinar nueva posición basada en offset y velocidad
    let newIndex = index;
    
    if (Math.abs(velocity) > 300) {
      // Swipe rápido basado en velocidad
      newIndex = velocity > 0 ? Math.max(index - 1, 0) : Math.min(index + 1, maxIndex);
    } else if (Math.abs(offset) > itemWidth / 3) {
      // Swipe lento basado en distancia (umbral de 1/3 del ancho)
      newIndex = offset > 0 ? Math.max(index - 1, 0) : Math.min(index + 1, maxIndex);
    }
    
    // Animar suavemente a la nueva posición
    const targetX = -newIndex * itemWidth;
    animate(x, targetX, {
      type: 'spring',
      stiffness: 300,
      damping: 35,
      mass: 0.8
    });
    
    setIndex(newIndex);
  }

  // Animar cuando cambia el index programáticamente
  function animateToIndex(newIndex: number) {
    const targetX = -newIndex * itemWidth;
    animate(x, targetX, {
      type: 'spring',
      stiffness: 300,
      damping: 35,
      mass: 0.8
    });
    setIndex(newIndex);
  }

  return (
    <div className="overflow-hidden">
      <motion.div
        className="flex gap-4 cursor-grab active:cursor-grabbing"
        drag="x"
        dragElastic={0.1}
        dragMomentum={false}
        style={{ x: constrainedX }}
        onDragEnd={handleDragEnd}
        whileTap={{ cursor: 'grabbing' }}
      >
        {appointments.map((a) => (
          <AppointmentCard key={a.id} appointment={a} onNoShow={handleNoShow} />
        ))}
      </motion.div>
    </div>
  );
}
