import { AlertTriangle, CheckCircle2, FlaskConical, Leaf, ShieldCheck, Sprout, Waves } from 'lucide-react';

const farmerPoints = [
  'What problem the device solves for the farmer',
  'How readings should be interpreted in simple language',
  'What action can be taken after each reading',
  'What improvement in crop health, yield, or profitability can reasonably be expected',
  'What the current version cannot yet claim',
];

const technicalPoints = [
  'Device architecture and working logic',
  'Purpose of each sensor and parameter',
  'Recommendation logic and interpretation framework',
  'Accuracy, reliability, calibration, and validation approach',
  'Practical deployment constraints and scalability',
];

export function About() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-8 mb-8">
          <h1 className="text-4xl font-bold text-white">Project Pragya जानकारी</h1>
          <p className="mt-4 text-lg text-slate-300">
            यह पेज किसान और फील्ड टीम दोनों के लिए साफ जानकारी देता है, ताकि मापन, रिपोर्ट और सलाह भरोसेमंद तरीके से समझाई जा सके।
          </p>
          <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-300 mt-0.5" />
              <p className="text-sm leading-6 text-amber-100">
                वर्तमान प्रोटोटाइप पानी, मिट्टी, NPK और क्षेत्रफल आधारित सलाह दिखाता है, लेकिन सूक्ष्म पोषक तत्व और जैविक पदार्थ को सीधे नहीं मापता। यह सीमा किसान को साफ बतानी चाहिए।
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-6">
            <div className="flex items-center gap-3">
              <Sprout className="h-5 w-5 text-emerald-300" />
              <h2 className="text-2xl font-semibold text-white">किसान की दृष्टि</h2>
            </div>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              {farmerPoints.map((point) => (
                <li key={point} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-6">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-cyan-300" />
              <h2 className="text-2xl font-semibold text-white">तकनीकी दृष्टि</h2>
            </div>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              {technicalPoints.map((point) => (
                <li key={point} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-cyan-300" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-6">
            <Waves className="h-6 w-6 text-cyan-300" />
            <h3 className="mt-4 text-lg font-semibold text-white">Water stack</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Use the live water metrics to explain pond condition, trend direction, and immediate intervention triggers.
            </p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-6">
            <Leaf className="h-6 w-6 text-lime-300" />
            <h3 className="mt-4 text-lg font-semibold text-white">NPK stack</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Present NPK as part of the picture, not the whole picture. It supports decisions, but it does not replace broader soil diagnostics.
            </p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-6">
            <FlaskConical className="h-6 w-6 text-violet-300" />
            <h3 className="mt-4 text-lg font-semibold text-white">Validation note</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Be ready to explain how readings are calibrated, how often they should be checked, and what confidence level the team currently has.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
