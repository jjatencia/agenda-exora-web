'use client';

import useSWR from 'swr';
import { Appointment } from '@/types';
import { fetcher, buildUrl } from '@/lib/api';

export default function useAppointments(date: string) {
  const url = buildUrl(`/api/appointments?date=${date}`);
  const { data, error, mutate } = useSWR<Appointment[]>(url, fetcher);
  return {
    data,
    isLoading: !data && !error,
    isError: !!error,
    mutate,
  };
}
