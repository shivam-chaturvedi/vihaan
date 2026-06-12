import { SensorReading } from '../types';

export async function analyzeWithGemini(readings: SensorReading[]): Promise<string> {
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!geminiApiKey) {
    throw new Error('Missing VITE_GEMINI_API_KEY in .env');
  }

  const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;

  // Prepare data summary for Gemini
  const dataSummary = readings.map((r, idx) => ({
    reading: idx + 1,
    time: new Date(r.ts * 1000).toLocaleString(),
    pH: r.ph?.toFixed(2) || 'N/A',
    ORP: r.orp?.toFixed(2) || 'N/A',
    TDS: r.tds?.toFixed(2) || 'N/A',
    Turbidity: r.turb?.toFixed(2) || 'N/A',
    Temperature: r.temp_c?.toFixed(2) || 'N/A',
    Status: r.turb_status || 'N/A',
  }));

  // Calculate averages
  const phReadings = readings.filter(r => r.ph !== null);
  const orpReadings = readings.filter(r => r.orp !== null);
  const tdsReadings = readings.filter(r => r.tds !== null);
  const turbReadings = readings.filter(r => r.turb !== null);
  const tempReadings = readings.filter(r => r.temp_c !== null);

  const avgPh = phReadings.length > 0 ? phReadings.reduce((sum, r) => sum + (r.ph || 0), 0) / phReadings.length : 0;
  const avgOrp = orpReadings.length > 0 ? orpReadings.reduce((sum, r) => sum + (r.orp || 0), 0) / orpReadings.length : 0;
  const avgTds = tdsReadings.length > 0 ? tdsReadings.reduce((sum, r) => sum + (r.tds || 0), 0) / tdsReadings.length : 0;
  const avgTurb = turbReadings.length > 0 ? turbReadings.reduce((sum, r) => sum + (r.turb || 0), 0) / turbReadings.length : 0;
  const avgTemp = tempReadings.length > 0 ? tempReadings.reduce((sum, r) => sum + (r.temp_c || 0), 0) / tempReadings.length : 0;

  const prompt = `You are an agricultural water quality expert analyzing sensor data from a Makhana (Euryale ferox) pond farming system.

Analyze the following 1-minute water quality monitoring data and provide comprehensive insights:

**Data Summary:**
- Total Readings: ${readings.length}
- Average pH: ${avgPh.toFixed(2)}
- Average ORP: ${avgOrp.toFixed(2)} mV
- Average TDS: ${avgTds.toFixed(2)} ppm
- Average Turbidity: ${avgTurb.toFixed(2)} NTU
- Average Temperature: ${avgTemp.toFixed(2)} °C

**Individual Readings:**
${JSON.stringify(dataSummary, null, 2)}

**Provide a detailed analysis including:**
1. Overall water quality assessment
2. Parameter-by-parameter analysis (pH, ORP, TDS, Turbidity, Temperature)
3. Trends and patterns observed during the 1-minute period
4. Recommendations for maintaining optimal pond conditions
5. Any concerns or alerts based on the readings
6. Specific guidance for Makhana farming

Format your response in clear sections with headings. Be specific and actionable.`;

  try {
    const response = await fetch(geminiApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text;
    }
    
    throw new Error('Invalid response from Gemini API');
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw error;
  }
}
