'use client';

import { Appointment } from '@/types';
import { isAppointmentDisabled } from '@/lib/appointments';

interface Props {
  appointment: Appointment;
  onNoShow: (id: string) => void;
}

export default function AppointmentCard({ appointment, onNoShow }: Props) {
  const isDisabled = isAppointmentDisabled(appointment);
  return (
    <div className={`bg-white rounded shadow p-4 w-72 flex-shrink-0 ${isDisabled ? 'opacity-50 bg-gray-50' : ''}`}>
      {appointment.pagada && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
            PAGADA
          </span>
          {isDisabled && (
            <span className="text-xs text-gray-500">
              Cita finalizada
            </span>
          )}
        </div>
      )}
      <h2 className={`font-heading text-lg text-primary ${isDisabled ? 'text-gray-400' : ''}`}>
        {appointment.clienteNombre} {appointment.clienteApellidos}
      </h2>
      <p className={`text-sm ${isDisabled ? 'text-gray-400' : ''}`}>{appointment.telefono}</p>
      <p className={`mt-2 font-medium ${isDisabled ? 'text-gray-400' : ''}`}>{appointment.servicio}</p>
      {appointment.variante && <p className={`text-sm ${isDisabled ? 'text-gray-400' : ''}`}>{appointment.variante}</p>}
      <p className={`text-sm ${isDisabled ? 'text-gray-400' : ''}`}>{appointment.sucursal}</p>
      <p className={`text-sm ${isDisabled ? 'text-gray-400' : ''}`}>{appointment.profesional}</p>
      <p className={`text-sm font-mono ${isDisabled ? 'text-gray-400' : ''}`}>
        {appointment.fechaISO} {appointment.horaInicio}
      </p>
      {appointment.descuentos?.length && (
        <div className="flex flex-wrap gap-1 mt-2">
          {appointment.descuentos.map((d) => (
            <span key={d} className={`text-xs px-2 py-0.5 rounded ${isDisabled ? 'bg-gray-100 text-gray-400' : 'bg-complement2'}`}>
              {d}
            </span>
          ))}
        </div>
      )}
      {appointment.noShow && (
        <span className="block mt-2 text-secondary font-bold">No show</span>
      )}
      <button
        className="mt-4 w-full border border-secondary text-secondary py-1 rounded disabled:opacity-50"
        disabled={appointment.noShow || isDisabled}
        onClick={() => onNoShow(appointment.id)}
      >
        No se ha presentado a la cita
      </button>
    </div>
  );
}
