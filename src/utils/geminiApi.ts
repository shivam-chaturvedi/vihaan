import { SensorReading } from '../types';
import { formatDateTime } from './formatTime';

const GEMINI_MODEL = 'gemini-2.5-flash-lite';

function average(values: Array<number | null>) {
  const filtered = values.filter((value): value is number => value !== null);
  return filtered.length > 0 ? filtered.reduce((sum, value) => sum + value, 0) / filtered.length : 0;
}

export async function analyzeWithGemini(
  readings: SensorReading[],
  latestTs?: number | null
): Promise<string> {
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!geminiApiKey) {
    throw new Error('Missing VITE_GEMINI_API_KEY in .env');
  }

  const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiApiKey}`;

  const dataSummary = readings.map((reading, index) => ({
    reading: index + 1,
    device: reading.deviceId,
    time: formatDateTime(reading.ts, latestTs),
    water_pH: reading.water_ph?.toFixed(2) || 'N/A',
    soil_pH: reading.soil_ph?.toFixed(2) || 'N/A',
    water_temp_c: reading.water_temp_c?.toFixed(2) || 'N/A',
    soil_temp_c: reading.soil_temp_c?.toFixed(2) || 'N/A',
    tds: reading.tds?.toFixed(2) || 'N/A',
    turbidity: reading.turb?.toFixed(2) || 'N/A',
    nitrogen: reading.nitrogen?.toFixed(2) || 'N/A',
    phosphorus: reading.phosphorus?.toFixed(2) || 'N/A',
    potassium: reading.potassium?.toFixed(2) || 'N/A',
    npk_valid: reading.npk_valid ?? 'N/A',
    status: reading.turb_status || 'N/A',
  }));

  const prompt = `You are an agricultural advisor for makhana farming.

You are reviewing live sensor values collected during a 1-minute field measurement from a makhana farming device. The device measures both water and soil parameters.

Data summary:
- Total readings: ${readings.length}
- Average water pH: ${average(readings.map((r) => r.water_ph)).toFixed(2)}
- Average soil pH: ${average(readings.map((r) => r.soil_ph)).toFixed(2)}
- Average water temperature: ${average(readings.map((r) => r.water_temp_c)).toFixed(2)} C
- Average soil temperature: ${average(readings.map((r) => r.soil_temp_c)).toFixed(2)} C
- Average TDS: ${average(readings.map((r) => r.tds)).toFixed(2)}
- Average turbidity: ${average(readings.map((r) => r.turb)).toFixed(2)}
- Average nitrogen: ${average(readings.map((r) => r.nitrogen)).toFixed(2)}
- Average phosphorus: ${average(readings.map((r) => r.phosphorus)).toFixed(2)}
- Average potassium: ${average(readings.map((r) => r.potassium)).toFixed(2)}

Individual readings:
${JSON.stringify(dataSummary, null, 2)}

Return a concise response with these exact sections:
1. Overall condition
2. Water analysis
3. Soil analysis
4. Nutrient analysis
5. Farmer recommendation
6. Pond advice
7. Limitation

Requirements:
- Explain the meaning in simple language for a farmer.
- Mention if the measured values suggest action is needed.
- Mention that micronutrients and organic matter are not directly measured if true.
- Keep the answer compact and practical.
- Do not use markdown tables.`;

  const response = await fetch(geminiApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        topP: 0.9,
        maxOutputTokens: 900,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || '').join('').trim();

  if (text) {
    return text;
  }

  throw new Error('Invalid response from Gemini API');
}
