'use client';

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Download, QrCode as QrIcon, Copy, Check, Globe, Wifi, Mail, Phone, FileText } from 'lucide-react';
import { ToolItem } from '@/lib/types';
import { useUser } from '@/components/auth/UserContext';
import { downloadDataUrl, copyToClipboard } from '@/lib/utils';
import { trackClientEvent } from '@/lib/analytics/tracker';

export function QrCodeGeneratorView({ tool }: { tool: ToolItem }) {
  const { recordToolUse } = useUser();
  const [mode, setMode] = useState<'url' | 'text' | 'wifi' | 'email' | 'phone'>('url');
  const [content, setContent] = useState('https://tools.techusar.com');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [wifiAuth, setWifiAuth] = useState('WPA');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(300);
  const [copied, setCopied] = useState(false);

  // Generate QR code data URL whenever parameters change
  useEffect(() => {
    let payload = content;
    if (mode === 'wifi') {
      payload = `WIFI:T:${wifiAuth};S:${wifiSsid};P:${wifiPass};;`;
    } else if (mode === 'email') {
      payload = `mailto:${content}`;
    } else if (mode === 'phone') {
      payload = `tel:${content}`;
    }

    if (!payload.trim()) return;

    QRCode.toDataURL(
      payload,
      {
        width: size,
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      },
      (err, url) => {
        if (!err && url) {
          setQrDataUrl(url);
        }
      }
    );
  }, [content, mode, wifiSsid, wifiPass, wifiAuth, fgColor, bgColor, size]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    downloadDataUrl('techtools-qrcode.png', qrDataUrl);
    recordToolUse(tool);
    trackClientEvent('download', { toolSlug: tool.slug });
  };

  const handleCopyImage = async () => {
    if (!qrDataUrl) return;
    const ok = await copyToClipboard(qrDataUrl);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* QR Type Selector Tabs */}
      <div className="flex flex-wrap gap-2 pb-3 border-b border-slate-800">
        {[
          { id: 'url', label: 'Website URL', icon: Globe },
          { id: 'text', label: 'Plain Text', icon: FileText },
          { id: 'wifi', label: 'WiFi Network', icon: Wifi },
          { id: 'email', label: 'Email Address', icon: Mail },
          { id: 'phone', label: 'Phone Call', icon: Phone },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = mode === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setMode(tab.id as any);
                if (tab.id === 'url') setContent('https://tools.techusar.com');
                else if (tab.id === 'text') setContent('Welcome to TechTools by TechUsar!');
                else setContent('');
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-[#171A21] text-slate-300 hover:text-white hover:bg-[#20242C] border border-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Inputs */}
        <div className="space-y-4">
          {mode === 'wifi' ? (
            <div className="space-y-3 p-4 rounded-xl bg-[#0D0F13] border border-slate-800">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Network Name (SSID)</label>
                <input
                  type="text"
                  placeholder="MyHomeWiFi"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#171A21] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                <input
                  type="text"
                  placeholder="WPA2 Password"
                  value={wifiPass}
                  onChange={(e) => setWifiPass(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#171A21] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Encryption</label>
                <select
                  value={wifiAuth}
                  onChange={(e) => setWifiAuth(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#171A21] border border-slate-700 rounded-xl text-xs text-white focus:outline-none"
                >
                  <option value="WPA">WPA / WPA2 / WPA3</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None (Open)</option>
                </select>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {mode === 'url'
                  ? 'Website URL (https://...)'
                  : mode === 'email'
                  ? 'Recipient Email'
                  : mode === 'phone'
                  ? 'Phone Number with Country Code'
                  : 'Plain Text or Note'}
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={mode === 'url' ? 'https://example.com' : 'Enter QR code content...'}
                rows={4}
                className="w-full p-3.5 bg-[#0D0F13] border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          )}

          {/* Color & Size Customization */}
          <div className="p-4 rounded-xl bg-[#14171F] border border-slate-800 space-y-3">
            <span className="text-xs font-semibold text-slate-200 block">Appearance Customization</span>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Foreground Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="font-mono text-slate-300 text-xs">{fgColor}</span>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Background Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <span className="font-mono text-slate-300 text-xs">{bgColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right QR Preview & Download */}
        <div className="flex flex-col items-center justify-center p-6 bg-[#0D0F13] border border-slate-800 rounded-2xl">
          <span className="text-xs font-semibold text-slate-400 mb-4">Live High-Res QR Code</span>

          <div className="p-4 bg-white rounded-2xl shadow-xl border border-slate-200 flex items-center justify-center">
            {qrDataUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={qrDataUrl} alt="Generated QR" className="w-52 h-52 object-contain" />
            ) : (
              <div className="w-52 h-52 flex items-center justify-center text-slate-400 text-xs">
                Generating QR...
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full">
            <button
              onClick={handleDownload}
              className="py-2.5 px-5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Download PNG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
