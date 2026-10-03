import { AddonService } from '../types/saas';

export const ADDON_SERVICES: AddonService[] = [
  {
    id: 'addon-janampatri-pdf',
    title: '35+ Page Comprehensive Janampatri Dossier',
    sanskritTitle: 'सम्पूर्ण जन्मपत्रिका महाग्रन्थ',
    description: 'A museum-quality, high-resolution printable PDF dossier covering your complete birth chart, all 12 Bhavas, Navamsha, Vimshottari Dasha timeline through age 80, and customized remedies.',
    originalPrice: 499,
    salePrice: 149,
    type: 'report_pdf',
    icon: '📜',
    badge: 'BESTSELLER',
    deliveryTime: 'Instant Digital Download (PDF)',
    features: [
      'North Indian & South Indian Kundli Vector Diagrams',
      'Exhaustive planetary dignity & Shadbala strength breakdown',
      'Year-by-year Vimshottari Mahadasha & Antardasha forecasts',
      'Life area deep-dives: Career, Wealth, Marriage & Health',
      'Curated gemstone, mantra, and fasting prescription stamp'
    ]
  },
  {
    id: 'addon-milan-pdf',
    title: 'Executive Matrimonial Milan Dossier (Kundli Matching)',
    sanskritTitle: 'वर-कन्या गुण मिलान प्रमाण पत्र',
    description: 'Complete 36 Gunas Ashtakoot analysis with Manglik & Nadi Dosha cancellation certificate, progeny prospects, and pre-marital harmonizing rituals for family elders.',
    originalPrice: 599,
    salePrice: 199,
    type: 'matchmaking_pdf',
    icon: '💍',
    badge: 'POPULAR FOR WEDDINGS',
    deliveryTime: 'Instant Download (PDF)',
    features: [
      'Official 36 Gunas score breakdown with Sanskrit shlokas',
      'Manglik Dosha deep dive & classical cancellation clause',
      'Emotional, financial, and sexual intimacy compatibility',
      'Progeny & family harmony astrological forecast',
      'Auspicious wedding Muhurat dates for 2026-2027'
    ]
  },
  {
    id: 'addon-urgent-credits',
    title: '10 Urgent Priority Consultation Tokens',
    sanskritTitle: 'त्वरित गुरु संवाद टोकन',
    description: 'Direct VIP access token queue for critical, time-sensitive decisions (e.g. job offer acceptance, property agreement signing, or relationship conflicts).',
    originalPrice: 299,
    salePrice: 99,
    type: 'urgent_credits',
    icon: '⚡',
    badge: 'INSTANT ACTIVATION',
    deliveryTime: 'Added to your Wallet instantly',
    features: [
      '10 Priority in-depth consultations with Acharya AstroGenie',
      'Instant deep reasoning with Jaimini & Parashara analysis',
      'Prescribed custom Beej Mantra & emergency Upay',
      'Never expires; valid across all saved Kundlis'
    ]
  },
  {
    id: 'addon-navagraha-puja',
    title: 'Navagraha Shanti & Sankalp Puja by Vedic Priests',
    sanskritTitle: 'नवग्रह शान्ति एवं वैदिक संकल्प पूजा',
    description: 'Personalized Vedic Havan conducted in your name and Gotra at holy Kashi/Haridwar by certified Acharyas to pacify malefic planetary transits (Shani, Rahu, Mangal).',
    originalPrice: 2499,
    salePrice: 999,
    type: 'puja_booking',
    icon: '🔥',
    badge: 'HOLY RITUAL',
    deliveryTime: 'Completed within 48 hours + Video recording',
    features: [
      'Live personalized Sankalp with your Name & Janam Nakshatra',
      'Chanting of 10,000+ Vedic Moola Mantras by 3 Pandits',
      'Private HD Video recording & photo proof sent via email',
      'Energized silver coin & consecrated Raksha Sutra couriered'
    ]
  }
];
