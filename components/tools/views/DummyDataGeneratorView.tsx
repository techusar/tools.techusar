'use client';

import React, { useState, useMemo } from 'react';
import { Database, Copy, Check, Download, RefreshCw } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { copyToClipboard, downloadTextFile } from '@/lib/utils';
import { useUser } from '@/components/auth/UserContext';
import { trackClientEvent, trackDownload } from '@/lib/analytics/tracker';

const FIRST_NAMES = ['Alexander', 'Emma', 'Liam', 'Olivia', 'Noah', 'Sophia', 'James', 'Ava', 'Benjamin', 'Isabella', 'Zain', 'Fatima', 'Aria'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Khan', 'Patel', 'Chen'];
const DOMAINS = ['gmail.com', 'outlook.com', 'yahoo.com', 'techcorp.io', 'company.org'];
const CITIES = ['San Francisco', 'New York', 'London', 'Berlin', 'Tokyo', 'Singapore', 'Dubai', 'Sydney', 'Karachi', 'Toronto'];
const ROLES = ['Frontend Engineer', 'Product Designer', 'DevOps Specialist', 'Marketing Lead', 'Data Analyst', 'CTO'];

function buildMockData(type: string, n: number, seed: number) {
  const list = [];
  for (let i = 1; i <= n; i++) {
    if (type === 'users') {
      const fn = FIRST_NAMES[(seed + i * 3) % FIRST_NAMES.length];
      const ln = LAST_NAMES[(seed + i * 7) % LAST_NAMES.length];
      const domain = DOMAINS[(seed + i) % DOMAINS.length];
      const city = CITIES[(seed + i * 5) % CITIES.length];
      const role = ROLES[(seed + i * 2) % ROLES.length];

      list.push({
        id: `usr_${1000 + i}`,
        name: `${fn} ${ln}`,
        email: `${fn.toLowerCase()}.${ln.toLowerCase()}@${domain}`,
        role: role,
        city: city,
        active: (seed + i) % 3 !== 0,
        createdAt: new Date(Date.now() - (seed * 10000 + i * 86400000)).toISOString(),
      });
    } else if (type === 'products') {
      const adjectives = ['Quantum', 'Hyper', 'Pro', 'Ultra', 'Smart', 'Wireless', 'Cloud', 'Ergonomic'];
      const nouns = ['Keyboard', 'Monitor', 'Headset', 'Router', 'Hub', 'SSD Drive', 'Mouse', 'Desk Mat'];
      const adj = adjectives[(seed + i * 2) % adjectives.length];
      const noun = nouns[(seed + i * 3) % nouns.length];

      list.push({
        id: `prod_${2000 + i}`,
        title: `${adj} ${noun} X${i + 10}`,
        price: parseFloat((((seed + i * 17) % 250) + 19.99).toFixed(2)),
        rating: parseFloat((((seed + i) % 15) / 10 + 3.5).toFixed(1)),
        inStock: ((seed + i * 11) % 150) + 5,
        category: 'Electronics',
      });
    } else {
      // Orders
      list.push({
        orderId: `ORD-2026-${10000 + i}`,
        customerName: `${FIRST_NAMES[(seed + i * 3) % FIRST_NAMES.length]} ${LAST_NAMES[(seed + i * 7) % LAST_NAMES.length]}`,
        amount: parseFloat((((seed + i * 43) % 800) + 49.99).toFixed(2)),
        status: ['Delivered', 'Processing', 'Shipped', 'Pending'][(seed + i) % 4],
        currency: 'USD',
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      });
    }
  }

  return JSON.stringify(list, null, 2);
}

export function DummyDataGeneratorView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [dataType, setDataType] = useState<'users' | 'products' | 'orders'>('users');
  const [count, setCount] = useState<number>(5);
  const [seed, setSeed] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);

  const outputVal = useMemo(() => {
    return buildMockData(dataType, count, seed);
  }, [dataType, count, seed]);

  const handleRegenerate = () => {
    recordToolUse(tool);
    trackClientEvent('tool_use', { toolSlug: tool.slug, action: 'regenerate_dummy_data' });
    setSeed((prev) => prev + 1);
  };

  const handleCopy = async () => {
    recordToolUse(tool);
    const ok = await copyToClipboard(outputVal);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    recordToolUse(tool);
    const filename = `mock_${dataType}_data.json`;
    downloadTextFile(filename, outputVal, 'application/json');
    trackDownload({ file_name: filename, file_extension: 'json', tool_slug: tool.slug });
    trackClientEvent('download', { toolSlug: tool.slug, metadata: { dataType } });
  };

  return (
    <div className="space-y-5">
      {/* Top Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-900/60 dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#0D0F13] p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setDataType('users')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                dataType === 'users' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              User Accounts
            </button>
            <button
              onClick={() => setDataType('products')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                dataType === 'products' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              E-Commerce Products
            </button>
            <button
              onClick={() => setDataType('orders')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                dataType === 'orders' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              Orders & Billing
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Count:</span>
            <select
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value, 10))}
              className="bg-[#0D0F13] border border-slate-800 rounded px-2.5 py-1 text-slate-200 text-xs focus:outline-none focus:border-cyan-500 font-mono font-bold"
            >
              <option value={3}>3 records</option>
              <option value={5}>5 records</option>
              <option value={10}>10 records</option>
              <option value={25}>25 records</option>
              <option value={50}>50 records</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRegenerate}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold rounded-lg border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Randomize</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy JSON'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3.5 py-1.5 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* JSON Viewer */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span className="font-semibold flex items-center gap-1.5">
            <Database className="w-4 h-4 text-cyan-400" />
            Generated JSON Array ({count} items)
          </span>
        </div>
        <textarea
          value={outputVal}
          readOnly
          rows={18}
          className="w-full font-mono text-xs p-4 bg-[#0D0F13] border border-slate-800 rounded-xl text-cyan-300 focus:outline-none leading-relaxed select-all"
        />
      </div>
    </div>
  );
}
