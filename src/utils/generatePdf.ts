import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SensorReading } from '../types';
import { formatDateTime } from './formatTime';
import {
  AreaUnit,
  buildAssessmentReport,
  PondType,
} from './makhanaRecommendations';

function average(values: Array<number | null>) {
  const filtered = values.filter((value): value is number => value !== null);
  return filtered.length > 0 ? filtered.reduce((sum, value) => sum + value, 0) / filtered.length : null;
}

function formatValue(value: number | null, suffix = '') {
  return value === null ? 'N/A' : `${value.toFixed(2)}${suffix}`;
}

export function generateInsightsPdf(
  readings: SensorReading[],
  geminiInsights: string,
  latestTs?: number | null,
  reportConfig?: {
    latestReading: SensorReading | null;
    pondType: PondType;
    areaValue: number;
    areaUnit: AreaUnit;
  }
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = margin;

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Field Telemetry Analysis Report', pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Data Summary', margin, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const summaryText = [
    `Total Readings: ${readings.length}`,
    `Average Water pH: ${formatValue(average(readings.map((r) => r.water_ph)))}`,
    `Average Soil pH: ${formatValue(average(readings.map((r) => r.soil_ph)))}`,
    `Average Water Temperature: ${formatValue(average(readings.map((r) => r.water_temp_c)), ' °C')}`,
    `Average TDS: ${formatValue(average(readings.map((r) => r.tds)), ' ppm')}`,
    `Average Turbidity: ${formatValue(average(readings.map((r) => r.turb)), ' NTU')}`,
    `Average Nitrogen: ${formatValue(average(readings.map((r) => r.nitrogen)))}`,
    `Average Phosphorus: ${formatValue(average(readings.map((r) => r.phosphorus)))}`,
    `Average Potassium: ${formatValue(average(readings.map((r) => r.potassium)))}`,
  ];

  summaryText.forEach((line) => {
    doc.text(line, margin + 5, yPos);
    yPos += 6;
  });

  yPos += 5;

  if (reportConfig) {
    const report = buildAssessmentReport(
      reportConfig.latestReading,
      reportConfig.pondType,
      reportConfig.areaValue,
      reportConfig.areaUnit
    );

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Assessment Report', margin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const reportLines = [
      report.headline,
      report.summary,
      `Pond type: ${reportConfig.pondType === 'natural' ? 'Natural' : 'Human-made'}`,
      `Area: ${reportConfig.areaValue.toFixed(2)} ${reportConfig.areaUnit}`,
      ...report.nutrientLines,
      ...report.recommendationLines.slice(0, 4),
    ];

    reportLines.forEach((line) => {
      const splitText = doc.splitTextToSize(line, pageWidth - margin * 2);
      splitText.forEach((textLine: string) => {
        doc.text(textLine, margin + 5, yPos);
        yPos += 5;
      });
      yPos += 1;
    });

    yPos += 4;
  }

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Sensor Readings', margin, yPos);
  yPos += 8;

  const tableData = readings.map((reading, idx) => [
    (idx + 1).toString(),
    formatDateTime(reading.ts, latestTs),
    reading.deviceId,
    formatValue(reading.water_ph),
    formatValue(reading.soil_ph),
    formatValue(reading.tds),
    formatValue(reading.turb),
    formatValue(reading.water_temp_c),
    formatValue(reading.nitrogen),
    formatValue(reading.phosphorus),
    formatValue(reading.potassium),
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['#', 'Time', 'Device', 'Water pH', 'Soil pH', 'TDS', 'Turb', 'Water Temp', 'N', 'P', 'K']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [8, 145, 178], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 8 },
    margin: { left: margin, right: margin },
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('AI Analysis & Insights', margin, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const insightsLines = geminiInsights.split('\n').filter((line) => line.trim());
  const maxWidth = pageWidth - 2 * margin;

  insightsLines.forEach((line) => {
    if (yPos > doc.internal.pageSize.getHeight() - 30) {
      doc.addPage();
      yPos = margin;
    }

    if (line.trim().startsWith('#') || (line.trim().startsWith('**') && line.trim().endsWith('**'))) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      const cleanLine = line.replace(/^#+\s*/, '').replace(/\*\*/g, '').trim();
      doc.text(cleanLine, margin, yPos);
      yPos += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
    } else {
      const splitText = doc.splitTextToSize(line.trim(), maxWidth);
      splitText.forEach((textLine: string) => {
        if (yPos > doc.internal.pageSize.getHeight() - 30) {
          doc.addPage();
          yPos = margin;
        }
        doc.text(textLine, margin, yPos);
        yPos += 5;
      });
      yPos += 2;
    }
  });

  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${totalPages} - Makhana Farming Website`, pageWidth / 2, doc.internal.pageSize.getHeight() - 10, {
      align: 'center',
    });
  }

  const fileName = `field-telemetry-analysis-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
