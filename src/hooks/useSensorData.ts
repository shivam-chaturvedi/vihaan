import { useEffect, useState } from 'react';
import { get, ref } from 'firebase/database';
import { db } from '../firebase';
import { RawSensorReading, SensorDataMap, SensorReading } from '../types';
import { pushIdToMs } from '../utils/firebaseKey';

const LIVE_WINDOW_MS = 3 * 60 * 1000;
const POLL_INTERVAL_MS = 2000;
const MAX_READINGS = 120;

function filterLiveReadings(readings: SensorReading[]): SensorReading[] {
  if (readings.length === 0) {
    return [];
  }

  const now = Date.now();

  // `ts` is now real wall-clock time (decoded from the push ID), so "live"
  // simply means the reading was written within the last few minutes.
  return readings.filter((reading) => now - reading.ts <= LIVE_WINDOW_MS && now - reading.ts >= -LIVE_WINDOW_MS);
}

function toNullableNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function normalizeReading(pushId: string, reading: RawSensorReading): SensorReading | null {
  if (!reading.deviceId || typeof reading.ts !== 'number') {
    return null;
  }

  const waterPh = toNullableNumber(reading.water_ph ?? reading.ph);
  const waterPhV = toNullableNumber(reading.water_ph_v ?? reading.ph_v);
  const waterTemp = toNullableNumber(reading.water_temp_c ?? reading.temp_c);

  // The device's own `ts` is millis-since-boot and resets on reboot, so it is
  // useless for ordering. The push ID encodes the real write time — use that.
  const pushMs = pushIdToMs(pushId);

  return {
    pushId,
    deviceId: reading.deviceId,
    ts: pushMs ?? reading.ts,
    deviceTs: reading.ts,
    raw: typeof reading.raw === 'string' ? reading.raw : '',
    npk_valid: reading.npk_valid ?? null,
    nitrogen: toNullableNumber(reading.nitrogen),
    phosphorus: toNullableNumber(reading.phosphorus),
    potassium: toNullableNumber(reading.potassium),
    soil_ec: toNullableNumber(reading.soil_ec),
    soil_moisture: toNullableNumber(reading.soil_moisture),
    soil_ph: toNullableNumber(reading.soil_ph),
    soil_temp_c: toNullableNumber(reading.soil_temp_c),
    water_ph: waterPh,
    water_ph_v: waterPhV,
    water_temp_c: waterTemp,
    orp_raw: toNullableNumber(reading.orp_raw),
    orp: toNullableNumber(reading.orp),
    tds: toNullableNumber(reading.tds),
    turb_adc: toNullableNumber(reading.turb_adc),
    turb: toNullableNumber(reading.turb),
    turb_status: typeof reading.turb_status === 'string' ? reading.turb_status : null,
    ph: waterPh,
    ph_v: waterPhV,
    temp_c: waterTemp,
  };
}

export function useSensorData() {
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [liveReadings, setLiveReadings] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchReadings = async () => {
      try {
        const sensorDataRef = ref(db, 'sensorData');
        const snapshot = await get(sensorDataRef);

        if (!isMounted) {
          return;
        }

        const data = snapshot.val() as SensorDataMap | null;

        if (!data) {
          setReadings([]);
          setError(null);
          setLoading(false);
          return;
        }

        const readingsArray = Object.entries(data)
          .map(([pushId, reading]) => normalizeReading(pushId, reading))
          .filter((reading): reading is SensorReading => reading !== null);

        // Order by push ID (chronological write order), falling back to ts.
        readingsArray.sort((a, b) => {
          if (a.pushId && b.pushId && a.pushId !== b.pushId) {
            return a.pushId < b.pushId ? -1 : 1;
          }
          return a.ts - b.ts;
        });
        const recentReadings = readingsArray.slice(-MAX_READINGS);

        const currentLiveReadings = filterLiveReadings(recentReadings);
        setReadings(recentReadings);
        setLiveReadings(currentLiveReadings);
        setError(null);
      } catch (err) {
        if (!isMounted) {
          return;
        }
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to process data: ${errorMessage}`);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchReadings();
    const intervalId = window.setInterval(fetchReadings, POLL_INTERVAL_MS);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const latestReading =
    readings.length > 0
      ? readings.reduce((latest, current) => (current.ts > latest.ts ? current : latest))
      : null;

  const latestLiveReading =
    liveReadings.length > 0
      ? liveReadings.reduce((latest, current) => (current.ts > latest.ts ? current : latest))
      : null;

  const deviceIds = Array.from(new Set(readings.map((r) => r.deviceId))).sort();

  return {
    readings,
    liveReadings,
    latestReading,
    latestLiveReading,
    deviceIds,
    loading,
    error,
  };
}
