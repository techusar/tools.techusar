'use client';

import React, { useState, useMemo } from 'react';
import { ArrowLeftRight, Copy, Check, Download, Table, FileSpreadsheet } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { copyToClipboard, downloadTextFile } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';
import { trackClientEvent, trackDownload } from '@/lib/analytics/tracker';

const SAMPLE_CSV = `id,name,role,department,salary
1,Sarah Connor,Lead Architect,Engineering,145000
2,John Doe,Senior Developer,Engineering,120000
3,Alice Johnson,Product Manager,Product,130000
4,Bob Smith,UX Designer,Design,110000
5,Emily Davis,DevOps Engineer,Infrastructure,125000`;

function convertCsvOrJson(input: string, mode: 'csv-to-json' | 'json-to-csv', delim: string) {
  if (!input.trim()) {
    return { output: '', rows: [], error: null };
  }

  try {
    if (mode === 'csv-to-json') {
      const lines = input.trim().split(/\r?\n/);
      if (lines.length === 0) return { output: '', rows: [], error: null };

      const headers = lines[0].split(delim).map((h) => h.trim().replace(/^["']|["']$/g, ''));
      const data = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const values = line.split(delim).map((v) => v.trim().replace(/^["']|["']$/g, ''));
        const rowObj: any = {};
        headers.forEach((header, index) => {
          let val: any = values[index] !== undefined ? values[index] : '';
          if (!isNaN(Number(val)) && val !== '') {
            val = Number(val);
          } else if (val.toLowerCase() === 'true') {
            val = true;
          } else if (val.toLowerCase() === 'false') {
            val = false;
          }
          rowObj[header] = val;
        });
        data.push(rowObj);
      }

      const jsonString = JSON.stringify(data, null, 2);
      return { output: jsonString, rows: data, error: null };
    } else {
      // JSON to CSV
      const parsed = JSON.parse(input);
      const array = Array.isArray(parsed) ? parsed : [parsed];
      if (array.length === 0) {
        return { output: '', rows: [], error: null };
      }

      const headers = Object.keys(array[0]);
      const csvLines = [headers.join(delim)];

      array.forEach((item) => {
        const row = headers.map((header) => {
          const val = item[header] !== undefined ? String(item[header]) : '';
          if (val.includes(delim) || val.includes('"') || val.includes('\n')) {
            return `"${val.replace(/"/g, '""')}"`;
          }
          return val;
        });
        csvLines.push(row.join(delim));
      });

      const csvResult = csvLines.join('\n');
      return { output: csvResult, rows: array, error: null };
    }
  } catch (err: any) {
    return { output: '', rows: [], error: err.message || 'Invalid data structure' };
  }
}

export function CsvJsonConverterView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [direction, setDirection] = useState<'csv-to-json' | 'json-to-csv'>('csv-to-json');
  const [inputVal, setInputVal] = useState(SAMPLE_CSV);
  const [delimiter, setDelimiter] = useState<',' | ';' | '\t'>(',');
  const [copied, setCopied] = useState(false);

  const conversionResult = useMemo(() => {
    return convertCsvOrJson(inputVal, direction, delimiter);
  }, [inputVal, direction, delimiter]);

  const outputVal = conversionResult.output;
  const parsedRows = conversionResult.rows;
  const error = conversionResult.error;

  const handleSwap = () => {
    const newDir = direction === 'csv-to-json' ? 'json-to-csv' : 'csv-to-json';
    setDirection(newDir);
    const newInput = outputVal || (newDir === 'json-to-csv' ? JSON.stringify([{ id: 1, name: 'Alice' }], null, 2) : SAMPLE_CSV);
    setInputVal(newInput);
    recordToolUse(tool);
    trackClientEvent('tool_use', { toolSlug: tool.slug, action: 'swap_direction' });
  };

  const handleCopy = async () => {
    recordToolUse(tool);
    trackClientEvent('tool_use', { toolSlug: tool.slug, action: 'copy_converted' });
    const ok = await copyToClipboard(outputVal);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    recordToolUse(tool);
    const ext = direction === 'csv-to-json' ? 'json' : 'csv';
    const mime = direction === 'csv-to-json' ? 'application/json' : 'text/csv';
    const filename = `converted_data.${ext}`;
    downloadTextFile(filename, outputVal, mime);
    trackDownload({ file_name: filename, file_extension: ext, tool_slug: tool.slug });
    trackClientEvent('download', { toolSlug: tool.slug, metadata: { format: ext } });
  };

  return (
    <div className="space-y-5">
      {/* Top action header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-900/70 dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-300">Conversion Mode:</span>
          <button
            onClick={handleSwap}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-bold flex items-center gap-2 transition-colors"
          >
            <span>{direction === 'csv-to-json' ? 'CSV  JSON' : 'JSON  CSV'}</span>
            <ArrowLeftRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Delimiter:</span>
            <select
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value as any)}
              className="bg-[#0D0F13] border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value=",">Comma (,)</option>
              <option value=";">Semicolon (;)</option>
              <option value="&#9;">Tab (\t)</option>
            </select>
          </div>

          <button
            onClick={handleCopy}
            disabled={!outputVal}
            className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 rounded-lg flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Output'}</span>
          </button>

          <button
            onClick={handleDownload}
            disabled={!outputVal}
            className="px-3.5 py-1.5 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center gap-2">
          <span>Parsing Error: {error}</span>
        </div>
      )}

      {/* Editor columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input area */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
              {direction === 'csv-to-json' ? 'Input CSV Raw Data' : 'Input JSON Array'}
            </span>
            <span className="font-mono text-[11px] text-slate-500">
              {inputVal.split('\n').length} lines
            </span>
          </div>
          <textarea
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder={direction === 'csv-to-json' ? 'Paste CSV content here...' : 'Paste JSON array here...'}
            rows={14}
            className="w-full font-mono text-xs p-3.5 bg-[#0D0F13] border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-500 leading-relaxed"
          />
        </div>

        {/* Output area */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span className="flex items-center gap-1.5">
              <Table className="w-4 h-4 text-cyan-400" />
              {direction === 'csv-to-json' ? 'Converted JSON Output' : 'Converted CSV Output'}
            </span>
            <span className="font-mono text-[11px] text-cyan-400">
              {parsedRows.length} records parsed
            </span>
          </div>
          <textarea
            value={outputVal}
            readOnly
            placeholder="Converted output will appear here..."
            rows={14}
            className="w-full font-mono text-xs p-3.5 bg-[#0D0F13] border border-slate-800 rounded-xl text-cyan-300 focus:outline-none leading-relaxed select-all"
          />
        </div>
      </div>

      {/* Live Data Table Preview */}
      {parsedRows.length > 0 && (
        <div className="p-4 bg-slate-900/50 dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Table className="w-4 h-4 text-cyan-400" />
              Visual Data Table Preview ({parsedRows.length} rows)
            </h4>
          </div>

          <div className="overflow-x-auto max-h-72 overflow-y-auto rounded-xl border border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-[#0D0F13] sticky top-0 border-b border-slate-800 text-slate-400">
                <tr>
                  {Object.keys(parsedRows[0] || {}).map((col) => (
                    <th key={col} className="p-2.5 font-semibold font-mono text-cyan-400">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                {parsedRows.slice(0, 50).map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                    {Object.keys(parsedRows[0] || {}).map((col) => (
                      <td key={col} className="p-2.5 whitespace-nowrap">
                        {String(row[col] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
