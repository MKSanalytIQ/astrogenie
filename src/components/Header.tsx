import React from 'react';
import { AstroGenieLogo } from './AstroGenieLogo';
import { VedicKundli, MembershipPlan } from '../types/astrology';
import { SupportedLanguage, SUPPORTED_LANGUAGES, TRANSLATIONS } from '../i18n/translations';
import { Sparkles, Calendar, HeartHandshake, BookOpen, Crown, UserPlus, ShieldCheck, ShoppingBag, Receipt, Zap, Compass, Smartphone, User as UserIcon, LogOut } from 'lucide-react';
import { User } from 'firebase/auth';

interface HeaderProps {
  activeTab: 'chat' | 'kundli' | 'matching' | 'prashna' | 'transits' | 'horoscope' | 'remedies' | 'store';
  setActiveTab: (tab: 'chat' | 'kundli' | 'matching' | 'prashna' | 'transits' | 'horoscope' | 'remedies' | 'store') => void;
  activeKundli: VedicKundli;
  allKundlis: VedicKundli[];
  onSelectKundli: (kundli: VedicKundli) => void;
  onOpenNewKundliModal: () => void;
  onOpenPricingModal: () => void;
  onOpenBillingModal: () => void;
  onOpenWhatsAppModal: () => void;
  onOpenAuthModal: () => void;
  onSignOut: () => void;
  currentUser: User | null;
  userPlan: MembershipPlan;
  creditsRemaining: number;
  currentLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  activeKundli,
  allKundlis,
  onSelectKundli,
  onOpenNewKundliModal,
  onOpenPricingModal,
  onOpenBillingModal,
  onOpenWhatsAppModal,
  onOpenAuthModal,
  onSignOut,
  currentUser,
  userPlan,
  creditsRemaining,
  currentLanguage,
  onSelectLanguage,
}) => {
  const t = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  return (
    <header className="sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-md border-b border-amber-900/30 text-stone-100 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Branding */}
          <div className="flex items-center gap-6">
            <AstroGenieLogo size="md" />
            
            {/* Quick Panchang Ticker */}
            <div className="hidden xl:flex items-center gap-3 text-xs bg-amber-950/40 border border-amber-500/20 px-3 py-1.5 rounded-full text-amber-200/90 shadow-inner">
              <span className="flex items-center gap-1 font-serif text-amber-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Panchang Today:
              </span>
              <span>Shukla Paksha</span>
              <span className="text-amber-500/50">•</span>
              <span>Abhijit: 11:46 AM</span>
              <span className="text-amber-500/50">•</span>
              <span className="text-rose-400">Rahu Kaal: 4:30 PM</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-stone-900/80 p-1.5 rounded-2xl border border-stone-800/80 shadow-inner">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'chat'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-stone-300 hover:text-amber-300 hover:bg-stone-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.talkToAstrologer}</span>
            </button>

            <button
              onClick={() => setActiveTab('kundli')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'kundli'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-stone-300 hover:text-amber-300 hover:bg-stone-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t.janamKundli}</span>
            </button>

            <button
              onClick={() => setActiveTab('matching')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'matching'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-stone-300 hover:text-amber-300 hover:bg-stone-800/60'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>{t.kundliMilan}</span>
            </button>

            {/* Prashna Kundli Tab */}
            <button
              onClick={() => setActiveTab('prashna')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'prashna'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-stone-300 hover:text-amber-300 hover:bg-stone-800/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{t.prashnaKundli}</span>
            </button>

            {/* Sade Sati & Transits Tab */}
            <button
              onClick={() => setActiveTab('transits')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'transits'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-stone-300 hover:text-amber-300 hover:bg-stone-800/60'
              }`}
            >
              <span className="text-sm">🪐</span>
              <span>{t.sadeSati || 'Sade Sati & Transits'}</span>
            </button>

            <button
              onClick={() => setActiveTab('horoscope')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'horoscope'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-stone-300 hover:text-amber-300 hover:bg-stone-800/60'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t.horoscope}</span>
            </button>

            <button
              onClick={() => setActiveTab('remedies')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'remedies'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-stone-300 hover:text-amber-300 hover:bg-stone-800/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t.upayVault}</span>
            </button>

            {/* Store Tab (Monetization Hub) */}
            <button
              onClick={() => setActiveTab('store')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                activeTab === 'store'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md shadow-amber-500/20 font-bold'
                  : 'text-amber-300 hover:text-amber-200 hover:bg-stone-800/60'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{t.dossiersAndStore}</span>
              <span className="px-1 py-0.2 rounded text-[8px] bg-red-500 text-white font-bold animate-pulse">
                HOT
              </span>
            </button>
          </nav>

          {/* Action Center: Auth Avatar + Language + WhatsApp + Active Kundli + Invoices + Membership */}
          <div className="flex items-center gap-2">
            
            {/* Multi-Language Selector Dropdown */}
            <div className="relative flex items-center">
              <select
                aria-label="Select preferred language"
                value={currentLanguage}
                onChange={(e) => onSelectLanguage(e.target.value as SupportedLanguage)}
                className="bg-stone-900 border border-stone-800 text-stone-200 text-xs rounded-xl px-2.5 py-2 pr-7 appearance-none focus:outline-none focus:ring-1 focus:ring-amber-400 font-medium cursor-pointer shadow-sm hover:border-amber-400"
              >
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <option key={lang.code} value={lang.code} className="bg-stone-950 text-stone-100">
                    {lang.flag} {lang.nativeName}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 text-[10px]">
                ▼
              </div>
            </div>

            {/* WhatsApp Daily Alerts Trigger */}
            <button
              onClick={onOpenWhatsAppModal}
              title="Daily WhatsApp Panchang Alerts"
              className="hidden sm:flex items-center gap-1 px-2.5 py-2 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/40 text-[#25D366] text-xs font-bold transition shadow-sm"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>

            {/* Active Kundli Dropdown */}
            <div className="hidden xl:flex relative items-center">
              <select
                aria-label="Select active birth chart"
                value={activeKundli.id}
                onChange={(e) => {
                  const target = allKundlis.find((k) => k.id === e.target.value);
                  if (target) onSelectKundli(target);
                }}
                className="bg-stone-900 border border-amber-500/30 text-amber-200 text-xs rounded-xl px-3 py-2 pr-7 appearance-none focus:outline-none focus:ring-1 focus:ring-amber-400 font-medium cursor-pointer shadow-sm hover:border-amber-400"
              >
                {allKundlis.map((k) => (
                  <option key={k.id} value={k.id} className="bg-stone-950 text-stone-100">
                    🕉️ {k.birthDetails.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-amber-400 text-[10px]">
                ▼
              </div>
            </div>

            {/* Customer Billing & Invoices Button */}
            <button
              onClick={onOpenBillingModal}
              title="View Invoices & Orders"
              className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-300 border border-stone-800 transition"
            >
              <Receipt className="w-4 h-4" />
            </button>

            {/* Personal Astrologer Membership Pill */}
            <button
              onClick={onOpenPricingModal}
              className="hidden md:flex relative group overflow-hidden items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-600/30 via-orange-600/30 to-yellow-600/30 border border-amber-500/40 hover:border-amber-400 text-amber-200 transition-all shadow-sm hover:shadow-amber-500/20"
            >
              <Crown className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  {userPlan.name}
                </span>
                <span className="text-[11px] text-stone-200 font-semibold">
                  ₹{userPlan.pricePerMonth}/mo
                </span>
              </div>
            </button>

            {/* User Profile / Sign In Pill */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 bg-stone-900 border border-amber-500/40 rounded-xl px-2.5 py-1.5">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-5 h-5 rounded-full object-cover border border-amber-400"
                  />
                ) : (
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-[10px] text-amber-300 font-bold">
                    {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:inline text-xs font-semibold text-stone-200 max-w-[80px] truncate">
                  {currentUser.displayName?.split(' ')[0] || 'Seeker'}
                </span>
                <button
                  onClick={onSignOut}
                  title="Sign Out"
                  className="p-1 hover:text-rose-400 text-stone-400 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-md shadow-amber-500/20 transition"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

          </div>

        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto gap-2 py-2.5 no-scrollbar border-t border-stone-800/60 text-xs">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg ${
              activeTab === 'chat' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300 bg-stone-900/60'
            }`}
          >
            {t.talkToAstrologer}
          </button>
          <button
            onClick={() => setActiveTab('kundli')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg ${
              activeTab === 'kundli' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300 bg-stone-900/60'
            }`}
          >
            {t.janamKundli}
          </button>
          <button
            onClick={() => setActiveTab('matching')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg ${
              activeTab === 'matching' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300 bg-stone-900/60'
            }`}
          >
            {t.kundliMilan}
          </button>
          <button
            onClick={() => setActiveTab('prashna')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg ${
              activeTab === 'prashna' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300 bg-stone-900/60'
            }`}
          >
            {t.prashnaKundli}
          </button>
          <button
            onClick={() => setActiveTab('transits')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg ${
              activeTab === 'transits' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300 bg-stone-900/60'
            }`}
          >
            🪐 {t.sadeSati || 'Sade Sati'}
          </button>
          <button
            onClick={() => setActiveTab('horoscope')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg ${
              activeTab === 'horoscope' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300 bg-stone-900/60'
            }`}
          >
            {t.horoscope}
          </button>
          <button
            onClick={() => setActiveTab('remedies')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg ${
              activeTab === 'remedies' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-300 bg-stone-900/60'
            }`}
          >
            {t.upayVault}
          </button>
          <button
            onClick={() => setActiveTab('store')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg ${
              activeTab === 'store' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-amber-300 bg-stone-900/60'
            }`}
          >
            🛍️ Store
          </button>
        </div>
      </div>
    </header>
  );
};
