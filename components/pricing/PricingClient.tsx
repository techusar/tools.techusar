'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Check,
  Sparkles,
  Zap,
  Shield,
  HelpCircle,
  ArrowRight,
  X,
  CreditCard,
  Lock,
} from 'lucide-react';
import { useUser } from '@/components/auth/UserContext';
import { trackPurchase } from '@/lib/analytics/tracker';

export function PricingClient() {
  const { user, openAuthModal, upgradeToPro } = useUser();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [upgradedSuccess, setUpgradedSuccess] = useState(false);

  const handleUpgrade = () => {
    if (!user) {
      openAuthModal('register');
      return;
    }
    upgradeToPro();
    setUpgradedSuccess(true);

    const price = billingCycle === 'yearly' ? 72 : 8;
    const txId = `TT-PRO-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    trackPurchase({
      transaction_id: txId,
      value: price,
      currency: 'USD',
      items: [
        {
          item_id: `plan_pro_${billingCycle}`,
          item_name: `TechTools Pro (${billingCycle === 'yearly' ? 'Annual' : 'Monthly'})`,
          price: price,
          quantity: 1,
        },
      ],
    });

    setTimeout(() => setUpgradedSuccess(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Transparent, Developer-Friendly Plans</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Supercharge Your Workflow
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          All standard utilities are free to use. Upgrade to Pro for unlimited Gemini AI generations, high-volume batch operations, and priority features.
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 pt-4">
          <span
            className={`text-xs font-semibold ${
              billingCycle === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Monthly Billing
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="w-12 h-6 rounded-full bg-slate-200 dark:bg-slate-800 p-1 relative border border-slate-300 dark:border-slate-700 transition-colors focus:outline-none"
            aria-label="Toggle billing cycle"
          >
            <div
              className={`w-4 h-4 rounded-full bg-cyan-600 dark:bg-cyan-400 transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <div className="flex items-center gap-1.5">
            <span
              className={`text-xs font-semibold ${
                billingCycle === 'yearly' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Yearly Billing
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 text-[10px] font-bold">
              Save 25%
            </span>
          </div>
        </div>
      </div>

      {upgradedSuccess && (
        <div className="max-w-md mx-auto p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-center text-xs font-semibold shadow-md">
          🎉 Successfully upgraded to TechTools Pro! Enjoy unlimited Gemini AI generations and priority access.
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        {/* Free Plan */}
        <div className="p-8 rounded-3xl bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Community Tier
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">Free Forever</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Ideal for day-to-day coding, data formatting, and privacy-first local tasks.
              </p>
            </div>

            <div className="flex items-baseline gap-1 text-slate-900 dark:text-white font-mono">
              <span className="text-4xl font-black">$0</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">/ forever free</span>
            </div>

            <ul className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
              {[
                'Full access to all browser utilities',
                '100% in-browser privacy & zero data retention',
                '3 free AI queries/day (anon) or 10/day (registered)',
                'Local favorites & history bookmarks',
                'Zero deceptive countdowns & zero paywalls',
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => {
              if (!user) openAuthModal('register');
            }}
            className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#171A21] dark:hover:bg-[#222733] border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all min-h-[44px]"
          >
            {user?.tier === 'pro' ? 'Included in Pro' : user ? 'Current Active Tier' : 'Get Started Free'}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="p-8 rounded-3xl bg-white dark:bg-gradient-to-b dark:from-[#14171F] dark:to-[#0D0F13] border-2 border-cyan-500/50 relative shadow-lg dark:shadow-2xl shadow-cyan-500/10 flex flex-col justify-between space-y-6">
          <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-950 text-[10px] font-extrabold uppercase tracking-wider shadow-md">
            Most Popular
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
                Pro Developer
              </span>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">Power Users & Teams</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                For software engineers, digital agencies, and high-frequency content creators.
              </p>
            </div>

            <div className="flex items-baseline gap-1 text-slate-900 dark:text-white font-mono">
              <span className="text-4xl font-black">
                {billingCycle === 'yearly' ? '$6' : '$8'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">/ month billed {billingCycle}</span>
            </div>

            <ul className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200">
              {[
                'Everything in Free Community plan',
                'Unlimited Gemini 2.5 Flash AI generations',
                'Batch image compression & multi-file exports',
                'Custom business branding on PDF invoices',
                'Priority execution with lowest AI latency',
                'Direct feature request priority queue',
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <span className="font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={handleUpgrade}
            className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 text-xs font-bold shadow-md shadow-cyan-600/20 transition-all min-h-[44px]"
          >
            {user?.tier === 'pro' ? 'Active Pro Subscription ✓' : 'Upgrade to Pro'}
          </button>
        </div>
      </div>

      {/* Feature Comparison Matrix */}
      <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm dark:shadow-xl space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
            Detailed Comparison
          </span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Plan Features Matrix</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="py-3 px-4 font-bold text-slate-900 dark:text-white">Feature</th>
                <th className="py-3 px-4 font-bold text-slate-900 dark:text-white">Free Community</th>
                <th className="py-3 px-4 font-bold text-cyan-600 dark:text-cyan-400">Pro Developer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-600 dark:text-slate-300">
              <tr>
                <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">Standard Online Utilities</td>
                <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">Unlimited</td>
                <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">Unlimited</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">Zero Data Retention Privacy</td>
                <td className="py-3 px-4">100% In-Browser</td>
                <td className="py-3 px-4">100% In-Browser</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">Gemini 2.5 Flash AI Generations</td>
                <td className="py-3 px-4">3 (anon) / 10 (signed in) daily</td>
                <td className="py-3 px-4 font-bold text-cyan-600 dark:text-cyan-400">Unlimited Daily Queries</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">Batch Processing & Multi-file ZIP Export</td>
                <td className="py-3 px-4 text-slate-400">Single File</td>
                <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">High Volume Batch</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">Custom Brand Logo on Invoices</td>
                <td className="py-3 px-4 text-slate-400">Standard</td>
                <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">Custom Upload & Watermark Removal</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">Engineering Support</td>
                <td className="py-3 px-4">Community</td>
                <td className="py-3 px-4 font-semibold text-cyan-600 dark:text-cyan-400">24hr Priority Ticket SLA</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Pricing FAQs */}
      <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm dark:shadow-xl space-y-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          Frequently Asked Questions About Pricing
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-slate-100">
              Can I cancel my Pro subscription at any time?
            </h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Yes, you can cancel whenever you wish with one click. Your Pro access remains active until the end of your billing cycle.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-slate-100">
              Do I need a credit card to use the standard tools?
            </h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              No. All standard utilities (JSON Formatter, Image Compressor, QR Codes, Calculators) require no sign-up or credit card whatsoever.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-slate-100">
              Do you offer student or non-profit discounts?
            </h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              Yes! Contact us at <a href="mailto:support@techusar.com" className="text-cyan-600 dark:text-cyan-400 hover:underline">support@techusar.com</a> with your educational credentials for a 50% discount code.
            </p>
          </div>

          <div className="space-y-1.5">
            <h4 className="font-bold text-slate-900 dark:text-slate-100">
              What payment methods are supported?
            </h4>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              We accept all major credit cards (Visa, MasterCard, Amex), Apple Pay, Google Pay, and PayPal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
