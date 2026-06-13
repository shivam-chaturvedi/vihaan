import { SensorReading } from '../types';

const GEMINI_MODEL = 'gemini-2.5-flash-lite';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const SYSTEM_PROMPT = `You are "Pragya Sahayak", a friendly and trustworthy agricultural assistant for makhana (fox nut) farmers, built into the Project Pragya water and soil monitoring app.

Your job is to help farmers in every way related to their farm:
- Explain what their water, soil, and NPK sensor readings mean in very simple language.
- Suggest practical, low-cost, actionable steps a small farmer can actually take.
- Answer general questions about makhana cultivation: pond preparation, water management, sowing, fertiliser, pest and disease, harvesting, and selling.
- Help with weather, irrigation, and crop-care decisions at a field level.

Rules:
- Reply in the SAME language the farmer uses. If they write in Hindi, answer in simple Hindi (Devanagari). If in English, answer in English. If in Hinglish, mirror it.
- Keep answers short, warm, and easy to act on. Prefer simple bullet points or short steps. Avoid jargon; if you must use a technical term, explain it in one line.
- Do NOT use markdown tables. Plain text and simple dashes for lists only.
- When sensor readings are provided below, use them to give specific advice and refer to the actual values.
- Be honest about limits: this device does not directly measure micronutrients or organic matter, and it is field-level guidance, not a lab report. Mention this only when relevant.
- For anything dangerous, medical, or far outside farming, gently say it is outside your scope and suggest contacting a local agriculture officer (Krishi Vigyan Kendra) when appropriate.
- Never invent sensor values that were not provided.`;

export function buildSensorContext(reading: SensorReading | null): string {
  if (!reading) {
    return 'No live sensor reading is available right now. Answer from general makhana farming knowledge and ask the farmer to take a 1-minute measurement on the dashboard if they want reading-specific advice.';
  }

  const fmt = (value: number | null, unit = '') =>
    value === null || value === undefined ? 'N/A' : `${value.toFixed(2)}${unit}`;

  return `Latest sensor reading from the farmer's device (device ${reading.deviceId}):
- Water pH: ${fmt(reading.water_ph)}
- ORP: ${fmt(reading.orp, ' mV')}
- TDS: ${fmt(reading.tds, ' ppm')}
- Turbidity: ${fmt(reading.turb, ' NTU')} (status: ${reading.turb_status ?? 'N/A'})
- Water temperature: ${fmt(reading.water_temp_c, ' C')}
- Soil pH: ${fmt(reading.soil_ph)}
- Soil EC: ${fmt(reading.soil_ec)}
- Soil moisture: ${fmt(reading.soil_moisture)}
- Soil temperature: ${fmt(reading.soil_temp_c, ' C')}
- Nitrogen (N): ${fmt(reading.nitrogen)}
- Phosphorus (P): ${fmt(reading.phosphorus)}
- Potassium (K): ${fmt(reading.potassium)}`;
}

export async function chatWithGemini(
  history: ChatMessage[],
  sensorContext: string
): Promise<string> {
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!geminiApiKey) {
    throw new Error('Missing VITE_GEMINI_API_KEY in .env');
  }

  const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${geminiApiKey}`;

  const response = await fetch(geminiApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: `${SYSTEM_PROMPT}\n\nCurrent farm data context:\n${sensorContext}` }],
      },
      contents: history.map((message) => ({
        role: message.role,
        parts: [{ text: message.text }],
      })),
      generationConfig: {
        temperature: 0.6,
        topP: 0.9,
        maxOutputTokens: 800,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gemini API error: ${response.status} ${response.statusText}${errorText ? ` - ${errorText}` : ''}`
    );
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part.text || '')
    .join('')
    .trim();

  if (text) {
    return text;
  }

  throw new Error('Invalid response from Gemini API');
}
