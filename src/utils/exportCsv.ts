import { SensorReading } from '../types';
import { getDisplayTimestampMs } from './formatTime';

export function exportCsv(
  readings: SensorReading[],
  deviceId?: string,
  latestTs?: number | null
): void {
  const filtered = deviceId ? readings.filter((r) => r.deviceId === deviceId) : readings;

  const headers = [
    'Time',
    'Device ID',
    'Water pH',
    'Water pH Voltage',
    'Water Temp (C)',
    'ORP Raw',
    'ORP',
    'TDS',
    'Turbidity ADC',
    'Turbidity',
    'Turbidity Status',
    'Soil pH',
    'Soil Temp (C)',
    'Soil EC',
    'Soil Moisture',
    'Nitrogen',
    'Phosphorus',
    'Potassium',
    'NPK Valid',
    'Raw Data',
  ];

  const rows = filtered.map((reading) => {
    const displayMs = getDisplayTimestampMs(reading.ts, latestTs);
    const date = new Date(displayMs);

    return [
      date.toISOString(),
      reading.deviceId,
      reading.water_ph?.toFixed(2) || '',
      reading.water_ph_v?.toFixed(3) || '',
      reading.water_temp_c?.toFixed(2) || '',
      reading.orp_raw?.toFixed(2) || '',
      reading.orp?.toFixed(2) || '',
      reading.tds?.toFixed(2) || '',
      reading.turb_adc?.toFixed(2) || '',
      reading.turb?.toFixed(2) || '',
      reading.turb_status || '',
      reading.soil_ph?.toFixed(2) || '',
      reading.soil_temp_c?.toFixed(2) || '',
      reading.soil_ec?.toFixed(2) || '',
      reading.soil_moisture?.toFixed(2) || '',
      reading.nitrogen?.toFixed(2) || '',
      reading.phosphorus?.toFixed(2) || '',
      reading.potassium?.toFixed(2) || '',
      reading.npk_valid ? 'true' : 'false',
      reading.raw || '',
    ];
  });

  const csvContent = [headers.join(','), ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', `field-telemetry-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
