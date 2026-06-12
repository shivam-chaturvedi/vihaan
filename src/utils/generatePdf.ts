import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SensorReading } from '../types';
import { formatDateTime } from './formatTime';

export function generateInsightsPdf(
  readings: SensorReading[],
  geminiInsights: string,
  latestTs?: number | null
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let yPos = margin;

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Water Quality Analysis Report', pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  // Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // Summary Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Data Summary', margin, yPos);
  yPos += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const avgPh = readings.reduce((sum, r) => sum + (r.ph || 0), 0) / readings.filter(r => r.ph !== null).length;
  const avgOrp = readings.reduce((sum, r) => sum + (r.orp || 0), 0) / readings.filter(r => r.orp !== null).length;
  const avgTds = readings.reduce((sum, r) => sum + (r.tds || 0), 0) / readings.filter(r => r.tds !== null).length;
  const avgTurb = readings.reduce((sum, r) => sum + (r.turb || 0), 0) / readings.filter(r => r.turb !== null).length;
  const avgTemp = readings.reduce((sum, r) => sum + (r.temp_c || 0), 0) / readings.filter(r => r.temp_c !== null).length;

  const summaryText = [
    `Total Readings: ${readings.length}`,
    `Average pH: ${avgPh.toFixed(2)}`,
    `Average ORP: ${avgOrp.toFixed(2)} mV`,
    `Average TDS: ${avgTds.toFixed(2)} ppm`,
    `Average Turbidity: ${avgTurb.toFixed(2)} NTU`,
    `Average Temperature: ${avgTemp.toFixed(2)} °C`,
  ];

  summaryText.forEach(line => {
    doc.text(line, margin + 5, yPos);
    yPos += 6;
  });

  yPos += 5;

  // Data Table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Sensor Readings', margin, yPos);
  yPos += 8;

  const tableData = readings.map((reading, idx) => [
    (idx + 1).toString(),
    formatDateTime(reading.ts, latestTs),
    reading.ph?.toFixed(2) || 'N/A',
    reading.orp?.toFixed(2) || 'N/A',
    reading.tds?.toFixed(2) || 'N/A',
    reading.turb?.toFixed(2) || 'N/A',
    reading.temp_c?.toFixed(2) || 'N/A',
    reading.turb_status || 'N/A',
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['#', 'Time', 'pH', 'ORP (mV)', 'TDS (ppm)', 'Turbidity (NTU)', 'Temp (°C)', 'Status']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 8 },
    margin: { left: margin, right: margin },
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Insights Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('AI Analysis & Insights', margin, yPos);
  yPos += 8;

  // Split Gemini insights into paragraphs and add to PDF
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  const insightsLines = geminiInsights.split('\n').filter(line => line.trim());
  const maxWidth = pageWidth - 2 * margin;
  
  insightsLines.forEach(line => {
    // Check if we need a new page
    if (yPos > doc.internal.pageSize.getHeight() - 30) {
      doc.addPage();
      yPos = margin;
    }

    // Handle headings (lines starting with # or **)
    if (line.trim().startsWith('#') || (line.trim().startsWith('**') && line.trim().endsWith('**'))) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      const cleanLine = line.replace(/^#+\s*/, '').replace(/\*\*/g, '').trim();
      doc.text(cleanLine, margin, yPos);
      yPos += 7;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
    } else {
      // Regular text - split if too long
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

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Page ${i} of ${totalPages} - Water Quality Monitoring System`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  // Save PDF
  const fileName = `water-quality-analysis-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
