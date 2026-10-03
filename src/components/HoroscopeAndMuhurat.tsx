import React, { useState } from 'react';
import { RashiSign, DailyHoroscope } from '../types/astrology';
import { SAMPLE_DAILY_HOROSCOPES, SAMPLE_AUSPICIOUS_DATES } from '../data/defaultKundlis';
import { Calendar, Sun, Clock, AlertTriangle, CheckCircle, Sparkles, Filter } from 'lucide-react';

interface HoroscopeAndMuhuratProps {
  onAskAstrologerAboutHoroscope: (topic: string) => void;
}

export const HoroscopeAndMuhurat: React.FC<HoroscopeAndMuhuratProps> = ({
  onAskAstrologerAboutHoroscope,
}) => {
  const [selectedRashi, setSelectedRashi] = useState<RashiSign>('Tula');
  const [activePeriod, setActivePeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [dateFilter, setDateFilter] = useState<'All' | 'Business' | 'Property' | 'Marriage'>('All');

  const allRashis: { name: RashiSign; english: string; symbol: string }[] = [
    { name: 'Mesha', english: 'Aries', symbol: '♈' },
    { name: 'Vrishabha', english: 'Taurus', symbol: '♉' },
    { name: 'Mithuna', english: 'Gemini', symbol: '♊' },
    { name: 'Karka', english: 'Cancer', symbol: '♋' },
    { name: 'Simha', english: 'Leo', symbol: '♌' },
    { name: 'Kanya', english: 'Virgo', symbol: '♍' },
    { name: 'Tula', english: 'Libra', symbol: '♎' },
    { name: 'Vrishchika', english: 'Scorpio', symbol: '♏' },
    { name: 'Dhanu', english: 'Sagittarius', symbol: '♐' },
    { name: 'Makara', english: 'Capricorn', symbol: '♑' },
    { name: 'Kumbha', english: 'Aquarius', symbol: '♒' },
    { name: 'Meena', english: 'Pisces', symbol: '♓' },
  ];

  const currentHoroscope: DailyHoroscope =
    SAMPLE_DAILY_HOROSCOPES[selectedRashi] || SAMPLE_DAILY_HOROSCOPES['Tula'];

  const filteredDates = SAMPLE_AUSPICIOUS_DATES.filter((d) => {
    if (dateFilter === 'All') return true;
    if (dateFilter === 'Business') return d.category.includes('Business');
    if (dateFilter === 'Property') return d.category.includes('Property');
    if (dateFilter === 'Marriage') return d.category.includes('Marriage');
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950/30 to-stone-900 border border-amber-500/25 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-extrabold text-stone-100 tracking-tight flex items-center gap-2">
              <Sun className="w-6 h-6 text-amber-400" />
              <span>Rashi Bhavishya & Auspicious Dates (Muhurat)</span>
            </h1>
            <p className="mt-1 text-xs text-stone-300 max-w-2xl leading-relaxed">
              Vedic daily, weekly & monthly transit forecasts with live Panchang timings, Abhijit Muhurat, Rahu Kaal, and auspicious business & marriage dates.
            </p>
          </div>

          {/* Period Toggle */}
          <div className="flex rounded-2xl bg-stone-950 p-1 border border-stone-800 text-xs">
            <button
              onClick={() => setActivePeriod('daily')}
              className={`px-4 py-2 rounded-xl font-bold transition ${
                activePeriod === 'daily' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Daily
            </button>
            <button
              onClick={() => setActivePeriod('weekly')}
              className={`px-4 py-2 rounded-xl font-bold transition ${
                activePeriod === 'weekly' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setActivePeriod('monthly')}
              className={`px-4 py-2 rounded-xl font-bold transition ${
                activePeriod === 'monthly' ? 'bg-amber-500 text-stone-950' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Monthly
            </button>
          </div>
        </div>

        {/* 12 Rashi Horizontal Selector */}
        <div className="mt-6 flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-2">
          {allRashis.map((r) => {
            const isSelected = selectedRashi === r.name;
            return (
              <button
                key={r.name}
                onClick={() => setSelectedRashi(r.name)}
                className={`flex-shrink-0 px-4 py-2.5 rounded-2xl border text-xs flex items-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-stone-950 font-bold border-amber-400 shadow-md shadow-amber-500/20'
                    : 'bg-stone-950/80 text-stone-300 border-stone-800 hover:border-amber-500/40'
                }`}
              >
                <span className="text-sm">{r.symbol}</span>
                <span>{r.name}</span>
                <span className={`text-[10px] ${isSelected ? 'text-amber-950/70' : 'text-stone-500'}`}>
                  ({r.english})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Selected Rashi Forecast + Live Panchang Muhurat */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Detailed Rashi Prediction (7 cols) */}
        <div className="lg:col-span-7 bg-stone-900/90 rounded-3xl border border-stone-800 p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                {activePeriod.toUpperCase()} FORECAST
              </span>
              <h2 className="font-serif text-xl font-extrabold text-stone-100 flex items-center gap-2">
                <span>{currentHoroscope.sign} ({currentHoroscope.englishSign})</span>
                <span className="text-xs font-sans text-stone-400 font-normal">
                  • Ruled by {currentHoroscope.rulingPlanet}
                </span>
              </h2>
            </div>

            {/* Lucky Metas */}
            <div className="flex items-center gap-3 text-xs">
              <div className="bg-stone-950 border border-stone-800 px-3 py-1.5 rounded-xl text-center">
                <div className="text-[9px] uppercase text-stone-500 font-bold">Lucky No.</div>
                <div className="font-bold text-amber-300">{currentHoroscope.luckyNumber}</div>
              </div>
              <div className="bg-stone-950 border border-stone-800 px-3 py-1.5 rounded-xl text-center">
                <div className="text-[9px] uppercase text-stone-500 font-bold">Lucky Color</div>
                <div className="font-bold text-stone-200">{currentHoroscope.luckyColor}</div>
              </div>
            </div>
          </div>

          {/* Predictions Breakdown */}
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
              <span className="text-xs font-bold text-amber-300">🌟 Personal Life & Aura</span>
              <p className="text-xs text-stone-300 leading-relaxed">
                {currentHoroscope.predictions.personal}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
              <span className="text-xs font-bold text-emerald-400">💼 Career & Profession</span>
              <p className="text-xs text-stone-300 leading-relaxed">
                {currentHoroscope.predictions.career}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
              <span className="text-xs font-bold text-amber-400">📈 Wealth & Business Inflows</span>
              <p className="text-xs text-stone-300 leading-relaxed">
                {currentHoroscope.predictions.finance}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
              <span className="text-xs font-bold text-rose-400">💍 Love & Marital Harmony</span>
              <p className="text-xs text-stone-300 leading-relaxed">
                {currentHoroscope.predictions.love}
              </p>
            </div>
          </div>

          {/* Daily Targeted Upay */}
          <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-200 space-y-0.5">
              <strong className="text-amber-300 font-serif">Today&apos;s Auspicious Upay (आज का उपाय):</strong>
              <p className="text-stone-300">{currentHoroscope.dailyUpay}</p>
            </div>
          </div>

          <button
            onClick={() => onAskAstrologerAboutHoroscope(`What are the key planetary transits for ${selectedRashi} this month?`)}
            className="w-full text-center text-xs font-semibold text-amber-400 hover:text-amber-300 pt-2 border-t border-stone-800"
          >
            Ask Acharya for In-Depth Personalized Transit Outlook →
          </button>
        </div>

        {/* Right: Live Panchang, Shubh Muhurat & Rahu Kaal (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Shubh Muhurat Card */}
          <div className="bg-stone-900/90 rounded-3xl border border-emerald-500/30 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <h3 className="font-serif text-md font-bold text-stone-100">
                  Today&apos;s Shubh Muhurat (Auspicious)
                </h3>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                FAVORABLE
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-200">Abhijit Muhurat (अभिजीत मुहूर्त)</div>
                  <div className="text-[11px] text-stone-400">Supreme golden window for all actions</div>
                </div>
                <span className="font-mono text-emerald-400 font-bold text-xs">
                  {currentHoroscope.shubhMuhuratToday.abhijitMuhurat}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-200">Amrit Kaal (अमृत काल)</div>
                  <div className="text-[11px] text-stone-400">Spiritual rituals, signing & journeys</div>
                </div>
                <span className="font-mono text-emerald-400 font-bold text-xs">
                  {currentHoroscope.shubhMuhuratToday.amritKaal}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-200">Shubh Choghadiya (शुभ चौघड़िया)</div>
                  <div className="text-[11px] text-stone-400">General commercial activities</div>
                </div>
                <span className="font-mono text-emerald-400 font-bold text-xs">
                  {currentHoroscope.shubhMuhuratToday.shubhChoghadiya}
                </span>
              </div>
            </div>
          </div>

          {/* Inauspicious Ashubh Timings (Rahu Kaal) */}
          <div className="bg-stone-900/90 rounded-3xl border border-rose-500/30 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <h3 className="font-serif text-md font-bold text-stone-100">
                  Inauspicious Windows (राहु काल)
                </h3>
              </div>
              <span className="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-2 py-0.5 rounded border border-rose-500/30">
                AVOID
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-rose-300">Rahu Kaal (राहु काल)</div>
                  <div className="text-[11px] text-stone-400">Do not begin new contracts or journeys</div>
                </div>
                <span className="font-mono text-rose-400 font-bold text-xs">
                  {currentHoroscope.ashubhTimings.rahuKaal}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-stone-300">Yamaganda (यमगंड)</div>
                  <div className="text-[11px] text-stone-400">Avoid debt clearance or confrontations</div>
                </div>
                <span className="font-mono text-stone-400 font-medium text-xs">
                  {currentHoroscope.ashubhTimings.yamaganda}
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Monthly Auspicious / Inauspicious Dates Calendar */}
      <div className="bg-stone-900/90 rounded-3xl border border-stone-800 p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div>
            <h2 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Good Dates & Bad Dates (Shubh & Ashubh Calendar)</span>
            </h2>
            <p className="text-xs text-stone-400">
              Optimal astrological windows for signing agreements, property purchase, weddings, and vehicle deliveries.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 text-xs bg-stone-950 p-1 rounded-xl border border-stone-800">
            <Filter className="w-3.5 h-3.5 text-stone-500 ml-2" />
            {(['All', 'Business', 'Property', 'Marriage'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setDateFilter(cat)}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  dateFilter === cat ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDates.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl bg-stone-950 border space-y-2 transition ${
                item.type.includes('Highly')
                  ? 'border-emerald-500/40 hover:border-emerald-400'
                  : item.type.includes('Inauspicious')
                  ? 'border-rose-500/40 hover:border-rose-400'
                  : 'border-amber-500/30 hover:border-amber-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-stone-200 text-sm">
                  {item.date} • {item.weekday}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  item.type.includes('Highly')
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : item.type.includes('Inauspicious')
                    ? 'bg-rose-500/20 text-rose-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {item.type}
                </span>
              </div>

              <div className="text-[11px] text-amber-400 font-semibold flex items-center justify-between">
                <span>{item.category}</span>
                <span className="text-stone-400 font-normal">{item.tithi} ({item.nakshatra})</span>
              </div>

              <p className="text-xs text-stone-400 leading-relaxed">
                {item.reason}
              </p>

              <div className="text-[11px] text-stone-300 bg-stone-900/60 p-2.5 rounded-xl border border-stone-800/80">
                <strong>Action:</strong> {item.recommendedAction}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
