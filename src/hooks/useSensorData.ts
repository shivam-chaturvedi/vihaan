import { useState, useEffect } from 'react';
import { ref, query, orderByChild, limitToLast, onValue } from 'firebase/database';
import { db } from '../firebase';
import { SensorReading, SensorDataMap } from '../types';
import { getDisplayTimestampMs } from '../utils/formatTime';

const LIVE_WINDOW_MS = 3 * 60 * 1000;

function getLatestTimestamp(readings: SensorReading[]): number | null {
  if (readings.length === 0) {
    return null;
  }

  return readings.reduce((latest, current) => (current.ts > latest.ts ? current : latest)).ts;
}

function filterLiveReadings(readings: SensorReading[]): SensorReading[] {
  const referenceTs = getLatestTimestamp(readings);

  if (referenceTs === null) {
    return [];
  }

  const now = Date.now();

  return readings.filter((reading) => {
    const displayMs = getDisplayTimestampMs(reading.ts, referenceTs);
    return Math.abs(now - displayMs) <= LIVE_WINDOW_MS;
  });
}

export function useSensorData() {
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sensorDataRef = ref(db, 'sensorData');
    const queryRef = query(
      sensorDataRef,
      orderByChild('ts'),
      limitToLast(50)
    );

    const unsubscribe = onValue(
      queryRef,
      (snapshot) => {
        try {
          const data = snapshot.val() as SensorDataMap | null;
          
          if (!data) {
            setReadings([]);
            setLoading(false);
            return;
          }

          // Convert object map to array
          const readingsArray: SensorReading[] = Object.entries(data).map(
            ([pushId, reading]) => ({
              ...reading,
              pushId, // Add pushId for reference if needed
            } as SensorReading & { pushId: string })
          );

          // Sort by ts ascending for charts
          readingsArray.sort((a, b) => a.ts - b.ts);

          const liveReadings = filterLiveReadings(readingsArray);

          setReadings(liveReadings);
          setError(null);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Unknown error';
          setError(`Failed to process data: ${errorMessage}`);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        const errorMessage = err.message || 'Failed to fetch data';
        setError(errorMessage);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Get latest live reading (maximum ts)
  const latestReading = readings.length > 0
    ? readings.reduce((latest, current) => 
        current.ts > latest.ts ? current : latest
      )
    : null;

  // Get unique device IDs
  const deviceIds = Array.from(new Set(readings.map(r => r.deviceId))).sort();

  return {
    readings,
    latestReading,
    deviceIds,
    loading,
    error,
  };
}
