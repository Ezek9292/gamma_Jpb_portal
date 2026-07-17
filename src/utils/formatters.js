export function formatDate(date) {
  if (!date) return 'Date unavailable';
  const value = /^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T00:00:00` : date;
  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) return 'Date unavailable';
  return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(parsedDate);
}

export function titleCase(value) {
  return value.replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}
