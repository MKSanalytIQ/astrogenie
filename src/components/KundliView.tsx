import React, { useState } from 'react';
import { VedicKundli, PlanetPosition, HouseInfo } from '../types/astrology';
import { Compass, Sparkles, Shield, AlertTriangle, CheckCircle, Info, Zap, Award } from 'lucide-react';

interface KundliViewProps {
  kundli: VedicKundli;
  onAskAstrologerAboutTopic: (topic: string) => void;
}

export const KundliView: React.FC<KundliViewProps> = ({
  kundli,
  onAskAstrologerAboutTopic,
}) => {
  const [selectedHouse, setSelectedHouse] = useState<number>(1);
  const [chartType, setChartType] = useState<'D1' | 'D9'>('D1');

  // Planet abbreviation lookup
  const planetAbbr: Record<string, string> = {
    Surya: 'Su (सूर्य)',
    Chandra: 'Mo (चन्द्र)',
    Mangal: 'Ma (मंगल)',
    Budha: 'Me (बुध)',
    Guru: 'Ju (गुरु)',
    Shukra: 'Ve (शुक्र)',
    Shani: 'Sa (शनि)',
    Rahu: 'Ra (राहु)',
    Ketu: 'Ke (केतु)',
  };

  // House coordinates on a 400x400 North Indian Kundli Canvas
  const houseCoordinates: Record<number, { textX: number; textY: number; labelX: number; labelY: number }> = {
    1: { textX: 200, textY: 105, labelX: 200, labelY: 135 }, // Top diamond
    2: { textX: 100, textY: 55, labelX: 100, labelY: 78 },   // Top-left triangle
    3: { textX: 55, textY: 105, labelX: 55, labelY: 125 },   // Upper-left corner
    4: { textX: 105, textY: 200, labelX: 105, labelY: 230 }, // Left diamond
    5: { textX: 55, textY: 295, labelX: 55, labelY: 315 },   // Lower-left corner
    6: { textX: 100, textY: 345, labelX: 100, labelY: 368 }, // Bottom-left triangle
    7: { textX: 200, textY: 295, labelX: 200, labelY: 325 }, // Bottom diamond
    8: { textX: 300, textY: 345, labelX: 300, labelY: 368 }, // Bottom-right triangle
    9: { textX: 345, textY: 295, labelX: 345, labelY: 315 }, // Lower-right corner
    10: { textX: 295, textY: 200, labelX: 295, labelY: 230 }, // Right diamond
    11: { textX: 345, textY: 105, labelX: 345, labelY: 125 }, // Upper-right corner
    12: { textX: 300, textY: 55, labelX: 300, labelY: 78 },  // Top-right triangle
  };

  const currentHouseInfo = kundli.houses.find((h) => h.houseNumber === selectedHouse) || kundli.houses[0];
  const planetsInCurrentHouse = kundli.planets.filter((p) => p.house === selectedHouse);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Native Kundli Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 border border-amber-500/25 p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-serif text-2xl md:text-3xl font-extrabold text-stone-100 tracking-tight">
                {kundli.birthDetails.name}&apos;s Vedic Janam Kundli
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {kundli.ascendant.sign} Lagna
              </span>
            </div>
            <p className="mt-1 text-sm text-stone-300 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>📅 {kundli.birthDetails.dateOfBirth} at {kundli.birthDetails.timeOfBirth}</span>
              <span>📍 {kundli.birthDetails.placeOfBirth}</span>
              <span>🌙 Moon: <strong className="text-amber-200">{kundli.moonSign.sign} ({kundli.moonSign.nakshatra})</strong></span>
              <span>☀️ Sun: <strong className="text-amber-200">{kundli.sunSign.sign}</strong></span>
            </p>
          </div>

          {/* Quick Dasha Pill */}
          <div className="bg-stone-950/80 border border-amber-500/30 px-4 py-3 rounded-2xl flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Compass className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                Current Vimshottari Dasha
              </div>
              <div className="text-sm font-bold text-stone-100">
                {kundli.currentDasha.mahadasha} - {kundli.currentDasha.antardasha} Dasha
              </div>
              <div className="text-[11px] text-stone-400">
                Active until {kundli.currentDasha.endsAt}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Kundli SVG + House Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive North Indian Diamond Chart (7 cols) */}
        <div className="lg:col-span-7 bg-stone-900/90 rounded-3xl border border-stone-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
                <span>North Indian Lagna Kundli (D-1)</span>
                <span className="text-xs font-sans text-amber-400/80 bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-500/20">
                  Interactive
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Click any of the 12 Bhavas (houses) to inspect resident planets, aspects, and planetary rulers.
              </p>
            </div>

            {/* Chart Type Toggle */}
            <div className="flex rounded-xl bg-stone-950 p-1 border border-stone-800 text-xs">
              <button
                onClick={() => setChartType('D1')}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  chartType === 'D1' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                D-1 Lagna
              </button>
              <button
                onClick={() => setChartType('D9')}
                className={`px-3 py-1 rounded-lg font-medium transition ${
                  chartType === 'D9' ? 'bg-amber-500 text-stone-950 font-bold' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                D-9 Navamsha
              </button>
            </div>
          </div>

          {/* SVG Diamond Kundli Canvas */}
          <div className="relative aspect-square max-w-[500px] mx-auto bg-[#090D16] rounded-2xl border-2 border-amber-500/40 p-2 shadow-2xl flex items-center justify-center">
            <svg
              viewBox="0 0 400 400"
              className="w-full h-full select-none"
              style={{ filter: 'drop-shadow(0 0 8px rgba(245, 158, 11, 0.15))' }}
            >
              {/* Outer Boundary Square */}
              <rect x="0" y="0" width="400" height="400" fill="#0C101D" stroke="#D97706" strokeWidth="2.5" />

              {/* Main Diagonals */}
              <line x1="0" y1="0" x2="400" y2="400" stroke="#B45309" strokeWidth="1.8" />
              <line x1="400" y1="0" x2="0" y2="400" stroke="#B45309" strokeWidth="1.8" />

              {/* Central Diamond connecting midpoints */}
              <polygon
                points="200,0 400,200 200,400 0,200"
                fill="none"
                stroke="#D97706"
                strokeWidth="2"
              />

              {/* House Highlight Overlay */}
              {selectedHouse === 1 && (
                <polygon points="200,0 300,100 200,200 100,100" fill="rgba(245, 158, 11, 0.15)" stroke="#F59E0B" strokeWidth="1.5" />
              )}
              {selectedHouse === 4 && (
                <polygon points="0,200 100,100 200,200 100,300" fill="rgba(245, 158, 11, 0.15)" stroke="#F59E0B" strokeWidth="1.5" />
              )}
              {selectedHouse === 7 && (
                <polygon points="200,200 300,300 200,400 100,300" fill="rgba(245, 158, 11, 0.15)" stroke="#F59E0B" strokeWidth="1.5" />
              )}
              {selectedHouse === 10 && (
                <polygon points="200,200 300,100 400,200 300,300" fill="rgba(245, 158, 11, 0.15)" stroke="#F59E0B" strokeWidth="1.5" />
              )}

              {/* Render 12 Houses content & click zones */}
              {kundli.houses.map((house) => {
                const pos = houseCoordinates[house.houseNumber];
                if (!pos) return null;
                const isSelected = selectedHouse === house.houseNumber;
                const planetsInside = kundli.planets.filter((p) => p.house === house.houseNumber);

                return (
                  <g
                    key={house.houseNumber}
                    onClick={() => setSelectedHouse(house.houseNumber)}
                    className="cursor-pointer group"
                  >
                    {/* Invisible Click Target Area */}
                    <circle cx={pos.textX} cy={pos.textY + 10} r="35" fill="transparent" />

                    {/* Rashi Sign Number Badge */}
                    <text
                      x={pos.textX}
                      y={pos.textY - 8}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={`text-[13px] font-bold font-serif transition-colors ${
                        isSelected ? 'fill-amber-300 font-extrabold' : 'fill-amber-400/90'
                      }`}
                    >
                      {house.signNumber}
                    </text>

                    {/* Resident Planets text */}
                    <text
                      x={pos.textX}
                      y={pos.textY + 12}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className={`text-[10px] font-mono tracking-tight font-medium ${
                        planetsInside.length > 0 ? 'fill-stone-100 font-semibold' : 'fill-stone-600'
                      }`}
                    >
                      {planetsInside.length > 0
                        ? planetsInside.map((p) => p.name.slice(0, 2)).join(', ')
                        : '—'}
                    </text>

                    {/* House Number Subscript */}
                    <text
                      x={pos.labelX}
                      y={pos.labelY}
                      textAnchor="middle"
                      className="text-[8px] fill-stone-500 font-sans tracking-widest opacity-80"
                    >
                      H{house.houseNumber}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Chart Legend */}
          <div className="flex flex-wrap items-center justify-between text-xs text-stone-400 pt-2 border-t border-stone-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>Numbers = Rashi Signs (1=Aries ... 12=Pisces)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold font-mono">Su, Mo, Ma...</span>
              <span>= Resident Grahas</span>
            </div>
          </div>
        </div>

        {/* Right Column: House Inspector & Planet Details (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Selected House Deep Dive */}
          <div className="bg-stone-900/90 rounded-3xl border border-amber-500/30 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  House Inspector
                </span>
                <h3 className="font-serif text-lg font-extrabold text-stone-100">
                  House {selectedHouse}: {currentHouseInfo.sanskritName}
                </h3>
              </div>
              <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-stone-950 text-amber-300 border border-stone-800">
                Sign: {currentHouseInfo.signName} ({currentHouseInfo.signLord})
              </span>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">
              <strong className="text-stone-200">Significance:</strong> {currentHouseInfo.significance}
            </p>

            {/* Resident Planets in this House */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-stone-200 uppercase tracking-wider">
                Planets in House {selectedHouse} ({planetsInCurrentHouse.length})
              </div>
              {planetsInCurrentHouse.length === 0 ? (
                <div className="p-3 rounded-2xl bg-stone-950/60 border border-stone-800/80 text-xs text-stone-400 italic">
                  No direct planetary residents. This house is governed by Lord{' '}
                  <strong className="text-amber-300">{currentHouseInfo.signLord}</strong> and aspected by benefic planets.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {planetsInCurrentHouse.map((p) => (
                    <div
                      key={p.name}
                      className="p-3 rounded-2xl bg-stone-950 border border-amber-500/20 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-300 text-sm flex items-center gap-1.5">
                          <span>{p.name} ({p.englishName})</span>
                          {p.isRetrograde && (
                            <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-mono">
                              (R) Retrograde
                            </span>
                          )}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          p.status === 'Exalted' || p.status === 'Own House'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : p.status === 'Debilitated'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-stone-800 text-stone-300'
                        }`}>
                          {p.status}
                        </span>
                      </div>
                      <div className="text-stone-300 flex items-center justify-between text-[11px]">
                        <span>Degree: {p.degree.toFixed(2)}° in {p.sign}</span>
                        <span>Nakshatra: {p.nakshatra} (Pada {p.pada})</span>
                      </div>
                      <p className="text-stone-400 text-[11px] leading-relaxed pt-1 border-t border-stone-800/60">
                        {p.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Ask Button */}
            <button
              onClick={() => onAskAstrologerAboutTopic(`How does House ${selectedHouse} (${currentHouseInfo.sanskritName}) impact my life and career?`)}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Acharya about House {selectedHouse}</span>
            </button>
          </div>

          {/* Dosha Status Gauges */}
          <div className="bg-stone-900/90 rounded-3xl border border-stone-800 p-6 shadow-xl space-y-4">
            <h3 className="font-serif text-md font-bold text-stone-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Major Vedic Dosha Diagnosis</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {/* Manglik Dosha */}
              <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-stone-200">Manglik Dosha</span>
                  {kundli.doshas.manglikDosha.cancellation ? (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                      <CheckCircle className="w-3 h-3" /> Cancelled
                    </span>
                  ) : kundli.doshas.manglikDosha.hasDosha ? (
                    <span className="flex items-center gap-1 text-[10px] text-amber-400 font-semibold">
                      <AlertTriangle className="w-3 h-3" /> Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                      <CheckCircle className="w-3 h-3" /> None
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-stone-400 line-clamp-2">
                  {kundli.doshas.manglikDosha.reason}
                </p>
              </div>

              {/* Sade Sati */}
              <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-stone-200">Shani Sade Sati</span>
                  {kundli.doshas.sadeSati.isActive ? (
                    <span className="flex items-center gap-1 text-[10px] text-amber-400 font-semibold">
                      <AlertTriangle className="w-3 h-3" /> In Progress
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                      <CheckCircle className="w-3 h-3" /> Inactive
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-stone-400 line-clamp-2">
                  {kundli.doshas.sadeSati.phase}
                </p>
              </div>

              {/* Kaal Sarp */}
              <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-stone-200">Kaal Sarp Dosha</span>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                    <CheckCircle className="w-3 h-3" /> {kundli.doshas.kaalSarpDosha.severity}
                  </span>
                </div>
                <p className="text-[10px] text-stone-400 line-clamp-2">
                  {kundli.doshas.kaalSarpDosha.recommendation}
                </p>
              </div>

              {/* Pitra Dosha */}
              <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-stone-200">Pitra Dosha</span>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                    <CheckCircle className="w-3 h-3" /> None
                  </span>
                </div>
                <p className="text-[10px] text-stone-400 line-clamp-2">
                  {kundli.doshas.pitraDosha.summary}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Navagraha Planetary Ephemeris Table */}
      <div className="bg-stone-900/90 rounded-3xl border border-stone-800 p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-stone-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Navagraha Planetary Positions & Nakshatra Pada</span>
            </h2>
            <p className="text-xs text-stone-400">
              Precise Lahiri Ayanamsha degrees, zodiac signs, and classical status for all 9 celestial grahas.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-800 text-stone-400 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 font-semibold">Graha (Planet)</th>
                <th className="py-3 px-4 font-semibold">Rashi (Sign)</th>
                <th className="py-3 px-4 font-semibold">Degree</th>
                <th className="py-3 px-4 font-semibold">House (Bhava)</th>
                <th className="py-3 px-4 font-semibold">Nakshatra & Pada</th>
                <th className="py-3 px-4 font-semibold">Dignity / Status</th>
                <th className="py-3 px-4 font-semibold">Motion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 font-sans">
              {kundli.planets.map((planet) => (
                <tr key={planet.name} className="hover:bg-stone-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-amber-200 flex items-center gap-2">
                    <span>{planetAbbr[planet.name] || planet.name}</span>
                  </td>
                  <td className="py-3 px-4 text-stone-200 font-medium">
                    {planet.sign} ({planet.signNumber})
                  </td>
                  <td className="py-3 px-4 text-stone-300 font-mono">
                    {planet.degree.toFixed(2)}°
                  </td>
                  <td className="py-3 px-4 text-stone-300">
                    House {planet.house}
                  </td>
                  <td className="py-3 px-4 text-stone-300">
                    {planet.nakshatra} <span className="text-amber-400/80 font-semibold">(Pada {planet.pada})</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                      planet.status === 'Exalted' || planet.status === 'Own House'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : planet.status === 'Debilitated'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-stone-800 text-stone-300'
                    }`}>
                      {planet.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {planet.isRetrograde ? (
                      <span className="text-rose-400 font-semibold flex items-center gap-1">
                        Vakri (Retrograde)
                      </span>
                    ) : (
                      <span className="text-stone-400">Margi (Direct)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Life Areas Predictions & Guidance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Career & Profession */}
        <div className="bg-stone-900/90 rounded-3xl border border-stone-800 p-6 space-y-3 shadow-xl hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
              10th House • Karma
            </span>
            <span className="text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
              {kundli.lifeAreas.career.score}% Score
            </span>
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-100">
            Career & Profession
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            {kundli.lifeAreas.career.summary}
          </p>
          <div className="text-[11px] text-amber-300/90 bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/20">
            <strong>Golden Period:</strong> {kundli.lifeAreas.career.favorablePeriods}
          </div>
          <button
            onClick={() => onAskAstrologerAboutTopic('Tell me about my career promotions and professional growth according to my 10th house.')}
            className="w-full text-center text-xs font-semibold text-amber-400 hover:text-amber-300 pt-2 border-t border-stone-800"
          >
            Counsel on Career →
          </button>
        </div>

        {/* Wealth & Business */}
        <div className="bg-stone-900/90 rounded-3xl border border-stone-800 p-6 space-y-3 shadow-xl hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
              2nd & 11th • Dhana
            </span>
            <span className="text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
              {kundli.lifeAreas.wealthAndBusiness.score}% Score
            </span>
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-100">
            Business & Wealth
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            {kundli.lifeAreas.wealthAndBusiness.summary}
          </p>
          <div className="text-[11px] text-amber-300/90 bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/20">
            <strong>Favored Assets:</strong> {kundli.lifeAreas.wealthAndBusiness.favorableInvestments}
          </div>
          <button
            onClick={() => onAskAstrologerAboutTopic('What does my chart say about starting a new business venture and financial growth?')}
            className="w-full text-center text-xs font-semibold text-amber-400 hover:text-amber-300 pt-2 border-t border-stone-800"
          >
            Counsel on Business →
          </button>
        </div>

        {/* Marriage & Relationships */}
        <div className="bg-stone-900/90 rounded-3xl border border-stone-800 p-6 space-y-3 shadow-xl hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
              7th House • Yuvati
            </span>
            <span className="text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
              {kundli.lifeAreas.marriageAndLove.score}% Score
            </span>
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-100">
            Marriage & Love
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            {kundli.lifeAreas.marriageAndLove.summary}
          </p>
          <div className="text-[11px] text-amber-300/90 bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/20">
            <strong>Marriage Window:</strong> {kundli.lifeAreas.marriageAndLove.timing}
          </div>
          <button
            onClick={() => onAskAstrologerAboutTopic('When is my marriage indicated in my horoscope and what qualities will my spouse have?')}
            className="w-full text-center text-xs font-semibold text-amber-400 hover:text-amber-300 pt-2 border-t border-stone-800"
          >
            Counsel on Marriage →
          </button>
        </div>

        {/* Health & Vitality */}
        <div className="bg-stone-900/90 rounded-3xl border border-stone-800 p-6 space-y-3 shadow-xl hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
              1st & 6th • Arogya
            </span>
            <span className="text-sm font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20">
              {kundli.lifeAreas.health.score}% Score
            </span>
          </div>
          <h3 className="font-serif text-lg font-bold text-stone-100">
            Health & Vitality
          </h3>
          <p className="text-xs text-stone-300 leading-relaxed">
            {kundli.lifeAreas.health.summary}
          </p>
          <div className="text-[11px] text-amber-300/90 bg-amber-950/40 p-2.5 rounded-xl border border-amber-500/20">
            <strong>Ayurvedic Tip:</strong> {kundli.lifeAreas.health.dietaryTips}
          </div>
          <button
            onClick={() => onAskAstrologerAboutTopic('What Vedic remedies and planetary precautions should I follow for health and vitality?')}
            className="w-full text-center text-xs font-semibold text-amber-400 hover:text-amber-300 pt-2 border-t border-stone-800"
          >
            Counsel on Health →
          </button>
        </div>

      </div>
    </div>
  );
};
