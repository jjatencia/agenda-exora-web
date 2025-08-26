'use client';

import { useState } from 'react';
import { Appointment } from '@/types';
import ConfirmationModal from './ConfirmationModal';

// Añadir estilos CSS para el flip 3D
const flipStyles = `
  .transform-style-preserve-3d {
    transform-style: preserve-3d;
  }
  .backface-hidden {
    backface-visibility: hidden;
  }
  .rotate-y-180 {
    transform: rotateY(180deg);
  }
`;

// Inyectar estilos si no existen
if (typeof window !== 'undefined' && !document.getElementById('flip-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'flip-styles';
  styleSheet.textContent = flipStyles;
  document.head.appendChild(styleSheet);
}

interface Props {
  appointment: Appointment;
  onNoShow: (id: string) => void;
  onAttended?: (id: string) => void;
}

export default function AppointmentCard({ appointment, onNoShow, onAttended }: Props) {
  const [isAttended, setIsAttended] = useState(appointment.attended || false);
  const [lastTap, setLastTap] = useState(0);
  const [showNoShowModal, setShowNoShowModal] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
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

  // Verificar si hay comentarios
  const hasComments = appointment.comentariosCita || appointment.comentariosCliente;
  
  // Debug: Force show comments for first appointment to test
  const forceShowComments = appointment.id === '1';

  // Manejar click en el icono de comentarios
  const handleCommentsClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

    return (
    <div 
      className="flex-shrink-0 relative"
      style={{ 
        width: '100%', 
        maxWidth: '400px', 
        minHeight: '420px',
        perspective: '1000px' 
      }}
    >
      {/* Contenedor flip */}
      <div 
        className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Cara frontal */}
        <div 
          className={`absolute inset-0 backface-hidden bg-white rounded-xl shadow-lg border border-gray-100 p-6 overflow-hidden transition-all duration-300 ${
            isAttended ? 'opacity-50 bg-gray-50' : ''
          } ${appointment.noShow ? 'bg-secondary bg-opacity-10 border-secondary border-opacity-30' : ''}`}
          style={{ backfaceVisibility: 'hidden' }}
          onClick={handleDoubleTap}
        >
      {/* Accent line en el top */}
      <div className={`absolute top-0 left-0 right-0 h-1 ${
        isAttended ? 'bg-complement2' : 
        appointment.noShow ? 'bg-secondary' : 
        'bg-gradient-to-r from-primary to-secondary'
      }`}></div>

      {/* Indicador de comentarios */}
      {(hasComments || forceShowComments) && (
        <button
          onClick={handleCommentsClick}
          className="absolute top-4 right-4 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-complement4 transition-all duration-300 transform hover:scale-110 z-10"
          title="Ver comentarios"
        >
          <span className="text-lg">💬</span>
        </button>
      )}
      
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
      </div>

      {/* Cara trasera - Comentarios */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-complement3 to-white rounded-xl shadow-lg border border-gray-100 p-6 overflow-y-auto"
        style={{ 
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)'
        }}
      >
        {/* Header de comentarios */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-heading text-xl font-semibold text-primary">
            💬 Comentarios
          </h3>
          <button
            onClick={handleCommentsClick}
            className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-complement4 transition-all duration-300"
            title="Volver"
          >
            <span className="text-sm">✕</span>
          </button>
        </div>

        {/* Cliente info header */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
          <h4 className="font-semibold text-gray-800">
            {appointment.clienteNombre} {appointment.clienteApellidos}
          </h4>
          <p className="text-sm text-gray-600">{formatDate(appointment.fechaISO)} - {appointment.horaInicio}</p>
        </div>

        {/* Comentarios de la cita */}
        {(appointment.comentariosCita || (forceShowComments && appointment.id === '1')) && (
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-2">📅</span>
              <h4 className="font-semibold text-secondary">Comentarios de la cita</h4>
            </div>
            <div className="bg-secondary bg-opacity-10 border border-secondary border-opacity-30 rounded-lg p-4">
              <p className="text-gray-800 leading-relaxed">
                {appointment.comentariosCita || 'Llegará 15 minutos tarde por trabajo. Quiere el degradado más corto que la última vez.'}
              </p>
            </div>
          </div>
        )}

        {/* Comentarios del cliente */}
        {(appointment.comentariosCliente || (forceShowComments && appointment.id === '1')) && (
          <div className="mb-6">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-2">👤</span>
              <h4 className="font-semibold text-complement4">Comentarios del cliente</h4>
            </div>
            <div className="bg-complement2 bg-opacity-20 border border-complement2 border-opacity-50 rounded-lg p-4">
              <p className="text-gray-800 leading-relaxed">
                {appointment.comentariosCliente || 'Cliente VIP. Prefiere silencio durante el servicio. Siempre pide gel extra fuerte.'}
              </p>
            </div>
          </div>
        )}

        {/* Botón para volver */}
        <div className="mt-auto pt-4">
          <button
            onClick={handleCommentsClick}
            className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium text-sm hover:bg-complement4 transition-all duration-300 active:scale-95"
          >
            🔄 Volver a la cita
          </button>
        </div>
      </div>
      </div>

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
