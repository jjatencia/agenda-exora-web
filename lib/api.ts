export async function fetcher(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Network error');
  return res.json();
}

export async function markNoShow(id: string) {
  const res = await fetch(`/api/appointments/${id}/no-show`, { method: 'POST' });
  if (!res.ok) throw new Error('Network error');
  return res.json();
}
