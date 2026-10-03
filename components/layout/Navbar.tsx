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
  Wrench,
  LogOut,
  ChevronDown,
  Layers,
  BookOpen,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { useUser } from '../auth/UserContext';
import { ThemeToggle } from '../theme/ThemeToggle';
import { NavbarSearchBar } from './NavbarSearchBar';
import { ToolItem } from '@/lib/types';
import { INITIAL_TOOLS } from '@/lib/data/initial-data';
import { SEO_CONFIG } from '@/lib/seo/config';
import { CommandPalette } from '@/components/tools/CommandPalette';

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

  // Listen to search modal open event
  React.useEffect(() => {
    const handleOpen = () => setIsSearchOpen(true);
    window.addEventListener('techtools:open-search', handleOpen);
    return () => window.removeEventListener('techtools:open-search', handleOpen);
  }, []);

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('#user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'All Tools', href: '/tools' },
    { name: 'AI Tools', href: '/ai-tools', isAI: true },
    { name: 'Categories', href: '/categories' },
    { name: 'Guides & Blog', href: '/blog' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/90 dark:bg-[#0B0D13]/90 border-b border-slate-200/80 dark:border-slate-800/80 transition-all shadow-[0_1px_3px_rgba(15,23,42,0.03)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
            
            {/* Left: Brand Identity */}
            <div className="flex items-center gap-6 lg:gap-8 shrink-0">
              <Link href="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-xl p-1 -m-1">
                <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/25 group-hover:shadow-lg group-hover:shadow-cyan-500/35 transition-all duration-200 group-hover:scale-105">
                  <Wrench className="w-5 h-5 text-white" />
                  <span className="absolute inset-0 rounded-xl border border-white/20" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
                      TECHTOOLS
                    </span>
                    <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-cyan-100 dark:bg-cyan-500/15 text-cyan-800 dark:text-cyan-300 rounded-md border border-cyan-200/60 dark:border-cyan-500/25">
                      v2.5
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold tracking-wider text-cyan-600 dark:text-cyan-400 -mt-0.5 uppercase">
                    by TechUsar
                  </span>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`relative px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center gap-1.5 ${
                        isActive
                          ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50/80 dark:bg-cyan-500/10 font-bold'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      {link.isAI && (
                        <Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 animate-pulse" />
                      )}
                      <span>{link.name}</span>
                      {isActive && (
                        <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-cyan-500 rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Middle: Integrated Fast Search */}
            <div className="hidden md:flex flex-1 max-w-sm lg:max-w-md mx-2">
              <NavbarSearchBar tools={tools} />
            </div>

            {/* Right: Quick Actions & User Area */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Mobile Search Icon Toggle */}
              <button
                onClick={() => setIsMobileSearchExpanded(!isMobileSearchExpanded)}
                className={`md:hidden p-2 rounded-xl transition-all ${
                  isMobileSearchExpanded
                    ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                aria-label="Toggle Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Theme Toggle Button */}
              <ThemeToggle />

              {/* Favorites Star Badge */}
              <Link
                href="/favorites"
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:border-rose-200 dark:hover:border-rose-500/20 border border-transparent transition-all"
                title="Your Favorite Tools"
                aria-label={`Favorites (${favorites.length})`}
              >
                <Heart className={`w-4 h-4 ${favorites.length > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {favorites.length}
                  </span>
                )}
              </Link>

              {/* User Account / Auth CTA */}
              {isAuthenticated && user ? (
                <div className="relative" id="user-menu-container">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 py-1.5 pl-2 pr-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#171A21] dark:hover:bg-[#1E232E] border border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-semibold transition-all duration-150 cursor-pointer shadow-xs"
                    aria-expanded={isUserMenuOpen}
                  >
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="max-w-[90px] truncate hidden sm:inline-block">{user.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-[#14171F] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                      <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800/80">
                        <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate font-mono">{user.email}</p>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/account"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium"
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>My Profile & Settings</span>
                        </Link>
                        <Link
                          href="/account/history"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium"
                        >
                          <Layers className="w-3.5 h-3.5" />
                          <span>Usage History</span>
                        </Link>
                        <Link
                          href="/favorites"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3.5 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-cyan-600 dark:hover:text-cyan-400 font-medium"
                        >
                          <Heart className="w-3.5 h-3.5" />
                          <span>Saved Favorites ({favorites.length})</span>
                        </Link>
                      </div>

                      <div className="border-t border-slate-100 dark:border-slate-800/80 pt-1">
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-medium text-left"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 font-bold text-xs cursor-pointer transition-all duration-150 flex items-center gap-1.5 shadow-md shadow-cyan-600/20 dark:shadow-cyan-500/25 hover:shadow-lg hover:shadow-cyan-500/30 hover:-translate-y-0.5 active:scale-95"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}

              {/* Mobile Hamburger Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Open Navigation Menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Expandable Tray */}
          {isMobileSearchExpanded && (
            <div className="md:hidden py-3 border-t border-slate-200 dark:border-slate-800 animate-in fade-in duration-150">
              <NavbarSearchBar
                tools={tools}
                isMobile={true}
                onNavigate={() => setIsMobileSearchExpanded(false)}
              />
            </div>
          )}
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0D13] px-4 py-4 space-y-3 shadow-xl animate-in slide-in-from-top-2 duration-150">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      isActive
                        ? 'bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-400 font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {link.isAI && <Sparkles className="w-3.5 h-3.5 text-cyan-500" />}
                      {link.name}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                  </Link>
                );
              })}
            </nav>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>{SEO_CONFIG.totalToolsString}</span>
              <a
                href="https://www.techusar.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-600 dark:text-cyan-400 font-medium hover:underline"
              >
                techusar.com ↗
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Global Command Palette / Search Modal */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        tools={tools}
      />
    </>
  );
}
