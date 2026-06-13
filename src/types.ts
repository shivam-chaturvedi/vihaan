export interface SensorReading {
  deviceId: string;
  ts: number;
  raw: string;
  pushId?: string;
  npk_valid?: boolean | null;

  nitrogen: number | null;
  phosphorus: number | null;
  potassium: number | null;

  soil_ec: number | null;
  soil_moisture: number | null;
  soil_ph: number | null;
  soil_temp_c: number | null;

  water_ph: number | null;
  water_ph_v: number | null;
  water_temp_c: number | null;
  orp_raw: number | null;
  orp: number | null;
  tds: number | null;
  turb_adc: number | null;
  turb: number | null;
  turb_status: string | null;

  // Backward-compatible aliases used across the existing UI.
  ph: number | null;
  ph_v: number | null;
  temp_c: number | null;
}

export interface RawSensorReading {
  deviceId?: string;
  ts?: number;
  raw?: string;
  npk_valid?: boolean | null;
  nitrogen?: number | null;
  phosphorus?: number | null;
  potassium?: number | null;
  soil_ec?: number | null;
  soil_moisture?: number | null;
  soil_ph?: number | null;
  soil_temp_c?: number | null;
  water_ph?: number | null;
  water_ph_v?: number | null;
  water_temp_c?: number | null;
  ph?: number | null;
  ph_v?: number | null;
  orp_raw?: number | null;
  orp?: number | null;
  tds?: number | null;
  turb_adc?: number | null;
  turb?: number | null;
  turb_status?: string | null;
  temp_c?: number | null;
}

export interface SensorDataMap {
  [pushId: string]: RawSensorReading;
}
