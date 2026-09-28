'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Printer, Download, Receipt, Sparkles } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { useUser } from '@/components/auth/UserContext';
import { trackClientEvent, trackDownload } from '@/lib/analytics/tracker';

interface LineItem {
  description: string;
  quantity: number;
  rate: number;
}

export function InvoiceGeneratorView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-001');
  const [invoiceDate, setInvoiceDate] = useState('2026-09-16');
  const [dueDate, setDueDate] = useState('2026-09-30');
  const [senderName, setSenderName] = useState('TechUsar Client Services');
  const [senderEmail, setSenderEmail] = useState('billing@techusar.com');
  const [clientName, setClientName] = useState('Acme Corporation');
  const [clientEmail, setClientEmail] = useState('accounts@acmecorp.com');
  const [currency, setCurrency] = useState('$');
  const [taxPercent, setTaxPercent] = useState(10);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [notes, setNotes] = useState('Thank you for your business! Payment is due within 14 days.');

  const [items, setItems] = useState<LineItem[]>([
    { description: 'Full-Stack Web Development & Cloud Architecture', quantity: 40, rate: 95 },
    { description: 'Gemini AI Integration & Prompt Engineering', quantity: 15, rate: 120 },
  ]);

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, rate: 0 }]);
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const updateItem = (idx: number, field: keyof LineItem, value: any) => {
    const next = [...items];
    next[idx] = { ...next[idx], [field]: value };
    setItems(next);
  };

  const subtotal = items.reduce((acc, it) => acc + (Number(it.quantity) || 0) * (Number(it.rate) || 0), 0);
  const discountAmount = (subtotal * (Number(discountPercent) || 0)) / 100;
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = (taxableAmount * (Number(taxPercent) || 0)) / 100;
  const total = taxableAmount + taxAmount;

  const handlePrint = () => {
    recordToolUse(tool);
    trackDownload({ file_name: `${invoiceNumber || 'invoice'}.pdf`, file_extension: 'pdf', tool_slug: tool.slug });
    trackClientEvent('tool_use', { toolSlug: tool.slug, metadata: { action: 'print' } });
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300">Currency Symbol:</span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="bg-[#171A21] border border-slate-700 rounded-lg px-2.5 py-1 text-slate-200 text-xs focus:outline-none"
          >
            <option value="$">USD ($)</option>
            <option value="€">EUR (€)</option>
            <option value="£">GBP (£)</option>
            <option value="₹">INR (₹)</option>
            <option value="¥">JPY (¥)</option>
            <option value="C$">CAD (C$)</option>
          </select>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-cyan-500/20"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Invoice Canvas Sheet */}
      <div className="p-6 sm:p-10 rounded-2xl bg-[#0D0F13] border border-slate-800 shadow-2xl space-y-8 print:bg-white print:text-black print:p-0 print:border-none">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-cyan-400 tracking-tight font-sans">INVOICE</h2>
            <div className="space-y-1">
              <input
                type="text"
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                className="w-full bg-transparent text-sm font-semibold text-white focus:outline-none placeholder-slate-600"
                placeholder="Your Business / Full Name"
              />
              <input
                type="text"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-400 focus:outline-none placeholder-slate-600"
                placeholder="your.email@business.com"
              />
            </div>
          </div>

          <div className="sm:text-right space-y-1.5 text-xs">
            <div className="flex sm:justify-end items-center gap-2">
              <span className="text-slate-400 font-medium">Invoice No:</span>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className="font-mono text-xs text-white bg-[#171A21] px-2 py-1 rounded border border-slate-700 sm:text-right"
              />
            </div>
            <div className="flex sm:justify-end items-center gap-2">
              <span className="text-slate-400 font-medium">Issue Date:</span>
              <input
                type="date"
                value={invoiceDate}
                onChange={(e) => setInvoiceDate(e.target.value)}
                className="text-xs text-white bg-[#171A21] px-2 py-1 rounded border border-slate-700"
              />
            </div>
            <div className="flex sm:justify-end items-center gap-2">
              <span className="text-slate-400 font-medium">Due Date:</span>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="text-xs text-white bg-[#171A21] px-2 py-1 rounded border border-slate-700"
              />
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="p-4 rounded-xl bg-[#14171F] border border-slate-800/80 space-y-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Billed To
          </span>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full bg-transparent text-sm font-semibold text-white focus:outline-none placeholder-slate-600"
            placeholder="Client Organization Name"
          />
          <input
            type="text"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-400 focus:outline-none placeholder-slate-600"
            placeholder="client.billing@example.com"
          />
        </div>

        {/* Line items table */}
        <div className="space-y-3">
          <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-slate-400 pb-2 border-b border-slate-800 px-2">
            <span className="col-span-6">Item Description</span>
            <span className="col-span-2 text-center">Qty / Hours</span>
            <span className="col-span-2 text-right">Rate ({currency})</span>
            <span className="col-span-2 text-right">Amount</span>
          </div>

          {items.map((it, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2 items-center text-xs">
              <div className="col-span-6 flex items-center gap-2">
                <button
                  onClick={() => removeItem(idx)}
                  className="text-slate-500 hover:text-rose-400 p-1 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <input
                  type="text"
                  value={it.description}
                  onChange={(e) => updateItem(idx, 'description', e.target.value)}
                  placeholder="Service / Product Name"
                  className="w-full bg-[#171A21] border border-slate-800 px-3 py-2 rounded-lg text-white text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="col-span-2">
                <input
                  type="number"
                  value={it.quantity}
                  onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))}
                  className="w-full bg-[#171A21] border border-slate-800 px-2 py-2 rounded-lg text-white text-xs text-center focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="col-span-2">
                <input
                  type="number"
                  value={it.rate}
                  onChange={(e) => updateItem(idx, 'rate', Number(e.target.value))}
                  className="w-full bg-[#171A21] border border-slate-800 px-2 py-2 rounded-lg text-white text-xs text-right focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="col-span-2 text-right font-mono font-semibold text-slate-200 pr-2">
                {currency}
                {((Number(it.quantity) || 0) * (Number(it.rate) || 0)).toFixed(2)}
              </div>
            </div>
          ))}

          <button
            onClick={addItem}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1.5 pt-2"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item Line</span>
          </button>
        </div>

        {/* Calculation Summary */}
        <div className="flex flex-col sm:flex-row justify-between gap-6 pt-4 border-t border-slate-800">
          <div className="max-w-xs space-y-2">
            <span className="text-xs font-semibold text-slate-400">Notes & Payment Instructions:</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full bg-[#171A21] border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none"
            />
          </div>

          <div className="sm:w-72 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal:</span>
              <span className="font-mono text-white">
                {currency}
                {subtotal.toFixed(2)}
              </span>
            </div>

            <div className="flex justify-between items-center text-slate-400">
              <span>Discount (%):</span>
              <input
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className="w-16 bg-[#171A21] border border-slate-700 rounded px-1.5 py-0.5 text-right text-xs text-white"
              />
            </div>

            <div className="flex justify-between items-center text-slate-400">
              <span>Tax / VAT (%):</span>
              <input
                type="number"
                value={taxPercent}
                onChange={(e) => setTaxPercent(Number(e.target.value))}
                className="w-16 bg-[#171A21] border border-slate-700 rounded px-1.5 py-0.5 text-right text-xs text-white"
              />
            </div>

            <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold text-white">
              <span>Total Balance Due:</span>
              <span className="font-mono text-cyan-400">
                {currency}
                {total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
