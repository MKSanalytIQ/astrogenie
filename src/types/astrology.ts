export type Gender = 'male' | 'female' | 'other';

export interface BirthDetails {
  name: string;
  gender: Gender;
  dateOfBirth: string; // YYYY-MM-DD
  timeOfBirth: string; // HH:mm
  placeOfBirth: string; // City, State, Country
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

export type PlanetName = 
  | 'Surya' // Sun
  | 'Chandra' // Moon
  | 'Mangal' // Mars
  | 'Budha' // Mercury
  | 'Guru' // Jupiter
  | 'Shukra' // Venus
  | 'Shani' // Saturn
  | 'Rahu' // North Node
  | 'Ketu'; // South Node

export type RashiSign = 
  | 'Mesha' // Aries
  | 'Vrishabha' // Taurus
  | 'Mithuna' // Gemini
  | 'Karka' // Cancer
  | 'Simha' // Leo
  | 'Kanya' // Virgo
  | 'Tula' // Libra
  | 'Vrishchika' // Scorpio
  | 'Dhanu' // Sagittarius
  | 'Makara' // Capricorn
  | 'Kumbha' // Aquarius
  | 'Meena'; // Pisces

export interface PlanetPosition {
  name: PlanetName;
  englishName: string;
  sign: RashiSign;
  signNumber: number; // 1 to 12
  house: number; // 1 to 12 (Tanu, Dhana, Sahaja, Sukha, Putra, Ari, Yuvati, Randhra, Dharma, Karma, Labha, Vyaya)
  degree: number;
  nakshatra: string;
  pada: number;
  isRetrograde: boolean;
  status: 'Exalted' | 'Debilitated' | 'Own House' | 'Friendly' | 'Neutral' | 'Enemy';
  description: string;
}

export interface HouseInfo {
  houseNumber: number; // 1 to 12
  sanskritName: string;
  significance: string; // e.g. Self, Wealth, Siblings, Mother/Property, Children, Enemies/Debts, Marriage/Partnership, Longevity, Luck/Spirituality, Career, Gains, Expenses/Moksha
  signNumber: number;
  signName: RashiSign;
  signLord: string;
  planetsInside: PlanetName[];
  favorablePlanets: string[];
}

export interface DashaPeriod {
  planet: PlanetName;
  startDate: string;
  endDate: string;
  status: 'Current' | 'Upcoming' | 'Past';
  nature: 'Auspicious' | 'Mixed' | 'Challenging';
  prediction: string;
}

export interface DoshaAnalysis {
  manglikDosha: {
    hasDosha: boolean;
    type: 'No Manglik' | 'Anshik (Partial) Manglik' | 'Poorna (Full) Manglik';
    reason: string;
    cancellation: boolean;
    cancellationReason?: string;
  };
  sadeSati: {
    isActive: boolean;
    phase: 'Rising (1st phase)' | 'Peak (2nd phase)' | 'Setting (3rd phase)' | 'Not in Sade Sati' | 'Dhaiyya (Small Panoti)';
    currentSaturnTransitSign: string;
    impact: string;
    remedyTips: string[];
  };
  kaalSarpDosha: {
    hasDosha: boolean;
    type?: string; // e.g. Anant, Kulik, Vasuki, Shankhpal
    severity: 'None' | 'Mild' | 'Moderate' | 'Severe';
    recommendation: string;
  };
  pitraDosha: {
    hasDosha: boolean;
    summary: string;
  };
}

export interface GemstoneRemedy {
  name: string;
  hindiName: string; // e.g. Pukhraj, Manik, Moti, Neelam, Panna
  planet: PlanetName;
  metal: string; // Gold, Silver, Copper, Panchdhatu
  finger: string; // Ring finger, Middle finger, Index finger, Little finger
  auspiciousDay: string; // Thursday, Sunday, Monday, Wednesday, Saturday
  idealWeight: string; // e.g. 5.25 to 7.25 Ratti
  mantra: string;
  benefits: string;
  warning?: string;
}

export interface MantraRemedy {
  title: string;
  deity: string;
  sanskritMantra: string;
  transliteration: string;
  meaning: string;
  targetPlanet: PlanetName;
  idealTime: string; // Brahma Muhurat, Evening, etc.
  repetitionCount: number; // e.g. 108
  audioSnippetName?: string;
}

export interface FastingRemedy {
  day: string; // e.g. Somvar (Monday), Brihaspativar (Thursday), Shaniwar (Saturday)
  associatedDeity: string;
  targetPlanet: PlanetName;
  ritualRules: string[];
  spiritualBenefit: string;
}

export interface CharityRemedy {
  title: string;
  itemsToDonate: string[];
  auspiciousDay: string;
  recipient: string; // Needy persons, temple, priests, cows/animals
  targetPlanetaryDosha: string;
}

export interface KundliRemedies {
  gemstones: GemstoneRemedy[];
  mantras: MantraRemedy[];
  fasting: FastingRemedy[];
  charities: CharityRemedy[];
  rudrakshaRecommendation: {
    mukhi: string; // e.g. "5 Mukhi + 7 Mukhi combo"
    rulingPlanet: string;
    benefits: string;
  };
  lifestyleUpay: string[];
}

export interface VedicKundli {
  id: string;
  userId?: string;
  birthDetails: BirthDetails;
  ascendant: {
    sign: RashiSign;
    signNumber: number;
    degree: number;
    lord: string;
    nakshatra: string;
    pada: number;
  };
  moonSign: {
    sign: RashiSign;
    signNumber: number;
    degree: number;
    lord: string;
    nakshatra: string;
    pada: number;
  };
  sunSign: {
    sign: RashiSign;
    signNumber: number;
    degree: number;
  };
  planets: PlanetPosition[];
  houses: HouseInfo[];
  currentDasha: {
    mahadasha: PlanetName;
    antardasha: PlanetName;
    pratyantardasha: PlanetName;
    endsAt: string;
    summary: string;
  };
  dashaTimeline: DashaPeriod[];
  doshas: DoshaAnalysis;
  remedies: KundliRemedies;
  lifeAreas: {
    career: { score: number; summary: string; favorablePeriods: string; cautionaryNote: string };
    wealthAndBusiness: { score: number; summary: string; favorableInvestments: string };
    marriageAndLove: { score: number; summary: string; partnerQualities: string; timing: string };
    health: { score: number; summary: string; vulnerableOrgans: string; dietaryTips: string };
  };
  createdAt: string;
}

// ----------------------------------------------------
// Kundli Matching (Gun Milan) Types
// ----------------------------------------------------
export interface AshtakootScore {
  name: string;
  hindiName: string;
  maximumPoints: number;
  obtainedPoints: number;
  area: string; // e.g. "Ego & Spiritual Compatibility", "Mutual Attraction", "Destiny & Health", "Sexual Compatibility", "Mental Compatibility", "Temperament", "Family Welfare & Prosperity", "Health & Genetic Compatibility"
  verdict: 'Excellent' | 'Good' | 'Average' | 'Challenging';
  explanation: string;
}

export interface MatchMakingResult {
  id: string;
  boyName: string;
  boyBirth: string;
  boyMoonSign: string;
  boyNakshatra: string;
  girlName: string;
  girlBirth: string;
  girlMoonSign: string;
  girlNakshatra: string;
  totalScore: number; // Out of 36
  minimumRequired: 18;
  compatibilityLevel: 'Exceptional (30-36)' | 'Very Auspicious (24-29)' | 'Acceptable (18-23)' | 'Inauspicious (<18)';
  manglikCompatibility: {
    boyManglik: boolean;
    girlManglik: boolean;
    verdict: string;
    remedyNeeded: boolean;
    remedyTips: string[];
  };
  nadiDosha: {
    hasNadiDosha: boolean;
    severity: string;
    cancellation: boolean;
    advice: string;
  };
  bhakootDosha: {
    hasBhakootDosha: boolean;
    advice: string;
  };
  scores: AshtakootScore[];
  counselorSummary: string;
  recommendedRituals: string[];
  createdAt: string;
}

// ----------------------------------------------------
// Horoscope & Muhurat Types
// ----------------------------------------------------
export interface DailyHoroscope {
  sign: RashiSign;
  englishSign: string;
  date: string;
  overallRating: number; // 1 to 5
  luckyNumber: number;
  luckyColor: string;
  luckyGem: string;
  rulingPlanet: string;
  predictions: {
    personal: string;
    career: string;
    finance: string;
    love: string;
    health: string;
  };
  shubhMuhuratToday: {
    abhijitMuhurat: string; // e.g. 11:45 AM - 12:35 PM
    amritKaal: string;
    shubhChoghadiya: string;
  };
  ashubhTimings: {
    rahuKaal: string; // e.g. 04:30 PM - 06:00 PM
    yamaganda: string;
    gulikaKaal: string;
  };
  dailyUpay: string;
}

export interface AuspiciousDate {
  date: string; // YYYY-MM-DD
  weekday: string;
  type: 'Highly Auspicious' | 'Auspicious' | 'Neutral' | 'Inauspicious / Avoid';
  category: 'Business / Signing' | 'Property / Vehicle' | 'Marriage / Engagement' | 'Gold / Luxury' | 'Travel' | 'General';
  tithi: string;
  nakshatra: string;
  reason: string;
  recommendedAction: string;
}

// ----------------------------------------------------
// Astrologer Chat / Consultation Types
// ----------------------------------------------------
export interface ChatMessage {
  id: string;
  sender: 'user' | 'astrologer';
  text: string;
  timestamp: string;
  category?: 'career' | 'business' | 'marriage' | 'health' | 'remedies' | 'general';
  suggestedUpay?: {
    mantra?: string;
    gemstone?: string;
    charity?: string;
    fasting?: string;
  };
  chartReference?: string; // e.g. "7th House Mars Aspect"
}

// ----------------------------------------------------
// Membership Plan Types (₹299 - ₹499/mo)
// ----------------------------------------------------
export interface MembershipPlan {
  id: 'starter' | 'pro' | 'annual';
  name: string;
  sanskritName: string;
  pricePerMonth: number;
  billingPeriod: 'month' | 'year';
  originalPrice?: number;
  tagline: string;
  isPopular?: boolean;
  features: string[];
  consultationCredits: string; // e.g. "10 sessions/mo" or "Unlimited 24/7"
  voiceModeEnabled: boolean;
  matchMakingQuota: string;
  muhuratAccess: string;
}
