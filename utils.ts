
export const exportToCsv = (filename: string, data: any[]): void => {
  if (!data || data.length === 0) {
    console.warn("No data provided for CSV export.");
    return;
  }

  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','), // CSV header row
    ...data.map(row => 
      headers.map(header => {
        let cell = row[header] === null || row[header] === undefined ? '' : String(row[header]);
        // Escape quotes by doubling them, and wrap if cell contains comma, newline or quote
        if (cell.includes('"') || cell.includes(',') || cell.includes('\n')) {
          cell = `"${cell.replace(/"/g, '""')}"`;
        }
        return cell;
      }).join(',')
    )
  ];

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
