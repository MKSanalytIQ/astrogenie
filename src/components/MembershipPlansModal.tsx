import React from 'react';
import { MembershipPlan } from '../types/astrology';
import { MEMBERSHIP_PLANS } from '../data/defaultKundlis';
import { X, Check, Crown, Sparkles, Shield, Star } from 'lucide-react';

interface MembershipPlansModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: MembershipPlan;
  onSelectPlan: (plan: MembershipPlan) => void;
}

export const MembershipPlansModal: React.FC<MembershipPlansModalProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onSelectPlan,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-[#0C101D] border border-amber-500/30 rounded-3xl p-6 sm:p-8 text-stone-100 shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            <Crown className="w-3.5 h-3.5" />
            <span>Personal Vedic Astrologer Membership</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-extrabold text-stone-100 tracking-tight">
            Your Dedicated Astrologer at Just ₹299 – ₹499/mo
          </h2>

          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            No more waiting days for temple appointments or paying ₹2,000+ per session. Get instant, deeply accurate Vedic counseling, Kundli matching, and remedies whenever you need guidance.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {MEMBERSHIP_PLANS.map((plan) => {
            const isCurrent = currentPlan.id === plan.id;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 flex flex-col justify-between transition-all ${
                  plan.isPopular
                    ? 'bg-gradient-to-b from-stone-900 via-amber-950/40 to-stone-900 border-2 border-amber-400 shadow-2xl shadow-amber-500/20 scale-105 z-10'
                    : 'bg-stone-900/80 border border-stone-800 hover:border-amber-500/40'
                }`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Star className="w-3 h-3 fill-stone-950" />
                    <span>Most Popular Choice</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-bold text-amber-400 tracking-wider">
                      {plan.sanskritName}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-stone-100">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-stone-400 mt-1">
                      {plan.tagline}
                    </p>
                  </div>

                  {/* Price Block */}
                  <div className="py-2 border-y border-stone-800">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-black text-amber-300 font-serif">
                        ₹{plan.pricePerMonth}
                      </span>
                      <span className="text-xs text-stone-400 font-medium">
                        / {plan.billingPeriod}
                      </span>
                      {plan.originalPrice && (
                        <span className="text-xs text-stone-500 line-through">
                          ₹{plan.originalPrice}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
                      {plan.consultationCredits}
                    </div>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-2.5 text-xs text-stone-300 pt-2">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Plan Selection Action */}
                <div className="pt-6 mt-4 border-t border-stone-800">
                  <button
                    onClick={() => {
                      onSelectPlan(plan);
                      onClose();
                    }}
                    className={`w-full py-3 rounded-2xl font-bold text-xs tracking-wide transition shadow-md ${
                      isCurrent
                        ? 'bg-stone-800 text-stone-300 cursor-default'
                        : plan.isPopular
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-amber-500/25'
                        : 'bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700'
                    }`}
                  >
                    {isCurrent ? 'Current Active Plan' : `Activate ${plan.name}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Satisfaction Guarantee */}
        <div className="mt-8 p-4 rounded-2xl bg-stone-950/60 border border-stone-800 flex items-center justify-between flex-wrap gap-4 text-xs text-stone-400">
          <div className="flex items-center gap-2 text-stone-300">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>100% Satisfaction & Vedic Accuracy Guarantee • Cancel Anytime with 1 Click</span>
          </div>
          <div className="flex items-center gap-3">
            <span>UPI, NetBanking, Debit/Credit Cards Accepted</span>
          </div>
        </div>
      </div>
    </div>
  );
};
