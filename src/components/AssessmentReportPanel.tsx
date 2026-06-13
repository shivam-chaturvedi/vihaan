import { ClipboardList, ShieldAlert } from 'lucide-react';
import { SensorReading } from '../types';
import {
  AreaUnit,
  buildAssessmentReport,
  PondType,
} from '../utils/makhanaRecommendations';

interface AssessmentReportPanelProps {
  latestReading: SensorReading | null;
  readingsCount: number;
  pondType: PondType;
  area: string;
  areaUnit: AreaUnit;
}

function statusClasses(status: 'good' | 'watch' | 'action') {
  if (status === 'good') return 'border-emerald-200 bg-emerald-50 text-emerald-700';
  if (status === 'watch') return 'border-amber-200 bg-amber-50 text-amber-700';
  return 'border-rose-200 bg-rose-50 text-rose-700';
}

export function AssessmentReportPanel({
  latestReading,
  readingsCount,
  pondType,
  area,
  areaUnit,
}: AssessmentReportPanelProps) {
  const areaValue = Number.parseFloat(area);
  const safeArea = Number.isFinite(areaValue) && areaValue > 0 ? areaValue : 0;
  const report = buildAssessmentReport(latestReading, pondType, safeArea, areaUnit);

  return (
    <section className="mb-8 rounded-xl border border-stone-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <ClipboardList className="h-5 w-5 text-sky-600" />
          <div>
            <h2 className="text-xl font-semibold text-stone-900">आकलन रिपोर्ट</h2>
            <p className="text-sm text-stone-500">
              मापे गए सेंसर मान और सलाह के आधार पर संक्षिप्त रिपोर्ट।
            </p>
          </div>
        </div>
        <div className={`rounded-md border px-3 py-2 text-xs font-semibold ${statusClasses(report.overallStatus)}`}>
          {report.overallStatus.toUpperCase()}
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-md border border-stone-200 bg-stone-50 p-4">
          <p className="text-sm font-semibold text-stone-900">{report.headline}</p>
          <p className="mt-3 text-sm leading-6 text-stone-600">{report.summary}</p>
          <div className="mt-4 grid gap-2 text-sm text-stone-500 sm:grid-cols-3">
            <p>रीडिंग: <span className="text-stone-900">{readingsCount}</span></p>
            <p>तालाब प्रकार: <span className="text-stone-900">{pondType === 'natural' ? 'प्राकृतिक' : 'मानव-निर्मित'}</span></p>
            <p>क्षेत्रफल: <span className="text-stone-900">{area || '0'} {areaUnit}</span></p>
          </div>
        </div>

        <div className="rounded-md border border-stone-200 bg-stone-50 p-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-600" />
            <p className="text-sm font-semibold text-stone-900">सीमा</p>
          </div>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            इस रिपोर्ट में मापे गए सेंसर मान और नियम-आधारित सलाह शामिल हैं, लेकिन सूक्ष्म पोषक तत्व और जैविक पदार्थ अभी सीधे नहीं मापे जाते।
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-md border border-stone-200 bg-stone-50 p-4">
          <h3 className="text-sm font-semibold text-stone-900">पोषक तत्व योजना</h3>
          <ul className="mt-3 space-y-3 text-sm text-stone-600">
            {report.nutrientLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-md border border-stone-200 bg-stone-50 p-4">
          <h3 className="text-sm font-semibold text-stone-900">सिफारिशें</h3>
          <ul className="mt-3 space-y-3 text-sm text-stone-600">
            {report.recommendationLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
