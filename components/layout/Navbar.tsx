'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  Sparkles,
  Heart,
  User,
  Menu,
  X,
  ExternalLink,
  Wrench,
  BookOpen,
  HelpCircle,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useUser } from '../auth/UserContext';
import { CommandPalette } from '../tools/CommandPalette';
import { ThemeToggle } from '../theme/ThemeToggle';
import { NavbarSearchBar } from './NavbarSearchBar';
import { ToolItem } from '@/lib/types';
import { INITIAL_TOOLS } from '@/lib/data/initial-data';

interface NavbarProps {
  tools?: ToolItem[];
}

export function Navbar({ tools = INITIAL_TOOLS }: NavbarProps) {
  const pathname = usePathname();
  const { user, isAuthenticated, openAuthModal, logout, favorites } = useUser();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Listen to search open event
  React.useEffect(() => {
    const handleOpen = () => setIsSearchOpen(true);
    window.addEventListener('techtools:open-search', handleOpen);
    return () => window.removeEventListener('techtools:open-search', handleOpen);
  }, []);

  const navLinks = [
    { name: 'All Tools', href: '/tools' },
    { name: 'AI Tools', href: '/ai-tools', isAI: true },
    { name: 'Categories', href: '/categories' },
    { name: 'Blog', href: '/blog' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#0A0C10]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* Brand Logo */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                  <Wrench className="w-5 h-5 text-white fill-white" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">TECHTOOLS</span>
                  </div>
                  <span className="text-[10px] font-semibold tracking-wide text-cyan-600 dark:text-cyan-400/90 -mt-0.5 uppercase">
                    by TechUsar
                  </span>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                        isActive
                          ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 font-semibold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60'
                      }`}
                    >
                      {link.isAI && <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />}
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Middle Global Search Bar with Fuzzy Search */}
            <div className="hidden lg:flex flex-1 max-w-md mx-3 xl:mx-6">
              <NavbarSearchBar tools={tools} />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Toggle (Light / Dark) */}
              <ThemeToggle />

              {/* Search button mobile */}
              <button
                onClick={() => setIsMobileSearchExpanded(!isMobileSearchExpanded)}
                className={`lg:hidden p-2 rounded-xl transition-colors ${
                  isMobileSearchExpanded
                    ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                aria-label="Toggle Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Favorites link */}
              <Link
                href="/favorites"
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Your Favorite Tools"
              >
                <Heart className="w-5 h-5" />
                {favorites.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>

              {/* Back to Parent Brand TechUsar link */}
              <a
                href="https://www.techusar.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors"
                title="Visit TechUsar corporate homepage"
              >
                <span>TechUsar.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              {/* User Account / Auth */}
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#171A21] dark:hover:bg-[#20242C] border border-slate-200 dark:border-slate-700/80 text-xs text-slate-900 dark:text-white transition-colors"
                  >
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[100px] truncate hidden sm:inline font-medium">{user.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#111318] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 text-xs divide-y divide-slate-100 dark:divide-slate-800 z-50 animate-fadeIn">
                      <div className="px-3 py-2">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-slate-500 dark:text-slate-400 truncate text-[11px] mt-0.5">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/account"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <User className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                          <span>Account Dashboard</span>
                        </Link>
                        <Link
                          href="/favorites"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Heart className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                          <span>Saved Favorites</span>
                        </Link>
                        <Link
                          href="/account/history"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Wrench className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                          <span>Usage History</span>
                        </Link>
                      </div>
                      <div className="pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={openAuthModal}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-cyan-600/15 dark:shadow-cyan-500/15"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Expandable Search Bar */}
        {isMobileSearchExpanded && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#0D0F14]/95 px-4 py-2.5 shadow-md">
            <div className="flex items-center gap-2">
              <NavbarSearchBar
                tools={tools}
                isMobile={true}
                onNavigate={() => setIsMobileSearchExpanded(false)}
              />
              <button
                onClick={() => setIsMobileSearchExpanded(false)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0D0F13] px-4 py-4 space-y-3 shadow-xl">
            <div className="mb-2">
              <NavbarSearchBar
                tools={tools}
                isMobile={true}
                onNavigate={() => setIsMobileMenuOpen(false)}
              />
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
              <a
                href="https://www.techusar.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between py-2 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400"
              >
                <span>Visit Parent Company (TechUsar.com)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Global Command Palette */}
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} tools={tools} />
    </>
  );
}
