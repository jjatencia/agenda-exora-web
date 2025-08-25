const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export function buildUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

export async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Network error');
  return res.json();
}

export async function markNoShow(id: string) {
  const res = await fetch(buildUrl(`/api/appointments/${id}/no-show`), {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Network error');
  return res.json();
}
