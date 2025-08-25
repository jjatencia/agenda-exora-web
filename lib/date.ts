import { format as f, parseISO as parseISODate } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatHeaderDate(date: Date) {
  return f(date, "EEEE, dd/MM/yyyy", { locale: es });
}

export function parseISO(str: string) {
  return parseISODate(str);
}

export function format(date: Date, pattern: string) {
  return f(date, pattern, { locale: es });
}
