'use client';

import { useEffect, useMemo, useState } from 'react';
import useAppointments from '@/hooks/useAppointments';
import { Appointment } from '@/types';

interface Props {
  userEmail?: string | null;
}

export default function AgendaClient({ userEmail }: Props) {
  // Fecha seleccionada persistida
  const [selectedDate, setSelectedDate] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lastSelectedDate');
      if (saved) return new Date(saved);
    }
    return new Date();
  });

  // Para el modal de calendario (input date)
  const [showCalendar, setShowCalendar] = useState(false);
  const [dateInputValue, setDateInputValue] = useState<string>('');

  // Carrusel tipo "stack"
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragDX, setDragDX] = useState(0);

  // Formato API yyyy-mm-dd
  const formatDateForAPI = (date: Date) => date.toISOString().split('T')[0];
  const { data: appointmentsFromAPI, isLoading, isError, mutate } = useAppointments(
    formatDateForAPI(selectedDate)
  );

  // Estado local de citas (permite futuras interacciones como attended/noShow)
  const [localAppointments, setLocalAppointments] = useState<Appointment[]>([]);
  useEffect(() => {
    if (appointmentsFromAPI) {
      setLocalAppointments(appointmentsFromAPI.map(a => ({ ...a, attended: a.attended || false })));
      setCurrentCardIndex(0);
    }
  }, [appointmentsFromAPI]);

  // Persistir fecha
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastSelectedDate', selectedDate.toISOString());
    }
  }, [selectedDate]);

  const appointments = localAppointments;

  const formatDateES = (date: Date) =>
    date.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' });

  // Preparar valor del input date cuando se abre el modal
  useEffect(() => {
    if (showCalendar) {
      const y = selectedDate.getFullYear();
      const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const d = String(selectedDate.getDate()).padStart(2, '0');
      setDateInputValue(`${y}-${m}-${d}`);
    }
  }, [showCalendar, selectedDate]);

  // Acciones de navegación
  const prev = () => setCurrentCardIndex(i => Math.max(i - 1, 0));
  const next = () => setCurrentCardIndex(i => Math.min(i + 1, Math.max(appointments.length - 1, 0)));

  // Drag handlers (pointer events)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Solo arrastrar la tarjeta activa
    const target = (e.target as HTMLElement).closest('[data-card-index]') as HTMLElement | null;
    if (!target) return;
    const indexAttr = target.getAttribute('data-card-index');
    if (indexAttr === null || Number(indexAttr) !== currentCardIndex) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
    (e.currentTarget as any)._startX = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const startX = (e.currentTarget as any)._startX as number | undefined;
    if (startX === undefined) return;
    setDragDX(e.clientX - startX);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    setIsDragging(false);
    const threshold = (typeof window !== 'undefined' ? window.innerWidth : 360) / 5;
    if (Math.abs(dragDX) > threshold) {
      if (dragDX > 0) prev(); else next();
    }
    setDragDX(0);
  };

  // Transform base por offset
  const computeCardStyle = (index: number): React.CSSProperties => {
    const offset = index - currentCardIndex;
    const common: React.CSSProperties = {
      transition: isDragging ? 'none' : 'transform 0.4s ease, opacity 0.4s ease',
      zIndex: 8,
      opacity: 0,
    };
    if (offset === 0) {
      if (isDragging) {
        const rotate = dragDX * 0.05;
        return { ...common, transform: `translateX(${dragDX}px) rotate(${rotate}deg)`, opacity: 1, zIndex: 10 };
      }
      return { ...common, transform: 'translateX(0) scale(1)', opacity: 1, zIndex: 10 };
    }
    if (offset === 1) return { ...common, transform: 'translateX(30px) scale(0.9)', opacity: 0.5, zIndex: 9 };
    if (offset === -1) return { ...common, transform: 'translateX(-30px) scale(0.9)', opacity: 0.5, zIndex: 9 };
    return { ...common, transform: `translateX(${offset > 0 ? 60 : -60}px) scale(0.8)` };
  };

  const handleAcceptDate = () => {
    if (dateInputValue) {
      const selected = new Date(`${dateInputValue}T00:00:00`);
      setSelectedDate(selected);
      mutate();
    }
    setShowCalendar(false);
  };

  const headerDateText = useMemo(() => formatDateES(selectedDate), [selectedDate]);

  if (isError) {
    return (
      <div className="min-h-screen bg-[var(--exora-background)] p-4">
        <div className="max-w-md mx-auto">
          <div className="bg-[color:var(--exora-light-blue)] border border-gray-200 rounded-lg p-4 text-center">
            <h2 className="text-[color:var(--exora-dark)] font-semibold mb-2">Error al cargar las citas</h2>
            <p className="text-[color:var(--exora-dark)]/80 text-sm mb-4">No se pudieron cargar las citas para esta fecha.</p>
            <button onClick={() => mutate()} className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: 'var(--exora-primary)' }}>Reintentar</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 text-black" style={{ paddingBottom: 'calc(96px + env(safe-area-inset-bottom))', backgroundColor: 'var(--exora-background)' }}>
      {/* Header alineado a la derecha con selector de fecha */}
      <header className="flex justify-end items-center mb-6">
        <button onClick={() => setShowCalendar(true)} className="flex items-center space-x-2 p-2 rounded-lg transition bg-gray-100 hover:bg-gray-200">
          <span className="font-semibold text-md text-gray-700">{headerDateText}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
        </button>
      </header>

      {/* Contenedor principal de tarjetas */}
      <main className="flex-grow flex flex-col items-center justify-center">
        <div className="card-stack" onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
          {isLoading && (
            <div className="card" style={{ position: 'relative' }}>
              <div className="card-content animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-3" />
                <div className="h-10 bg-gray-200 rounded mb-6" />
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          )}

          {!isLoading && appointments.length === 0 && (
            <div className="text-center text-gray-600">No hay citas para esta fecha</div>
          )}

          {appointments.map((apt, i) => (
            <div key={apt.id} className="card" data-card-index={i} style={computeCardStyle(i)}>
              <div className="card-content">
                <div className="text-center mb-3">
                  <h2 className="text-3xl font-bold client-name" style={{ color: 'var(--exora-dark)' }}>
                    {apt.clienteNombre} {apt.clienteApellidos}
                  </h2>
                  <p className="text-5xl font-bold mt-2" style={{ color: 'var(--exora-primary)' }}>
                    {apt.horaInicio}
                  </p>
                </div>
                <div className="info-list mt-4 flex-grow">
                  <div className="info-row">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    <span><span className="label">Teléfono:</span><a href={`tel:${apt.telefono}`} className="underline hover:text-blue-500">{apt.telefono}</a></span>
                  </div>
                  <div className="info-row">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                    <span><span className="label">Servicio:</span><span className="service-name">{apt.servicio}</span></span>
                  </div>
                  {apt.variante && (
                    <div className="info-row">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                      <span><span className="label">Variante:</span>{apt.variante}</span>
                    </div>
                  )}
                  <div className="info-row">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <span><span className="label">Sucursal:</span>{apt.sucursal}</span>
                  </div>
                  <div className="info-row">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="5" x2="5" y2="19"></line><circle cx="6.5" cy="6.5" r="2.5"></circle><circle cx="17.5" cy="17.5" r="2.5"></circle></svg>
                    <span><span className="label">Descuentos:</span>{apt.descuentos && apt.descuentos.length > 0 ? apt.descuentos.join(', ') : 'No'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom navigation */}
      <nav className="bottom-nav">
        <button onClick={prev} className="p-4 rounded-full bg-white/20 transition transform hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <div className="fab" onClick={() => alert('Funcionalidad para añadir nueva cita.') }>
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#02145C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
        </div>
        <button onClick={next} className="p-4 rounded-full bg-white/20 transition transform hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </nav>

      {/* Modal del Calendario */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <input type="date" value={dateInputValue} onChange={(e) => setDateInputValue(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg" />
            <button onClick={handleAcceptDate} className="w-full mt-4 text-white py-2 rounded-lg font-semibold" style={{ backgroundColor: 'var(--exora-primary)' }}>Aceptar</button>
          </div>
        </div>
      )}
    </div>
  );
}