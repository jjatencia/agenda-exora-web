'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import DateHeader from '@/components/DateHeader';
import CardCarousel from '@/components/CardCarousel';
import NoData from '@/components/NoData';
import { Appointment } from '@/types';

export default function AgendaPage() {
  const { data: session, status } = useSession();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'unauthenticated') redirect('/login');

  useEffect(() => {
    fetchAppointments(selectedDate);
  }, [selectedDate]);

  async function fetchAppointments(date: Date) {
    setLoading(true);
    try {
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
      const response = await fetch(`/api/appointments?date=${dateStr}`);
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      } else {
        console.error('Failed to fetch appointments');
        setAppointments([]);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }

  function handleDateChange(newDate: Date) {
    setSelectedDate(newDate);
  }

  function handleRefresh() {
    fetchAppointments(selectedDate);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary/5 to-white p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-heading font-bold text-primary mb-2">
            Agenda Exora
          </h1>
          <p className="text-gray-600">Gestión de citas y servicios</p>
        </div>

        <DateHeader date={selectedDate} onChange={handleDateChange} />

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : appointments.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              Citas para {selectedDate.toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h2>
            <CardCarousel appointments={appointments} onRefresh={handleRefresh} />
          </div>
        ) : (
          <NoData />
        )}

        <div className="text-center text-sm text-gray-500 mt-8">
          <p>¡Prueba el swipe fluido en las tarjetas!</p>
          <p className="mt-1">Las mejoras del CardCarousel están implementadas</p>
        </div>
      </div>
    </main>
  );
}
