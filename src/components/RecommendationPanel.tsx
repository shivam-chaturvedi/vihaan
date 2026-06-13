import { useMemo } from 'react';
import { AlertTriangle, CheckCircle2, ExternalLink, Leaf, Map, Sprout } from 'lucide-react';
import { SensorReading } from '../types';
import {
  AreaUnit,
  getNutrientPlan,
  getPondTypeAdvice,
  getSensorRecommendations,
  MAKHANA_REFERENCE_LINKS,
  PondType,
  convertToHectares,
} from '../utils/makhanaRecommendations';

interface RecommendationPanelProps {
  latestReading: SensorReading | null;
  pondType: PondType;
  setPondType: (value: PondType) => void;
  area: string;
  setArea: (value: string) => void;
  areaUnit: AreaUnit;
  setAreaUnit: (value: AreaUnit) => void;
}

function statusClasses(status: 'good' | 'watch' | 'action') {
  if (status === 'good') return 'border-emerald-200 bg-emerald-50 text-emerald-800';
  if (status === 'watch') return 'border-amber-200 bg-amber-50 text-amber-800';
  return 'border-rose-200 bg-rose-50 text-rose-800';
}

function nutrientStatusLabel(status: 'low' | 'medium' | 'high' | 'unknown') {
  if (status === 'low') return 'कम';
  if (status === 'medium') return 'मध्यम';
  if (status === 'high') return 'उच्च';
  return 'अज्ञात';
}

export function RecommendationPanel({
  latestReading,
  pondType,
  setPondType,
  area,
  setArea,
  areaUnit,
  setAreaUnit,
}: RecommendationPanelProps) {
  const sensorRecommendations = useMemo(() => getSensorRecommendations(latestReading), [latestReading]);
  const pondAdvice = useMemo(() => getPondTypeAdvice(pondType), [pondType]);
  const nutrientPlan = useMemo(() => getNutrientPlan(latestReading), [latestReading]);

  const numericArea = Number.parseFloat(area);
  const areaHa = Number.isFinite(numericArea) && numericArea > 0 ? convertToHectares(numericArea, areaUnit) : 0;

  return (
    <section className="mb-8 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-xl border border-stone-200 bg-white p-6">
        <div className="flex items-center gap-3">
          <Sprout className="h-5 w-5 text-emerald-600" />
          <div>
            <h2 className="text-xl font-semibold text-stone-900">सलाह प्रणाली</h2>
            <p className="text-sm text-stone-500">
              किसान मार्गदर्शन, तालाब सुधार और पोषक योजना के लिए सलाह।
            </p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            onClick={() => setPondType('natural')}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pondType === 'natural' ? 'bg-emerald-600 text-white' : 'border border-stone-300 bg-white text-stone-700 hover:bg-stone-100'
            }`}
          >
            प्राकृतिक तालाब
          </button>
          <button
            onClick={() => setPondType('managed')}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              pondType === 'managed' ? 'bg-emerald-600 text-white' : 'border border-stone-300 bg-white text-stone-700 hover:bg-stone-100'
            }`}
          >
            मानव-निर्मित तालाब
          </button>
        </div>

        <div className="mt-6 grid gap-3">
          {[...sensorRecommendations, ...pondAdvice].map((item, index) => (
            <div key={`${item.title}-${index}`} className={`rounded-md border p-4 ${statusClasses(item.status)}`}>
              <p className="text-sm font-semibold">{item.title}</p>
              <p className="mt-2 text-sm leading-6 opacity-90">{item.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-md border border-stone-200 bg-stone-50 p-4">
          <div className="flex items-center gap-2 text-stone-800">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <p className="text-sm font-semibold">महत्वपूर्ण सीमा</p>
          </div>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            यह संस्करण सूक्ष्म पोषक तत्व और जैविक पदार्थ को सीधे नहीं मापता। इसलिए पोषक सलाह को अंतिम प्रयोगशाला रिपोर्ट की जगह केवल खेत-स्तर संकेत माना जाए।
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <Map className="h-5 w-5 text-sky-600" />
            <div>
              <h2 className="text-xl font-semibold text-stone-900">क्षेत्रफल आधारित पोषक योजना</h2>
              <p className="text-sm text-stone-500">
                खेत/तालाब के क्षेत्र के हिसाब से अनुमानित पोषक मात्रा।
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto]">
            <label className="block">
              <span className="text-sm text-stone-500">क्षेत्रफल</span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="mt-2 h-11 w-full rounded-md border border-stone-200 bg-white px-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </label>
            <label className="block">
              <span className="text-sm text-stone-500">इकाई</span>
              <select
                value={areaUnit}
                onChange={(e) => setAreaUnit(e.target.value as AreaUnit)}
                className="mt-2 h-11 rounded-md border border-stone-200 bg-white px-3 text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="ha">हेक्टेयर</option>
                <option value="acre">एकड़</option>
              </select>
            </label>
          </div>

          <div className="mt-4 rounded-md border border-stone-200 bg-stone-50 p-4">
            <p className="text-sm text-stone-500">हेक्टेयर में क्षेत्रफल</p>
            <p className="mt-1 text-2xl font-semibold text-stone-900">{areaHa.toFixed(2)} ha</p>
          </div>

          <div className="mt-4 space-y-3">
            {nutrientPlan.map((item) => (
              <div key={item.nutrient} className="rounded-md border border-stone-200 bg-stone-50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-stone-500">{item.nutrient}</p>
                    <p className="text-lg font-semibold text-stone-900">{nutrientStatusLabel(item.status)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-stone-500">अनुमानित मात्रा</p>
                    <p className="text-lg font-semibold text-emerald-700">{(item.perHectareKg * areaHa).toFixed(1)} kg</p>
                    <p className="text-xs text-stone-400">{item.perHectareKg} kg/ha आधार</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs leading-5 text-stone-400">
            Assumption: the N, P, and K sensor values are interpreted in the style of available-soil categories used in Indian agronomy. Use this for field discussion, not as a direct replacement for a lab fertilizer prescription.
          </p>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <Leaf className="h-5 w-5 text-emerald-600" />
            <div>
          <h2 className="text-xl font-semibold text-stone-900">संदर्भ नोट्स</h2>
              <p className="text-sm text-stone-500">
                यह सलाह प्रणाली मखाना खेती की संदर्भ जानकारी और व्यावहारिक नियमों का उपयोग करती है।
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {MAKHANA_REFERENCE_LINKS.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="block rounded-md border border-stone-200 bg-stone-50 p-4 transition-colors hover:border-stone-300"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-stone-900">{link.title}</p>
                    <p className="mt-2 text-sm leading-6 text-stone-500">{link.note}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 shrink-0 text-stone-400" />
                </div>
              </a>
            ))}
          </div>

          <div className="mt-4 rounded-md border border-stone-200 bg-stone-50 p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <p className="text-sm font-semibold text-stone-900">उद्देश्य</p>
            </div>
            <p className="mt-2 text-sm text-stone-500">
              यह वेबसाइट मखाना किसानों के लिए बनाई गई है ताकि वे पानी और मिट्टी की स्थिति समझकर हर मापन के बाद सलाह प्राप्त कर सकें।
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
