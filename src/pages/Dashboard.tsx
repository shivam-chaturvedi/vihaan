import { useState } from 'react';
import { useSensorData } from '../hooks/useSensorData';
import { StatCard } from '../components/StatCard';
import { ChartPanel } from '../components/ChartPanel';
import { HistoryTable } from '../components/HistoryTable';
import { TestAnalysisPanel } from '../components/TestAnalysisPanel';
import { formatTime } from '../utils/formatTime';
import { exportCsv } from '../utils/exportCsv';
import { 
  Droplet, 
  Activity, 
  Thermometer, 
  Gauge, 
  Eye,
  Download,
  AlertCircle,
  Loader2,
  Radio
} from 'lucide-react';

export function Dashboard() {
  const { readings, latestReading, deviceIds, loading, error } = useSensorData();
  const [selectedDevice, setSelectedDevice] = useState<string>('All');

  const filteredReadings = selectedDevice === 'All'
    ? readings
    : readings.filter(r => r.deviceId === selectedDevice);

  const handleExport = () => {
    exportCsv(
      readings,
      selectedDevice === 'All' ? undefined : selectedDevice,
      latestReading?.ts
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading sensor data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
            <h2 className="text-xl font-semibold text-red-800">Error Loading Data</h2>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <p className="text-sm text-red-600">
            Please check your internet connection and ensure the device is powered on and connected to Wi-Fi.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">Water Quality Dashboard</h1>
              {latestReading && (
                <div className="flex items-center gap-2 text-green-600">
                  <Radio className="h-4 w-4 animate-pulse" />
                  <span className="text-xs font-semibold">LIVE</span>
                </div>
              )}
            </div>
            {latestReading && (
              <p className="text-gray-600 mt-2">
                Last updated: {formatTime(latestReading.ts, latestReading.ts)} • 
                <span className="ml-2 text-sm text-gray-500">Live window: ±3 minutes around Firebase time</span>
              </p>
            )}
          </div>
          <div className="flex gap-4">
            {/* Device Filter */}
            {deviceIds.length > 0 && (
              <select
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="All">All Devices</option>
                {deviceIds.map(id => (
                  <option key={id} value={id}>{id}</option>
                ))}
              </select>
            )}
            {/* Export Button */}
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="h-5 w-5 mr-2" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Test Analysis Panel - Always show, even when no data */}
        <TestAnalysisPanel readings={filteredReadings} latestTs={latestReading?.ts} />

        {/* Empty State */}
        {readings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Droplet className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Data Yet</h2>
            <p className="text-gray-600 mb-4">
              Waiting for a live Firebase reading inside the current 3-minute window.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Older history is hidden so the dashboard only shows current live data.
            </p>
            <p className="text-sm text-blue-600 font-semibold">
              💡 Tip: When the device sends a fresh timestamp, the dashboard will update automatically.
            </p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <StatCard
                title="pH Level"
                value={latestReading?.ph ?? null}
                unit=""
                icon={<Droplet className="h-6 w-6" />}
                color="blue"
              />
              <StatCard
                title="ORP"
                value={latestReading?.orp ?? null}
                unit="mV"
                icon={<Activity className="h-6 w-6" />}
                color="green"
              />
              <StatCard
                title="TDS"
                value={latestReading?.tds ?? null}
                unit="ppm"
                icon={<Gauge className="h-6 w-6" />}
                color="yellow"
              />
              <StatCard
                title="Turbidity"
                value={latestReading?.turb ?? null}
                unit="NTU"
                icon={<Eye className="h-6 w-6" />}
                color="purple"
              />
              <StatCard
                title="Temperature"
                value={latestReading?.temp_c ?? null}
                unit="°C"
                icon={<Thermometer className="h-6 w-6" />}
                color="red"
              />
            </div>

            {/* Turbidity Status */}
            {latestReading?.turb_status && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Turbidity Status</h3>
                    <p className="text-sm text-gray-600">Current water clarity condition</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-4 py-2 rounded-lg text-lg font-semibold ${
                      latestReading.turb_status.toLowerCase() === 'clear'
                        ? 'bg-green-100 text-green-800'
                        : latestReading.turb_status.toLowerCase() === 'cloudy'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {latestReading.turb_status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Charts */}
            <div className="mb-8">
              <ChartPanel readings={filteredReadings} latestTs={latestReading?.ts} />
            </div>

            {/* History Table */}
            <HistoryTable readings={filteredReadings} latestTs={latestReading?.ts} />
          </>
        )}
      </div>
    </div>
  );
}
