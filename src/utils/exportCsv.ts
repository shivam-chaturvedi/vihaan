import { SensorReading } from '../types';
import { getDisplayTimestampMs } from './formatTime';

export function exportCsv(
  readings: SensorReading[],
  deviceId?: string,
  /** Latest reading ts — used to map device time (seconds-since-boot) to system time */
  latestTs?: number | null
): void {
  const filtered = deviceId 
    ? readings.filter(r => r.deviceId === deviceId)
    : readings;

  const headers = [
    'Time',
    'Device ID',
    'pH',
    'ORP',
    'TDS',
    'Turbidity',
    'Temperature (°C)',
    'Turbidity Status',
    'Raw Data'
  ];

  const rows = filtered.map(reading => {
    const displayMs = getDisplayTimestampMs(reading.ts, latestTs);
    const date = new Date(displayMs);
    
    return [
      date.toISOString(),
      reading.deviceId,
      reading.ph?.toFixed(2) || '',
      reading.orp?.toFixed(2) || '',
      reading.tds?.toFixed(2) || '',
      reading.turb?.toFixed(2) || '',
      reading.temp_c?.toFixed(2) || '',
      reading.turb_status || '',
      reading.raw || ''
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `sensor-data-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
