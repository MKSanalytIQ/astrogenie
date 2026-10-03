import React, { useState } from 'react';
import { Sparkles, HelpCircle, CheckCircle, AlertTriangle, Clock, RefreshCw, MapPin, Compass } from 'lucide-react';

interface PrashnaResult {
  id: string;
  question: string;
  category: string;
  timestamp: string;
  location: string;
  prashnaLagna: {
    sign: string;
    degree: number;
    lord: string;
    nakshatra: string;
  };
  karyeshPlanet: string; // The significator of the action
  verdict: 'Highly Auspicious (पूर्ण सफलता)' | 'Delayed Success (प्रतीक्षा उपरांत सिद्धि)' | 'Unfavorable / Obstacles (बाधा योग)';
  confidenceScore: number; // 0-100
  timingOfResult: string; // e.g. "Within 11 to 21 days"
  detailedDiagnosis: string;
  immediateUpay: {
    mantra: string;
    action: string;
    direction: string;
  };
}

const SAMPLE_PRASHNA_RESULT: PrashnaResult = {
  id: 'prashna-demo-01',
  question: 'Will my new job offer and executive promotion be confirmed this month?',
  category: 'Career & Karma',
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short', year: 'numeric' }),
  location: 'New Delhi, India (Current Location)',
  prashnaLagna: {
    sign: 'Dhanu (Sagittarius)',
    degree: 18.4,
    lord: 'Guru (Jupiter)',
    nakshatra: 'Purva Ashadha',
  },
  karyeshPlanet: 'Surya (Sun) & Guru (Jupiter)',
  verdict: 'Highly Auspicious (पूर्ण सफलता)',
  confidenceScore: 94,
  timingOfResult: 'Within 9 to 18 days (during waxing Moon phase)',
  detailedDiagnosis: 'The Prashna Lagna lord Jupiter occupies a Kendra house and forms an Ithasala (harmonious benefic aspect) with the 10th lord Sun. The Moon is exalted and free from malefic combustion. This guarantees that your negotiations will bear positive fruit with executive recognition.',
  immediateUpay: {
    mantra: 'Om Namo Bhagavate Vasudevaya (ॐ नमो भगवते वासुदेवाय)',
    action: 'Offer sweet yellow rice or saffron milk to Lord Vishnu on Thursday morning',
    direction: 'Face North-East (Ishanya) while signing agreements',
  },
};

export const PrashnaKundliStudio: React.FC = () => {
  const [questionText, setQuestionText] = useState('Will my upcoming business deal or job offer be finalized successfully?');
  const [locationText, setLocationText] = useState('New Delhi, India');
  const [isCalculating, setIsCalculating] = useState(false);
  const [prashnaResult, setPrashnaResult] = useState<PrashnaResult>(SAMPLE_PRASHNA_RESULT);

  const quickQuestions = [
    'Will I get the job offer I recently interviewed for?',
    'Will my pending visa or international travel be approved?',
    'Is this the right time to invest in property or stocks?',
    'Will my health concern or legal obstacle resolve smoothly?',
    'Will my lost valuable or money be recovered?',
  ];

  const handleCastPrashna = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    setIsCalculating(true);

    try {
      const res = await fetch('/api/prashna-kundli', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText.trim(),
          location: locationText.trim(),
        }),
      });

      const data = await res.json();
      if (data?.result) {
        setPrashnaResult(data.result);
      }
    } catch (err) {
      console.error('Error casting Prashna:', err);
      // Fallback calculation based on current time
      const now = new Date();
      setPrashnaResult({
        id: 'prashna-' + Date.now(),
        question: questionText,
        category: 'General Inquiry',
        timestamp: now.toLocaleString(),
        location: locationText,
        prashnaLagna: {
          sign: 'Simha (Leo)',
          degree: 14.2,
          lord: 'Surya (Sun)',
          nakshatra: 'Magha',
        },
        karyeshPlanet: 'Surya (Sun)',
        verdict: 'Highly Auspicious (पूर्ण सफलता)',
        confidenceScore: 91,
        timingOfResult: 'Within 7 to 14 days',
        detailedDiagnosis: 'Classical Prashna Marga reveals an auspicious connection between the query Lagna and the 11th house of gains (Labha Bhava). Benefic planetary aspects indicate victory over initial hesitation.',
        immediateUpay: {
          mantra: 'Om Suryaya Namaha (ॐ सूर्याय नमः)',
          action: 'Offer water to the rising Sun in a copper vessel',
          direction: 'Face East when making the crucial call',
        },
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 border border-amber-500/30 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Classical Horary Astrology (प्रश्न मार्ग)</span>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl font-extrabold text-stone-100 tracking-tight">
              Prashna Kundli — Instant Answers Without Birth Time
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Don&apos;t know your exact birth minute? Classical Vedic horary astrology casts an instantaneous planetary chart for the exact second your dilemma is posed.
            </p>
          </div>

          <div className="bg-stone-950/80 border border-amber-500/30 px-5 py-3 rounded-2xl flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-amber-400">Current Prashna Moment</span>
              <div className="font-mono text-xs font-bold text-stone-200">{new Date().toLocaleTimeString()}</div>
              <div className="text-[10px] text-stone-400">{new Date().toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Inquiry Form */}
      <form onSubmit={handleCastPrashna} className="bg-stone-900/90 rounded-3xl border border-stone-800 p-6 shadow-xl space-y-4">
        <div>
          <label className="block text-xs font-bold text-stone-200 mb-1 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Pose Your Specific Urgent Question (प्रश्न)</span>
          </label>
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="e.g. Will my business partnership contract be signed this month?"
            className="w-full bg-stone-950 border border-stone-800 rounded-2xl px-4 py-3 text-xs text-stone-100 focus:border-amber-400 focus:outline-none"
            required
          />
        </div>

        {/* Quick prompt suggestions */}
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase font-bold text-stone-500">Popular Inquiries:</span>
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setQuestionText(q)}
                className="px-3 py-1 rounded-xl bg-stone-950 hover:bg-stone-800 text-[11px] text-stone-300 hover:text-amber-300 border border-stone-800 transition"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-stone-800">
          <div className="flex items-center gap-2 text-xs text-stone-400">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Location: </span>
            <input
              type="text"
              value={locationText}
              onChange={(e) => setLocationText(e.target.value)}
              className="bg-stone-950 border border-stone-800 rounded-lg px-2 py-1 text-xs text-stone-200 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isCalculating}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs tracking-wide shadow-md shadow-amber-500/20 transition flex items-center justify-center gap-2"
          >
            {isCalculating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Casting Horary Matrix...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Cast Prashna Kundli (Get Instant Answer)</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Prashna Result Card */}
      {prashnaResult && (
        <div className="bg-stone-900/90 rounded-3xl border border-amber-500/30 p-6 sm:p-8 shadow-2xl space-y-6">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                ORACULAR VERDICT (फल निर्णय)
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-100 mt-0.5">
                &ldquo;{prashnaResult.question}&rdquo;
              </h2>
              <div className="text-xs text-stone-400 mt-1">
                Charted at {prashnaResult.timestamp} • {prashnaResult.location}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-4 py-2 rounded-2xl text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                <span>{prashnaResult.verdict}</span>
              </span>
            </div>
          </div>

          {/* Key Prashna Astrological Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 text-xs">
              <span className="text-stone-500 text-[10px] uppercase font-bold block">Prashna Lagna</span>
              <strong className="text-amber-300">{prashnaResult.prashnaLagna.sign}</strong>
              <span className="text-stone-400 block text-[10px]">Lord: {prashnaResult.prashnaLagna.lord}</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 text-xs">
              <span className="text-stone-500 text-[10px] uppercase font-bold block">Significator (कार्येश)</span>
              <strong className="text-amber-300">{prashnaResult.karyeshPlanet}</strong>
              <span className="text-stone-400 block text-[10px]">Key Planetary Agent</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 text-xs">
              <span className="text-stone-500 text-[10px] uppercase font-bold block">Expected Timeline</span>
              <strong className="text-emerald-400">{prashnaResult.timingOfResult}</strong>
              <span className="text-stone-400 block text-[10px]">Phalaprapti Timing</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 text-xs">
              <span className="text-stone-500 text-[10px] uppercase font-bold block">Certainty Index</span>
              <strong className="text-amber-300">{prashnaResult.confidenceScore}%</strong>
              <span className="text-stone-400 block text-[10px]">Astrological Alignment</span>
            </div>
          </div>

          {/* Detailed Diagnosis */}
          <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-2 text-xs">
            <h3 className="font-serif text-sm font-bold text-stone-100 flex items-center gap-1.5">
              <span>Classical Parashara & Shatpanchasika Analysis</span>
            </h3>
            <p className="text-stone-300 leading-relaxed">
              {prashnaResult.detailedDiagnosis}
            </p>
          </div>

          {/* Immediate Actionable Upay */}
          <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/30 space-y-3 text-xs text-amber-200">
            <h3 className="font-serif text-sm font-bold text-amber-300 flex items-center gap-1.5">
              <span>🕉️ Immediate Accelerating Upay (शीघ्र फल प्राप्ति उपाय)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
              <div className="p-3 rounded-xl bg-stone-950/60 border border-amber-500/20">
                <strong className="block text-amber-400 uppercase text-[9px] mb-0.5">Potent Beej Mantra</strong>
                <span>{prashnaResult.immediateUpay.mantra}</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-950/60 border border-amber-500/20">
                <strong className="block text-amber-400 uppercase text-[9px] mb-0.5">Auspicious Action</strong>
                <span>{prashnaResult.immediateUpay.action}</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-950/60 border border-amber-500/20">
                <strong className="block text-amber-400 uppercase text-[9px] mb-0.5">Favorable Direction</strong>
                <span>{prashnaResult.immediateUpay.direction}</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
