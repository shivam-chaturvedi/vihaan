import { SensorReading } from '../types';
import { analyzeWithGemini } from '../utils/geminiApi';
import { generateInsightsPdf } from '../utils/generatePdf';
import { FileDown, Loader2, AlertCircle, Radio } from 'lucide-react';
import { useState } from 'react';

interface TestAnalysisPanelProps {
  readings: SensorReading[];
  latestTs?: number | null;
}

export function TestAnalysisPanel({ readings, latestTs }: TestAnalysisPanelProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyzeAndGeneratePdf = async () => {
    if (readings.length === 0) {
      setError('No live readings found in the current 3-minute window.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const insights = await analyzeWithGemini(readings);
      generateInsightsPdf(readings, insights, latestTs);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze data';
      setError(`Error: ${errorMessage}`);
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">Live Test Analysis</h2>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold border border-green-200">
              <Radio className="h-3.5 w-3.5 animate-pulse" />
              LIVE WINDOW
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Showing only readings from the current Firebase time window. No countdown or mock timer is used.
          </p>
        </div>

        <button
          onClick={handleAnalyzeAndGeneratePdf}
          disabled={isAnalyzing || readings.length === 0}
          className="inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-400"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <FileDown className="h-5 w-5 mr-2" />
              Generate PDF Report
            </>
          )}
        </button>
      </div>

      <div className="p-4 rounded-lg border border-blue-200 bg-blue-50 text-blue-900">
        <div className="flex items-start gap-3">
          <Radio className="h-5 w-5 mt-0.5 text-blue-600" />
          <div>
            <p className="font-semibold">Live readings only</p>
            <p className="text-sm text-blue-800 mt-1">
              We filter Firebase data to the readings whose timestamps fall within approximately 3 minutes of the current time. Older readings stay hidden so the panel reflects the live device feed.
            </p>
            <p className="text-sm text-blue-800 mt-2">
              {readings.length > 0
                ? `${readings.length} live reading${readings.length === 1 ? '' : 's'} available for analysis.`
                : 'No live readings are currently inside the window. When a fresh timestamp arrives, the panel will update automatically.'}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}
