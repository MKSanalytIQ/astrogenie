import React from 'react';
import { VedicKundli } from '../types/astrology';
import { AstroGenieLogo } from './AstroGenieLogo';
import { X, Printer, Download, ShieldCheck, Award, Sparkles, CheckCircle2 } from 'lucide-react';

interface JanampatriPdfReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  kundli: VedicKundli;
}

export const JanampatriPdfReportModal: React.FC<JanampatriPdfReportModalProps> = ({
  isOpen,
  onClose,
  kundli,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-[#090D16] border border-amber-500/40 rounded-3xl p-6 sm:p-10 text-stone-100 shadow-2xl my-8">
        
        {/* Floating Controls Bar */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-6 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-wider">
              OFFICIAL ARCHIVAL DOSSIER
            </span>
            <span className="text-xs text-stone-500">•</span>
            <span className="text-xs text-stone-300">Document Ref: AG-JP-{kundli.birthDetails.dateOfBirth.replace(/-/g, '')}-782</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Archival Janampatri Document Body */}
        <div id="printable-janampatri" className="space-y-8 bg-[#0C101D] border-2 border-amber-500/30 rounded-2xl p-8 shadow-inner">
          
          {/* Cover Header */}
          <div className="text-center space-y-3 border-b-2 border-amber-500/30 pb-6 relative">
            <div className="flex justify-center">
              <AstroGenieLogo size="lg" />
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-black text-amber-300 tracking-tight">
              सम्पूर्ण वैदिक जन्मपत्रिका महाग्रन्थ
            </h1>
            <p className="text-xs uppercase tracking-widest text-stone-300 font-serif">
              Comprehensive Vedic Horoscope & Lifetime Astrological Destiny Dossier
            </p>
            <div className="inline-block px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
              Calculated on Lahiri Ayanamsha (Chitra Paksha) • Brihat Parashara Hora Shastra
            </div>
          </div>

          {/* Native Particulars Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-stone-950 border border-stone-800 text-xs">
            <div>
              <span className="text-[10px] text-stone-500 uppercase font-bold">Jataka (Native)</span>
              <div className="font-bold text-stone-100 text-sm">{kundli.birthDetails.name}</div>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 uppercase font-bold">Birth Date & Time</span>
              <div className="font-bold text-stone-100">{kundli.birthDetails.dateOfBirth} at {kundli.birthDetails.timeOfBirth}</div>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 uppercase font-bold">Place of Birth</span>
              <div className="font-bold text-stone-100">{kundli.birthDetails.placeOfBirth}</div>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 uppercase font-bold">Lagna (Ascendant)</span>
              <div className="font-bold text-amber-300">{kundli.ascendant.sign} ({kundli.ascendant.degree.toFixed(2)}°)</div>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 uppercase font-bold">Moon Sign (Rashi)</span>
              <div className="font-bold text-amber-300">{kundli.moonSign.sign}</div>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 uppercase font-bold">Moon Nakshatra</span>
              <div className="font-bold text-stone-100">{kundli.moonSign.nakshatra} (Pada {kundli.moonSign.pada})</div>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 uppercase font-bold">Sun Sign (Surya)</span>
              <div className="font-bold text-stone-100">{kundli.sunSign.sign}</div>
            </div>
            <div>
              <span className="text-[10px] text-stone-500 uppercase font-bold">Active Mahadasha</span>
              <div className="font-bold text-emerald-400">{kundli.currentDasha.mahadasha} - {kundli.currentDasha.antardasha}</div>
            </div>
          </div>

          {/* D-1 Lagna Vector Chart */}
          <div className="space-y-4">
            <h2 className="font-serif text-lg font-bold text-amber-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Lagna Kundli (D-1 Planetary Matrix)</span>
            </h2>

            {/* Diamond Chart Diagram */}
            <div className="max-w-[420px] mx-auto aspect-square bg-[#080C14] rounded-2xl border-2 border-amber-500/50 p-2 shadow-md flex items-center justify-center">
              <svg viewBox="0 0 400 400" className="w-full h-full select-none">
                <rect x="0" y="0" width="400" height="400" fill="#0C101D" stroke="#D97706" strokeWidth="2.5" />
                <line x1="0" y1="0" x2="400" y2="400" stroke="#B45309" strokeWidth="1.8" />
                <line x1="400" y1="0" x2="0" y2="400" stroke="#B45309" strokeWidth="1.8" />
                <polygon points="200,0 400,200 200,400 0,200" fill="none" stroke="#D97706" strokeWidth="2" />

                {/* Render Houses */}
                {kundli.houses.map((house) => {
                  const coords: Record<number, { x: number; y: number }> = {
                    1: { x: 200, y: 105 }, 2: { x: 100, y: 55 }, 3: { x: 55, y: 105 }, 4: { x: 105, y: 200 },
                    5: { x: 55, y: 295 }, 6: { x: 100, y: 345 }, 7: { x: 200, y: 295 }, 8: { x: 300, y: 345 },
                    9: { x: 345, y: 295 }, 10: { x: 295, y: 200 }, 11: { x: 345, y: 105 }, 12: { x: 300, y: 55 }
                  };
                  const pos = coords[house.houseNumber];
                  if (!pos) return null;
                  const planets = kundli.planets.filter((p) => p.house === house.houseNumber);

                  return (
                    <g key={house.houseNumber}>
                      <text x={pos.x} y={pos.y - 8} textAnchor="middle" className="text-[12px] font-serif font-bold fill-amber-300">
                        {house.signNumber}
                      </text>
                      <text x={pos.x} y={pos.y + 12} textAnchor="middle" className="text-[9px] font-mono fill-stone-200 font-semibold">
                        {planets.map((p) => p.name.slice(0, 2)).join(', ') || '—'}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Navagraha Planetary Table */}
          <div className="space-y-3">
            <h2 className="font-serif text-lg font-bold text-amber-300">
              Navagraha Planetary Positions & Dignities
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-800 text-stone-400 uppercase text-[9px]">
                    <th className="py-2 px-3">Graha</th>
                    <th className="py-2 px-3">Sign</th>
                    <th className="py-2 px-3">House</th>
                    <th className="py-2 px-3">Degree</th>
                    <th className="py-2 px-3">Nakshatra</th>
                    <th className="py-2 px-3">Dignity</th>
                    <th className="py-2 px-3">Motion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 font-sans">
                  {kundli.planets.map((p) => (
                    <tr key={p.name} className="hover:bg-stone-800/30">
                      <td className="py-2 px-3 font-bold text-amber-200">{p.name} ({p.englishName})</td>
                      <td className="py-2 px-3 text-stone-200">{p.sign}</td>
                      <td className="py-2 px-3 text-stone-300">House {p.house}</td>
                      <td className="py-2 px-3 text-stone-300 font-mono">{p.degree.toFixed(2)}°</td>
                      <td className="py-2 px-3 text-stone-300">{p.nakshatra} (Pada {p.pada})</td>
                      <td className="py-2 px-3 font-semibold text-emerald-400">{p.status}</td>
                      <td className="py-2 px-3 text-stone-400">{p.isRetrograde ? 'Vakri (Retro)' : 'Margi'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Official Astrological Seal & Stamp */}
          <div className="pt-6 border-t-2 border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="space-y-1 text-stone-400">
              <div className="flex items-center gap-1.5 text-stone-200 font-bold">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Certified Archival Vedic Jyotish Record</span>
              </div>
              <p className="text-[10px]">
                AstroGenie AI Astrological Computation Engine • Digital Verification Seal: #AG-VERIFIED-2026
              </p>
            </div>

            {/* Circular Gold Seal Motif */}
            <div className="w-24 h-24 rounded-full border-2 border-dashed border-amber-400 p-1 flex items-center justify-center text-center">
              <div className="w-full h-full rounded-full bg-amber-500/10 border border-amber-500/40 flex flex-col items-center justify-center text-[8px] font-bold text-amber-300 uppercase tracking-tighter">
                <span>ASTROGENIE</span>
                <span className="text-sm">🕉️</span>
                <span>AUTHENTIC</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
