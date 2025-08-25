'use client';

import useSWR from 'swr';
import { Appointment } from '@/types';
import { fetcher } from '@/lib/api';

export default function useAppointments(date: string) {
  const { data, error, mutate } = useSWR<Appointment[]>(`/api/appointments?date=${date}`, fetcher);
  return {
    data,
    isLoading: !data && !error,
    isError: !!error,
    mutate,
  };
}
