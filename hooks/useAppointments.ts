'use client';

import useSWR from 'swr';
import { Appointment } from '@/types';
import { fetcher, buildUrl } from '@/lib/api';

interface UseAppointmentsParams {
  date: string;
  empresa: string;
  profesional?: string;
}

export default function useAppointments({ date, empresa, profesional }: UseAppointmentsParams) {
  const params = new URLSearchParams({
    date,
    empresa,
    ...(profesional && { profesional })
  });

  const url = buildUrl(`/api/appointments?${params.toString()}`);
  const { data, error, mutate } = useSWR<Appointment[]>(url, fetcher);

  return {
    data,
    isLoading: !data && !error,
    isError: !!error,
    mutate,
  };
}
