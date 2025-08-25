'use client';

import { useEffect, useState } from 'react';
import DateHeader from '@/components/DateHeader';
import CardCarousel from '@/components/CardCarousel';
import NoData from '@/components/NoData';
import useAppointments from '@/hooks/useAppointments';
import { useSearchParams, useRouter } from 'next/navigation';
import { parseISO, format } from '@/lib/date';

export default function HomePage() {
  const search = useSearchParams();
  const router = useRouter();
  const initial = search.get('date');
  const [date, setDate] = useState(() => (initial ? parseISO(initial) : new Date()));

  useEffect(() => {
    localStorage.setItem('lastDate', date.toISOString().slice(0, 10));
  }, [date]);

  const iso = date.toISOString().slice(0, 10);
  const { data, isLoading, mutate } = useAppointments(iso);

  function handleChange(d: Date) {
    setDate(d);
    router.replace(`/?date=${d.toISOString().slice(0, 10)}`);
  }

  return (
    <main className="p-4 space-y-4">
      <DateHeader date={date} onChange={handleChange} />
      {isLoading ? (
        <p>Cargando...</p>
      ) : data && data.length > 0 ? (
        <CardCarousel appointments={data} onRefresh={mutate} />
      ) : (
        <NoData onPick={() => {}} />
      )}
    </main>
  );
}
