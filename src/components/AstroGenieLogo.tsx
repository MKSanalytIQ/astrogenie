import React from 'react';

interface AstroGenieLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const AstroGenieLogo: React.FC<AstroGenieLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const sizeMap = {
    sm: { icon: 32, text: 'text-lg', sub: 'text-[9px]' },
    md: { icon: 42, text: 'text-xl', sub: 'text-[10px]' },
    lg: { icon: 56, text: 'text-2xl', sub: 'text-xs' },
    xl: { icon: 72, text: 'text-3xl', sub: 'text-sm' },
  };

  const current = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Mystical Vedic Emblem SVG */}
      <div className="relative flex-shrink-0 group cursor-pointer">
        {/* Soft Golden Halo Glow */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500/30 via-orange-500/25 to-yellow-400/30 rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-500" />
        
        <svg
          width={current.icon}
          height={current.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative drop-shadow-[0_0_12px_rgba(245,158,11,0.5)] transform transition duration-300 group-hover:scale-105"
        >
          <defs>
            {/* Molten Gold Gradient */}
            <linearGradient id="astroGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FDE68A" />
              <stop offset="35%" stopColor="#F59E0B" />
              <stop offset="70%" stopColor="#D97706" />
              <stop offset="100%" stopColor="#78350F" />
            </linearGradient>

            {/* Radiant Core Gradient */}
            <linearGradient id="celestialCore" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E1B4B" />
              <stop offset="50%" stopColor="#0B0F19" />
              <stop offset="100%" stopColor="#311042" />
            </linearGradient>

            {/* Glowing Accent */}
            <radialGradient id="sacredAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#D97706" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Outer Cosmic Boundary Circle */}
          <circle
            cx="50"
            cy="50"
            r="47"
            stroke="url(#astroGold)"
            strokeWidth="1.5"
            strokeDasharray="2 3"
            opacity="0.85"
          />

          {/* Inner Deep Sacred Backing */}
          <circle cx="50" cy="50" r="44" fill="url(#celestialCore)" />
          <circle cx="50" cy="50" r="44" fill="url(#sacredAura)" />

          {/* Authentic Vedic Kundli Diamond Yantra Geometry */}
          {/* Outer Diamond */}
          <polygon
            points="50,14 86,50 50,86 14,50"
            stroke="url(#astroGold)"
            strokeWidth="1.8"
            fill="none"
            opacity="0.9"
          />

          {/* Inner Square */}
          <polygon
            points="50,22 78,50 50,78 22,50"
            stroke="url(#astroGold)"
            strokeWidth="1.2"
            fill="none"
            opacity="0.6"
          />

          {/* Intersecting Cross Lines forming Vedic 12 Bhavas */}
          <line x1="50" y1="14" x2="50" y2="86" stroke="url(#astroGold)" strokeWidth="1.2" opacity="0.7" />
          <line x1="14" y1="50" x2="86" y2="50" stroke="url(#astroGold)" strokeWidth="1.2" opacity="0.7" />
          <line x1="22" y1="22" x2="78" y2="78" stroke="url(#astroGold)" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
          <line x1="78" y1="22" x2="22" y2="78" stroke="url(#astroGold)" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />

          {/* Elegant Celestial Crescent Moon Silhouette */}
          <path
            d="M50 28 C62 28 72 38 72 50 C72 62 62 72 50 72 C56 67 60 59 60 50 C60 41 56 33 50 28 Z"
            fill="url(#astroGold)"
            opacity="0.95"
          />

          {/* Central Radiant Star of Destiny (Navagraha Bindu) */}
          <circle cx="50" cy="50" r="3.5" fill="#FFFBEB" />
          <circle cx="50" cy="50" r="5" stroke="url(#astroGold)" strokeWidth="1" opacity="0.8" />

          {/* 4 Cardinal Sacred Star Rays */}
          <path d="M50 41 L51.2 48.8 L59 50 L51.2 51.2 L50 59 L48.8 51.2 L41 50 L48.8 48.8 Z" fill="#FDE68A" />

          {/* Navagraha Planetary Dots */}
          <circle cx="32" cy="32" r="1.8" fill="#FDE68A" opacity="0.9" />
          <circle cx="68" cy="32" r="1.8" fill="#F59E0B" opacity="0.9" />
          <circle cx="32" cy="68" r="1.8" fill="#D97706" opacity="0.9" />
          <circle cx="68" cy="68" r="1.8" fill="#FBBF24" opacity="0.9" />
        </svg>
      </div>

      {/* Typography Branding */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-serif tracking-tight font-extrabold ${current.text} bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent drop-shadow-sm`}
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              AstroGenie
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
              AI
            </span>
          </div>
          <span className={`text-stone-400 font-medium tracking-wider uppercase ${current.sub}`}>
            Personal Vedic Astrologer & Kundli Guide
          </span>
        </div>
      )}
    </div>
  );
};
