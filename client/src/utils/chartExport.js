// Chart Export Utilities
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportChart = async (chartRef, format = 'png', filename = 'chart') => {
  if (!chartRef || !chartRef.current) {
    throw new Error('Chart reference not found');
  }

  try {
    const canvas = await html2canvas(chartRef.current, {
      backgroundColor: '#0D0D0D',
      scale: 2, // Higher resolution
      logging: false,
      useCORS: true
    });

    switch (format.toLowerCase()) {
      case 'png':
        return downloadPNG(canvas, filename);
      case 'jpg':
      case 'jpeg':
        return downloadJPEG(canvas, filename);
      case 'pdf':
        return downloadPDF(canvas, filename);
      case 'svg':
        return downloadSVG(chartRef.current, filename);
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
};

const downloadPNG = (canvas, filename) => {
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return true;
};

const downloadJPEG = (canvas, filename) => {
  const link = document.createElement('a');
  link.download = `${filename}.jpg`;
  link.href = canvas.toDataURL('image/jpeg', 0.9);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return true;
};

const downloadPDF = (canvas, filename) => {
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  const imgX = (pdfWidth - imgWidth * ratio) / 2;
  const imgY = 30;

  // Add title
  pdf.setFontSize(16);
  pdf.setTextColor(255, 255, 255);
  pdf.text('CoachGG Performance Chart', pdfWidth / 2, 20, { align: 'center' });

  // Add chart
  pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);

  // Add footer
  pdf.setFontSize(10);
  pdf.setTextColor(150, 150, 150);
  pdf.text(`Generated on ${new Date().toLocaleDateString()}`, pdfWidth / 2, pdfHeight - 10, { align: 'center' });

  pdf.save(`${filename}.pdf`);
  return true;
};

const downloadSVG = (chartElement, filename) => {
  // For SVG export, we'll convert the chart to SVG format
  // This is a simplified version - in a real implementation, you might want to use a library
  const svgData = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
      <rect width="100%" height="100%" fill="#0D0D0D"/>
      <text x="400" y="50" text-anchor="middle" fill="white" font-size="16">Chart Export (SVG format not fully implemented)</text>
      <text x="400" y="300" text-anchor="middle" fill="#666" font-size="14">Use PNG or PDF for full chart export</text>
    </svg>
  `;

  const blob = new Blob([svgData], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${filename}.svg`;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
};

// Filter utilities for charts
export const filterMatches = (matches, filters) => {
  if (!matches || matches.length === 0) return [];

  let filtered = [...matches];

  // Date range filter
  if (filters.dateRange && (filters.dateRange.start || filters.dateRange.end)) {
    filtered = filtered.filter(match => {
      const matchDate = new Date(match.match_date);
      const startDate = filters.dateRange.start ? new Date(filters.dateRange.start) : null;
      const endDate = filters.dateRange.end ? new Date(filters.dateRange.end) : null;

      if (startDate && matchDate < startDate) return false;
      if (endDate && matchDate > endDate) return false;
      return true;
    });
  }

  // Game filter
  if (filters.gameFilter && filters.gameFilter !== 'all') {
    filtered = filtered.filter(match => 
      match.games?.name === filters.gameFilter
    );
  }

  // Result filter
  if (filters.resultFilter && filters.resultFilter !== 'all') {
    filtered = filtered.filter(match => 
      match.result === filters.resultFilter
    );
  }

  return filtered;
};

// Get available games from matches
export const getAvailableGames = (matches) => {
  if (!matches || matches.length === 0) return [];

  const games = new Map();
  matches.forEach(match => {
    if (match.games?.name) {
      games.set(match.games.name, {
        id: match.games.id || match.games.name,
        name: match.games.name
      });
    }
  });

  return Array.from(games.values()).sort((a, b) => a.name.localeCompare(b.name));
};

// Generate filename based on chart type and filters
export const generateFilename = (chartType, filters = {}) => {
  let filename = `coachgg-${chartType}`;
  
  if (filters.gameFilter && filters.gameFilter !== 'all') {
    filename += `-${filters.gameFilter.toLowerCase().replace(/\s+/g, '-')}`;
  }
  
  if (filters.resultFilter && filters.resultFilter !== 'all') {
    filename += `-${filters.resultFilter}`;
  }
  
  if (filters.dateRange && (filters.dateRange.start || filters.dateRange.end)) {
    const start = filters.dateRange.start ? new Date(filters.dateRange.start).toISOString().split('T')[0] : 'start';
    const end = filters.dateRange.end ? new Date(filters.dateRange.end).toISOString().split('T')[0] : 'end';
    filename += `-${start}-to-${end}`;
  }
  
  filename += `-${new Date().toISOString().split('T')[0]}`;
  
  return filename;
};