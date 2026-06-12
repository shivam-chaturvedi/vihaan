interface StatusBadgeProps {
  status: string | null;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  if (!status) return null;

  const statusLower = status.toLowerCase();
  
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-800';

  if (statusLower === 'clear') {
    bgColor = 'bg-green-100';
    textColor = 'text-green-800';
  } else if (statusLower === 'cloudy') {
    bgColor = 'bg-yellow-100';
    textColor = 'text-yellow-800';
  } else if (statusLower === 'dirty') {
    bgColor = 'bg-red-100';
    textColor = 'text-red-800';
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}
    >
      {status.toUpperCase()}
    </span>
  );
}
