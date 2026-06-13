import { SensorReading } from '../types';
import { formatDateTime } from '../utils/formatTime';
import { StatusBadge } from './StatusBadge';

interface HistoryTableProps {
  readings: SensorReading[];
  latestTs?: number | null;
}

function renderNumber(value: number | null) {
  return value !== null ? value.toFixed(2) : 'उपलब्ध नहीं';
}

export function HistoryTable({ readings, latestTs }: HistoryTableProps) {
  const sortedReadings = [...readings].sort((a, b) => b.ts - a.ts);
  const tableKey = readings.length > 0 ? Math.max(...readings.map((r) => r.ts)) : 0;

  return (
    <div className="rounded-lg border border-stone-200 bg-white overflow-hidden shadow-sm" key={tableKey}>
      <div className="px-6 py-4 border-b border-stone-200">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-stone-900">पिछली रीडिंग</h2>
          {readings.length > 0 && (
            <span className="text-xs text-stone-500">
              {readings.length} रीडिंग दिखाई जा रही हैं
            </span>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-stone-200">
          <thead className="bg-stone-50">
            <tr>
              {[
                'समय',
                'डिवाइस',
                'पानी pH',
                'मिट्टी pH',
                'N',
                'P',
                'K',
                'TDS',
                'गंदलापन',
                'पानी तापमान',
                'स्थिति',
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-stone-500"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 bg-white">
            {sortedReadings.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-6 py-8 text-center text-stone-400">
                  डेटा उपलब्ध नहीं है
                </td>
              </tr>
            ) : (
              sortedReadings.map((reading, index) => (
                <tr key={`${reading.ts}-${reading.deviceId}-${index}`} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">
                    {formatDateTime(reading.ts, latestTs)}
                    {index === 0 && <span className="ml-2 text-xs font-semibold text-emerald-400">(नवीनतम)</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-600">{reading.deviceId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">{renderNumber(reading.water_ph)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">{renderNumber(reading.soil_ph)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">{renderNumber(reading.nitrogen)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">{renderNumber(reading.phosphorus)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">{renderNumber(reading.potassium)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">{renderNumber(reading.tds)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">{renderNumber(reading.turb)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-900">{renderNumber(reading.water_temp_c)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <StatusBadge status={reading.turb_status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
