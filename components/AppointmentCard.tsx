'use client';

import { useState } from 'react';
import { Appointment } from '@/types';
import ConfirmationModal from './ConfirmationModal';

interface Props {
  appointment: Appointment;
  onNoShow: (id: string) => void;
  onAttended?: (id: string) => void;
  index: number;
}

export default function AppointmentCard({ appointment, onNoShow, onAttended, index }: Props) {
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
      className="card"
      data-index={index}
    >
      <div className="card-content">
        <div className="text-center mb-3">
          <h2 className="text-3xl font-bold client-name">
            {appointment.clienteNombre} {appointment.clienteApellidos}
          </h2>
          <p className="text-5xl font-bold mt-2" style={{ color: 'var(--exora-primary)' }}>
            {appointment.horaInicio}
          </p>
        </div>
        
        <div className="info-list mt-4 flex-grow">
          <div className="info-row">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            <span>
              <span className="label">Teléfono:</span>
              <a href={`tel:${appointment.telefono}`} className="underline hover:text-blue-500">
                {appointment.telefono}
              </a>
            </span>
          </div>
          
          <div className="info-row">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span>
              <span className="label">Servicio:</span>
              <span className="service-name">{appointment.servicio}</span>
            </span>
          </div>
          
          <div className="info-row">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
              <line x1="7" y1="7" x2="7.01" y2="7"></line>
            </svg>
            <span>
              <span className="label">Variante:</span>
              {appointment.variante || 'Sin variante'}
            </span>
          </div>
          
          <div className="info-row">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>
              <span className="label">Sucursal:</span>
              {appointment.sucursal}
            </span>
          </div>
          
          <div className="info-row">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="5" x2="5" y2="19"></line>
              <circle cx="6.5" cy="6.5" r="2.5"></circle>
              <circle cx="17.5" cy="17.5" r="2.5"></circle>
            </svg>
            <span>
              <span className="label">Descuentos:</span>
              {appointment.descuentos?.length ? appointment.descuentos.join(', ') : 'No'}
            </span>
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
