import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { FileText, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service - TechTools by TechUsar',
  description: 'Terms, conditions, and fair use guidelines for utilizing TechTools web utilities.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 space-y-10">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/30 text-cyan-700 dark:text-cyan-400 text-xs font-semibold">
          <FileText className="w-3.5 h-3.5" />
          <span>User Agreement & Policies</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Effective Date: September 16, 2026 | TechUsar Technologies Ltd.
        </p>
      </div>

      {/* Main Legal Agreement Box */}
      <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm dark:shadow-xl space-y-8 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-mono">1</span>
            Acceptance and Agreement
          </h2>
          <p>
            By accessing or using the services, utilities, and application interfaces provided at TechTools (&quot;the Service&quot;) by TechUsar Technologies Ltd., you acknowledge that you have read, understood, and agree to be legally bound by these Terms of Service. If you do not agree to all terms outlined herein, you must immediately discontinue use of the Service.
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-mono">2</span>
            Acceptable Use and User Responsibilities
          </h2>
          <p>
            You agree to utilize all utilities exclusively for lawful personal and commercial operations. You are strictly prohibited from:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>Using AI endpoints or regex parsers to generate or propagate malware, spyware, ransomware, or phishing campaigns.</li>
            <li>Attempting to reverse-engineer, bypass rate limits, or launch denial-of-service (DoS) attacks against our edge infrastructure.</li>
            <li>Submitting material that infringes upon third-party copyrights, trademarks, or proprietary trade secrets.</li>
            <li>Automating high-frequency scraping of AI endpoints without an authorized enterprise API license.</li>
          </ul>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-mono">3</span>
            Intellectual Property & Ownership of Generated Outputs
          </h2>
          <p>
            You retain 100% full legal ownership, copyright, and commercial exploitation rights to all output assets, formatted files, compressed images, generated invoices, and AI-assisted text created using TechTools. TechUsar claims zero proprietary interest over your calculations, generated code, or customer documents.
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-mono">4</span>
            Disclaimer of Warranties & Calculation Precision
          </h2>
          <p>
            TechTools is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind, whether express or implied. While our algorithms, cryptographic hash routines, and financial formulas undergo automated testing for mathematical accuracy, TechUsar does not warrant that calculations will be error-free or suitable for critical life-support, judicial, or certified tax filing situations without independent human review.
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-mono">5</span>
            Subscription Plans & Quotas
          </h2>
          <p>
            Standard browser tools are provided without cost. For premium Gemini AI generation quotas, Pro subscriptions are billed on a recurring monthly or annual basis. You may cancel your subscription at any time without penalty or termination fees.
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-mono">6</span>
            Contact & Legal Notices
          </h2>
          <p>
            For legal inquiries, copyright notices, or questions concerning these Terms, please reach out to our legal affairs team at{' '}
            <a href="mailto:legal@techusar.com" className="text-cyan-600 dark:text-cyan-400 font-semibold hover:underline">
              legal@techusar.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
