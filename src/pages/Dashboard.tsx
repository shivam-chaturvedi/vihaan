import { useEffect, useMemo, useState } from 'react';
import { useSensorData } from '../hooks/useSensorData';
import { StatCard } from '../components/StatCard';
import { ChartPanel } from '../components/ChartPanel';
import { HistoryTable } from '../components/HistoryTable';
import { RecommendationPanel } from '../components/RecommendationPanel';
import { TestAnalysisPanel } from '../components/TestAnalysisPanel';
import { AssessmentReportPanel } from '../components/AssessmentReportPanel';
import { exportCsv } from '../utils/exportCsv';
import { formatTime, getDisplayTimestampMs } from '../utils/formatTime';
import { AreaUnit, buildAssessmentReport, PondType } from '../utils/makhanaRecommendations';
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  Download,
  Droplets,
  FlaskConical,
  Leaf,
  Loader2,
  Play,
  Radio,
  ShieldAlert,
  Sprout,
  Thermometer,
  TestTube,
  TimerReset,
  Waves,
} from 'lucide-react';
import { SensorReading } from '../types';

const MEASUREMENT_DURATION_MS = 60 * 1000;

interface CompletedMeasurement {
  id: number;
  startedAt: number;
  endedAt: number;
  deviceId: string;
  readings: SensorReading[];
  latestReading: SensorReading | null;
  pondType: PondType;
  area: string;
  areaUnit: AreaUnit;
}

function formatMetric(value: number | null, digits = 2) {
  return value === null ? 'N/A' : value.toFixed(digits);
}

function formatCountdown(ms: number) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function Dashboard() {
  const { readings, liveReadings, deviceIds, loading, error } = useSensorData();
  const [selectedDevice, setSelectedDevice] = useState<string>('All');
  const [measurementStartedAt, setMeasurementStartedAt] = useState<number | null>(null);
  const [nowMs, setNowMs] = useState(Date.now());
  const [pondType, setPondType] = useState<PondType>('managed');
  const [area, setArea] = useState('1');
  const [areaUnit, setAreaUnit] = useState<AreaUnit>('ha');
  const [completedMeasurements, setCompletedMeasurements] = useState<CompletedMeasurement[]>([]);

  useEffect(() => {
    const intervalId = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  const filteredReadings = useMemo(
    () => (selectedDevice === 'All' ? readings : readings.filter((r) => r.deviceId === selectedDevice)),
    [readings, selectedDevice]
  );

  const filteredLiveReadings = useMemo(
    () => (selectedDevice === 'All' ? liveReadings : liveReadings.filter((r) => r.deviceId === selectedDevice)),
    [liveReadings, selectedDevice]
  );

  const latestFilteredReading = filteredReadings.length > 0 ? filteredReadings[filteredReadings.length - 1] : null;
  const latestFilteredLiveReading =
    filteredLiveReadings.length > 0 ? filteredLiveReadings[filteredLiveReadings.length - 1] : null;

  const measurementReadings = useMemo(() => {
    if (!measurementStartedAt || !latestFilteredReading) {
      return [];
    }

    return filteredReadings.filter((reading) => {
      const displayMs = getDisplayTimestampMs(reading.ts, latestFilteredReading.ts);
      return displayMs >= measurementStartedAt && displayMs <= measurementStartedAt + MEASUREMENT_DURATION_MS;
    });
  }, [filteredReadings, latestFilteredReading, measurementStartedAt]);

  const measurementEndsAt = measurementStartedAt ? measurementStartedAt + MEASUREMENT_DURATION_MS : null;
  const measurementInProgress = measurementEndsAt !== null && nowMs < measurementEndsAt;
  const measurementComplete = measurementEndsAt !== null && nowMs >= measurementEndsAt;

  const resultReadings = measurementComplete ? measurementReadings : [];
  const resultLatestReading = resultReadings.length > 0 ? resultReadings[resultReadings.length - 1] : null;
  const activeMeasurementReadings = measurementStartedAt ? measurementReadings : [];
  const activeMeasurementLatestReading =
    activeMeasurementReadings.length > 0 ? activeMeasurementReadings[activeMeasurementReadings.length - 1] : null;

  useEffect(() => {
    if (!measurementComplete || !measurementStartedAt) {
      return;
    }

    if (resultReadings.length === 0 || !resultLatestReading) {
      return;
    }

    setCompletedMeasurements((previous) => {
      if (previous.some((session) => session.id === measurementStartedAt)) {
        return previous;
      }

      const nextSession: CompletedMeasurement = {
        id: measurementStartedAt,
        startedAt: measurementStartedAt,
        endedAt: measurementEndsAt ?? measurementStartedAt,
        deviceId: resultLatestReading.deviceId,
        readings: resultReadings,
        latestReading: resultLatestReading,
        pondType,
        area,
        areaUnit,
      };

      return [nextSession, ...previous].slice(0, 10);
    });
  }, [
    area,
    areaUnit,
    measurementComplete,
    measurementEndsAt,
    measurementStartedAt,
    pondType,
    resultLatestReading,
    resultReadings,
  ]);

  const handleExport = () => {
    exportCsv(resultReadings, selectedDevice === 'All' ? undefined : selectedDevice, resultLatestReading?.ts);
  };

  const handleStartMeasurement = () => {
    setMeasurementStartedAt(Date.now());
    setNowMs(Date.now());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-stone-500">लाइव डेटा लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
        <div className="bg-white border border-rose-200 rounded-lg p-6 max-w-md shadow-sm">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-rose-500 mr-2" />
            <h2 className="text-xl font-semibold text-rose-700">डेटा लोड नहीं हुआ</h2>
          </div>
          <p className="text-rose-700 mb-4">{error}</p>
          <p className="text-sm text-rose-600">
            Firebase कनेक्शन और डिवाइस डेटा भेज रहा है या नहीं, यह जाँचें।
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-semibold text-stone-900">Project Pragya</h1>
                  {latestFilteredLiveReading && (
                    <div className="flex items-center gap-2 text-emerald-600">
                      <Radio className="h-4 w-4 animate-pulse" />
                      <span className="text-xs font-semibold">डिवाइस लाइव</span>
                    </div>
                  )}
                </div>
                {latestFilteredLiveReading && (
                  <p className="text-sm text-stone-500 mt-2">
                    अंतिम लाइव डेटा: {formatTime(latestFilteredLiveReading.ts, latestFilteredLiveReading.ts)}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-3 items-center">
                {deviceIds.length > 0 && (
                  <select
                    value={selectedDevice}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                    className="h-10 rounded-md border border-stone-200 bg-white px-3 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="All">सभी डिवाइस</option>
                    {deviceIds.map((id) => (
                      <option key={id} value={id}>
                        {id}
                      </option>
                    ))}
                  </select>
                )}
                <button
                  onClick={handleStartMeasurement}
                  disabled={measurementInProgress}
                  className="inline-flex h-10 items-center rounded-md bg-emerald-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:bg-stone-300 disabled:text-stone-500"
                >
                  {measurementComplete ? <TimerReset className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                  {measurementStartedAt ? (measurementInProgress ? 'मापन जारी है...' : 'नई माप शुरू करें') : 'मापन शुरू करें'}
                </button>
                <button
                  onClick={handleExport}
                  disabled={resultReadings.length === 0}
                  className="inline-flex h-10 items-center rounded-md bg-stone-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-stone-800 disabled:bg-stone-300 disabled:text-stone-500"
                >
                  <Download className="mr-2 h-4 w-4" />
                  परिणाम डाउनलोड करें
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                <p className="text-xs uppercase tracking-wide text-stone-500">डिवाइस</p>
                <p className="mt-2 text-lg font-semibold text-stone-900">{latestFilteredLiveReading?.deviceId ?? latestFilteredReading?.deviceId ?? 'No device'}</p>
              </div>
              <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                <p className="text-xs uppercase tracking-wide text-stone-500">मापन स्थिति</p>
                <div className="mt-2 flex items-center gap-2">
                  {measurementInProgress ? (
                    <>
                      <Radio className="h-5 w-5 animate-pulse text-amber-400" />
                      <p className="text-lg font-semibold text-stone-900">{formatCountdown((measurementEndsAt ?? nowMs) - nowMs)} बाकी</p>
                    </>
                  ) : measurementComplete ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      <p className="text-lg font-semibold text-stone-900">1 मिनट की माप तैयार</p>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="h-5 w-5 text-cyan-400" />
                      <p className="text-lg font-semibold text-stone-900">शुरू होने की प्रतीक्षा</p>
                    </>
                  )}
                </div>
              </div>
              <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
                <p className="text-xs uppercase tracking-wide text-stone-500">कैप्चर रीडिंग</p>
                <p className="mt-2 text-lg font-semibold text-stone-900">{measurementReadings.length}</p>
              </div>
            </div>
          </section>
        </div>

        {!measurementStartedAt ? (
          <div className="mx-auto max-w-2xl rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-full bg-emerald-50 p-3">
                <Play className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-stone-900">मापन शुरू करें</h2>
                <p className="text-sm text-stone-500">केवल जरूरी जानकारी भरें</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_auto]">
              <label className="block">
                <span className="text-sm text-stone-500">क्षेत्रफल</span>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="mt-2 h-11 w-full rounded-md border border-stone-200 bg-white px-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </label>

              <label className="block">
                <span className="text-sm text-stone-500">इकाई</span>
                <select
                  value={areaUnit}
                  onChange={(e) => setAreaUnit(e.target.value as AreaUnit)}
                  className="mt-2 h-11 rounded-md border border-stone-200 bg-white px-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="ha">हेक्टेयर</option>
                  <option value="acre">एकड़</option>
                </select>
              </label>
            </div>

            <div className="mt-4">
              <span className="text-sm text-stone-500">तालाब प्रकार</span>
              <div className="mt-2 flex flex-wrap gap-2">
                <button
                  onClick={() => setPondType('natural')}
                  className={`rounded-md px-4 py-2 text-sm font-medium ${
                    pondType === 'natural' ? 'bg-emerald-600 text-white' : 'border border-stone-200 bg-stone-50 text-stone-700'
                  }`}
                >
                  प्राकृतिक
                </button>
                <button
                  onClick={() => setPondType('managed')}
                  className={`rounded-md px-4 py-2 text-sm font-medium ${
                    pondType === 'managed' ? 'bg-emerald-600 text-white' : 'border border-stone-200 bg-stone-50 text-stone-700'
                  }`}
                >
                  मानव-निर्मित
                </button>
              </div>
            </div>

            <button
              onClick={handleStartMeasurement}
              className="mt-6 inline-flex w-full items-center justify-center rounded-md bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
            >
              <Play className="mr-2 h-4 w-4" />
              मापन शुरू करें
            </button>
          </div>
        ) : measurementInProgress ? (
          <>
            <div className="mb-8 rounded-lg border border-amber-500/30 bg-amber-500/10 p-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-start gap-4">
                  <Radio className="mt-1 h-10 w-10 animate-pulse text-amber-400" />
                  <div>
                    <h2 className="text-2xl font-semibold text-white">मापन जारी है</h2>
                    <p className="mt-2 text-slate-200">
                      डिवाइस को सही जगह रखें। नीचे आते हुए लाइव मान दिख रहे हैं।
                    </p>
                    <p className="mt-2 text-sm text-slate-300">
                      अब तक की रीडिंग: {activeMeasurementReadings.length}
                    </p>
                  </div>
                </div>
                <div className="rounded-lg border border-amber-400/30 bg-slate-950/50 px-5 py-4 text-center">
                  <p className="text-sm text-slate-400">बाकी समय</p>
                  <p className="mt-1 text-3xl font-bold text-amber-300">
                    {formatCountdown((measurementEndsAt ?? nowMs) - nowMs)}
                  </p>
                </div>
              </div>
            </div>

            <section className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <Waves className="h-5 w-5 text-cyan-400" />
                <h2 className="text-xl font-semibold text-white">मापन के दौरान पानी का लाइव डेटा</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                <StatCard title="पानी pH" value={activeMeasurementLatestReading?.water_ph ?? null} unit="" icon={<Droplets className="h-6 w-6" />} color="cyan" />
                <StatCard title="ORP" value={activeMeasurementLatestReading?.orp ?? null} unit="mV" icon={<Activity className="h-6 w-6" />} color="green" />
                <StatCard title="TDS" value={activeMeasurementLatestReading?.tds ?? null} unit="ppm" icon={<FlaskConical className="h-6 w-6" />} color="amber" />
                <StatCard title="गंदलापन" value={activeMeasurementLatestReading?.turb ?? null} unit="NTU" icon={<TestTube className="h-6 w-6" />} color="violet" />
                <StatCard title="पानी तापमान" value={activeMeasurementLatestReading?.water_temp_c ?? null} unit="°C" icon={<Thermometer className="h-6 w-6" />} color="rose" />
              </div>
            </section>

            <section className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <Sprout className="h-5 w-5 text-emerald-400" />
                <h2 className="text-xl font-semibold text-white">मापन के दौरान मिट्टी का लाइव डेटा</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard title="मिट्टी pH" value={activeMeasurementLatestReading?.soil_ph ?? null} unit="" icon={<Droplets className="h-6 w-6" />} color="teal" />
                <StatCard title="मिट्टी EC" value={activeMeasurementLatestReading?.soil_ec ?? null} unit="" icon={<Activity className="h-6 w-6" />} color="orange" />
                <StatCard title="मिट्टी नमी" value={activeMeasurementLatestReading?.soil_moisture ?? null} unit="" icon={<Leaf className="h-6 w-6" />} color="emerald" />
                <StatCard title="मिट्टी तापमान" value={activeMeasurementLatestReading?.soil_temp_c ?? null} unit="°C" icon={<Thermometer className="h-6 w-6" />} color="rose" />
              </div>
            </section>

            <section className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <Leaf className="h-5 w-5 text-lime-400" />
                <h2 className="text-xl font-semibold text-white">मापन के दौरान NPK लाइव डेटा</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <StatCard title="नाइट्रोजन" value={activeMeasurementLatestReading?.nitrogen ?? null} unit="" icon={<Leaf className="h-6 w-6" />} color="lime" />
                <StatCard title="फॉस्फोरस" value={activeMeasurementLatestReading?.phosphorus ?? null} unit="" icon={<Leaf className="h-6 w-6" />} color="amber" />
                <StatCard title="पोटैशियम" value={activeMeasurementLatestReading?.potassium ?? null} unit="" icon={<Leaf className="h-6 w-6" />} color="fuchsia" />
              </div>
            </section>

            <div className="mb-8">
              <ChartPanel readings={activeMeasurementReadings} latestTs={activeMeasurementLatestReading?.ts} />
            </div>

            <HistoryTable readings={activeMeasurementReadings} latestTs={activeMeasurementLatestReading?.ts} />
          </>
        ) : resultReadings.length === 0 ? (
          <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-12 text-center">
            <Droplets className="h-16 w-16 text-slate-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">उस 1 मिनट में कोई रीडिंग नहीं मिली</h2>
            <p className="text-slate-300 mb-4">
              टाइमर पूरा हो गया, लेकिन मापन अवधि में कोई डेटा नहीं मिला। डिवाइस लाइव है या नहीं देखकर फिर से शुरू करें।
            </p>
            <button
              onClick={handleStartMeasurement}
              className="inline-flex items-center rounded-md bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
            >
              <TimerReset className="mr-2 h-4 w-4" />
              फिर से मापन करें
            </button>
          </div>
        ) : (
          <>
            <AssessmentReportPanel
              latestReading={resultLatestReading}
              readingsCount={resultReadings.length}
              pondType={pondType}
              area={area}
              areaUnit={areaUnit}
            />
            <TestAnalysisPanel
              readings={resultReadings}
              latestTs={resultLatestReading?.ts}
              latestReading={resultLatestReading}
              pondType={pondType}
              areaValue={Number.parseFloat(area) > 0 ? Number.parseFloat(area) : 0}
              areaUnit={areaUnit}
            />
            <RecommendationPanel
              latestReading={resultLatestReading}
              pondType={pondType}
              setPondType={setPondType}
              area={area}
              setArea={setArea}
              areaUnit={areaUnit}
              setAreaUnit={setAreaUnit}
            />

            <section className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <Waves className="h-5 w-5 text-cyan-400" />
                <h2 className="text-xl font-semibold text-white">मापा गया पानी डेटा</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
                <StatCard title="पानी pH" value={resultLatestReading?.water_ph ?? null} unit="" icon={<Droplets className="h-6 w-6" />} color="cyan" />
                <StatCard title="ORP" value={resultLatestReading?.orp ?? null} unit="mV" icon={<Activity className="h-6 w-6" />} color="green" />
                <StatCard title="TDS" value={resultLatestReading?.tds ?? null} unit="ppm" icon={<FlaskConical className="h-6 w-6" />} color="amber" />
                <StatCard title="गंदलापन" value={resultLatestReading?.turb ?? null} unit="NTU" icon={<TestTube className="h-6 w-6" />} color="violet" />
                <StatCard title="पानी तापमान" value={resultLatestReading?.water_temp_c ?? null} unit="°C" icon={<Thermometer className="h-6 w-6" />} color="rose" />
              </div>
            </section>

            <section className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <Sprout className="h-5 w-5 text-emerald-400" />
                <h2 className="text-xl font-semibold text-white">मापा गया मिट्टी डेटा</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard title="मिट्टी pH" value={resultLatestReading?.soil_ph ?? null} unit="" icon={<Droplets className="h-6 w-6" />} color="teal" />
                <StatCard title="मिट्टी EC" value={resultLatestReading?.soil_ec ?? null} unit="" icon={<Activity className="h-6 w-6" />} color="orange" />
                <StatCard title="मिट्टी नमी" value={resultLatestReading?.soil_moisture ?? null} unit="" icon={<Leaf className="h-6 w-6" />} color="emerald" />
                <StatCard title="मिट्टी तापमान" value={resultLatestReading?.soil_temp_c ?? null} unit="°C" icon={<Thermometer className="h-6 w-6" />} color="rose" />
              </div>
            </section>

            <section className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <Leaf className="h-5 w-5 text-lime-400" />
                <h2 className="text-xl font-semibold text-white">मापा गया NPK</h2>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <StatCard title="नाइट्रोजन" value={resultLatestReading?.nitrogen ?? null} unit="" icon={<Leaf className="h-6 w-6" />} color="lime" />
                <StatCard title="फॉस्फोरस" value={resultLatestReading?.phosphorus ?? null} unit="" icon={<Leaf className="h-6 w-6" />} color="amber" />
                <StatCard title="पोटैशियम" value={resultLatestReading?.potassium ?? null} unit="" icon={<Leaf className="h-6 w-6" />} color="fuchsia" />
              </div>
            </section>

            {resultLatestReading?.turb_status && (
              <div className="mb-8 rounded-lg border border-slate-800 bg-slate-900/80 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">पानी की स्थिति</h3>
                    <p className="text-sm text-slate-400">1 मिनट की माप के अंतिम डेटा पर आधारित स्थिति।</p>
                  </div>
                  <div
                    className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold ${
                      resultLatestReading.turb_status.toLowerCase() === 'clear'
                        ? 'bg-emerald-500/15 text-emerald-300'
                        : resultLatestReading.turb_status.toLowerCase() === 'cloudy'
                          ? 'bg-amber-500/15 text-amber-300'
                          : 'bg-rose-500/15 text-rose-300'
                    }`}
                  >
                    {resultLatestReading.turb_status.toUpperCase()}
                  </div>
                </div>
              </div>
            )}

            <div className="mb-8">
              <ChartPanel readings={resultReadings} latestTs={resultLatestReading?.ts} />
            </div>

            <HistoryTable readings={resultReadings} latestTs={resultLatestReading?.ts} />

            <div className="mt-8 grid gap-4 lg:grid-cols-2">
              <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-6">
                <h3 className="text-lg font-semibold text-white">माप का सार</h3>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4 border-b border-slate-800 pb-3">
                    <dt className="text-slate-400">पानी pH</dt>
                    <dd className="text-slate-100">{formatMetric(resultLatestReading?.water_ph ?? null)}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-b border-slate-800 pb-3">
                    <dt className="text-slate-400">मिट्टी pH</dt>
                    <dd className="text-slate-100">{formatMetric(resultLatestReading?.soil_ph ?? null)}</dd>
                  </div>
                  <div className="flex justify-between gap-4 border-b border-slate-800 pb-3">
                    <dt className="text-slate-400">जैविक पदार्थ</dt>
                    <dd className="text-amber-300">अभी नहीं मापा गया</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-400">सूक्ष्म पोषक तत्व</dt>
                    <dd className="text-amber-300">अभी नहीं मापा गया</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-6">
                <h3 className="text-lg font-semibold text-white">किसान नोट</h3>
                <p className="mt-4 text-sm leading-6 text-slate-300">
                  यह परिणाम 1 मिनट की माप पर आधारित है। इससे पानी, मिट्टी, क्षेत्रफल के हिसाब से पोषक आवश्यकता और तालाब की स्थिति समझाई जा सकती है।
                </p>
              </div>
            </div>

            <section className="mt-8">
              <div className="mb-4 flex items-center gap-2">
                <TimerReset className="h-5 w-5 text-cyan-300" />
                <h2 className="text-xl font-semibold text-white">पिछले परीक्षण</h2>
              </div>
              {completedMeasurements.length === 0 ? (
                <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-6 text-sm text-slate-400">
                  अभी तक कोई पूर्ण परीक्षण सहेजा नहीं गया है।
                </div>
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                  {completedMeasurements.map((session) => {
                    const sessionAreaValue = Number.parseFloat(session.area);
                    const report = buildAssessmentReport(
                      session.latestReading,
                      session.pondType,
                      Number.isFinite(sessionAreaValue) && sessionAreaValue > 0 ? sessionAreaValue : 0,
                      session.areaUnit
                    );

                    return (
                      <div key={session.id} className="rounded-lg border border-slate-800 bg-slate-900/80 p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {new Date(session.startedAt).toLocaleString()}
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                              डिवाइस {session.deviceId} • {session.readings.length} रीडिंग
                            </p>
                          </div>
                          <div className="rounded-md border border-slate-700 bg-slate-950/70 px-3 py-1 text-xs font-semibold text-slate-200">
                            {report.overallStatus.toUpperCase()}
                          </div>
                        </div>

                        <p className="mt-4 text-sm font-semibold text-cyan-200">{report.headline}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-300">{report.summary}</p>

                        <div className="mt-4 grid gap-2 text-sm text-slate-400">
                          <p>पानी pH: <span className="text-slate-200">{formatMetric(session.latestReading?.water_ph ?? null)}</span></p>
                          <p>मिट्टी pH: <span className="text-slate-200">{formatMetric(session.latestReading?.soil_ph ?? null)}</span></p>
                          <p>नाइट्रोजन: <span className="text-slate-200">{formatMetric(session.latestReading?.nitrogen ?? null)}</span></p>
                        </div>

                        <div className="mt-4 rounded-md border border-slate-800 bg-slate-950/70 p-3">
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">सलाह</p>
                          <p className="mt-2 text-sm text-slate-300">
                            {report.recommendationLines[0] ?? 'इस परीक्षण के लिए कोई सलाह उपलब्ध नहीं है।'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
