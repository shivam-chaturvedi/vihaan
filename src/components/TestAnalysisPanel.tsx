import { useState } from 'react';
import { AlertCircle, Brain, FileDown, Loader2, Radio } from 'lucide-react';
import { SensorReading } from '../types';
import { analyzeWithGemini } from '../utils/geminiApi';
import { generateInsightsPdf } from '../utils/generatePdf';
import { AreaUnit, PondType } from '../utils/makhanaRecommendations';

interface TestAnalysisPanelProps {
  readings: SensorReading[];
  latestTs?: number | null;
  latestReading: SensorReading | null;
  pondType: PondType;
  areaValue: number;
  areaUnit: AreaUnit;
}

export function TestAnalysisPanel({
  readings,
  latestTs,
  latestReading,
  pondType,
  areaValue,
  areaUnit,
}: TestAnalysisPanelProps) {
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<string>('');

  const handleGetInsights = async () => {
    if (readings.length === 0) {
      setError('अभी मापी गई रीडिंग उपलब्ध नहीं है।');
      return;
    }

    setIsLoadingInsights(true);
    setError(null);

    try {
      const nextInsights = await analyzeWithGemini(readings, latestTs);
      setInsights(nextInsights);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'विश्लेषण नहीं हो सका';
      setError(`Error: ${errorMessage}`);
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const handleGeneratePdf = async () => {
    if (readings.length === 0) {
      setError('अभी मापी गई रीडिंग उपलब्ध नहीं है।');
      return;
    }

    setIsGeneratingPdf(true);
    setError(null);

    try {
      const nextInsights = insights || (await analyzeWithGemini(readings, latestTs));
      setInsights(nextInsights);
      generateInsightsPdf(readings, nextInsights, latestTs, {
        latestReading,
        pondType,
        areaValue,
        areaUnit,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'PDF नहीं बन सका';
      setError(`Error: ${errorMessage}`);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="rounded-xl border border-stone-200 bg-white p-6 mb-8">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-stone-900">Gemini विश्लेषण</h2>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              GEMINI 2.5 FLASH-LITE
            </span>
          </div>
          <p className="mt-1 text-sm text-stone-500">
            `.env` में मौजूद Gemini API key का उपयोग करके मापे गए सेंसर मानों का विश्लेषण करें।
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleGetInsights}
            disabled={isLoadingInsights || isGeneratingPdf || readings.length === 0}
            className="inline-flex items-center justify-center rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-100 disabled:border-stone-200 disabled:text-stone-300"
          >
            {isLoadingInsights ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                विश्लेषण हो रहा है...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-5 w-5" />
                विश्लेषण देखें
              </>
            )}
          </button>

          <button
            onClick={handleGeneratePdf}
            disabled={isLoadingInsights || isGeneratingPdf || readings.length === 0}
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:bg-stone-200 disabled:text-stone-400"
          >
            {isGeneratingPdf ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                PDF बन रहा है...
              </>
            ) : (
              <>
                <FileDown className="mr-2 h-5 w-5" />
                PDF रिपोर्ट
              </>
            )}
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-stone-200 bg-stone-50 p-4 text-stone-700">
        <div className="flex items-start gap-3">
          <Radio className="mt-0.5 h-5 w-5 text-emerald-600" />
          <div>
            <p className="font-semibold">केवल मापी गई रीडिंग</p>
            <p className="mt-1 text-sm text-stone-600">
              विश्लेषण उसी 1 मिनट की माप के आधार पर बनाया जाता है जो अभी डैशबोर्ड पर दिख रही है।
            </p>
            <p className="mt-2 text-sm text-stone-600">
              {readings.length > 0
                ? `Gemini विश्लेषण के लिए ${readings.length} रीडिंग उपलब्ध हैं।`
                : 'अभी कोई मापी गई रीडिंग उपलब्ध नहीं है।'}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-4">
          <div className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-rose-500" />
            <span className="text-rose-700">{error}</span>
          </div>
        </div>
      )}

      <div className="mt-4 rounded-lg border border-stone-200 bg-stone-50 p-4">
        <div className="mb-3 flex items-center gap-2">
          <Brain className="h-4 w-4 text-emerald-600" />
          <p className="text-sm font-semibold text-stone-900">विश्लेषण परिणाम</p>
        </div>
        {insights ? (
          <div className="whitespace-pre-wrap text-sm leading-6 text-stone-700">{insights}</div>
        ) : (
          <p className="text-sm text-stone-500">
            अभी विश्लेषण उपलब्ध नहीं है। <span className="font-semibold text-stone-900">विश्लेषण देखें</span> पर क्लिक करें।
          </p>
        )}
      </div>
    </div>
  );
}
