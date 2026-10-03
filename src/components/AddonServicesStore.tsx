import React from 'react';
import { ADDON_SERVICES } from '../data/addonServices';
import { AddonService } from '../types/saas';
import { Sparkles, Shield, ArrowRight, Check, Flame } from 'lucide-react';

interface AddonServicesStoreProps {
  onSelectItemForCheckout: (service: AddonService) => void;
  onPreviewReport: () => void;
}

export const AddonServicesStore: React.FC<AddonServicesStoreProps> = ({
  onSelectItemForCheckout,
  onPreviewReport,
}) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-stone-900 via-amber-950/40 to-stone-900 border border-amber-500/30 p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Vedic Astrological Store & Dossiers</span>
            </div>
            <h1 className="font-serif text-2xl md:text-3xl font-extrabold text-stone-100 tracking-tight">
              Premium Astrological Dossiers & Sacred Pujas
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              Unlock archival lifetime Janampatri reports, official 36-Guna wedding certificates, emergency consultation tokens, and live Vedic havan bookings.
            </p>
          </div>

          <button
            onClick={onPreviewReport}
            className="flex-shrink-0 px-5 py-3 rounded-2xl bg-stone-950 border border-amber-500/40 hover:border-amber-400 text-amber-300 text-xs font-bold tracking-wide transition shadow-sm hover:shadow-amber-500/20"
          >
            Preview Janampatri Sample Dossier →
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ADDON_SERVICES.map((srv) => (
          <div
            key={srv.id}
            className="bg-stone-900/90 rounded-3xl border border-stone-800 hover:border-amber-500/40 p-6 flex flex-col justify-between shadow-xl transition-all group"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl flex-shrink-0">
                    {srv.icon}
                  </div>
                  <div>
                    {srv.badge && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-1">
                        <Flame className="w-2.5 h-2.5 fill-amber-400" />
                        {srv.badge}
                      </span>
                    )}
                    <h3 className="font-serif text-lg font-bold text-stone-100 group-hover:text-amber-200 transition">
                      {srv.title}
                    </h3>
                    <div className="text-[11px] text-amber-400 font-medium">
                      {srv.sanskritTitle}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-stone-300 leading-relaxed">
                {srv.description}
              </p>

              {/* Feature Checklist */}
              <ul className="space-y-2 text-xs text-stone-400 pt-2 border-t border-stone-800/80">
                {srv.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Price & Buy Action */}
            <div className="pt-6 mt-4 border-t border-stone-800 flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-amber-300 font-serif">
                    ₹{srv.salePrice}
                  </span>
                  <span className="text-xs text-stone-500 line-through">
                    ₹{srv.originalPrice}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    Save {Math.round((1 - srv.salePrice / srv.originalPrice) * 100)}%
                  </span>
                </div>
                <span className="text-[10px] text-stone-400">{srv.deliveryTime}</span>
              </div>

              <button
                onClick={() => onSelectItemForCheckout(srv)}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs tracking-wide shadow-md shadow-amber-500/20 transition flex items-center gap-1.5"
              >
                <span>Order Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Trust & Vedic Authenticity Stamp */}
      <div className="p-6 rounded-3xl bg-stone-950/70 border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <span>
            Every Janampatri and Vedic Havan is verified by authentic Jyotish Acharyas adhering to Lahiri Ayanamsha and classical Brihat Parashara Hora Shastra.
          </span>
        </div>
        <span className="font-mono text-amber-400 font-bold flex-shrink-0">
          100% Guaranteed Satisfaction
        </span>
      </div>
    </div>
  );
};
