import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, X, Clock, Flame } from 'lucide-react';

interface RevenueBannerProps {
  onClaimOffer: () => void;
}

export const RevenueBanner: React.FC<RevenueBannerProps> = ({ onClaimOffer }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="relative bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 text-stone-950 font-sans text-xs py-2 px-4 shadow-lg flex items-center justify-between select-none border-b border-amber-400/40">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
        
        {/* Left Teaser with Countdown */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1 font-black uppercase text-[10px] bg-stone-950 text-amber-300 px-2 py-0.5 rounded-full tracking-wider">
            <Flame className="w-3 h-3 fill-amber-300" />
            LIMITED TIME
          </span>
          <p className="font-semibold text-stone-950">
            <strong>Festive Muhurat Offer:</strong> Get <span className="underline font-bold">Kalyan Pro</span> at 40% OFF — Only <strong className="text-stone-950 bg-amber-300/60 px-1 rounded">₹299</strong> for your 1st month!
          </p>
        </div>

        {/* Center Countdown Timer */}
        <div className="hidden md:flex items-center gap-2 font-mono font-bold text-stone-950 text-[11px] bg-amber-400/50 px-2.5 py-0.5 rounded-lg border border-amber-900/20">
          <Clock className="w-3 h-3" />
          <span>Ends in: {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s</span>
        </div>

        {/* Action Button & Dismiss */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClaimOffer}
            className="px-3.5 py-1 rounded-xl bg-stone-950 hover:bg-stone-900 text-amber-300 font-bold text-[11px] flex items-center gap-1 shadow-sm transition hover:scale-105"
          >
            <span>Claim ₹299 Deal</span>
            <ArrowRight className="w-3 h-3" />
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 hover:bg-amber-700/40 rounded-full text-stone-950"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
