import { ReactNode } from 'react';

type Accent = 'water' | 'soil' | 'nutrient' | 'neutral';

interface StatCardProps {
  title: string;
  value: string | number | null;
  unit?: string;
  icon: ReactNode;
  accent?: Accent;
}

const accentClasses: Record<Accent, string> = {
  water: 'bg-sky-50 text-sky-600',
  soil: 'bg-emerald-50 text-emerald-600',
  nutrient: 'bg-amber-50 text-amber-600',
  neutral: 'bg-stone-100 text-stone-500',
};

export function StatCard({ title, value, unit, icon, accent = 'neutral' }: StatCardProps) {
  const displayValue =
    value !== null && value !== undefined ? (typeof value === 'number' ? value.toFixed(2) : value) : '—';

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${accentClasses[accent]}`}>{icon}</div>
        <p className="text-sm font-medium text-stone-500">{title}</p>
      </div>
      <p className="mt-4 text-3xl font-semibold tracking-tight text-stone-900 break-words">
        {displayValue}
        {unit && <span className="ml-1 text-base font-normal text-stone-400">{unit}</span>}
      </p>
    </div>
  );
}
