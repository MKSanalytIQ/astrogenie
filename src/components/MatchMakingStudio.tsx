import React, { useState } from 'react';
import { MatchMakingResult } from '../types/astrology';
import { SAMPLE_MATCH_RESULT } from '../data/defaultKundlis';
import { HeartHandshake, ShieldCheck, AlertCircle, CheckCircle, RefreshCw, Sparkles, Heart } from 'lucide-react';

interface MatchMakingStudioProps {
  onAskAstrologerAboutMarriage: (topic: string) => void;
}

export const MatchMakingStudio: React.FC<MatchMakingStudioProps> = ({
  onAskAstrologerAboutMarriage,
}) => {
  const [matchResult, setMatchResult] = useState<MatchMakingResult>(SAMPLE_MATCH_RESULT);
  const [isCalculating, setIsCalculating] = useState(false);

  // Boy details
  const [boyName, setBoyName] = useState('Rahul Sharma');
  const [boyDob, setBoyDob] = useState('1995-10-14');
  const [boyTob, setBoyTob] = useState('07:30');
  const [boyPob, setBoyPob] = useState('New Delhi, India');

  // Girl details
  const [girlName, setGirlName] = useState('Priya Verma');
  const [girlDob, setGirlDob] = useState('1997-04-22');
  const [girlTob, setGirlTob] = useState('14:15');
  const [girlPob, setGirlPob] = useState('Mumbai, India');

  const handleCalculateMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);

    try {
      const res = await fetch('/api/match-kundli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          boy: { name: boyName, dateOfBirth: boyDob, timeOfBirth: boyTob, placeOfBirth: boyPob },
          girl: { name: girlName, dateOfBirth: girlDob, timeOfBirth: girlTob, placeOfBirth: girlPob },
        }),
      });

      const data = await res.json();
      if (data?.match) {
        setMatchResult(data.match);
      }
    } catch (err) {
      console.error('Error matching Kundlis:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  const getScoreColor = (obtained: number, max: number) => {
    const ratio = obtained / max;
    if (ratio >= 0.75) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (ratio >= 0.5) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-rose-950/30 to-stone-900 border border-rose-500/25 p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-2xl md:text-3xl font-extrabold text-stone-100 tracking-tight flex items-center gap-2">
                <span>Vedic Kundli Milan (36 Guna Matching)</span>
                <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
              </h1>
            </div>
            <p className="mt-1 text-xs text-stone-300 max-w-2xl leading-relaxed">
              Classical Ashtakoot Gun Milan evaluating biological, emotional, mental, and genetic marital longevity. Minimum 18/36 points required for auspicious union.
            </p>
          </div>

          <div className="bg-stone-950/80 border border-rose-500/30 px-5 py-3 rounded-2xl flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">
                Total Ashtakoot Score
              </div>
              <div className="text-2xl font-black text-stone-100">
                {matchResult.totalScore} <span className="text-sm font-normal text-stone-400">/ 36 Gunas</span>
              </div>
            </div>
            <div className="h-10 w-[1px] bg-stone-800" />
            <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
              matchResult.totalScore >= 24
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : matchResult.totalScore >= 18
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}>
              {matchResult.compatibilityLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Input Section: Boy & Girl Birth Details Form */}
      <form onSubmit={handleCalculateMatch} className="bg-stone-900/90 rounded-3xl border border-stone-800 p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <h2 className="font-serif text-md font-bold text-stone-100 flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <span>Enter Bride & Groom Birth Data for Matchmaking</span>
          </h2>
          <span className="text-xs text-stone-400">
            Calculates Lagna, Moon Nakshatra & Mangal Dosha
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Groom (Boy) Column */}
          <div className="space-y-4 p-5 rounded-2xl bg-stone-950 border border-amber-500/20">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <span>🤵 Groom (Var) Details</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={boyName}
                  onChange={(e) => setBoyName(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-300 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={boyDob}
                  onChange={(e) => setBoyDob(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-300 mb-1">Time of Birth</label>
                <input
                  type="time"
                  value={boyTob}
                  onChange={(e) => setBoyTob(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-300 mb-1">Place of Birth (City)</label>
                <input
                  type="text"
                  value={boyPob}
                  onChange={(e) => setBoyPob(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:border-amber-400 focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Bride (Girl) Column */}
          <div className="space-y-4 p-5 rounded-2xl bg-stone-950 border border-rose-500/20">
            <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
              <span>👰 Bride (Kanya) Details</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={girlName}
                  onChange={(e) => setGirlName(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:border-rose-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-300 mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={girlDob}
                  onChange={(e) => setGirlDob(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:border-rose-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-300 mb-1">Time of Birth</label>
                <input
                  type="time"
                  value={girlTob}
                  onChange={(e) => setGirlTob(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:border-rose-400 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-stone-300 mb-1">Place of Birth (City)</label>
                <input
                  type="text"
                  value={girlPob}
                  onChange={(e) => setGirlPob(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:border-rose-400 focus:outline-none"
                  required
                />
              </div>
            </div>
          </div>

        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isCalculating}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs tracking-wide shadow-md shadow-amber-500/20 transition flex items-center gap-2"
          >
            {isCalculating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Matching 36 Gunas...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Calculate Gun Milan (36 Points)</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Critical Marriage Dosha Checks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Manglik Compatibility */}
        <div className="bg-stone-900/90 rounded-3xl border border-stone-800 p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
              Kuja (Manglik) Check
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
              <CheckCircle className="w-3.5 h-3.5" /> Favorable
            </span>
          </div>
          <h3 className="font-serif text-md font-bold text-stone-100">
            Manglik Compatibility
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            {matchResult.manglikCompatibility.verdict}
          </p>
        </div>

        {/* Nadi Dosha */}
        <div className="bg-stone-900/90 rounded-3xl border border-stone-800 p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
              Nadi (Genetic Health)
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
              <CheckCircle className="w-3.5 h-3.5" /> 8/8 Points
            </span>
          </div>
          <h3 className="font-serif text-md font-bold text-stone-100">
            Nadi Koota Harmony
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            {matchResult.nadiDosha.advice}
          </p>
        </div>

        {/* Bhakoot Dosha */}
        <div className="bg-stone-900/90 rounded-3xl border border-stone-800 p-5 shadow-xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
              Bhakoot (Family Fortune)
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
              <CheckCircle className="w-3.5 h-3.5" /> 7/7 Points
            </span>
          </div>
          <h3 className="font-serif text-md font-bold text-stone-100">
            Bhakoot Auspiciousness
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            {matchResult.bhakootDosha.advice}
          </p>
        </div>

      </div>

      {/* 8-Factor Ashtakoot Breakdown Grid */}
      <div className="bg-stone-900/90 rounded-3xl border border-stone-800 p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Ashtakoot 8-Fold Guna Milan Breakdown</span>
            </h2>
            <p className="text-xs text-stone-400">
              Complete point allocation according to classical Brihat Parashara Hora Shastra.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {matchResult.scores.map((s) => (
            <div
              key={s.name}
              className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2 hover:border-amber-500/30 transition"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-stone-200 text-sm">
                  {s.name} ({s.hindiName})
                </span>
                <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${getScoreColor(s.obtainedPoints, s.maximumPoints)}`}>
                  {s.obtainedPoints} / {s.maximumPoints}
                </span>
              </div>
              <div className="text-[10px] text-amber-400/90 font-medium">
                {s.area}
              </div>
              <p className="text-xs text-stone-400 leading-relaxed">
                {s.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Counselor Summary & Wedding Rituals */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-stone-900/90 rounded-3xl border border-amber-500/25 p-6 shadow-xl space-y-3">
          <h3 className="font-serif text-md font-bold text-stone-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Astrological Counselor Verdict</span>
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed whitespace-pre-line">
            {matchResult.counselorSummary}
          </p>

          <button
            onClick={() => onAskAstrologerAboutMarriage(`Explain the matrimonial compatibility between ${boyName} and ${girlName} in detail.`)}
            className="mt-2 text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1.5"
          >
            <span>Ask Acharya for Pre-Marital Guidance & Auspicious Dates →</span>
          </button>
        </div>

        <div className="lg:col-span-4 bg-stone-900/90 rounded-3xl border border-stone-800 p-6 shadow-xl space-y-3">
          <h3 className="font-serif text-md font-bold text-stone-100">
            Recommended Harmonizing Rituals
          </h3>
          <ul className="space-y-2 text-xs text-stone-300">
            {matchResult.recommendedRituals.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">🕉️</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
