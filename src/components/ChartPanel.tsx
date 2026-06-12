import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { SensorReading } from '../types';
import { formatDateTime } from '../utils/formatTime';

interface ChartPanelProps {
  readings: SensorReading[];
  /** Latest reading ts — used to map device time to system time */
  latestTs?: number | null;
}

export function ChartPanel({ readings, latestTs }: ChartPanelProps) {
  const [visibleLines, setVisibleLines] = useState({
    ph: true,
    orp: true,
    tds: true,
    turb: true,
    temp: true,
  });

  const toggleLine = (key: keyof typeof visibleLines) => {
    setVisibleLines(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const chartData = readings.map(reading => ({
    time: formatDateTime(reading.ts, latestTs),
    ts: reading.ts,
    pH: reading.ph,
    ORP: reading.orp,
    TDS: reading.tds,
    Turbidity: reading.turb,
    Temperature: reading.temp_c,
  }));

  // Use readings length and latest ts as key to force chart update when new data arrives
  const chartKey = readings.length > 0 ? readings[readings.length - 1].ts : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Sensor Data Trends</h2>
        
        {/* Toggle Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => toggleLine('ph')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors border ${
              visibleLines.ph
                ? 'bg-blue-100 text-blue-800 border-blue-300'
                : 'bg-gray-100 text-gray-500 border-gray-300'
            }`}
          >
            pH
          </button>
          <button
            onClick={() => toggleLine('orp')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors border ${
              visibleLines.orp
                ? 'bg-green-100 text-green-800 border-green-300'
                : 'bg-gray-100 text-gray-500 border-gray-300'
            }`}
          >
            ORP
          </button>
          <button
            onClick={() => toggleLine('tds')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors border ${
              visibleLines.tds
                ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                : 'bg-gray-100 text-gray-500 border-gray-300'
            }`}
          >
            TDS
          </button>
          <button
            onClick={() => toggleLine('turb')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors border ${
              visibleLines.turb
                ? 'bg-purple-100 text-purple-800 border-purple-300'
                : 'bg-gray-100 text-gray-500 border-gray-300'
            }`}
          >
            Turbidity
          </button>
          <button
            onClick={() => toggleLine('temp')}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors border ${
              visibleLines.temp
                ? 'bg-red-100 text-red-800 border-red-300'
                : 'bg-gray-100 text-gray-500 border-gray-300'
            }`}
          >
            Temperature
          </button>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-gray-500">
          No data available for chart
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={400} key={chartKey}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="time" 
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 10 }}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            {visibleLines.ph && (
              <Line 
                type="monotone" 
                dataKey="pH" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={false}
                name="pH"
              />
            )}
            {visibleLines.orp && (
              <Line 
                type="monotone" 
                dataKey="ORP" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={false}
                name="ORP (mV)"
              />
            )}
            {visibleLines.tds && (
              <Line 
                type="monotone" 
                dataKey="TDS" 
                stroke="#eab308" 
                strokeWidth={2}
                dot={false}
                name="TDS (ppm)"
              />
            )}
            {visibleLines.turb && (
              <Line 
                type="monotone" 
                dataKey="Turbidity" 
                stroke="#a855f7" 
                strokeWidth={2}
                dot={false}
                name="Turbidity (NTU)"
              />
            )}
            {visibleLines.temp && (
              <Line 
                type="monotone" 
                dataKey="Temperature" 
                stroke="#ef4444" 
                strokeWidth={2}
                dot={false}
                name="Temperature (°C)"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
