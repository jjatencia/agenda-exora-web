import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { appointments } from './data';

/**
 * Returns appointments for a given date and professional.
 *
 * Query parameters:
 * - `date`: ISO-8601 date string (e.g., 2025-08-25).
 * - `empresa`: Company identifier
 * - `profesional`: Professional identifier (optional)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const empresa = searchParams.get('empresa');
  const profesional = searchParams.get('profesional');

  if (!date || isNaN(Date.parse(date))) {
    return NextResponse.json({ error: 'Missing or invalid date' }, { status: 400 });
  }

  if (!empresa) {
    return NextResponse.json({ error: 'Missing empresa parameter' }, { status: 400 });
  }

  try {
    // Get session to retrieve the token
    const session = await getServerSession();
    const token = (session?.user as any)?.accessToken;

    if (!token) {
      // If no token, fall back to mock data for development
      return NextResponse.json(appointments.filter((a) => a.fechaISO === date));
    }

    // Call the external API
    const response = await fetch('https://api.exora.app/api/citas/dia/profesional', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-token': token
      },
      body: JSON.stringify({
        empresa,
        fecha: date,
        ...(profesional && { profesional })
      })
    });

    if (!response.ok) {
      console.error('External API error:', response.status, response.statusText);
      // Fall back to mock data if external API fails
      return NextResponse.json(appointments.filter((a) => a.fechaISO === date));
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('API error:', error);
    // Fall back to mock data in case of error
    return NextResponse.json(appointments.filter((a) => a.fechaISO === date));
  }
}
