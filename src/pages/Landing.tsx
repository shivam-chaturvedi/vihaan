import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Database,
  Droplets,
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

export function Landing() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <section className="border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                <Database className="h-4 w-4" />
                Firebase से जुड़ा लाइव डेटा
              </div>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Project Pragya
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
                मखाना किसानों और फील्ड टीम के लिए बनाया गया यह प्लेटफॉर्म पानी, मिट्टी, तालाब की स्थिति और सिफारिशों को एक साथ दिखाता है, ताकि 1 मिनट की जाँच के बाद किसान को सीधी उपयोगी सलाह मिल सके।
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center rounded-md bg-cyan-500 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
                >
                  डैशबोर्ड खोलें
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center rounded-md border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition-colors hover:bg-slate-900"
                >
                  जानकारी देखें
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-md border border-slate-800 bg-slate-950/70 p-4">
                  <Droplets className="h-6 w-6 text-cyan-300" />
                  <p className="mt-3 text-sm text-slate-400">लाइव पानी डेटा</p>
                  <p className="mt-1 text-2xl font-semibold text-white">pH, ORP, TDS</p>
                </div>
                <div className="rounded-md border border-slate-800 bg-slate-950/70 p-4">
                  <Sprout className="h-6 w-6 text-emerald-300" />
                  <p className="mt-3 text-sm text-slate-400">मिट्टी डेटा</p>
                  <p className="mt-1 text-2xl font-semibold text-white">pH, EC, temp</p>
                </div>
                <div className="rounded-md border border-slate-800 bg-slate-950/70 p-4">
                  <Leaf className="h-6 w-6 text-lime-300" />
                  <p className="mt-3 text-sm text-slate-400">NPK डेटा</p>
                  <p className="mt-1 text-2xl font-semibold text-white">N, P, K</p>
                </div>
                <div className="rounded-md border border-slate-800 bg-slate-950/70 p-4">
                  <Activity className="h-6 w-6 text-violet-300" />
                  <p className="mt-3 text-sm text-slate-400">फील्ड उपयोग</p>
                  <p className="mt-1 text-2xl font-semibold text-white">लाइव + सलाह</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-6 lg:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div key={pillar.title} className="rounded-lg border border-slate-800 bg-slate-900/80 p-6">
                <div className="rounded-md border border-slate-800 bg-slate-950/70 p-3 w-fit">
                  <Icon className="h-5 w-5 text-cyan-300" />
                </div>
                <h2 className="mt-4 text-xl font-semibold text-white">{pillar.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">{pillar.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-6">
            <h2 className="text-xl font-semibold text-white">किसान उपयोग के लिए क्या जरूरी है</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />हर सेंसर रीडिंग का सरल अर्थ समझ में आए।</li>
              <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />रीडिंग देखकर किसान क्या करे, इसका सीधा उत्तर मिले।</li>
              <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />खेत/तालाब के क्षेत्रफल के आधार पर पोषक तत्व की मात्रा दिखे।</li>
              <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />यह भी साफ लिखा हो कि अभी कौन सी चीजें नहीं मापी जा रहीं।</li>
            </ul>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-6">
            <h2 className="text-xl font-semibold text-white">मापन की वर्तमान सीमा</h2>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              NPK महत्वपूर्ण है, लेकिन फसल की अच्छी वृद्धि केवल NPK पर निर्भर नहीं होती। सूक्ष्म पोषक तत्व और जैविक पदार्थ की जानकारी अभी सीधे नहीं मापी जा रही है। इसलिए यह सीमा किसान को साफ दिखाई जाती है।
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
