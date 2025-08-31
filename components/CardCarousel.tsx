'use client';

import { useState, useEffect, useRef } from 'react';
import AppointmentCard from './AppointmentCard';
import BottomNavigation from './BottomNavigation';
import { Appointment } from '@/types';
import { markNoShow } from '@/lib/api';

interface Props {
  appointments: Appointment[];
  onRefresh: () => void;
  onAttended?: (appointmentId: string) => void;
  onNoShow?: (appointmentId: string) => void;
}

export default function CardCarousel({ appointments, onRefresh, onAttended, onNoShow }: Props) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const stackRef = useRef<HTMLDivElement>(null);

  if (appointments.length === 0) {
    return null;
  }

  async function handleNoShow(id: string) {
    try {
      await markNoShow(id);
      
      if (onNoShow) {
        onNoShow(id);
      }
      
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-complement2 text-complement4 px-4 py-2 rounded-lg shadow-lg z-50';
      toast.textContent = 'Marcado como no presentado';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
    } catch (e) {
      const toast = document.createElement('div');
      toast.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-secondary text-white px-4 py-2 rounded-lg shadow-lg z-50';
      toast.textContent = 'Error al marcar la cita';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 3000);
    }
  }

  function handleAttendedLocal(id: string) {
    if (onAttended) {
      onAttended(id);
    }
  }

  const updateCarousel = (instant = false) => {
    if (!stackRef.current) return;
    
    const cards = stackRef.current.querySelectorAll('.card') as NodeListOf<HTMLElement>;
    cards.forEach((card, index) => {
      const offset = index - currentCardIndex;
      
      if (instant) {
        card.style.transition = 'none';
      } else {
        card.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
      }

      if (offset === 0) {
        card.style.transform = 'translateX(0) scale(1)';
        card.style.opacity = '1';
        card.style.zIndex = '10';
      } else if (offset === 1) {
        card.style.transform = 'translateX(30px) scale(0.9)';
        card.style.opacity = '0.5';
        card.style.zIndex = '9';
      } else if (offset === -1) {
        card.style.transform = 'translateX(-30px) scale(0.9)';
        card.style.opacity = '0.5';
        card.style.zIndex = '9';
      } else {
        card.style.transform = `translateX(${offset > 0 ? 60 : -60}px) scale(0.8)`;
        card.style.opacity = '0';
        card.style.zIndex = '8';
      }
    });
  };

  // Lógica del drag para móvil
  useEffect(() => {
    if (!stackRef.current) return;
    
    let activeCard: HTMLElement | null = null;
    let startX: number;
    let isDragging = false;

    const startDrag = (e: MouseEvent | TouchEvent) => {
      const target = (e.target as HTMLElement).closest('.card') as HTMLElement;
      if (!target || target.tagName === 'A' || parseInt(target.dataset.index || '0') !== currentCardIndex) return;

      isDragging = true;
      activeCard = target;
      activeCard.classList.add('dragging');
      const touch = e.type === 'touchstart';
      startX = touch ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
      
      document.addEventListener('mousemove', onDrag);
      document.addEventListener('touchmove', onDrag, { passive: true });
      document.addEventListener('mouseup', endDrag);
      document.addEventListener('touchend', endDrag);
    };

    const onDrag = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !activeCard) return;
      const touch = e.type === 'touchmove';
      const currentX = touch ? (e as TouchEvent).touches[0].clientX : (e as MouseEvent).clientX;
      const deltaX = currentX - startX;
      const rotate = deltaX * 0.05;
      activeCard.style.transform = `translateX(${deltaX}px) rotate(${rotate}deg)`;
    };

    const endDrag = (e: MouseEvent | TouchEvent) => {
      if (!isDragging || !activeCard) return;
      isDragging = false;
      
      const touch = e.type.includes('touch');
      const finalX = touch && (e as TouchEvent).changedTouches?.length ? 
        (e as TouchEvent).changedTouches[0].clientX : (e as MouseEvent).clientX;
      const deltaX = finalX - startX;
      
      if (Math.abs(deltaX) > window.innerWidth / 5) {
        if (deltaX > 0) {
          // Swipe Right (Previous)
          if (currentCardIndex > 0) setCurrentCardIndex(currentCardIndex - 1);
        } else {
          // Swipe Left (Next)
          if (currentCardIndex < appointments.length - 1) setCurrentCardIndex(currentCardIndex + 1);
        }
      }
      
      updateCarousel();

      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('touchmove', onDrag);
      document.removeEventListener('mouseup', endDrag);
      document.removeEventListener('touchend', endDrag);
    };

    const stack = stackRef.current;
    stack.addEventListener('mousedown', startDrag);
    stack.addEventListener('touchstart', startDrag, { passive: true });

    return () => {
      stack.removeEventListener('mousedown', startDrag);
      stack.removeEventListener('touchstart', startDrag);
    };
  }, [currentCardIndex, appointments.length]);

  useEffect(() => {
    updateCarousel();
  }, [currentCardIndex]);

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentCardIndex < appointments.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    }
  };

  return (
    <>
      <div className="card-stack" ref={stackRef}>
        {appointments.map((appointment, index) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            onNoShow={handleNoShow}
            onAttended={handleAttendedLocal}
            index={index}
          />
        ))}
      </div>
      
      <BottomNavigation
        currentIndex={currentCardIndex}
        totalItems={appointments.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </>
  );
}
