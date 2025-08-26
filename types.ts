export type Appointment = {
  id: string;
  clienteNombre: string;
  clienteApellidos: string;
  telefono: string;
  servicio: string;
  variante?: string;
  sucursal: string;
  profesional: string;
  fechaISO: string;
  horaInicio: string;
  descuentos?: string[];
  noShow?: boolean;
  attended?: boolean;
  comentariosCita?: string; // Comentarios específicos de esta cita
  comentariosCliente?: string; // Comentarios permanentes del cliente
};
