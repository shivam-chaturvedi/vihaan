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

const notes = [
  {
    icon: Waves,
    title: 'Water stack',
    body: 'Use the live water metrics to explain pond condition, trend direction, and immediate intervention triggers.',
  },
  {
    icon: Leaf,
    title: 'NPK stack',
    body: 'Present NPK as part of the picture, not the whole picture. It supports decisions, but does not replace broader soil diagnostics.',
  },
  {
    icon: FlaskConical,
    title: 'Validation note',
    body: 'Be ready to explain how readings are calibrated, how often they should be checked, and the confidence level the team currently has.',
  },
];

export function About() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <header>
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">Project Pragya जानकारी</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-stone-600">
          यह पेज किसान और फील्ड टीम दोनों के लिए साफ जानकारी देता है, ताकि मापन, रिपोर्ट और सलाह भरोसेमंद तरीके से
          समझाई जा सके।
        </p>
      </header>

      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <p className="text-sm leading-7 text-stone-700">
            वर्तमान प्रोटोटाइप पानी, मिट्टी, NPK और क्षेत्रफल आधारित सलाह दिखाता है, लेकिन सूक्ष्म पोषक तत्व और जैविक
            पदार्थ को सीधे नहीं मापता। यह सीमा किसान को साफ बतानी चाहिए।
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <Sprout className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-stone-900">किसान की दृष्टि</h2>
          </div>
          <ul className="mt-5 space-y-3 text-sm text-stone-600">
            {farmerPoints.map((point) => (
              <li key={point} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-sky-600" />
            <h2 className="text-lg font-semibold text-stone-900">तकनीकी दृष्टि</h2>
          </div>
          <ul className="mt-5 space-y-3 text-sm text-stone-600">
            {technicalPoints.map((point) => (
              <li key={point} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {notes.map((note) => {
          const Icon = note.icon;
          return (
            <div key={note.title} className="rounded-xl border border-stone-200 bg-white p-6">
              <Icon className="h-5 w-5 text-stone-400" />
              <h3 className="mt-4 text-base font-semibold text-stone-900">{note.title}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{note.body}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
