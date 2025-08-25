import { NextResponse } from 'next/server';
import { appointments } from './data';

/**
 * Returns appointments for a given date.
 *
 * Query parameters:
 * - `date`: ISO-8601 date string (e.g., 2025-08-25).
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (!date || isNaN(Date.parse(date))) {
    return NextResponse.json({ error: 'Missing date' }, { status: 400 });
  }

  return NextResponse.json(appointments.filter((a) => a.fechaISO === date));
}
