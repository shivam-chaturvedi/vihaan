interface StatusBadgeProps {
  status: string | null;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (!status) return null;

  const statusLower = status.toLowerCase();

  let classes = 'bg-stone-100 text-stone-700';

  if (statusLower === 'clear') {
    classes = 'bg-emerald-100 text-emerald-700';
  } else if (statusLower === 'cloudy') {
    classes = 'bg-amber-100 text-amber-700';
  } else if (statusLower === 'dirty') {
    classes = 'bg-rose-100 text-rose-700';
  }

  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${classes}`}>{status.toUpperCase()}</span>;
}
