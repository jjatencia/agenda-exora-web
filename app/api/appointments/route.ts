import { NextResponse } from 'next/server';
import { appointments } from './data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  if (!date) return NextResponse.json([]);
  return NextResponse.json(appointments.filter((a) => a.fechaISO === date));
}
