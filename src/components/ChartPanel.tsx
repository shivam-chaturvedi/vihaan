import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { SensorReading } from '../types';
import { getDisplayTimestampMs } from '../utils/formatTime';

interface ChartPanelProps {
  readings: SensorReading[];
  latestTs?: number | null;
}

const seriesConfig = [
  { key: 'water_ph', label: 'पानी pH', color: '#22d3ee', unit: '' },
  { key: 'water_ph_v', label: 'पानी pH वोल्टेज', color: '#06b6d4', unit: 'V' },
  { key: 'orp', label: 'ORP', color: '#34d399', unit: 'mV' },
  { key: 'orp_raw', label: 'ORP रॉ', color: '#10b981', unit: '' },
  { key: 'tds', label: 'TDS', color: '#fbbf24', unit: 'ppm' },
  { key: 'turb', label: 'गंदलापन', color: '#c084fc', unit: 'NTU' },
  { key: 'turb_adc', label: 'गंदलापन ADC', color: '#a855f7', unit: '' },
  { key: 'water_temp_c', label: 'पानी तापमान', color: '#fb7185', unit: 'C' },
  { key: 'soil_ph', label: 'मिट्टी pH', color: '#2dd4bf', unit: '' },
  { key: 'soil_ec', label: 'मिट्टी EC', color: '#f97316', unit: '' },
  { key: 'soil_moisture', label: 'मिट्टी नमी', color: '#84cc16', unit: '' },
  { key: 'soil_temp_c', label: 'मिट्टी तापमान', color: '#ef4444', unit: 'C' },
  { key: 'nitrogen', label: 'नाइट्रोजन', color: '#65a30d', unit: '' },
  { key: 'phosphorus', label: 'फॉस्फोरस', color: '#f59e0b', unit: '' },
  { key: 'potassium', label: 'पोटैशियम', color: '#d946ef', unit: '' },
] as const;

type SeriesKey = (typeof seriesConfig)[number]['key'];

function formatValue(value: number | null | undefined, unit: string) {
  if (value === null || value === undefined) return 'उपलब्ध नहीं';
  return unit ? `${value.toFixed(2)} ${unit}` : value.toFixed(2);
}

export function ChartPanel({ readings, latestTs }: ChartPanelProps) {
  const chartData = readings.map((reading) => {
    const displayMs = getDisplayTimestampMs(reading.ts, latestTs);

    return {
      ...reading,
      displayMs,
      displayTime: new Date(displayMs).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
    };
  });

  if (chartData.length === 0) {
    return (
      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-stone-900">लाइव ग्राफ</h2>
        <div className="h-64 flex items-center justify-center text-stone-400">ग्राफ के लिए डेटा उपलब्ध नहीं है</div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-stone-900">समय-आधारित लाइव ग्राफ</h2>
        <p className="mt-2 text-sm text-stone-500">
          हर सेंसर का अलग ग्राफ दिखेगा और नया डेटा आते ही अपडेट होगा।
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {seriesConfig.map((series) => {
          const hasData = chartData.some((row) => row[series.key as SeriesKey] !== null && row[series.key as SeriesKey] !== undefined);

          return (
            <div key={series.key} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <div className="mb-3 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">{series.label}</h3>
                  <p className="mt-1 text-xs text-stone-500">{series.unit || 'सेंसर मान'}</p>
                </div>
                <p className="text-sm font-semibold" style={{ color: series.color }}>
                  {formatValue(chartData[chartData.length - 1][series.key as SeriesKey], series.unit)}
                </p>
              </div>

              {hasData ? (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={chartData}>
                    <CartesianGrid stroke="#e7e5e4" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="displayTime"
                      minTickGap={28}
                      tick={{ fontSize: 10, fill: '#78716c' }}
                    />
                    <YAxis tick={{ fontSize: 10, fill: '#78716c' }} width={44} domain={['auto', 'auto']} />
                    <Tooltip
                      labelFormatter={(_, payload) => {
                        if (!payload || payload.length === 0) return '';
                        const point = payload[0].payload as { displayMs: number };
                        return new Date(point.displayMs).toLocaleString();
                      }}
                      formatter={(value) => {
                        const scalarValue = Array.isArray(value) ? value[0] : value;
                        if (typeof scalarValue !== 'number') return ['उपलब्ध नहीं', series.label];
                        return [formatValue(scalarValue, series.unit), series.label];
                      }}
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e7e5e4',
                        borderRadius: '8px',
                        color: '#1c1917',
                      }}
                    />
                    <Line
                      type="linear"
                      dataKey={series.key}
                      stroke={series.color}
                      strokeWidth={2}
                      dot={false}
                      connectNulls={false}
                      isAnimationActive={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-[220px] items-center justify-center text-sm text-stone-400">इस सेंसर का डेटा अभी नहीं आया</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
