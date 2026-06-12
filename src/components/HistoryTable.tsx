import { SensorReading } from '../types';
import { formatDateTime } from '../utils/formatTime';
import { StatusBadge } from './StatusBadge';

interface HistoryTableProps {
  readings: SensorReading[];
  /** Latest reading ts — used to map device time (seconds-since-boot) to system time */
  latestTs?: number | null;
}

export function HistoryTable({ readings, latestTs }: HistoryTableProps) {
  // Sort by ts descending to show most recent first
  const sortedReadings = [...readings].sort((a, b) => b.ts - a.ts);
  
  // Use latest reading ts as key to force re-render when new data arrives
  const tableKey = readings.length > 0 ? Math.max(...readings.map(r => r.ts)) : 0;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden" key={tableKey}>
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Recent Readings</h2>
          {readings.length > 0 && (
            <span className="text-xs text-gray-500">
              Showing {readings.length} reading{readings.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Device ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                pH
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ORP (mV)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                TDS (ppm)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Turbidity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Temp (°C)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedReadings.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              sortedReadings.map((reading, index) => (
                <tr key={`${reading.ts}-${reading.deviceId}-${index}`} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDateTime(reading.ts, latestTs)}
                    {index === 0 && (
                      <span className="ml-2 text-xs text-green-600 font-semibold">(Latest)</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {reading.deviceId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reading.ph !== null ? reading.ph.toFixed(2) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reading.orp !== null ? reading.orp.toFixed(2) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reading.tds !== null ? reading.tds.toFixed(2) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reading.turb !== null ? reading.turb.toFixed(2) : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {reading.temp_c !== null ? reading.temp_c.toFixed(2) : 'N/A'}
                  </td>
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
