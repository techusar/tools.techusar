'use client';

import React from 'react';
import { useUser } from '../auth/UserContext';
import { X, Sparkles, ShieldAlert, ArrowRight } from 'lucide-react';

export function UsageLimitModal() {
  const { isLimitModalOpen, closeLimitModal, limitModalTool, openAuthModal, isAuthenticated } = useUser();

  if (!isLimitModalOpen || !limitModalTool) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-md bg-white dark:bg-[#111318] border border-slate-200 dark:border-cyan-500/30 text-slate-900 dark:text-slate-100 rounded-2xl sm:rounded-3xl shadow-2xl p-5 sm:p-7 md:p-8 my-auto max-h-[92dvh] overflow-y-auto">
        {/* Glow */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />

        <button
          onClick={closeLimitModal}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Free Usage Limit Reached
        </h3>
        
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
          {isAuthenticated
            ? `You have reached your free daily quota of ${limitModalTool.authenticatedLimit} runs for ${limitModalTool.name}.`
            : `You've reached the free anonymous limit of ${limitModalTool.anonymousLimit} uses for ${limitModalTool.name}. Create a free TechUsar account to unlock additional runs.`}
        </p>

        <div className="mt-6 flex flex-col gap-2.5">
          {!isAuthenticated ? (
            <>
              <button
                onClick={() => {
                  closeLimitModal();
                  openAuthModal();
                }}
                className="w-full py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-semibold text-xs sm:text-sm cursor-pointer transition-all duration-150 flex items-center justify-center gap-2 shadow-md shadow-cyan-600/20 hover:shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-0.5 active:scale-95 min-h-[44px]"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Sign Up Free to Unlock More Uses</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>
              <button
                onClick={() => {
                  closeLimitModal();
                  openAuthModal();
                }}
                className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#171A21] dark:hover:bg-[#20242C] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-medium cursor-pointer transition-all duration-150 hover:shadow-xs active:scale-95 min-h-[44px]"
              >
                Log In with Existing Account
              </button>
            </>
          ) : (
            <button
              onClick={closeLimitModal}
              className="w-full py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-semibold text-xs sm:text-sm cursor-pointer transition-all duration-150 shadow-md shadow-cyan-600/20 hover:shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-0.5 active:scale-95 min-h-[44px]"
            >
              Got it, continue exploring other tools
            </button>
          )}
        </div>

        <p className="text-[11px] text-slate-500 dark:text-slate-400 text-center mt-4">
          TechTools by TechUsar · Free everyday utilities with privacy-first execution
        </p>
      </div>
    </div>
  );
}
