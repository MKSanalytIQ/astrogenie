import React, { useState } from 'react';
import { MatchMakingResult } from '../types/astrology';
import { SAMPLE_MATCH_RESULT } from '../data/defaultKundlis';
import { AshtakootRadarChart } from './AshtakootRadarChart';
import { calculateAshtakootMilan } from '../utils/ashtakootEngine';
import { 
  HeartHandshake, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle, 
  RefreshCw, 
  Sparkles, 
  Heart, 
  Compass, 
  Flame, 
  Info, 
  MessageSquare,
  Award
} from 'lucide-react';

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

  const handleCalculateMatch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
      if (data?.match && Array.isArray(data.match.scores) && data.match.scores.length === 8) {
        setMatchResult(data.match);
      } else {
        // High fidelity deterministic engine fallback
        const calculated = calculateAshtakootMilan(
          boyName, boyDob, boyTob, boyPob,
          girlName, girlDob, girlTob, girlPob
        );
        setMatchResult(calculated);
      }
    } catch (err) {
      console.warn('Network call fallback to local Ashtakoot engine:', err);
      const calculated = calculateAshtakootMilan(
        boyName, boyDob, boyTob, boyPob,
        girlName, girlDob, girlTob, girlPob
      );
      setMatchResult(calculated);
    } finally {
      setIsCalculating(false);
    }
  };

  const loadPreset = (presetType: 'uttama' | 'auspicious' | 'dosha') => {
    if (presetType === 'uttama') {
      setBoyName('Arjun Kapoor');
      setBoyDob('1994-06-21');
      setBoyTob('08:15');
      setBoyPob('Varanasi, India');
      setGirlName('Ananya Iyer');
      setGirlDob('1996-09-12');
      setGirlTob('11:45');
      setGirlPob('Chennai, India');
      const res = calculateAshtakootMilan('Arjun Kapoor', '1994-06-21', '08:15', 'Varanasi', 'Ananya Iyer', '1996-09-12', '11:45', 'Chennai');
      setMatchResult(res);
    } else if (presetType === 'auspicious') {
      setBoyName('Vikram Malhotra');
      setBoyDob('1992-11-05');
      setBoyTob('16:20');
      setBoyPob('Bengaluru, India');
      setGirlName('Sneha Joshi');
      setGirlDob('1995-02-18');
      setGirlTob('09:10');
      setGirlPob('Pune, India');
      const res = calculateAshtakootMilan('Vikram Malhotra', '1992-11-05', '16:20', 'Bengaluru', 'Sneha Joshi', '1995-02-18', '09:10', 'Pune');
      setMatchResult(res);
    } else {
      setBoyName('Rohan Mehra');
      setBoyDob('1993-03-10');
      setBoyTob('22:45');
      setBoyPob('Jaipur, India');
      setGirlName('Kavita Rao');
      setGirlDob('1993-03-11');
      setGirlTob('04:15');
      setGirlPob('Hyderabad, India');
      const res = calculateAshtakootMilan('Rohan Mehra', '1993-03-10', '22:45', 'Jaipur', 'Kavita Rao', '1993-03-11', '04:15', 'Hyderabad');
      setMatchResult(res);
    }
  };

  const getScoreColor = (obtained: number, max: number) => {
    const ratio = obtained / max;
    if (ratio >= 0.75) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (ratio >= 0.5) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-rose-950/40 to-[#1A0E1C] border-2 border-rose-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
              <span>Brihat Parashara Ashtakoot Compatibility Engine</span>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl font-extrabold text-stone-100 tracking-tight flex items-center gap-2">
              <span>Kundli Milan & 36 Guna Score</span>
              <span className="text-xl">💍</span>
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Classical 8-fold astrological analysis evaluating spiritual ego, psychological friendship, biological warmth, and genetic longevity. Visualized via interactive multi-axis D3.js radar geometry.
            </p>
          </div>

          {/* Compatibility Score Counter Badge */}
          <div className="bg-stone-950/90 border-2 border-amber-500/40 px-6 py-4 rounded-3xl flex items-center gap-5 shadow-xl">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                Ashtakoot Score
              </div>
              <div className="text-3xl font-black text-stone-100 font-mono">
                {matchResult.totalScore} <span className="text-sm font-normal text-stone-400">/ 36</span>
              </div>
            </div>
            <div className="h-12 w-[1px] bg-stone-800" />
            <div className="space-y-1">
              <span className={`inline-block px-3 py-1 rounded-xl text-xs font-bold ${
                matchResult.totalScore >= 24
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : matchResult.totalScore >= 18
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {matchResult.compatibilityLevel}
              </span>
              <div className="text-[10px] text-stone-400 font-mono">Min 18 Required</div>
            </div>
          </div>
        </div>

        {/* Quick Couple Presets for Testing */}
        <div className="mt-6 pt-4 border-t border-stone-800/80 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[10px] uppercase font-bold text-stone-400">Explore Sample Pairings:</span>
          <button
            onClick={() => loadPreset('uttama')}
            className="px-3 py-1 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 hover:border-amber-400 transition"
          >
            🌟 Uttama Match (30+ Gunas)
          </button>
          <button
            onClick={() => loadPreset('auspicious')}
            className="px-3 py-1 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 hover:border-amber-400 transition"
          >
            💍 Auspicious Match (24-29 Gunas)
          </button>
          <button
            onClick={() => loadPreset('dosha')}
            className="px-3 py-1 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 hover:border-rose-400 transition"
          >
            ⚠️ Dosha Test (Nadi Conflict)
          </button>
        </div>
      </div>

      {/* Input Section: Boy & Girl Birth Details Form */}
      <form onSubmit={handleCalculateMatch} className="bg-stone-900/90 rounded-3xl border border-stone-800 p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <h2 className="font-serif text-md font-bold text-stone-100 flex items-center gap-2">
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <span>Enter Groom & Bride Birth Particulars (वर एवं कन्या जन्म विवरण)</span>
          </h2>
          <span className="text-xs text-stone-400">
            Calculates exact Moon sign, Janam Nakshatra & Gunas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Groom (Boy) Column */}
          <div className="space-y-4 p-5 rounded-2xl bg-stone-950 border border-amber-500/20">
            <div className="flex items-center justify-between text-amber-300 font-bold text-sm">
              <span className="flex items-center gap-1.5">
                <span>🤵</span>
                <span>Groom (वर) Details</span>
              </span>
              <span className="text-[11px] font-normal text-stone-400 font-mono">
                {matchResult.boyMoonSign} • {matchResult.boyNakshatra}
              </span>
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
            <div className="flex items-center justify-between text-rose-300 font-bold text-sm">
              <span className="flex items-center gap-1.5">
                <span>👰</span>
                <span>Bride (कन्या) Details</span>
              </span>
              <span className="text-[11px] font-normal text-stone-400 font-mono">
                {matchResult.girlMoonSign} • {matchResult.girlNakshatra}
              </span>
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

        <div className="flex justify-end gap-3">
          <button
            type="submit"
            disabled={isCalculating}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs tracking-wide shadow-md shadow-amber-500/20 transition flex items-center gap-2"
          >
            {isCalculating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Aligning 36 Gunas...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Calculate Gun Milan & Render Radar</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* CORE FEATURE: D3.js Radar Chart Visualization & Astrological Verdict */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: D3.js Ashtakoot Radar Chart (7 cols) */}
        <div className="lg:col-span-7">
          <AshtakootRadarChart
            scores={matchResult.scores}
            totalScore={matchResult.totalScore}
            compatibilityLevel={matchResult.compatibilityLevel}
          />
        </div>

        {/* Right: Critical Marriage Dosha Checks & Counselor Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Manglik Compatibility Card */}
          <div className="bg-stone-900/90 rounded-3xl border border-stone-800 p-5 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                Kuja (Manglik) Check
              </span>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" /> Favorable
              </span>
            </div>
            <h3 className="font-serif text-sm font-bold text-stone-100">
              Manglik Compatibility
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              {matchResult.manglikCompatibility.verdict}
            </p>
          </div>

          {/* Nadi Dosha Card */}
          <div className={`p-5 rounded-3xl border shadow-xl space-y-2 ${
            matchResult.nadiDosha.hasNadiDosha 
              ? 'bg-rose-950/20 border-rose-500/40 text-stone-200' 
              : 'bg-stone-900/90 border-stone-800 text-stone-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                Nadi (Genetic Health)
              </span>
              <span className={`flex items-center gap-1 text-xs font-bold ${
                matchResult.nadiDosha.hasNadiDosha ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {matchResult.nadiDosha.hasNadiDosha ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                {matchResult.nadiDosha.hasNadiDosha ? 'Nadi Dosha Detected' : '8/8 Max Points'}
              </span>
            </div>
            <h3 className="font-serif text-sm font-bold text-stone-100">
              Nadi Koota Harmony
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              {matchResult.nadiDosha.advice}
            </p>
          </div>

          {/* Bhakoot Dosha Card */}
          <div className={`p-5 rounded-3xl border shadow-xl space-y-2 ${
            matchResult.bhakootDosha.hasBhakootDosha 
              ? 'bg-amber-950/20 border-amber-500/40 text-stone-200' 
              : 'bg-stone-900/90 border-stone-800 text-stone-200'
          }`}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                Bhakoot (Family Fortune)
              </span>
              <span className={`flex items-center gap-1 text-xs font-bold ${
                matchResult.bhakootDosha.hasBhakootDosha ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                {matchResult.bhakootDosha.hasBhakootDosha ? <AlertCircle className="w-3.5 h-3.5" /> : <CheckCircle className="w-3.5 h-3.5" />}
                {matchResult.bhakootDosha.hasBhakootDosha ? 'Bhakoot Dosha Detected' : '7/7 Max Points'}
              </span>
            </div>
            <h3 className="font-serif text-sm font-bold text-stone-100">
              Bhakoot Auspiciousness
            </h3>
            <p className="text-xs text-stone-300 leading-relaxed">
              {matchResult.bhakootDosha.advice}
            </p>
          </div>

          {/* Ask Astrologer Action Box */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-stone-900 to-stone-950 border border-amber-500/30 space-y-3">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <h4 className="font-serif text-xs font-bold text-stone-100">
                Seek Deeper Marriage Guidance?
              </h4>
            </div>
            <p className="text-[11px] text-stone-300 leading-relaxed">
              Acharya AstroGenie can analyze Navamsha (D9) chart overlays, 7th house lord strength, and Jupiter transit blessing windows for this couple.
            </p>
            <button
              onClick={() => onAskAstrologerAboutMarriage(`Acharya ji, please analyze the ${matchResult.totalScore}/36 Kundli Milan compatibility between ${boyName} and ${girlName}, and suggest marital harmony remedies.`)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Discuss Compatibility with Acharya</span>
            </button>
          </div>

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
              Point allocation according to classical Brihat Parashara Hora Shastra.
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
              <div className="text-[11px] text-amber-400 font-medium">
                {s.area}
              </div>
              <p className="text-[11px] text-stone-400 leading-relaxed">
                {s.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
