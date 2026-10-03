import React, { useState } from 'react';
import { VedicKundli } from '../types/astrology';
import { ShieldCheck, Volume2, Sparkles, Heart, CheckCircle2, Award, Zap } from 'lucide-react';

interface RemediesVaultProps {
  kundli: VedicKundli;
  onAskAstrologerAboutRemedy: (remedyTopic: string) => void;
}

export const RemediesVault: React.FC<RemediesVaultProps> = ({
  kundli,
  onAskAstrologerAboutRemedy,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'gemstones' | 'mantras' | 'fasting' | 'charity'>('all');
  const [playingMantraIndex, setPlayingMantraIndex] = useState<number | null>(null);

  const remedies = kundli.remedies;

  const playMantraRecitation = (index: number, mantraText: string) => {
    if (!('speechSynthesis' in window)) return;
    if (playingMantraIndex === index) {
      window.speechSynthesis.cancel();
      setPlayingMantraIndex(null);
      return;
    }

    window.speechSynthesis.cancel();
    const clean = mantraText.replace(/[*#_~]/g, '');
    const utter = new SpeechSynthesisUtterance(clean);
    utter.rate = 0.85; // Slow, meditative pace for Vedic mantra recitation
    utter.pitch = 0.95;
    utter.onend = () => setPlayingMantraIndex(null);
    utter.onerror = () => setPlayingMantraIndex(null);
    setPlayingMantraIndex(index);
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950/30 to-stone-900 border border-amber-500/25 p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="font-serif text-2xl md:text-3xl font-extrabold text-stone-100 tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
              <span>Vedic Upay & Remedy Sanctuary (उपाय)</span>
            </h1>
            <p className="mt-1 text-xs text-stone-300 max-w-2xl leading-relaxed">
              Classical, non-superstitious remedies tailored specifically to {kundli.birthDetails.name}&apos;s {kundli.ascendant.sign} Lagna and {kundli.currentDasha.mahadasha} Mahadasha.
            </p>
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex flex-wrap rounded-2xl bg-stone-950 p-1 border border-stone-800 text-xs">
            {(['all', 'gemstones', 'mantras', 'fasting', 'charity'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl capitalize font-semibold transition ${
                  activeTab === tab ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Rudraksha & Kavach Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-stone-950 via-amber-950/40 to-stone-950 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl flex-shrink-0">
            📿
          </div>
          <div>
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
              Sacred Botanical Kavach
            </span>
            <h3 className="font-serif text-lg font-bold text-stone-100">
              {remedies.rudrakshaRecommendation.mukhi}
            </h3>
            <p className="text-xs text-stone-300 mt-0.5">
              Ruling Deity/Planet: <strong className="text-amber-200">{remedies.rudrakshaRecommendation.rulingPlanet}</strong> • {remedies.rudrakshaRecommendation.benefits}
            </p>
          </div>
        </div>

        <button
          onClick={() => onAskAstrologerAboutRemedy(`How should I energize and wear my ${remedies.rudrakshaRecommendation.mukhi}?`)}
          className="flex-shrink-0 px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition flex items-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask Consecration Ritual</span>
        </button>
      </div>

      {/* Section 1: Astrological Gemstones (Ratna) */}
      {(activeTab === 'all' || activeTab === 'gemstones') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Recommended Astrological Gemstones (रत्न)</span>
            </h2>
            <span className="text-xs text-stone-400">
              Based on Lagna Lord & 9th/5th Trikona benefic planets
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {remedies.gemstones.map((gem, idx) => (
              <div
                key={idx}
                className="bg-stone-900/90 rounded-3xl border border-stone-800 p-6 space-y-4 shadow-xl hover:border-amber-500/30 transition"
              >
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      Target Planet: {gem.planet}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-stone-100">
                      {gem.name} ({gem.hindiName})
                    </h3>
                  </div>
                  <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-stone-950 text-amber-300 border border-stone-800">
                    {gem.metal}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-stone-300">
                  <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800/80">
                    <span className="text-stone-500 block text-[10px]">Wearing Finger:</span>
                    <strong className="text-stone-200">{gem.finger}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800/80">
                    <span className="text-stone-500 block text-[10px]">Ideal Weight:</span>
                    <strong className="text-stone-200">{gem.idealWeight}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800/80 col-span-2">
                    <span className="text-stone-500 block text-[10px]">Auspicious Day:</span>
                    <strong className="text-stone-200">{gem.auspiciousDay}</strong>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/20 text-xs text-amber-200/90">
                  <strong className="block text-[10px] uppercase text-amber-400 font-bold mb-1">
                    Prana Pratishtha Consecration Mantra:
                  </strong>
                  <span className="font-mono text-amber-300">{gem.mantra}</span>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed">
                  <strong className="text-stone-200">Cosmic Benefits:</strong> {gem.benefits}
                </p>

                {gem.warning && (
                  <p className="text-[11px] text-rose-300/90 bg-rose-950/30 p-2.5 rounded-xl border border-rose-500/20">
                    ⚠️ {gem.warning}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 2: Vedic Mantras with Audio Recitation */}
      {(activeTab === 'all' || activeTab === 'mantras') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Sacred Vedic & Beej Mantras (मंत्र साधना)</span>
            </h2>
            <span className="text-xs text-stone-400">
              Listen to correct pronunciation & recite 108 times
            </span>
          </div>

          <div className="space-y-4">
            {remedies.mantras.map((m, idx) => (
              <div
                key={idx}
                className="bg-stone-900/90 rounded-3xl border border-stone-800 p-6 shadow-xl space-y-4 hover:border-amber-500/30 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                      Presiding Deity: {m.deity} • Target Graha: {m.targetPlanet}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-stone-100">
                      {m.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-stone-950 px-3 py-1.5 rounded-xl text-stone-300 border border-stone-800">
                      {m.repetitionCount} Japas ({m.idealTime})
                    </span>
                    <button
                      onClick={() => playMantraRecitation(idx, m.sanskritMantra)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>{playingMantraIndex === idx ? 'Stop Audio' : 'Listen Pronunciation'}</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#080C14] border border-amber-500/30 text-center space-y-2">
                  <div className="font-serif text-base sm:text-lg text-amber-300 font-extrabold tracking-wide">
                    {m.sanskritMantra}
                  </div>
                  <div className="text-xs text-stone-400 italic font-mono">
                    {m.transliteration}
                  </div>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed">
                  <strong className="text-stone-200">Meaning & Spiritual Power:</strong> {m.meaning}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 3: Fasting & Charity (Vrat & Daan) */}
      {(activeTab === 'all' || activeTab === 'fasting' || activeTab === 'charity') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Fasting (Vrat) */}
          <div className="bg-stone-900/90 rounded-3xl border border-stone-800 p-6 space-y-4 shadow-xl">
            <h3 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
              <span>Auspicious Fasting (व्रत साधना)</span>
            </h3>

            {remedies.fasting.map((f, i) => (
              <div key={i} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-amber-300 text-sm">{f.day}</span>
                  <span className="text-[10px] text-stone-400 font-semibold bg-stone-900 px-2 py-0.5 rounded">
                    Deity: {f.associatedDeity}
                  </span>
                </div>
                <ul className="text-xs text-stone-300 space-y-1.5 list-disc list-inside">
                  {f.ritualRules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
                <p className="text-[11px] text-amber-200/90 bg-amber-950/30 p-2.5 rounded-xl border border-amber-500/20">
                  <strong>Benefit:</strong> {f.spiritualBenefit}
                </p>
              </div>
            ))}
          </div>

          {/* Charity (Daan) */}
          <div className="bg-stone-900/90 rounded-3xl border border-stone-800 p-6 space-y-4 shadow-xl">
            <h3 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
              <span>Sacred Charity & Daan (दान पुण्य)</span>
            </h3>

            {remedies.charities.map((c, i) => (
              <div key={i} className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-stone-200 text-sm">{c.title}</span>
                  <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    Day: {c.auspiciousDay}
                  </span>
                </div>
                <div className="text-xs text-stone-300">
                  <strong className="text-stone-400">Items to Donate:</strong> {c.itemsToDonate.join(', ')}
                </div>
                <div className="text-[11px] text-stone-400">
                  <strong>Recipient:</strong> {c.recipient}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* Section 4: Daily Behavioral Lifestyle Upay */}
      <div className="bg-stone-900/90 rounded-3xl border border-stone-800 p-6 space-y-4 shadow-xl">
        <h3 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Vedic Lifestyle & Constitutional Habits (दिनचर्या उपाय)</span>
        </h3>
        <p className="text-xs text-stone-400">
          Small, mindful daily alignments that naturally clear subtle energetic blockages in home and mind.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {remedies.lifestyleUpay.map((upay, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 flex items-start gap-3 text-xs text-stone-200"
            >
              <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center flex-shrink-0 text-[10px]">
                {idx + 1}
              </span>
              <span>{upay}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
