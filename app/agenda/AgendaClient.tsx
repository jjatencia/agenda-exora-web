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
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
            <h2 className="text-red-600 font-semibold mb-2">Error al cargar las citas</h2>
            <p className="text-red-500 text-sm mb-4">
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
    <div className="min-h-screen bg-gradient-to-br from-complement3 to-white">
      {/* Header con branding */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-md mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-heading text-2xl font-bold text-primary">
                Agenda Barbería
              </h1>
              {userEmail && (
                <p className="text-sm text-gray-600">
                  {userEmail}
                </p>
              )}
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">✂️</span>
            </div>
          </div>
          
          {/* Selector de fecha */}
          <div className="bg-gray-50 rounded-lg p-3">
            <DateHeader 
              date={selectedDate} 
              onChange={handleDateChange}
            />
            <button
              onClick={() => setShowDatePicker(true)}
              className="w-full mt-2 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              📅 Seleccionar otra fecha
            </button>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-md mx-auto p-4">
        {isLoading ? (
          // Skeleton loading
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-6 animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-20 bg-gray-200 rounded mb-4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : appointments && appointments.length > 0 ? (
          <div className="space-y-6">
            {/* Resumen del día */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h2 className="font-heading text-lg font-semibold text-gray-800 mb-2">
                Resumen del día
              </h2>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total de citas:</span>
                <span className="font-semibold text-primary">{appointments.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Atendidos:</span>
                <span className="font-semibold text-green-600">
                  {appointments.filter(a => a.attended && !a.noShow).length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Pendientes:</span>
                <span className="font-semibold text-blue-600">
                  {appointments.filter(a => !a.noShow && !a.attended).length}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">No presentados:</span>
                <span className="font-semibold text-red-600">
                  {appointments.filter(a => a.noShow).length}
                </span>
              </div>
            </div>

            {/* Carrusel de tarjetas */}
            <div className="space-y-4">
              <h2 className="font-heading text-lg font-semibold text-gray-800 text-center">
                Citas del día
              </h2>
              <CardCarousel
                appointments={appointments}
                onRefresh={handleRefresh}
                onAttended={handleAttended}
                onNoShow={handleNoShow}
              />
            </div>
          </div>
        ) : (
          <NoData onPick={() => setShowDatePicker(true)} />
        )}
      </main>

      {/* Modal del selector de fecha */}
      {showDatePicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-sm w-full">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-heading text-lg font-semibold text-gray-800">
                Seleccionar fecha
              </h3>
            </div>
            <div className="p-4">
              <DayPicker
                selectedDate={selectedDate}
                onDateSelect={handleDateChange}
              />
            </div>
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => setShowDatePicker(false)}
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}