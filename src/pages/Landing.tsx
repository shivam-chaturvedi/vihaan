import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Database,
  Droplets,
  Info,
  Leaf,
  ShieldCheck,
  Sprout,
  Waves,
} from 'lucide-react';

const pillars = [
  {
    title: 'पानी की जाँच',
    description: 'तालाब के पानी में pH, ORP, TDS, गंदलापन और तापमान देखें।',
    icon: Waves,
  },
  {
    title: 'मिट्टी और NPK',
    description: 'मिट्टी का pH, तापमान और मुख्य पोषक तत्व एक ही स्क्रीन पर देखें।',
    icon: Leaf,
  },
  {
    title: 'भरोसेमंद सलाह',
    description: 'कौन सी बात पक्की है और कहाँ अभी जाँच बाकी है, यह साफ दिखे।',
    icon: ShieldCheck,
  },
];

const metrics = [
  { label: 'पानी डेटा', value: 'pH · ORP · TDS', icon: Droplets },
  { label: 'मिट्टी डेटा', value: 'pH · EC · तापमान', icon: Sprout },
  { label: 'NPK डेटा', value: 'N · P · K', icon: Leaf },
];

const farmerNeeds = [
  'हर सेंसर रीडिंग का सरल अर्थ समझ में आए।',
  'रीडिंग देखकर किसान क्या करे, इसका सीधा उत्तर मिले।',
  'खेत/तालाब के क्षेत्रफल के आधार पर पोषक तत्व की मात्रा दिखे।',
  'अभी कौन सी चीजें नहीं मापी जा रहीं, यह भी साफ लिखा हो।',
];

export function Landing() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="py-16 lg:py-24">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
          <Database className="h-3.5 w-3.5" />
          Firebase से जुड़ा लाइव डेटा
        </div>
        <h1 className="mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-stone-900 sm:text-5xl">
          मखाना खेती के लिए सरल मापन और सलाह
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">
          Project Pragya पानी, मिट्टी, तालाब की स्थिति और सिफारिशों को एक साथ दिखाता है — ताकि 1 मिनट की जाँच के
          बाद किसान को सीधी उपयोगी सलाह मिल सके।
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            डैशबोर्ड खोलें
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center rounded-lg border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100"
          >
            जानकारी देखें
          </Link>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="rounded-xl border border-stone-200 bg-white p-5">
                <Icon className="h-5 w-5 text-emerald-600" />
                <p className="mt-3 text-sm text-stone-500">{metric.label}</p>
                <p className="mt-1 text-lg font-semibold text-stone-900">{metric.value}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Pillars */}
      <section className="border-t border-stone-200 py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="rounded-xl border border-stone-200 bg-white p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                  <Icon className="h-5 w-5 text-emerald-600" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-stone-900">{pillar.title}</h2>
                <p className="mt-2 text-sm leading-6 text-stone-600">{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Needs + limits */}
      <section className="grid gap-6 border-t border-stone-200 py-16 lg:grid-cols-2">
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-stone-900">किसान के लिए क्या जरूरी है</h2>
          <ul className="mt-4 space-y-3 text-sm text-stone-600">
            {farmerNeeds.map((need) => (
              <li key={need} className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                {need}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-amber-600" />
            <h2 className="text-lg font-semibold text-stone-900">मापन की वर्तमान सीमा</h2>
          </div>
          <p className="mt-4 text-sm leading-7 text-stone-700">
            NPK महत्वपूर्ण है, लेकिन फसल की अच्छी वृद्धि केवल NPK पर निर्भर नहीं होती। सूक्ष्म पोषक तत्व और जैविक पदार्थ
            की जानकारी अभी सीधे नहीं मापी जा रही है। इसलिए यह सीमा किसान को साफ दिखाई जाती है।
          </p>
        </div>
      </section>
    </div>
  );
}
