export function todayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function isWithin90Days(dateString: string): boolean {
  const date = new Date(dateString);
  const cutoff = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  return date >= cutoff;
}

export function prune90DayWindow(
  ids: string[],
  dates: string[]
): { ids: string[]; dates: string[] } {
  const filtered = ids
    .map((id, i) => ({ id, date: dates[i] ?? '' }))
    .filter(({ date }) => isWithin90Days(date));
  return {
    ids: filtered.map((f) => f.id),
    dates: filtered.map((f) => f.date),
  };
}

export function formatNotificationTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${m.toString().padStart(2, '0')} ${suffix}`;
}
