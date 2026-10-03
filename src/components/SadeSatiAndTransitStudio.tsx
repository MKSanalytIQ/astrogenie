import React, { useState } from 'react';
import { VedicKundli } from '../types/astrology';
import { 
  ShieldAlert, 
  Sparkles, 
  Compass, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  Volume2, 
  Phone, 
  MessageSquare, 
  ExternalLink,
  Info,
  Flame,
  ShieldCheck
} from 'lucide-react';

interface SadeSatiAndTransitStudioProps {
  kundli: VedicKundli;
  onAskAstrologerAboutTransit: (topic: string) => void;
  onStartVoiceCall: () => void;
}

const ZODIAC_SIGNS: Record<string, number> = {
  'Mesha': 1, 'Aries': 1,
  'Vrishabha': 2, 'Taurus': 2,
  'Mithuna': 3, 'Gemini': 3,
  'Karka': 4, 'Cancer': 4,
  'Simha': 5, 'Leo': 5,
  'Kanya': 6, 'Virgo': 6,
  'Tula': 7, 'Libra': 7,
  'Vrishchika': 8, 'Scorpio': 8,
  'Dhanu': 9, 'Sagittarius': 9,
  'Makara': 10, 'Capricorn': 10,
  'Kumbha': 11, 'Aquarius': 11,
  'Meena': 12, 'Pisces': 12,
};

export const SadeSatiAndTransitStudio: React.FC<SadeSatiAndTransitStudioProps> = ({
  kundli,
  onAskAstrologerAboutTransit,
  onStartVoiceCall,
}) => {
  const [selectedTransitPlanet, setSelectedTransitPlanet] = useState<'shani' | 'guru' | 'rahu' | 'ketu' | 'surya'>('shani');
  const [isPlayingMantra, setIsPlayingMantra] = useState(false);

  // Determine Moon Sign Index (1-12)
  const moonSignName = kundli.moonSign.sign.split(' ')[0];
  const moonIndex = ZODIAC_SIGNS[moonSignName] || 1;

  // Saturn's current transit position is Meena (Pisces = 12)
  const currentSaturnSignIndex = 12; // Meena

  // Calculate relative house of Saturn from Moon (1 to 12)
  let saturnHouseFromMoon = currentSaturnSignIndex - moonIndex + 1;
  if (saturnHouseFromMoon <= 0) saturnHouseFromMoon += 12;

  // Determine Sade Sati / Dhaiya Status
  let sadeSatiStatus: {
    type: 'rising' | 'peak' | 'setting' | 'dhaiya_4' | 'dhaiya_8' | 'free';
    title: string;
    hindiTitle: string;
    phaseNumber?: number;
    severity: 'high' | 'moderate' | 'mild' | 'none';
    bodyPart: string;
    description: string;
    duration: string;
    progressPercentage: number;
  };

  if (saturnHouseFromMoon === 12) {
    sadeSatiStatus = {
      type: 'rising',
      title: 'Phase 1: Rising Phase (Aadhyant चरण)',
      hindiTitle: 'साढ़े साती - प्रथम चरण (मस्तक/सिर पर प्रभाव)',
      phaseNumber: 1,
      severity: 'moderate',
      bodyPart: 'Head & Intellect (मस्तक)',
      description: 'Saturn transits the 12th house from your natal Moon. High expenditure, mental restlessness, sleeplessness, and unforeseen foreign travels or career shifts are indicated. Requires patience and emotional stability.',
      duration: 'April 2025 – June 2027',
      progressPercentage: 35,
    };
  } else if (saturnHouseFromMoon === 1) {
    sadeSatiStatus = {
      type: 'peak',
      title: 'Phase 2: Peak Core Phase (Madhya चरण)',
      hindiTitle: 'साढ़े साती - द्वितीय शिखर चरण (हृदय/छाती पर प्रभाव)',
      phaseNumber: 2,
      severity: 'high',
      bodyPart: 'Heart & Core (हृदय व अंतःकरण)',
      description: 'Saturn transits directly over your natal Moon. This is the pivotal test of character, resilience, and discipline. Deep karmic transformation in career, domestic peace, and emotional maturity. Humility brings maximum reward.',
      duration: 'January 2023 – March 2028',
      progressPercentage: 68,
    };
  } else if (saturnHouseFromMoon === 2) {
    sadeSatiStatus = {
      type: 'setting',
      title: 'Phase 3: Setting Phase (Antya चरण)',
      hindiTitle: 'साढ़े साती - तृतीय अंतिम चरण (पैरों/पाद पर प्रभाव)',
      phaseNumber: 3,
      severity: 'moderate',
      bodyPart: 'Feet & Wealth (पाद व धन स्थान)',
      description: 'Saturn transits the 2nd house from your natal Moon. Financial restructuring, speech moderation, and family obligations take center stage. Obstacles begin easing as Saturn prepares to grant long-term maturity and stabilization.',
      duration: 'March 2020 – April 2027',
      progressPercentage: 88,
    };
  } else if (saturnHouseFromMoon === 4) {
    sadeSatiStatus = {
      type: 'dhaiya_4',
      title: 'Kantaka Shani (Small Panoti / 4th Dhaiya)',
      hindiTitle: 'कंटक शनि ढैया (चतुर्थ भाव प्रभाव)',
      severity: 'moderate',
      bodyPart: 'Chest & Domestic Comfort (सुख स्थान)',
      description: 'Saturn transits the 4th house from natal Moon. Impacts domestic tranquility, property matters, vehicle caution, and maternal wellness. Maintain emotional peace and avoid rash property decisions.',
      duration: 'Active 2.5 Year Transit',
      progressPercentage: 55,
    };
  } else if (saturnHouseFromMoon === 8) {
    sadeSatiStatus = {
      type: 'dhaiya_8',
      title: 'Ashtama Shani (8th House Dhaiya)',
      hindiTitle: 'अष्टम शनि ढैया (आयु व आकस्मिक भाव प्रभाव)',
      severity: 'high',
      bodyPart: 'Pelvic & Sudden Transformation (अष्टम स्थान)',
      description: 'Saturn transits the 8th house from natal Moon. Demands deep spiritual surrender, disciplined health routines, and ethical conduct. Excellent for mystical research, occult studies, and eliminating chronic bad habits.',
      duration: 'Active 2.5 Year Transit',
      progressPercentage: 50,
    };
  } else {
    sadeSatiStatus = {
      type: 'free',
      title: 'Sade Sati Mukt (Free of Saturn Affliction)',
      hindiTitle: 'साढ़े साती एवं ढैया से पूर्णतः मुक्त',
      severity: 'none',
      bodyPart: 'Neutral & Auspicious Harmony',
      description: 'Rejoice! Your Moon sign is currently free from Saturn’s Sade Sati and Dhaiya. Saturn’s transits are neutral or favorable, making this an auspicious window for major new investments, marriage, and career expansion.',
      duration: 'Safe until next cycle',
      progressPercentage: 0,
    };
  }

  // Current Major Planetary Transits (2026-2027)
  const planetaryTransits = [
    {
      id: 'shani' as const,
      name: 'Saturn (Shani Dev)',
      hindiName: 'शनि देव गोचर',
      currentSign: 'Meena (Pisces)',
      houseFromMoon: saturnHouseFromMoon,
      dignity: 'Neutral Water Sign',
      status: saturnHouseFromMoon === 3 || saturnHouseFromMoon === 6 || saturnHouseFromMoon === 11 ? 'Highly Auspicious (3, 6, 11)' : 'Karmic Testing',
      rating: saturnHouseFromMoon === 3 || saturnHouseFromMoon === 6 || saturnHouseFromMoon === 11 ? 5 : 3,
      impact: `Transiting house #${saturnHouseFromMoon} from your Moon sign. Demands methodical discipline, perseverance, and ethical work ethic.`,
      keyRemedy: 'Recite Dasharatha Shani Stotram & light mustard oil diya under Peepal tree on Saturdays.',
      mantra: 'Om Sham Shanaishcharaya Namah (ॐ शं शनैश्चराय नमः)',
    },
    {
      id: 'guru' as const,
      name: 'Jupiter (Brihaspati / Guru)',
      hindiName: 'गुरु देव गोचर',
      currentSign: 'Mithuna (Gemini)',
      houseFromMoon: ((3 - moonIndex + 1 + 12) % 12) || 12,
      dignity: 'Friendly Intellectual Air Sign',
      status: 'Auspicious Amrit Drishti',
      rating: 5,
      impact: 'Jupiter casts divine 5th, 7th, and 9th benefic rays across your key life houses, offering wisdom, divine protection, and auspicious resolutions.',
      keyRemedy: 'Donate yellow split chickpeas (chana dal) or bananas to temple priests on Thursdays.',
      mantra: 'Om Gram Grim Graum Sah Gurave Namah (ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः)',
    },
    {
      id: 'rahu' as const,
      name: 'Rahu (North Node)',
      hindiName: 'राहु देव गोचर',
      currentSign: 'Kumbha (Aquarius)',
      houseFromMoon: ((11 - moonIndex + 1 + 12) % 12) || 12,
      dignity: 'Moolatrikona / Co-ruler',
      status: 'Sudden Shifts & Unconventional Gains',
      rating: 4,
      impact: 'Activates unconventional career networking, technological breakthroughs, and digital foreign collaborations.',
      keyRemedy: 'Feed birds with mixed grains (Satnaja) and avoid wearing dark blue clothing on Wednesdays.',
      mantra: 'Om Bhram Bhrim Bhraum Sah Rahave Namah (ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः)',
    },
    {
      id: 'ketu' as const,
      name: 'Ketu (South Node)',
      hindiName: 'केतु देव गोचर',
      currentSign: 'Simha (Leo)',
      houseFromMoon: ((5 - moonIndex + 1 + 12) % 12) || 12,
      dignity: 'Spiritual Fire Sign',
      status: 'Spiritual Detachment & Moksha Karaka',
      rating: 3,
      impact: 'Encourages internal introspection, detachment from petty office politics, and deepening of meditation practices.',
      keyRemedy: 'Feed street dogs with sweet chapati or biscuits on Tuesdays.',
      mantra: 'Om Stram Strim Straum Sah Ketave Namah (ॐ स्रां स्रीं स्रौं सः केतवे नमः)',
    },
    {
      id: 'surya' as const,
      name: 'Sun (Surya Bhagwan)',
      hindiName: 'सूर्य देव गोचर',
      currentSign: 'Kanya (Virgo) / Tula (Libra)',
      houseFromMoon: ((6 - moonIndex + 1 + 12) % 12) || 12,
      dignity: 'Royal Luminary',
      status: 'Authority & Vitality Transit',
      rating: 4,
      impact: 'Energizes leadership ability, government interactions, and fatherly blessings.',
      keyRemedy: 'Offer copper vessel water (Surya Arghya) with red kumkum every morning at sunrise.',
      mantra: 'Om Hram Hrim Hraum Sah Suryaya Namah (ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः)',
    },
  ];

  const activeTransitData = planetaryTransits.find((p) => p.id === selectedTransitPlanet) || planetaryTransits[0];

  const handlePlayMantra = (mantraText: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isPlayingMantra) {
      window.speechSynthesis.cancel();
      setIsPlayingMantra(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(mantraText);
    utterance.rate = 0.85;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlayingMantra(false);
    utterance.onerror = () => setIsPlayingMantra(false);
    setIsPlayingMantra(true);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      
      {/* Studio Header */}
      <div className="bg-gradient-to-r from-stone-900 via-[#131226] to-[#1F172E] border-2 border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>Classical Parashara Gochar & Sade Sati Engine</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-black text-stone-100 flex items-center gap-2">
              <span>Shani Sade Sati & Live Planetary Transits</span>
              <span className="text-xl">🪐</span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Real-time analysis of Saturn&apos;s 7.5-year cycle, Dhaiya, and ongoing transits across your <strong className="text-amber-300">{kundli.moonSign.sign} Moon sign</strong> and <strong className="text-amber-300">{kundli.ascendant.sign} Lagna</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onStartVoiceCall}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-stone-950 font-black text-xs shadow-lg shadow-emerald-500/25 transition transform hover:scale-105 active:scale-95"
            >
              <Phone className="w-4 h-4 fill-stone-950" />
              <span>Call Acharya About Transits</span>
            </button>

            <button
              onClick={() => onAskAstrologerAboutTransit(`How is current Saturn in Pisces and Sade Sati affecting my ${kundli.moonSign.sign} Moon chart?`)}
              className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-500/30 font-bold text-xs transition"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Ask in Chat</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. Primary Sade Sati Status Dial / Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Gauge Card (8 cols) */}
        <div className="lg:col-span-8 bg-stone-900/90 rounded-3xl border border-stone-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-stone-800 pb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-2xl ${
                sadeSatiStatus.severity === 'high' 
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40' 
                  : sadeSatiStatus.severity === 'moderate'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}>
                {sadeSatiStatus.severity === 'high' ? <Flame className="w-6 h-6 animate-pulse" /> : <ShieldCheck className="w-6 h-6" />}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Active Cycle Diagnosis</span>
                <h2 className="font-serif text-xl font-bold text-stone-100">{sadeSatiStatus.title}</h2>
                <div className="text-xs text-amber-300 font-serif">{sadeSatiStatus.hindiTitle}</div>
              </div>
            </div>

            <div className="text-right">
              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                sadeSatiStatus.severity === 'high'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : sadeSatiStatus.severity === 'moderate'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {sadeSatiStatus.severity.toUpperCase()} IMPACT
              </span>
            </div>
          </div>

          {/* Description & Impact */}
          <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 text-xs sm:text-sm text-stone-300 leading-relaxed">
            {sadeSatiStatus.description}
          </div>

          {/* 3-Phase Interactive Visual Timeline */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-300">
              <span>7.5-Year Sade Sati Phase Progress</span>
              <span className="font-mono text-amber-400">{sadeSatiStatus.duration}</span>
            </div>

            {/* Segmented Timeline */}
            <div className="grid grid-cols-3 gap-2">
              
              {/* Phase 1 */}
              <div className={`p-3 rounded-2xl border text-center transition ${
                sadeSatiStatus.phaseNumber === 1
                  ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-md shadow-amber-500/10'
                  : 'bg-stone-950/60 border-stone-800 text-stone-500'
              }`}>
                <div className="text-[10px] font-bold uppercase tracking-wider">Phase 1 (Rising)</div>
                <div className="text-xs font-semibold mt-1">12th House (सिर पर)</div>
                <div className="text-[10px] text-stone-400 mt-0.5">Expenses & Travels</div>
              </div>

              {/* Phase 2 */}
              <div className={`p-3 rounded-2xl border text-center transition ${
                sadeSatiStatus.phaseNumber === 2
                  ? 'bg-rose-500/20 border-rose-400 text-rose-200 shadow-md shadow-rose-500/10'
                  : 'bg-stone-950/60 border-stone-800 text-stone-500'
              }`}>
                <div className="text-[10px] font-bold uppercase tracking-wider">Phase 2 (Peak Core)</div>
                <div className="text-xs font-semibold mt-1">1st House (हृदय पर)</div>
                <div className="text-[10px] text-stone-400 mt-0.5">Karmic Crucible</div>
              </div>

              {/* Phase 3 */}
              <div className={`p-3 rounded-2xl border text-center transition ${
                sadeSatiStatus.phaseNumber === 3
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-md shadow-emerald-500/10'
                  : 'bg-stone-950/60 border-stone-800 text-stone-500'
              }`}>
                <div className="text-[10px] font-bold uppercase tracking-wider">Phase 3 (Setting)</div>
                <div className="text-xs font-semibold mt-1">2nd House (पैरों पर)</div>
                <div className="text-[10px] text-stone-400 mt-0.5">Finances & Stabilization</div>
              </div>

            </div>

            {/* Progress Bar */}
            <div className="w-full bg-stone-950 rounded-full h-3 overflow-hidden border border-stone-800 mt-2">
              <div
                className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 h-full rounded-full transition-all duration-1000 shadow"
                style={{ width: `${sadeSatiStatus.progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-stone-500 font-mono">
              <span>Cycle Initiation</span>
              <span>{sadeSatiStatus.progressPercentage}% Completed</span>
              <span>Complete Mukti</span>
            </div>
          </div>

          {/* Body Zone Anatomical Indicator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400">Anatomical Focus Area</span>
              <div className="text-xs font-bold text-amber-300">{sadeSatiStatus.bodyPart}</div>
              <p className="text-[11px] text-stone-400">
                Classical texts state Saturn’s transit focuses energy on this specific bodily and psychological center during this phase.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-stone-400">Golden Astrological Rule</span>
              <div className="text-xs font-bold text-emerald-400">Patience & Service (कर्म योग)</div>
              <p className="text-[11px] text-stone-400">
                Saturn rewards honesty, punctuality, and service to elders, laborers, and the needy without ego.
              </p>
            </div>
          </div>

        </div>

        {/* Right Sidebar: Recommended Upay & Action Hub (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Shani Pacification Upay Box */}
          <div className="bg-gradient-to-br from-stone-900 via-stone-900 to-[#181424] rounded-3xl border border-amber-500/30 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="font-serif text-base font-bold text-stone-100">
                Prescribed Shani Upay (उपाय)
              </h3>
            </div>

            {/* Beej Mantra Card */}
            <div className="p-4 rounded-2xl bg-stone-950 border border-amber-500/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-amber-400">Tantrik Beej Mantra</span>
                <button
                  onClick={() => handlePlayMantra('Om Sham Shanaishcharaya Namah')}
                  className="flex items-center gap-1 text-[10px] text-amber-300 hover:text-amber-200 font-bold transition"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isPlayingMantra ? 'Playing...' : 'Pronounce'}</span>
                </button>
              </div>
              <div className="font-serif text-sm font-bold text-amber-200">
                ॐ शं शनैश्चराय नमः
              </div>
              <div className="text-[11px] text-stone-400 italic">
                Chant 108 times daily facing West, ideally after sunset using a Rudraksha mala.
              </div>
            </div>

            {/* Specific Saturday Rituals */}
            <div className="space-y-2 text-xs text-stone-300">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Mustard Oil Lamp:</strong> Light a Diya under a Peepal or Shami tree on Saturday evenings.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Hanuman Chalisa:</strong> Recite 11 times on Tuesdays & Saturdays to neutralize malefic Saturn rays.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Charitable Giving (Daan):</strong> Donate black sesame seeds (til), whole black urad, or iron items to workers.</span>
              </div>
            </div>

            <button
              onClick={() => onAskAstrologerAboutTransit('Acharya ji, please prescribe a customized Shani remedy for my specific Dasha and chart.')}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-md transition"
            >
              Get Custom Astrologer Upay
            </button>
          </div>

          {/* Quick FAQ Card */}
          <div className="p-5 rounded-3xl bg-stone-900/80 border border-stone-800 text-xs space-y-3">
            <h4 className="font-serif font-bold text-stone-200 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-indigo-400" />
              <span>Is Sade Sati Always Harmful?</span>
            </h4>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              No! For Capricorn, Aquarius, Taurus, and Libra ascendants, Saturn is a Yogakaraka or Lagna lord. Sade Sati frequently delivers immense wealth, political rise, and career mastery during these years for disciplined natives.
            </p>
          </div>

        </div>

      </div>

      {/* 2. Live 2026-2027 Planetary Transits (Gochar Radar) */}
      <div className="bg-stone-900/90 rounded-3xl border border-stone-800 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-800 pb-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">Live Ephemeris Calculations</span>
            <h3 className="font-serif text-xl font-bold text-stone-100">
              Active Navagraha Transits (वर्तमान गोचर)
            </h3>
            <p className="text-xs text-stone-400">
              Calculated dynamically from your natal Moon sign: <strong className="text-amber-300">{kundli.moonSign.sign}</strong>
            </p>
          </div>

          {/* Planet Switcher Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-stone-950 p-1.5 rounded-2xl border border-stone-800 text-xs">
            {planetaryTransits.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedTransitPlanet(p.id)}
                className={`px-3 py-1.5 rounded-xl font-medium transition ${
                  selectedTransitPlanet === p.id
                    ? 'bg-amber-500 text-stone-950 font-bold shadow'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {p.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Planet Deep-Dive Spotlight Card */}
        <div className="p-6 rounded-2xl bg-stone-950 border border-indigo-500/20 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          <div className="md:col-span-4 space-y-2 border-r border-stone-800/80 pr-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🪐</span>
              <div>
                <h4 className="font-serif text-lg font-bold text-stone-100">{activeTransitData.name}</h4>
                <div className="text-xs text-amber-400 font-serif">{activeTransitData.hindiName}</div>
              </div>
            </div>

            <div className="space-y-1 text-xs text-stone-300 pt-2">
              <div>Transiting Sign: <strong className="text-indigo-300">{activeTransitData.currentSign}</strong></div>
              <div>House from Moon: <strong className="text-amber-300">House #{activeTransitData.houseFromMoon}</strong></div>
              <div>Dignity: <span className="text-stone-400">{activeTransitData.dignity}</span></div>
            </div>

            <div className="pt-2">
              <span className="inline-block px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-[11px] font-bold text-indigo-300">
                {activeTransitData.status}
              </span>
            </div>
          </div>

          <div className="md:col-span-8 space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400">Classical Gochar Impact</span>
              <p className="text-xs sm:text-sm text-stone-200 mt-1 leading-relaxed">
                {activeTransitData.impact}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-900/80 border border-stone-800 space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-400">Key Pacifying Upay</span>
              <p className="text-xs text-stone-300">{activeTransitData.keyRemedy}</p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="text-[11px] font-mono text-stone-400">
                Mantra: <span className="font-serif text-amber-300 font-semibold">{activeTransitData.mantra}</span>
              </div>
              <button
                onClick={() => handlePlayMantra(activeTransitData.mantra)}
                className="p-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-amber-300 transition"
                title="Play pronunciation"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
