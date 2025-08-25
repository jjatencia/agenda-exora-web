'use client';

import { Appointment } from '@/types';

interface Props {
  appointment: Appointment;
  onNoShow: (id: string) => void;
}

export default function AppointmentCard({ appointment, onNoShow }: Props) {
  // Formatear fecha en DD/MM/AAAA
  const formatDate = (dateISO: string) => {
    const date = new Date(dateISO);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 w-80 flex-shrink-0 relative overflow-hidden">
      {/* Accent line en el top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary"></div>
      
      {/* Header con nombre del cliente */}
      <div className="mb-4">
        <h2 className="font-heading text-xl font-semibold text-primary mb-1">
          {appointment.clienteNombre} {appointment.clienteApellidos}
        </h2>
        <p className="text-sm text-gray-600 flex items-center">
          <span className="inline-block w-4 h-4 mr-2">📞</span>
          {appointment.telefono}
        </p>
      </div>

      {/* Servicio principal */}
      <div className="mb-4 p-3 bg-complement3 rounded-lg">
        <h3 className="font-medium text-complement4 text-lg mb-1">
          {appointment.servicio}
        </h3>
        {appointment.variante && (
          <p className="text-sm text-gray-700 italic">+ {appointment.variante}</p>
        )}
      </div>

      {/* Detalles de la cita */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm">
          <span className="w-16 text-gray-500 font-medium">Lugar:</span>
          <span className="text-gray-800">{appointment.sucursal}</span>
        </div>
        <div className="flex items-center text-sm">
          <span className="w-16 text-gray-500 font-medium">Con:</span>
          <span className="text-gray-800">{appointment.profesional}</span>
        </div>
        <div className="flex items-center text-sm">
          <span className="w-16 text-gray-500 font-medium">Fecha:</span>
          <span className="text-gray-800 font-medium">{formatDate(appointment.fechaISO)}</span>
        </div>
        <div className="flex items-center text-sm">
          <span className="w-16 text-gray-500 font-medium">Hora:</span>
          <span className="text-gray-800 font-medium text-lg">{appointment.horaInicio}</span>
        </div>
      </div>

      {/* Descuentos */}
      {appointment.descuentos?.length && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 mb-2 font-medium">PROMOCIONES:</p>
          <div className="flex flex-wrap gap-1">
            {appointment.descuentos.map((d) => (
              <span key={d} className="text-xs bg-complement1 text-complement4 px-2 py-1 rounded-full font-medium">
                🎯 {d}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Estado No Show */}
      {appointment.noShow && (
        <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded-lg">
          <span className="text-red-600 font-semibold text-sm flex items-center">
            ⚠️ Cliente no se presentó
          </span>
        </div>
      )}

      {/* Botón de acción */}
      <button
        className={`w-full py-3 px-4 rounded-lg font-medium text-sm transition-all ${
          appointment.noShow
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-secondary text-white hover:bg-opacity-90 active:scale-95 shadow-md hover:shadow-lg'
        }`}
        disabled={appointment.noShow}
        onClick={() => onNoShow(appointment.id)}
      >
        {appointment.noShow ? 'Ya marcado como ausente' : 'No se ha presentado a la cita'}
      </button>
    </div>
  );
}
