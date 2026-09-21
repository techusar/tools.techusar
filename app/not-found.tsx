import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Layers, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-3xl bg-[#0D0F13] border border-slate-800 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold text-cyan-400">404 ERROR</span>
          <h1 className="text-2xl font-extrabold text-white">Tool or Page Not Found</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            The online utility or directory page you are looking for might have been moved or doesn&apos;t exist.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
          <Link
            href="/categories"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#14171F] hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700"
          >
            Browse Categories
          </Link>
        </div>
      </div>
    </div>
  );
}
