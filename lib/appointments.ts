import { Appointment } from '@/types';

/**
 * Determina si una cita debe estar deshabilitada basándose en:
 * - Si está pagada
 * - Si ya pasó su hora + 15 minutos de margen
 */
export function isAppointmentDisabled(appointment: Appointment): boolean {
  if (!appointment.pagada) {
    return false;
  }

  const now = new Date();
  const appointmentDateTime = new Date(`${appointment.fechaISO}T${appointment.horaInicio}:00`);

  // Agregar 15 minutos de margen
  appointmentDateTime.setMinutes(appointmentDateTime.getMinutes() + 15);

  // Si la hora actual es mayor que la hora de la cita + 15 min, deshabilitar
  return now > appointmentDateTime;
}

/**
 * Filtra las citas que deben mostrarse (todas las del día)
 * y las ordena por hora de inicio
 */
export function filterAndSortAppointments(appointments: Appointment[]): Appointment[] {
  return appointments
    .sort((a, b) => {
      // Ordenar por hora de inicio
      return a.horaInicio.localeCompare(b.horaInicio);
    });
}