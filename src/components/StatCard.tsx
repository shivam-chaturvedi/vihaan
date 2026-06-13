import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number | null;
  unit?: string;
  icon: ReactNode;
  color?:
    | 'cyan'
    | 'green'
    | 'amber'
    | 'violet'
    | 'rose'
    | 'teal'
    | 'orange'
    | 'emerald'
    | 'lime'
    | 'fuchsia';
}

export function StatCard({ title, value, unit, icon, color = 'cyan' }: StatCardProps) {
  const colorClasses = {
    cyan: 'bg-cyan-50 border-cyan-100 text-cyan-700',
    green: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    amber: 'bg-amber-50 border-amber-100 text-amber-700',
    violet: 'bg-violet-50 border-violet-100 text-violet-700',
    rose: 'bg-rose-50 border-rose-100 text-rose-700',
    teal: 'bg-teal-50 border-teal-100 text-teal-700',
    orange: 'bg-orange-50 border-orange-100 text-orange-700',
    emerald: 'bg-emerald-50 border-emerald-100 text-emerald-700',
    lime: 'bg-lime-50 border-lime-100 text-lime-700',
    fuchsia: 'bg-fuchsia-50 border-fuchsia-100 text-fuchsia-700',
  };

  const displayValue =
    value !== null && value !== undefined ? (typeof value === 'number' ? value.toFixed(2) : value) : 'N/A';

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-stone-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-stone-900 break-words">
            {displayValue}
            {unit && <span className="ml-1 text-lg font-normal text-stone-400">{unit}</span>}
          </p>
        </div>
        <div className={`rounded-md border p-3 ${colorClasses[color]}`}>{icon}</div>
      </div>
    </div>
  );
}
