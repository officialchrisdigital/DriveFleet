/**
 * Helper to download structured data as a formatted CSV file in the browser.
 * Supports both signatures:
 * 1. downloadCsv(filename, headers, rows)
 * 2. downloadCsv(filename, objectsArray)
 */
export function downloadCsv(
  filename: string,
  arg2: string[] | Record<string, any>[],
  arg3?: (string | number | boolean | null | undefined)[][]
) {
  const sanitizeCell = (val: string | number | boolean | null | undefined): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  let headers: string[] = [];
  let rows: (string | number | boolean | null | undefined)[][] = [];

  if (Array.isArray(arg2) && arg2.length > 0 && typeof arg2[0] === 'object' && !Array.isArray(arg2[0]) && !arg3) {
    // Array of objects
    headers = Object.keys(arg2[0]);
    rows = (arg2 as Record<string, any>[]).map((obj) => headers.map((key) => obj[key]));
  } else if (Array.isArray(arg2) && arg2.length === 0 && !arg3) {
    headers = ['Empty'];
    rows = [];
  } else {
    headers = arg2 as string[];
    rows = arg3 || [];
  }

  const csvContent = [
    headers.map(sanitizeCell).join(','),
    ...rows.map((row) => row.map(sanitizeCell).join(',')),
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
