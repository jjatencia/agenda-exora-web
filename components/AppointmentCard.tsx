'use client';

import { useState } from 'react';
import { Appointment } from '@/types';
import ConfirmationModal from './ConfirmationModal';

interface Props {
  appointment: Appointment;
  onNoShow: (id: string) => void;
  onAttended?: (id: string) => void;
}

export default function AppointmentCard({ appointment, onNoShow, onAttended }: Props) {
  const [isAttended, setIsAttended] = useState(appointment.attended || false);
  const [lastTap, setLastTap] = useState(0);
  const [showNoShowModal, setShowNoShowModal] = useState(false);
  // Formatear fecha en DD/MM/AAAA
  const formatDate = (dateISO: string) => {
    const date = new Date(dateISO);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Manejar doble tap para toggle estado atendido
  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      // Es un doble tap - toggle estado atendido
      if (!appointment.noShow && onAttended) {
        const newAttendedState = !isAttended;
        setIsAttended(newAttendedState);
        onAttended(appointment.id);
        
        // Mostrar toast apropiado
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-lg shadow-lg z-50';
        toast.textContent = newAttendedState ? 'Cliente atendido ✅' : 'Estado revertido ↩️';
        document.body.appendChild(toast);
        setTimeout(() => document.body.removeChild(toast), 2000);
      }
    }
    setLastTap(now);
  };

  // Formatear teléfono para llamada
  const handlePhoneCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${appointment.telefono}`;
  };

  // Manejar click en botón "No se ha presentado"
  const handleNoShowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowNoShowModal(true);
  };

  // Confirmar "No se ha presentado"
  const handleConfirmNoShow = () => {
    if (onNoShow) {
      onNoShow(appointment.id);
    }
    setShowNoShowModal(false);
  };

  // Cancelar "No se ha presentado"
  const handleCancelNoShow = () => {
    setShowNoShowModal(false);
  };

  return (
    <div 
      className={`bg-white rounded-xl shadow-lg border border-gray-100 p-6 flex-shrink-0 relative overflow-hidden transition-all duration-300 ${
        isAttended ? 'opacity-50 bg-gray-50' : ''
              } ${appointment.noShow ? 'bg-secondary bg-opacity-10 border-secondary border-opacity-30' : ''}`}
      style={{ width: '100%', maxWidth: '400px' }}
      onClick={handleDoubleTap}
    >
      {/* Accent line en el top */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${
        isAttended ? 'bg-complement2' : 
        appointment.noShow ? 'bg-secondary' : 
        'bg-gradient-to-r from-primary to-secondary'
      }`}></div>
      
      {/* Header con nombre del cliente */}
      <div className="mb-4">
        <h2 className="font-heading text-xl font-semibold text-primary mb-1">
          {appointment.clienteNombre} {appointment.clienteApellidos}
        </h2>
        <button 
          onClick={handlePhoneCall}
          className="text-sm text-primary hover:text-complement4 flex items-center transition-colors cursor-pointer"
        >
          <span className="inline-block w-4 h-4 mr-2">📞</span>
          {appointment.telefono}
        </button>
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
        <div className="mb-4 p-2 bg-secondary bg-opacity-10 border border-secondary border-opacity-30 rounded-lg">
          <span className="text-secondary font-semibold text-sm flex items-center">
            ⚠️ Cliente no se presentó
          </span>
        </div>
      )}

      {/* Estado Atendido */}
      {isAttended && !appointment.noShow && (
        <div className="mb-4 p-2 bg-complement2 bg-opacity-20 border border-complement2 border-opacity-50 rounded-lg">
          <span className="text-complement4 font-semibold text-sm flex items-center">
            ✅ Cliente atendido
          </span>
        </div>
      )}

      {/* Instrucciones y botón de acción */}
      {!appointment.noShow && (
        <div className="mb-3 p-2 bg-complement3 bg-opacity-50 border border-primary border-opacity-30 rounded-lg">
          <span className="text-primary text-xs font-medium">
            💡 Doble tap para {isAttended ? 'revertir' : 'marcar como atendido'}
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
        onClick={handleNoShowClick}
      >
        {appointment.noShow ? 'Ya marcado como ausente' : 'No se ha presentado a la cita'}
      </button>

      {/* Modal de confirmación */}
      <ConfirmationModal
        isOpen={showNoShowModal}
        title="Confirmar ausencia"
        message={`¿Estás seguro de que ${appointment.clienteNombre} ${appointment.clienteApellidos} no se ha presentado a la cita?`}
        confirmText="Sí, no se presentó"
        cancelText="Cancelar"
        confirmButtonType="danger"
        onConfirm={handleConfirmNoShow}
        onCancel={handleCancelNoShow}
      />
    </div>
  );
}
