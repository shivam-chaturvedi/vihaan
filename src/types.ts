export interface SensorReading {
  deviceId: string;
  ts: number;
  raw: string;
  ph: number | null;
  ph_v: number | null;
  orp_raw: number | null;
  orp: number | null;
  tds: number | null;
  turb_adc: number | null;
  turb: number | null;
  turb_status: string | null;
  temp_c: number | null;
}

export interface SensorDataMap {
  [pushId: string]: SensorReading;
}
