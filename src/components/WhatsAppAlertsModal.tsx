import React, { useState } from 'react';
import { X, CheckCircle2, Send, Bell, Smartphone, ShieldCheck, Sparkles } from 'lucide-react';
import { RashiSign } from '../types/astrology';

interface WhatsAppAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRashi?: string;
  nativeName?: string;
}

export const WhatsAppAlertsModal: React.FC<WhatsAppAlertsModalProps> = ({
  isOpen,
  onClose,
  defaultRashi = 'Tula',
  nativeName = 'Seeker',
}) => {
  const [phoneNumber, setPhoneNumber] = useState('+91 98765 43210');
  const [selectedRashi, setSelectedRashi] = useState<string>(defaultRashi);
  const [includeMuhurat, setIncludeMuhurat] = useState(true);
  const [includeRahuKaal, setIncludeRahuKaal] = useState(true);
  const [includeVratAlerts, setIncludeVratAlerts] = useState(true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  if (!isOpen) return null;

  // Format WhatsApp message text
  const sampleMessage = `🕉️ *AstroGenie Daily Vedic Bulletin* 🕉️\n\n` +
    `Namaste ${nativeName}! Here is your personalized cosmic forecast for today:\n\n` +
    `✨ *Rashi:* ${selectedRashi} (Moon Sign)\n` +
    `🌟 *Lucky Number:* 6 | *Lucky Color:* Pearl White & Gold\n\n` +
    `📅 *Today's Shubh Muhurat:*\n` +
    `• Abhijit Muhurat: 11:46 AM - 12:35 PM (Most auspicious)\n` +
    `• Amrit Kaal: 03:15 PM - 04:50 PM\n\n` +
    `⚠️ *Rahu Kaal to Avoid:*\n` +
    `• 04:30 PM - 06:00 PM (Do not sign contracts)\n\n` +
    `📿 *Today's Recommended Upay (उपाय):*\n` +
    `Offer a white flower to Goddess Lakshmi and recite "Om Shum Shukraya Namaha" 11 times.\n\n` +
    `_Have an auspicious and blessed day!_\n` +
    `_Powered by AstroGenie AI Vedic Astrologer_`;

  const handleLaunchWhatsApp = () => {
    const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
    const encodedText = encodeURIComponent(sampleMessage);
    const url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedText}`;
    window.open(url, '_blank');
    setIsSubscribed(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-[#0B0F19] border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-stone-100 shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubscribed ? (
          <div className="text-center py-8 space-y-4 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-3xl">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-100">
              WhatsApp Alerts Activated!
            </h2>
            <p className="text-xs text-stone-300 max-w-md mx-auto">
              You will receive your daily morning Panchang, Abhijit Muhurat, Rahu Kaal, and Upay alerts directly on <strong className="text-amber-300">{phoneNumber}</strong> every morning at 7:00 AM.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-2">
                <Smartphone className="w-3.5 h-3.5" />
                <span>Daily 7:00 AM WhatsApp Dispatch</span>
              </div>
              <h2 className="font-serif text-2xl font-bold text-stone-100">
                Receive Daily Panchang & Muhurat on WhatsApp
              </h2>
              <p className="text-xs text-stone-400">
                Never start an important meeting in Rahu Kaal or miss an auspicious Abhijit Muhurat window.
              </p>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  WhatsApp Mobile Number
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Your Moon Sign (Rashi)
                </label>
                <select
                  value={selectedRashi}
                  onChange={(e) => setSelectedRashi(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:border-amber-400 focus:outline-none"
                >
                  {['Mesha (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)', 'Karka (Cancer)', 'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrishchika (Scorpio)', 'Dhanu (Sagittarius)', 'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)'].map((r) => (
                    <option key={r} value={r.split(' ')[0]}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-2 p-3.5 rounded-2xl bg-stone-950 border border-stone-800 text-xs">
              <span className="font-bold text-stone-300 block mb-1">Included in Your Daily Dispatch:</span>
              <label className="flex items-center gap-2 text-stone-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeMuhurat}
                  onChange={(e) => setIncludeMuhurat(e.target.checked)}
                  className="rounded text-amber-500"
                />
                <span>Daily Abhijit Muhurat & Amrit Kaal timings</span>
              </label>
              <label className="flex items-center gap-2 text-stone-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeRahuKaal}
                  onChange={(e) => setIncludeRahuKaal(e.target.checked)}
                  className="rounded text-amber-500"
                />
                <span>Rahu Kaal & Inauspicious hours caution alerts</span>
              </label>
              <label className="flex items-center gap-2 text-stone-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeVratAlerts}
                  onChange={(e) => setIncludeVratAlerts(e.target.checked)}
                  className="rounded text-amber-500"
                />
                <span>Ekadashi, Pradosh & Purnima fasting reminders</span>
              </label>
            </div>

            {/* Live WhatsApp Bubble Preview */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>📱 Live WhatsApp Preview</span>
              </span>
              <div className="p-4 rounded-2xl bg-[#0D1418] border border-emerald-900/60 font-sans text-xs text-stone-200 leading-relaxed space-y-1">
                <div className="p-3 rounded-2xl bg-[#005C4B]/80 text-stone-100 shadow-sm border border-emerald-700/40 whitespace-pre-line text-[11px]">
                  {sampleMessage}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero Spam Guarantee • Cancel anytime via WhatsApp</span>
              </div>

              <button
                onClick={handleLaunchWhatsApp}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Activate WhatsApp Alerts & Test Now</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
