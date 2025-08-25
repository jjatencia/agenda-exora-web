import { Appointment } from '@/types';

export const appointments: Appointment[] = [
  {
    id: '1',
    clienteNombre: 'Juan',
    clienteApellidos: 'Pérez',
    telefono: '600000000',
    servicio: 'Corte de cabello adulto',
    variante: 'Degradado',
    sucursal: 'Parets',
    profesional: 'Luis',
    fechaISO: '2025-08-25',
    horaInicio: '10:00',
    descuentos: ['Promo verano'],
  },
  {
    id: '2',
    clienteNombre: 'María',
    clienteApellidos: 'López',
    telefono: '600000001',
    servicio: 'Afeitado',
    sucursal: 'Lliçà',
    profesional: 'Carlos',
    fechaISO: '2025-08-25',
    horaInicio: '11:00',
  },
];
