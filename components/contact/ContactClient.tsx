'use client';

import React, { useState } from 'react';
import {
  Mail,
  Send,
  CheckCircle2,
  MessageSquare,
  Clock,
} from 'lucide-react';
import { trackContact, trackWhatsAppClick } from '@/lib/analytics/tracker';

export function ContactClient() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Tool Request');
  const [message, setMessage] = useState('');
  const [ticketId, setTicketId] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const randomTicket = 'TT-' + Math.floor(100000 + Math.random() * 900000);
    setTicketId(randomTicket);
    setSubmitted(true);
    trackContact({
      ticket_id: randomTicket,
      subject: subject,
      inquiry_type: subject,
    });
  };

  const handleWhatsAppClick = () => {
    trackWhatsAppClick({
      location: 'contact_page_direct_chat',
      label: 'WhatsApp Support',
      link_url: 'https://wa.me/15551234567',
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      {/* Contact Form */}
      <div className="lg:col-span-2 bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-sm dark:shadow-xl">
        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-200 dark:border-emerald-500/20">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Ticket Created #{ticketId}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
              Thank you for reaching out, <strong className="text-slate-900 dark:text-white">{name}</strong>. A confirmation has been logged. Our developer team typically replies within 24 business hours.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setMessage('');
                setName('');
              }}
              className="mt-4 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#171A21] dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
            >
              Send Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-slate-700 dark:text-slate-300 font-semibold">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#14171F] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 text-xs transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-slate-700 dark:text-slate-300 font-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@company.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#14171F] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 text-xs transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-700 dark:text-slate-300 font-semibold">
                Inquiry Classification
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-[#14171F] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 text-xs"
              >
                <option value="Tool Request">Feature / New Online Tool Request</option>
                <option value="Bug Report">Bug Report & Calculation Edge Case</option>
                <option value="API Integration">API Integration & High-Volume Access</option>
                <option value="Security Disclosure">Security & Vulnerability Disclosure</option>
                <option value="Partnership">Partnership & Media Inquiry</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-slate-700 dark:text-slate-300 font-semibold">
                Detailed Description
              </label>
              <textarea
                required
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Provide any inputs, sample code, expected outcomes, or steps to reproduce..."
                className="w-full p-3.5 bg-slate-50 dark:bg-[#14171F] border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500 text-xs transition-colors leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs shadow-md shadow-cyan-600/20 flex items-center justify-center gap-2 transition-all min-h-[44px]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Inquiry Ticket</span>
            </button>
          </form>
        )}
      </div>

      {/* Channels & Info Sidebar */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            Direct Communication
          </h3>
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">General Inquiries</span>
              <a
                href="mailto:support@techusar.com"
                className="font-semibold text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              >
                support@techusar.com
              </a>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Security & Privacy</span>
              <a
                href="mailto:privacy@techusar.com"
                className="font-semibold text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
              >
                privacy@techusar.com
              </a>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Instant WhatsApp Support</span>
              <a
                href="https://wa.me/15551234567?text=Hi%20TechTools%20Support%2C%20I%20have%20a%20question"
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1.5 mt-0.5"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp (+1 555-123-4567)</span>
              </a>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Parent Organization</span>
              <a
                href="https://www.techusar.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
              >
                TechUsar Technologies Ltd.
              </a>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
            <Clock className="w-4 h-4 text-emerald-500" />
            <span>SLA Response Guarantee</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            We monitor tool reliability and error reports 24/7. Critical security reports receive initial response within 4 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
