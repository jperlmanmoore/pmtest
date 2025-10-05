'use client';

import { Case } from '../types';

export function exportToCSV(data: Case[], filename: string = 'cases-export.csv') {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  // Define CSV headers
  const headers = [
    'Case Number',
    'Client Name',
    'Title',
    'Description',
    'Stage',
    'Date of Loss',
    'Date of Incident',
    'Ante Litem Required',
    'Ante Litem Agency',
    'Ante Litem Deadline',
    'Assigned Attorney',
    'SOL Date',
    'SOL Status',
    'SOL Warning Days'
  ];

  // Convert data to CSV rows
  const rows = data.map(caseItem => [
    caseItem.caseNumber,
    caseItem.clientId.name,
    caseItem.title,
    caseItem.description || '',
    caseItem.stage,
    caseItem.dateOfLoss,
    caseItem.dateOfIncident || '',
    caseItem.anteLitemRequired ? 'Yes' : 'No',
    caseItem.anteLitemAgency || '',
    caseItem.anteLitemDeadline || '',
    caseItem.assignedAttorney?.name || '',
    caseItem.statuteOfLimitations?.solDate || '',
    caseItem.statuteOfLimitations?.solStatus || '',
    caseItem.statuteOfLimitations?.solWarningDays?.toString() || ''
  ]);

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map(row => row.map(field => `"${field}"`).join(','))
    .join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export function exportToJSON(data: Case[], filename: string = 'cases-export.json') {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export async function exportToPDF(data: Case[], filename: string = 'cases-report.pdf') {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  // For PDF export, we'll create a simple HTML-based PDF
  // In a real application, you'd use a library like jsPDF or Puppeteer

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Case Management Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; border-bottom: 2px solid #333; padding-bottom: 10px; }
        .case { margin-bottom: 20px; border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
        .case-header { font-weight: bold; margin-bottom: 10px; }
        .case-detail { margin: 5px 0; }
        .stage-badge { display: inline-block; padding: 2px 8px; border-radius: 3px; font-size: 12px; }
        .stage-intake { background: #dbeafe; color: #1e40af; }
        .stage-treating { background: #dcfce7; color: #166534; }
        .stage-demandPrep { background: #ddd6fe; color: #5b21b6; }
        .stage-negotiation { background: #fed7aa; color: #9a3412; }
        .stage-settlement { background: #dbeafe; color: #1e40af; }
        .stage-closed { background: #f3f4f6; color: #374151; }
      </style>
    </head>
    <body>
      <h1>Case Management Report</h1>
      <p>Generated on: ${new Date().toLocaleDateString()}</p>
      <p>Total Cases: ${data.length}</p>

      ${data.map(caseItem => `
        <div class="case">
          <div class="case-header">
            Case ${caseItem.caseNumber}: ${caseItem.title}
            <span class="stage-badge stage-${caseItem.stage}">${caseItem.stage}</span>
          </div>
          <div class="case-detail"><strong>Client:</strong> ${caseItem.clientId.name}</div>
          <div class="case-detail"><strong>Description:</strong> ${caseItem.description || 'N/A'}</div>
          <div class="case-detail"><strong>Date of Loss:</strong> ${caseItem.dateOfLoss}</div>
          ${caseItem.anteLitemRequired ? `
            <div class="case-detail"><strong>Ante Litem:</strong> Required - ${caseItem.anteLitemAgency || 'N/A'} (Due: ${caseItem.anteLitemDeadline || 'N/A'})</div>
          ` : ''}
          ${caseItem.statuteOfLimitations ? `
            <div class="case-detail"><strong>Statute of Limitations:</strong> ${new Date(caseItem.statuteOfLimitations.solDate).toLocaleDateString()} (${caseItem.statuteOfLimitations.solStatus})</div>
          ` : ''}
        </div>
      `).join('')}
    </body>
    </html>
  `;

  // Create blob and download
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  const link = document.createElement('a');

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename.replace('.pdf', '.html'));
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export function generateCaseSummaryReport(cases: Case[]) {
  const totalCases = cases.length;
  const activeCases = cases.filter(c => c.stage !== 'closed').length;
  const urgentCases = cases.filter(c => {
    if (!c.statuteOfLimitations?.solDate) return false;
    const daysUntilSOL = Math.ceil((new Date(c.statuteOfLimitations.solDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilSOL <= 30;
  }).length;

  const casesByStage = cases.reduce((acc, caseItem) => {
    acc[caseItem.stage] = (acc[caseItem.stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    totalCases,
    activeCases,
    urgentCases,
    casesByStage,
    generatedAt: new Date().toISOString()
  };
}