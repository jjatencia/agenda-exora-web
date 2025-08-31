'use client';

import { useState, useEffect } from 'react';
import DateHeader from '@/components/DateHeader';
import CardCarousel from '@/components/CardCarousel';
import NoData from '@/components/NoData';
import DayPicker from '@/components/DayPicker';
import useAppointments from '@/hooks/useAppointments';
import { Appointment } from '@/types';

interface Props {
  userEmail?: string | null;
}

export default function AgendaClient({ userEmail }: Props) {
  const [selectedDate, setSelectedDate] = useState(() => {
    // Intentar cargar la última fecha del localStorage o usar hoy
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lastSelectedDate');
      if (saved) {
        return new Date(saved);
      }
    }
    return new Date();
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Formatear fecha para la API (YYYY-MM-DD)
  const formatDateForAPI = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const { data: appointmentsFromAPI, isLoading, isError, mutate } = useAppointments(
    formatDateForAPI(selectedDate)
  );

  // Estado local para manejar el estado "attended" de las citas
  const [localAppointments, setLocalAppointments] = useState<Appointment[]>([]);

  // Sincronizar datos de la API con el estado local
  useEffect(() => {
    if (appointmentsFromAPI) {
      setLocalAppointments(appointmentsFromAPI.map(apt => ({
        ...apt,
        attended: apt.attended || false
      })));
    }
  }, [appointmentsFromAPI]);

  // Usar el estado local para mostrar las citas
  const appointments = localAppointments;

  // Guardar la fecha seleccionada en localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastSelectedDate', selectedDate.toISOString());
    }
  }, [selectedDate]);

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
    setShowDatePicker(false);
  };

  const handleRefresh = () => {
    mutate();
  };

  const handleAttended = (appointmentId: string) => {
    setLocalAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, attended: !apt.attended } // Toggle el estado
          : apt
      )
    );
  };

  const handleNoShow = (appointmentId: string) => {
    setLocalAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, noShow: true }
          : apt
      )
    );
  };

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-complement3 to-white p-4">
        <div className="max-w-md mx-auto">
          <div className="bg-secondary bg-opacity-10 border border-secondary border-opacity-30 rounded-lg p-4 text-center">
            <h2 className="text-secondary font-semibold mb-2">Error al cargar las citas</h2>
            <p className="text-secondary text-opacity-80 text-sm mb-4">
              No se pudieron cargar las citas para esta fecha.
            </p>
            <button
              onClick={handleRefresh}
              className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 text-black overflow-hidden" style={{ paddingBottom: 'calc(96px + env(safe-area-inset-bottom))' }}>
      {/* Cabecera simplificada sin logo, alineada a la derecha */}
      <header className="flex justify-end items-center mb-6">
        <div 
          onClick={() => setShowDatePicker(true)}
          className="cursor-pointer"
        >
          <DateHeader 
            date={selectedDate} 
            onChange={handleDateChange}
          />
        </div>
      </header>

      {/* Contenedor principal de las tarjetas */}
      <main className="flex-grow flex flex-col items-center justify-center">
        {isLoading ? (
          // Skeleton loading
          <div className="card-stack">
            <div className="card animate-pulse">
              <div className="card-content">
                <div className="text-center mb-3">
                  <div className="h-8 bg-gray-200 rounded mb-2"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-3 mt-4">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        ) : appointments && appointments.length > 0 ? (
          <CardCarousel
            appointments={appointments}
            onRefresh={handleRefresh}
            onAttended={handleAttended}
            onNoShow={handleNoShow}
          />
        ) : (
          <NoData onPick={() => setShowDatePicker(true)} />
        )}
      </main>

      {/* Modal del Calendario */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-40">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <DayPicker
              selectedDate={selectedDate}
              onDateSelect={handleDateChange}
            />
            <button 
              onClick={() => setShowDatePicker(false)}
              className="w-full mt-4 text-white py-2 rounded-lg font-semibold"
              style={{ backgroundColor: 'var(--exora-primary)' }}
            >
              Aceptar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}