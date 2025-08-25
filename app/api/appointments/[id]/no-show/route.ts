import { NextResponse } from 'next/server';
import { appointments } from '../../data';

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const appt = appointments.find((a) => a.id === params.id);
  if (!appt) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  appt.noShow = true;
  return NextResponse.json({ ok: true });
}
