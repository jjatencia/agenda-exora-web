'use client';

import { Appointment } from '@/types';

interface Props {
  appointment: Appointment;
  onNoShow: (id: string) => void;
}

export default function AppointmentCard({ appointment, onNoShow }: Props) {
  return (
    <div className="bg-white rounded shadow p-4 w-72 flex-shrink-0">
      <h2 className="font-heading text-lg text-primary">
        {appointment.clienteNombre} {appointment.clienteApellidos}
      </h2>
      <p className="text-sm">{appointment.telefono}</p>
      <p className="mt-2 font-medium">{appointment.servicio}</p>
      {appointment.variante && <p className="text-sm">{appointment.variante}</p>}
      <p className="text-sm">{appointment.sucursal}</p>
      <p className="text-sm">{appointment.profesional}</p>
      <p className="text-sm">
        {appointment.fechaISO} {appointment.horaInicio}
      </p>
      {appointment.descuentos?.length && (
        <div className="flex flex-wrap gap-1 mt-2">
          {appointment.descuentos.map((d) => (
            <span key={d} className="text-xs bg-complement2 px-2 py-0.5 rounded">
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
        disabled={appointment.noShow}
        onClick={() => onNoShow(appointment.id)}
      >
        No se ha presentado a la cita
      </button>
    </div>
  );
}
