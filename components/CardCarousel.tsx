'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import AppointmentCard from './AppointmentCard';
import { Appointment } from '@/types';
import { markNoShow } from '@/lib/api';

interface Props {
  appointments: Appointment[];
  onRefresh: () => void;
  onAttended?: (appointmentId: string) => void;
  onNoShow?: (appointmentId: string) => void;
}

export default function CardCarousel({ appointments, onRefresh, onAttended, onNoShow }: Props) {
  const [index, setIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  // Responsive card width for mobile
  const cardWidth = typeof window !== 'undefined' ? window.innerWidth - 32 : 320; // Full width minus padding
  const gap = 32; // gap-8 (32px) - 2rem
  const totalCardWidth = cardWidth + gap;
  const maxIndex = Math.max(appointments.length - 1, 0);

  if (appointments.length === 0) {
    return null;
  }

  async function handleNoShow(id: string) {
    try {
      await markNoShow(id);
      
      // Usar la función externa para actualizar el estado local
      if (onNoShow) {
        onNoShow(id);
      }
      
      // Mostrar mensaje de éxito
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      toast.textContent = 'Marcado como no presentado';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
    } catch (e) {
      // Mostrar mensaje de error
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      toast.textContent = 'Error al marcar la cita';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
    }
  }

  function handleAttendedLocal(id: string) {
    // Usar la función externa para actualizar el estado
    if (onAttended) {
      onAttended(id);
    }
    
    // Mostrar mensaje de éxito
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    toast.textContent = 'Cliente atendido ✅';
    document.body.appendChild(toast);
    setTimeout(() => document.body.removeChild(toast), 2000);
  }

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (_: any, info: any) => {
    setIsDragging(false);
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    
    // Thresholds más precisos para swipe
    const threshold = cardWidth * 0.2; // 20% del ancho de la tarjeta
    const velocityThreshold = 300;
    
    if (offset < -threshold || velocity < -velocityThreshold) {
      // Swipe hacia la izquierda - siguiente tarjeta
      const newIndex = Math.min(index + 1, maxIndex);
      setIndex(newIndex);
    } else if (offset > threshold || velocity > velocityThreshold) {
      // Swipe hacia la derecha - tarjeta anterior
      const newIndex = Math.max(index - 1, 0);
      setIndex(newIndex);
    }
    // Si no se cumple el threshold, la tarjeta vuelve a su posición original automáticamente
  };

  return (
    <div className="w-full">
      {/* Indicadores de posición */}
      <div className="flex justify-center items-center mb-4 space-x-2">
        {appointments.map((_, i) => (
          <button
            key={i}
            className={`w-2 h-2 rounded-full transition-all ${
              i === index ? 'bg-primary w-8' : 'bg-gray-300'
            }`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>

      {/* Contenedor del carrusel */}
      <div className="overflow-hidden max-w-full">
        <motion.div
          drag="x"
          dragConstraints={{
            left: -maxIndex * totalCardWidth,
            right: 0,
          }}
          dragElastic={0.2}
          animate={{ x: -index * totalCardWidth }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 40,
            mass: 0.8,
          }}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          style={{
            cursor: isDragging ? 'grabbing' : 'grab',
            display: 'flex',
            gap: '2rem',
            paddingLeft: '16px',
            paddingRight: '16px',
          }}
        >
          {appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onNoShow={handleNoShow}
              onAttended={handleAttendedLocal}
            />
          ))}
        </motion.div>
      </div>

      {/* Contador de citas */}
      <div className="text-center mt-4 text-sm text-gray-500">
        Cita {index + 1} de {appointments.length}
      </div>

      {/* Botones de navegación opcionales */}
      <div className="flex justify-center items-center mt-4 space-x-4">
        <button
          className={`p-2 rounded-full transition-all ${
            index === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-opacity-90 shadow-md'
          }`}
          onClick={() => setIndex(Math.max(index - 1, 0))}
          disabled={index === 0}
        >
          ←
        </button>
        <button
          className={`p-2 rounded-full transition-all ${
            index === maxIndex
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-primary text-white hover:bg-opacity-90 shadow-md'
          }`}
          onClick={() => setIndex(Math.min(index + 1, maxIndex))}
          disabled={index === maxIndex}
        >
          →
        </button>
      </div>
    </div>
  );
}
