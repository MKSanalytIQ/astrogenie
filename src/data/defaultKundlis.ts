import { VedicKundli, MatchMakingResult, DailyHoroscope, AuspiciousDate, MembershipPlan } from '../types/astrology';

export const SAMPLE_KUNDLIS: VedicKundli[] = [
  {
    id: 'kundli-rahul-1',
    birthDetails: {
      name: 'Rahul Sharma',
      gender: 'male',
      dateOfBirth: '1995-10-14',
      timeOfBirth: '07:30',
      placeOfBirth: 'New Delhi, Delhi, India',
      latitude: 28.6139,
      longitude: 77.2090,
      timezone: 'Asia/Kolkata'
    },
    ascendant: {
      sign: 'Tula', // Libra
      signNumber: 7,
      degree: 14.28,
      lord: 'Shukra (Venus)',
      nakshatra: 'Swati',
      pada: 3
    },
    moonSign: {
      sign: 'Mithuna', // Gemini
      signNumber: 3,
      degree: 8.42,
      lord: 'Budha (Mercury)',
      nakshatra: 'Ardra',
      pada: 1
    },
    sunSign: {
      sign: 'Kanya', // Virgo
      signNumber: 6,
      degree: 26.5
    },
    planets: [
      {
        name: 'Surya',
        englishName: 'Sun',
        sign: 'Kanya',
        signNumber: 6,
        house: 12,
        degree: 26.50,
        nakshatra: 'Chitra',
        pada: 1,
        isRetrograde: false,
        status: 'Neutral',
        description: 'Sun in 12th house indicates interest in international opportunities, research, and quiet introspection.'
      },
      {
        name: 'Chandra',
        englishName: 'Moon',
        sign: 'Mithuna',
        signNumber: 3,
        house: 9,
        degree: 8.42,
        nakshatra: 'Ardra',
        pada: 1,
        isRetrograde: false,
        status: 'Friendly',
        description: 'Moon in 9th house bestows keen philosophical mind, high ethical values, and fortune through higher learning.'
      },
      {
        name: 'Mangal',
        englishName: 'Mars',
        sign: 'Vrishchika',
        signNumber: 8,
        house: 2,
        degree: 19.12,
        nakshatra: 'Jyeshtha',
        pada: 2,
        isRetrograde: false,
        status: 'Own House',
        description: 'Mars in own 2nd house generates strong wealth-accumulation drive and decisive communication style.'
      },
      {
        name: 'Budha',
        englishName: 'Mercury',
        sign: 'Kanya',
        signNumber: 6,
        house: 12,
        degree: 18.05,
        nakshatra: 'Hasta',
        pada: 3,
        isRetrograde: false,
        status: 'Exalted',
        description: 'Exalted Mercury gives formidable analytical intellect, mathematical talent, and business acumen.'
      },
      {
        name: 'Guru',
        englishName: 'Jupiter',
        sign: 'Vrishchika',
        signNumber: 8,
        house: 2,
        degree: 12.30,
        nakshatra: 'Anuradha',
        pada: 3,
        isRetrograde: false,
        status: 'Friendly',
        description: 'Jupiter in 2nd house (Dhana Bhava) creates auspicious Dhana Yoga, blessing family prosperity and sweet speech.'
      },
      {
        name: 'Shukra',
        englishName: 'Venus',
        sign: 'Tula',
        signNumber: 7,
        house: 1,
        degree: 14.28,
        nakshatra: 'Swati',
        pada: 3,
        isRetrograde: false,
        status: 'Own House',
        description: 'Malavya Mahapurusha Yoga! Venus in Lagna grants charismatic presence, refined taste, artistic appreciation, and radiant charm.'
      },
      {
        name: 'Shani',
        englishName: 'Saturn',
        sign: 'Kumbha',
        signNumber: 11,
        house: 5,
        degree: 24.18,
        nakshatra: 'Purva Bhadrapada',
        pada: 2,
        isRetrograde: true,
        status: 'Own House',
        description: 'Sasa Mahapurusha Yoga potential; Saturn in 5th fosters deep discipline in strategic planning and long-term investments.'
      },
      {
        name: 'Rahu',
        englishName: 'North Node',
        sign: 'Tula',
        signNumber: 7,
        house: 1,
        degree: 3.15,
        nakshatra: 'Chitra',
        pada: 3,
        isRetrograde: true,
        status: 'Friendly',
        description: 'Rahu in 1st house fuels ambition to stand out, explore foreign cultures, and pioneer innovative technology fields.'
      },
      {
        name: 'Ketu',
        englishName: 'South Node',
        sign: 'Mesha',
        signNumber: 1,
        house: 7,
        degree: 3.15,
        nakshatra: 'Ashwini',
        pada: 1,
        isRetrograde: true,
        status: 'Neutral',
        description: 'Ketu in 7th requires conscious effort towards emotional grounding and transparent communication in romantic partnerships.'
      }
    ],
    houses: [
      { houseNumber: 1, sanskritName: 'Tanu Bhava (Self & Vitality)', significance: 'Physique, temperament, longevity, life path', signNumber: 7, signName: 'Tula', signLord: 'Shukra', planetsInside: ['Shukra', 'Rahu'], favorablePlanets: ['Shukra', 'Shani', 'Budha'] },
      { houseNumber: 2, sanskritName: 'Dhana Bhava (Wealth & Speech)', significance: 'Liquid assets, family lineage, speech', signNumber: 8, signName: 'Vrishchika', signLord: 'Mangal', planetsInside: ['Mangal', 'Guru'], favorablePlanets: ['Guru', 'Chandra'] },
      { houseNumber: 3, sanskritName: 'Sahaja Bhava (Siblings & Courage)', significance: 'Courage, short journeys, writing, younger siblings', signNumber: 9, signName: 'Dhanu', signLord: 'Guru', planetsInside: [], favorablePlanets: ['Mangal', 'Surya'] },
      { houseNumber: 4, sanskritName: 'Sukha Bhava (Mother & Property)', significance: 'Mother, real estate, vehicles, inner happiness', signNumber: 10, signName: 'Makara', signLord: 'Shani', planetsInside: [], favorablePlanets: ['Shukra', 'Budha'] },
      { houseNumber: 5, sanskritName: 'Putra Bhava (Children & Intelligence)', significance: 'Intellect, romance, past-life merits (Purva Punya), speculation', signNumber: 11, signName: 'Kumbha', signLord: 'Shani', planetsInside: ['Shani'], favorablePlanets: ['Budha', 'Shukra'] },
      { houseNumber: 6, sanskritName: 'Ari Bhava (Debts & Competitions)', significance: 'Enemies, health challenges, litigation, daily work', signNumber: 12, signName: 'Meena', signLord: 'Guru', planetsInside: [], favorablePlanets: ['Mangal', 'Shani'] },
      { houseNumber: 7, sanskritName: 'Yuvati Bhava (Spouse & Partnership)', significance: 'Marriage partner, business alliances, public interactions', signNumber: 1, signName: 'Mesha', signLord: 'Mangal', planetsInside: ['Ketu'], favorablePlanets: ['Shukra', 'Guru'] },
      { houseNumber: 8, sanskritName: 'Randhra Bhava (Transformation & Secrets)', significance: 'Longevity, occult, inheritance, sudden transformations', signNumber: 2, signName: 'Vrishabha', signLord: 'Shukra', planetsInside: [], favorablePlanets: ['Shani', 'Budha'] },
      { houseNumber: 9, sanskritName: 'Dharma Bhava (Fortune & Higher Wisdom)', significance: 'Fortune (Bhagya), guru, pilgrimage, higher knowledge', signNumber: 3, signName: 'Mithuna', signLord: 'Budha', planetsInside: ['Chandra'], favorablePlanets: ['Guru', 'Surya'] },
      { houseNumber: 10, sanskritName: 'Karma Bhava (Career & Status)', significance: 'Profession, fame, leadership, public prestige', signNumber: 4, signName: 'Karka', signLord: 'Chandra', planetsInside: [], favorablePlanets: ['Surya', 'Mangal', 'Guru'] },
      { houseNumber: 11, sanskritName: 'Labha Bhava (Gains & Social Network)', significance: 'Gains, fulfillment of desires, elder siblings, network', signNumber: 5, signName: 'Simha', signLord: 'Surya', planetsInside: [], favorablePlanets: ['Budha', 'Shukra', 'Shani'] },
      { houseNumber: 12, sanskritName: 'Vyaya Bhava (Moksha & Foreign Travel)', significance: 'Expenditures, foreign settlements, meditation, spiritual release', signNumber: 6, signName: 'Kanya', signLord: 'Budha', planetsInside: ['Surya', 'Budha'], favorablePlanets: ['Guru', 'Ketu'] }
    ],
    currentDasha: {
      mahadasha: 'Guru',
      antardasha: 'Shani',
      pratyantardasha: 'Budha',
      endsAt: '2027-08-15',
      summary: 'Guru-Shani period activates 2nd & 5th houses. Favorable for consolidations of investments, career advancements, and professional mentorship.'
    },
    dashaTimeline: [
      { planet: 'Rahu', startDate: '2005-03-10', endDate: '2023-03-10', status: 'Past', nature: 'Mixed', prediction: 'Transformative period with extensive exploration and technical education.' },
      { planet: 'Guru', startDate: '2023-03-10', endDate: '2039-03-10', status: 'Current', nature: 'Auspicious', prediction: 'Golden 16-year window for wealth generation, spiritual elevation, and matrimonial bliss.' },
      { planet: 'Shani', startDate: '2039-03-10', endDate: '2058-03-10', status: 'Upcoming', nature: 'Auspicious', prediction: 'Authoritative era establishing lasting public institutions and stable enterprise.' }
    ],
    doshas: {
      manglikDosha: {
        hasDosha: true,
        type: 'Anshik (Partial) Manglik',
        reason: 'Mars resides in 2nd house in Scorpio (its own sign).',
        cancellation: true,
        cancellationReason: 'Mars is placed in its own sign (Swakshetra Scorpio), which according to classical Shlokas cancels the severe malefic effects of Kuja Dosha.'
      },
      sadeSati: {
        isActive: false,
        phase: 'Not in Sade Sati',
        currentSaturnTransitSign: 'Aquarius (Kumbha)',
        impact: 'Moon is in Mithuna (Gemini); Saturn is in Aquarius (9th from Moon). You are completely free of Sade Sati until 2030.',
        remedyTips: [
          'Chant Hanuman Chalisa every Tuesday to preserve protective martial energy.',
          'Support elder mentors and respect lineage traditions.'
        ]
      },
      kaalSarpDosha: {
        hasDosha: false,
        severity: 'None',
        recommendation: 'Planets are freely distributed across both sides of the nodal axis. No Kaal Sarp Dosha present.'
      },
      pitraDosha: {
        hasDosha: false,
        summary: 'Sun in 12th is conjunct exalted Mercury, forming Budhaditya Yoga; ancestral blessings are intact.'
      }
    },
    remedies: {
      gemstones: [
        {
          name: 'White Zircon or Diamond (Heera)',
          hindiName: 'Heera / Safed Zircon',
          planet: 'Shukra',
          metal: 'Platinum or Silver',
          finger: 'Middle or Little Finger of right hand',
          auspiciousDay: 'Friday morning during Shukla Paksha',
          idealWeight: '0.75 - 1.5 Carats (or 4-6 Ratti Zircon)',
          mantra: 'Om Shum Shukraya Namaha (ॐ शुं शुक्राय नमः)',
          benefits: 'Enhances magnetic charisma, financial luck, relationship harmony, and creative excellence.',
          warning: 'Ensure gemstone is completely natural and unheated without cracks.'
        },
        {
          name: 'Yellow Sapphire (Pukhraj)',
          hindiName: 'Pukhraj',
          planet: 'Guru',
          metal: '22K Gold or Panchdhatu',
          finger: 'Index finger (Tarjani) of right hand',
          auspiciousDay: 'Thursday morning in Pushya or Punarvasu Nakshatra',
          idealWeight: '5.25 to 7.25 Ratti',
          mantra: 'Om Brim Brihaspataye Namaha (ॐ बृं बृहस्पतये नमः)',
          benefits: 'Ignites business prosperity, divine wisdom, leadership clarity, and marital happiness.'
        }
      ],
      mantras: [
        {
          title: 'Maha Mrityunjaya Mantra',
          deity: 'Lord Shiva',
          sanskritMantra: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् ॥',
          transliteration: 'Om Tryambakam Yajamahe Sugandhim Pushti-Vardhanam | Urvarukamiva Bandhanan Mrityor Mukshiya Maamritat ||',
          meaning: 'We meditate upon the Three-Eyed Lord who nourishes all beings. May He liberate us from death and distress, granting divine immortality.',
          targetPlanet: 'Chandra',
          idealTime: 'Brahma Muhurat (05:00 AM - 06:30 AM)',
          repetitionCount: 108
        },
        {
          title: 'Brihaspati Beej Mantra',
          deity: 'Guru Devta',
          sanskritMantra: 'ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः ॥',
          transliteration: 'Om Graam Greem Graum Sah Gurave Namaha ||',
          meaning: 'Salutations to the supreme guru of the cosmos who illuminates our intellect and grants limitless prosperity.',
          targetPlanet: 'Guru',
          idealTime: 'Thursday mornings after bath',
          repetitionCount: 108
        }
      ],
      fasting: [
        {
          day: 'Thursday (Brihaspativar)',
          associatedDeity: 'Lord Vishnu & Brihaspati',
          targetPlanet: 'Guru',
          ritualRules: [
            'Wear light yellow clothes.',
            'Offer yellow flowers and gram dal (chana dal) to banana tree.',
            'Consume one meal prepared without salt, preferably containing yellow lentils or saffron milk.'
          ],
          spiritualBenefit: 'Directly pacifies financial obstacles and strengthens intellectual career trajectory.'
        }
      ],
      charities: [
        {
          title: 'Gau Seva (Feeding sacred cows)',
          itemsToDonate: ['Fresh green fodder', 'Jaggery (Gud)', 'Wheat dough'],
          auspiciousDay: 'Wednesday or Friday mornings',
          recipient: 'Local Gaushala or shelter',
          targetPlanetaryDosha: 'Venus & Mercury alignment'
        },
        {
          title: 'Vidya Daan (Supporting student education)',
          itemsToDonate: ['Notebooks', 'Stationery', 'Course scholarships to underprivileged children'],
          auspiciousDay: 'Thursday',
          recipient: 'Deserving students or gurukuls',
          targetPlanetaryDosha: 'Guru (Jupiter) empowerment'
        }
      ],
      rudrakshaRecommendation: {
        mukhi: '5 Mukhi (Pancha Mukhi) + 7 Mukhi (Sat Mukhi) Divine Kavach',
        rulingPlanet: 'Jupiter (Guru) and Goddess Mahalakshmi (Venus)',
        benefits: 'Protects mental equilibrium, neutralizes blood pressure stress, and attracts stable abundance.'
      },
      lifestyleUpay: [
        'Place a brass Kalash with fresh water and camphor in the North-East (Ishan Kona) corner of your living room.',
        'Never speak harshly or demean your spouse or family members before sunset.',
        'Keep a silver coin gifted by your mother in your wallet to balance lunar emotional tides.',
        'Apply white sandalwood (Chandan) tilak on your forehead on Fridays.'
      ]
    },
    lifeAreas: {
      career: {
        score: 92,
        summary: 'Exceptional career prospects in technology architecture, consultancy, strategic leadership, and venture management.',
        favorablePeriods: '2024 to late 2028 under Jupiter-Saturn and Jupiter-Mercury cycles.',
        cautionaryNote: 'Avoid impulsive corporate resignations during Mercury retrograde windows; verify all legal contracts thoroughly.'
      },
      wealthAndBusiness: {
        score: 88,
        summary: 'Mars and Jupiter in 2nd house create permanent Dhana Yoga. Excellent capacity for wealth accumulation and real-estate equity.',
        favorableInvestments: 'Commercial property, sovereign gold, index blue-chips, and intellectual property ventures.'
      },
      marriageAndLove: {
        score: 85,
        summary: 'Venus in 1st house brings romantic grace, while Ketu in 7th asks for intellectual and spiritual companionship over mere superficial attraction.',
        partnerQualities: 'Independent, articulate, highly cultured, intellectually curious, and spiritually grounded.',
        timing: 'High probability of marital alliance activation between age 29 and 32.'
      },
      health: {
        score: 82,
        summary: 'Robust vitality supported by Ascendant Lord in own sign. Need to regulate work-stress and kidneys/lower back.',
        vulnerableOrgans: 'Lower lumbar spine, kidney filtration, and throat/vocal cords.',
        dietaryTips: 'Drink 3+ liters of water infused with tulsi and fennel; minimize excess refined sugars and acidic foods.'
      }
    },
    createdAt: '2026-10-02T12:00:00Z'
  },
  {
    id: 'kundli-priya-2',
    birthDetails: {
      name: 'Priya Verma',
      gender: 'female',
      dateOfBirth: '1997-04-22',
      timeOfBirth: '14:15',
      placeOfBirth: 'Mumbai, Maharashtra, India',
      latitude: 19.0760,
      longitude: 72.8777,
      timezone: 'Asia/Kolkata'
    },
    ascendant: {
      sign: 'Simha', // Leo
      signNumber: 5,
      degree: 22.10,
      lord: 'Surya (Sun)',
      nakshatra: 'Purva Phalguni',
      pada: 3
    },
    moonSign: {
      sign: 'Tula', // Libra
      signNumber: 7,
      degree: 16.45,
      lord: 'Shukra (Venus)',
      nakshatra: 'Swati',
      pada: 4
    },
    sunSign: {
      sign: 'Mesha', // Aries
      signNumber: 1,
      degree: 8.20
    },
    planets: [
      {
        name: 'Surya',
        englishName: 'Sun',
        sign: 'Mesha',
        signNumber: 1,
        house: 9,
        degree: 8.20,
        nakshatra: 'Ashwini',
        pada: 3,
        isRetrograde: false,
        status: 'Exalted',
        description: 'Exalted Sun in 9th house (Bhagya Bhava) forms supreme Raja Yoga, blessing extraordinary leadership and paternal favor.'
      },
      {
        name: 'Chandra',
        englishName: 'Moon',
        sign: 'Tula',
        signNumber: 7,
        house: 3,
        degree: 16.45,
        nakshatra: 'Swati',
        pada: 4,
        isRetrograde: false,
        status: 'Neutral',
        description: 'Moon in 3rd house grants creative eloquence, diplomatic prowess, and successful digital/media communication.'
      },
      {
        name: 'Mangal',
        englishName: 'Mars',
        sign: 'Kanya',
        signNumber: 6,
        house: 2,
        degree: 11.40,
        nakshatra: 'Hasta',
        pada: 1,
        isRetrograde: false,
        status: 'Enemy',
        description: 'Mars in 2nd house gives rapid precision in financial audits and sharp, decisive articulation.'
      },
      {
        name: 'Budha',
        englishName: 'Mercury',
        sign: 'Meena',
        signNumber: 12,
        house: 8,
        degree: 15.10,
        nakshatra: 'Uttara Bhadrapada',
        pada: 4,
        isRetrograde: true,
        status: 'Debilitated',
        description: 'Neechabhanga cancellation active; gives deep intuitive abilities, psychological acumen, and research excellence.'
      },
      {
        name: 'Guru',
        englishName: 'Jupiter',
        sign: 'Makara',
        signNumber: 10,
        house: 6,
        degree: 28.50,
        nakshatra: 'Dhanishta',
        pada: 2,
        isRetrograde: false,
        status: 'Debilitated',
        description: 'Strong Vipareeta Raja Yoga effects; turns formidable adversaries into allies and conquers competitive examinations.'
      },
      {
        name: 'Shukra',
        englishName: 'Venus',
        sign: 'Mesha',
        signNumber: 1,
        house: 9,
        degree: 21.30,
        nakshatra: 'Bharani',
        pada: 3,
        isRetrograde: false,
        status: 'Neutral',
        description: 'Venus in 9th house with exalted Sun grants luxurious travels, refined aesthetic sensibility, and fortunate mentors.'
      },
      {
        name: 'Shani',
        englishName: 'Saturn',
        sign: 'Meena',
        signNumber: 12,
        house: 8,
        degree: 19.45,
        nakshatra: 'Revati',
        pada: 1,
        isRetrograde: false,
        status: 'Neutral',
        description: 'Saturn in 8th house blesses long lifespan (Dirghayu) and deep patience in uncovering profound truths.'
      },
      {
        name: 'Rahu',
        englishName: 'North Node',
        sign: 'Kanya',
        signNumber: 6,
        house: 2,
        degree: 4.50,
        nakshatra: 'Uttara Phalguni',
        pada: 3,
        isRetrograde: true,
        status: 'Friendly',
        description: 'Rahu in 2nd inspires innovative modern asset accumulation through global avenues.'
      },
      {
        name: 'Ketu',
        englishName: 'South Node',
        sign: 'Meena',
        signNumber: 12,
        house: 8,
        degree: 4.50,
        nakshatra: 'Purva Bhadrapada',
        pada: 4,
        isRetrograde: true,
        status: 'Exalted',
        description: 'Ketu in 8th house gives exceptional spiritual intuition and uncanny knack for anticipating future trends.'
      }
    ],
    houses: [
      { houseNumber: 1, sanskritName: 'Tanu Bhava (Self & Vitality)', significance: 'Physique, temperament, longevity, life path', signNumber: 5, signName: 'Simha', signLord: 'Surya', planetsInside: [], favorablePlanets: ['Surya', 'Mangal', 'Guru'] },
      { houseNumber: 2, sanskritName: 'Dhana Bhava (Wealth & Speech)', significance: 'Liquid assets, family lineage, speech', signNumber: 6, signName: 'Kanya', signLord: 'Budha', planetsInside: ['Mangal', 'Rahu'], favorablePlanets: ['Budha', 'Shukra'] },
      { houseNumber: 3, sanskritName: 'Sahaja Bhava (Siblings & Courage)', significance: 'Courage, short journeys, writing, younger siblings', signNumber: 7, signName: 'Tula', signLord: 'Shukra', planetsInside: ['Chandra'], favorablePlanets: ['Shukra', 'Shani'] },
      { houseNumber: 4, sanskritName: 'Sukha Bhava (Mother & Property)', significance: 'Mother, real estate, vehicles, inner happiness', signNumber: 8, signName: 'Vrishchika', signLord: 'Mangal', planetsInside: [], favorablePlanets: ['Surya', 'Guru'] },
      { houseNumber: 5, sanskritName: 'Putra Bhava (Children & Intelligence)', significance: 'Intellect, romance, past-life merits, speculation', signNumber: 9, signName: 'Dhanu', signLord: 'Guru', planetsInside: [], favorablePlanets: ['Guru', 'Mangal'] },
      { houseNumber: 6, sanskritName: 'Ari Bhava (Debts & Competitions)', significance: 'Enemies, health challenges, litigation, daily work', signNumber: 10, signName: 'Makara', signLord: 'Shani', planetsInside: ['Guru'], favorablePlanets: ['Shani', 'Budha'] },
      { houseNumber: 7, sanskritName: 'Yuvati Bhava (Spouse & Partnership)', significance: 'Marriage partner, business alliances, public interactions', signNumber: 11, signName: 'Kumbha', signLord: 'Shani', planetsInside: [], favorablePlanets: ['Shani', 'Budha', 'Shukra'] },
      { houseNumber: 8, sanskritName: 'Randhra Bhava (Transformation & Secrets)', significance: 'Longevity, occult, inheritance, sudden transformations', signNumber: 12, signName: 'Meena', signLord: 'Guru', planetsInside: ['Budha', 'Shani', 'Ketu'], favorablePlanets: ['Guru', 'Mangal'] },
      { houseNumber: 9, sanskritName: 'Dharma Bhava (Fortune & Higher Wisdom)', significance: 'Fortune (Bhagya), guru, pilgrimage, higher knowledge', signNumber: 1, signName: 'Mesha', signLord: 'Mangal', planetsInside: ['Surya', 'Shukra'], favorablePlanets: ['Surya', 'Guru'] },
      { houseNumber: 10, sanskritName: 'Karma Bhava (Career & Status)', significance: 'Profession, fame, leadership, public prestige', signNumber: 2, signName: 'Vrishabha', signLord: 'Shukra', planetsInside: [], favorablePlanets: ['Shukra', 'Shani'] },
      { houseNumber: 11, sanskritName: 'Labha Bhava (Gains & Social Network)', significance: 'Gains, fulfillment of desires, elder siblings, network', signNumber: 3, signName: 'Mithuna', signLord: 'Budha', planetsInside: [], favorablePlanets: ['Budha', 'Surya'] },
      { houseNumber: 12, sanskritName: 'Vyaya Bhava (Moksha & Foreign Travel)', significance: 'Expenditures, foreign settlements, meditation, spiritual release', signNumber: 4, signName: 'Karka', signLord: 'Chandra', planetsInside: [], favorablePlanets: ['Chandra', 'Guru'] }
    ],
    currentDasha: {
      mahadasha: 'Budha',
      antardasha: 'Shukra',
      pratyantardasha: 'Surya',
      endsAt: '2028-02-20',
      summary: 'Mercury-Venus dasha activating 9th house Dharma trikona. Highly auspicious for creative branding, brand expansion, and prestigious accolades.'
    },
    dashaTimeline: [
      { planet: 'Shani', startDate: '2004-06-15', endDate: '2023-06-15', status: 'Past', nature: 'Mixed', prediction: 'Intense foundation-building phase with steep learning curves.' },
      { planet: 'Budha', startDate: '2023-06-15', endDate: '2040-06-15', status: 'Current', nature: 'Auspicious', prediction: 'Massive intellectual expansion, high-visibility executive roles, and public renown.' },
      { planet: 'Ketu', startDate: '2040-06-15', endDate: '2047-06-15', status: 'Upcoming', nature: 'Challenging', prediction: 'Spiritual awakening, philanthropic giving, and deep philosophical mentorship.' }
    ],
    doshas: {
      manglikDosha: {
        hasDosha: false,
        type: 'No Manglik',
        reason: 'Mars is located in the 2nd house in Virgo, not in 1st, 4th, 7th, 8th or 12th.',
        cancellation: true,
        cancellationReason: 'No Kuja Dosha present in Janam Kundli.'
      },
      sadeSati: {
        isActive: false,
        phase: 'Not in Sade Sati',
        currentSaturnTransitSign: 'Aquarius (Kumbha)',
        impact: 'Moon is in Libra (Tula); Saturn transit in Aquarius is 5th from natal Moon. Highly creative and fertile period.',
        remedyTips: ['Recite Aditya Hridaya Stotram at sunrise for career empowerment.']
      },
      kaalSarpDosha: {
        hasDosha: false,
        severity: 'None',
        recommendation: 'Planets are unencumbered by Rahu-Ketu axis.'
      },
      pitraDosha: {
        hasDosha: false,
        summary: 'Exalted Sun in 9th house guarantees immense paternal grace and ancestor support.'
      }
    },
    remedies: {
      gemstones: [
        {
          name: 'Ruby (Manikya)',
          hindiName: 'Manik',
          planet: 'Surya',
          metal: 'Pure Gold or Copper',
          finger: 'Ring finger (Anamika) of right hand',
          auspiciousDay: 'Sunday morning during sunrise',
          idealWeight: '4.25 to 6.25 Ratti',
          mantra: 'Om Hram Hreem Hroum Sah Suryaya Namaha (ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः)',
          benefits: 'Amplifies leadership authority, vitality, self-confidence, and executive elevation.'
        },
        {
          name: 'Emerald (Panna)',
          hindiName: 'Panna',
          planet: 'Budha',
          metal: 'Gold or Silver',
          finger: 'Little finger (Kanishtha) of right hand',
          auspiciousDay: 'Wednesday morning during Shukla Paksha',
          idealWeight: '3.25 to 5.25 Ratti',
          mantra: 'Om Bum Budhaya Namaha (ॐ बुं बुधाय नमः)',
          benefits: 'Enhances sharp negotiation power, commercial brilliance, and public speaking.'
        }
      ],
      mantras: [
        {
          title: 'Aditya Hridaya Stotra Moola Mantra',
          deity: 'Bhagwan Surya',
          sanskritMantra: 'ॐ घृणिः सूर्य आदित्यः ॐ ॥',
          transliteration: 'Om Ghrinih Surya Adityaha Om ||',
          meaning: 'I bow to the radiant Sun God, the supreme source of life, victory, and radiant health.',
          targetPlanet: 'Surya',
          idealTime: 'Sunrise facing East',
          repetitionCount: 108
        }
      ],
      fasting: [
        {
          day: 'Sunday (Ravivar)',
          associatedDeity: 'Surya Narayana',
          targetPlanet: 'Surya',
          ritualRules: [
            'Offer Arghya (water with red kumkum and red flowers) to rising Sun.',
            'Consume food prepared without salt on Sunday.',
            'Maintain noble, righteous thoughts throughout the day.'
          ],
          spiritualBenefit: 'Disperses professional obstacles and grants rapid governmental and institutional favors.'
        }
      ],
      charities: [
        {
          title: 'Copper & Wheat Daan',
          itemsToDonate: ['Whole wheat grains', 'Jaggery (Gud)', 'Copper vessels'],
          auspiciousDay: 'Sunday afternoons',
          recipient: 'Temple pujaris or charitable trusts',
          targetPlanetaryDosha: 'Surya strengthening'
        }
      ],
      rudrakshaRecommendation: {
        mukhi: '1 Mukhi or 12 Mukhi Rudraksha',
        rulingPlanet: 'Lord Surya (Sun)',
        benefits: 'Imparts commanding leadership aura, physical immunity, and clarity of life vision.'
      },
      lifestyleUpay: [
        'Perform Surya Namaskar every morning facing East.',
        'Drink water stored in copper vessel (Tamra Patra) first thing in the morning.',
        'Touch parents feet every morning before leaving home for work.',
        'Keep lighting bright and well-aerated in the East quadrant of your home.'
      ]
    },
    lifeAreas: {
      career: {
        score: 96,
        summary: 'Commanding leadership profile suited for corporate vice-presidency, public administration, high-level strategy, or media entrepreneurship.',
        favorablePeriods: '2024 through 2029 under Mercury-Venus-Sun periods.',
        cautionaryNote: 'Keep ego in check when dealing with sub-ordinates; delegating trust expands your impact exponentially.'
      },
      wealthAndBusiness: {
        score: 90,
        summary: 'Exalted 9th Sun directly aspects 3rd house; exceptional gains through digital ventures, luxury design, and overseas investments.',
        favorableInvestments: 'Gold, intellectual property, premium equities, commercial leasing.'
      },
      marriageAndLove: {
        score: 87,
        summary: '7th lord Saturn in 8th signifies a mature, dependable, intellectually profound life partner who brings immense stability.',
        partnerQualities: 'Grounding, patient, intellectually refined, loyal, emotionally resilient.',
        timing: 'Marriage prospects highly highlighted between 28 and 30 years.'
      },
      health: {
        score: 86,
        summary: 'High vitality, excellent metabolic fire. Watch out for seasonal throat irritation and eye strain.',
        vulnerableOrgans: 'Eyes, upper back, cardiovascular pacing under heavy deadline stress.',
        dietaryTips: 'Include cooling pomegranate, amla, soaked almonds, and fresh buttermilk in diet.'
      }
    },
    createdAt: '2026-10-02T12:00:00Z'
  }
];

export const SAMPLE_MATCH_RESULT: MatchMakingResult = {
  id: 'match-rahul-priya',
  boyName: 'Rahul Sharma',
  boyBirth: '14 Oct 1995, 07:30 AM, New Delhi',
  boyMoonSign: 'Mithuna (Gemini)',
  boyNakshatra: 'Ardra (Pada 1)',
  girlName: 'Priya Verma',
  girlBirth: '22 Apr 1997, 02:15 PM, Mumbai',
  girlMoonSign: 'Tula (Libra)',
  girlNakshatra: 'Swati (Pada 4)',
  totalScore: 29.5,
  minimumRequired: 18,
  compatibilityLevel: 'Very Auspicious (24-29)',
  manglikCompatibility: {
    boyManglik: true,
    girlManglik: false,
    verdict: 'Kuja Dosha Cancelled: Rahul has Mars in own sign Scorpio, which cancels malefic Kuja Dosha. Union is completely safe and harmonious.',
    remedyNeeded: false,
    remedyTips: [
      'Perform a simple joint Shiv-Parvati Puja on Vivaha Panchami for lasting bliss.',
      'Wear a silver band on little finger for mutual emotional alignment.'
    ]
  },
  nadiDosha: {
    hasNadiDosha: false,
    severity: 'None',
    cancellation: true,
    advice: 'Boy is Adya Nadi and Girl is Antya Nadi. Different Nadis award full 8/8 points, ensuring stellar genetic health and progeny welfare.'
  },
  bhakootDosha: {
    hasBhakootDosha: false,
    advice: 'Gemini (3) and Libra (7) form a highly auspicious 5-9 Trikona relationship, awarding full 7/7 points for romantic harmony and financial expansion.'
  },
  scores: [
    { name: 'Varna', hindiName: 'वर्ण', maximumPoints: 1, obtainedPoints: 1, area: 'Ego & Spiritual Compatibility', verdict: 'Excellent', explanation: 'Both share complementary Varnas, promoting mutual respect and absence of ego friction.' },
    { name: 'Vashya', hindiName: 'वश्य', maximumPoints: 2, obtainedPoints: 2, area: 'Mutual Magnetic Attraction', verdict: 'Excellent', explanation: 'Natural interpersonal magnetism and balanced decision-making power dynamic.' },
    { name: 'Tara', hindiName: 'तारा', maximumPoints: 3, obtainedPoints: 3, area: 'Destiny, Health & Longevity', verdict: 'Excellent', explanation: 'Kalyana Tara alignment ensures long-term mutual support through all life transitions.' },
    { name: 'Yoni', hindiName: 'योनि', maximumPoints: 4, obtainedPoints: 2.5, area: 'Biological & Intimacy Compatibility', verdict: 'Good', explanation: 'Friendly animal symbols generate warm romantic empathy and physical affection.' },
    { name: 'Graha Maitri', hindiName: 'ग्रह मैत्री', maximumPoints: 5, obtainedPoints: 5, area: 'Intellectual & Psychological Bond', verdict: 'Excellent', explanation: 'Moon lords Mercury and Venus are natural intimate friends; excellent conversational rapport.' },
    { name: 'Gana', hindiName: 'गण', maximumPoints: 6, obtainedPoints: 1, area: 'Temperament & Lifestyle Values', verdict: 'Average', explanation: 'Manushya and Deva combination; minor differences in weekend pacing easily resolved with open dialogue.' },
    { name: 'Bhakoot', hindiName: 'भकूट', maximumPoints: 7, obtainedPoints: 7, area: 'Family Welfare & Prosperity', verdict: 'Excellent', explanation: 'Auspicious 5-9 relationship fosters mutual fortune, children happiness, and stable wealth.' },
    { name: 'Nadi', hindiName: 'नाड़ी', maximumPoints: 8, obtainedPoints: 8, area: 'Physiological & Genetic Harmony', verdict: 'Excellent', explanation: 'Different Nadis award the highest 8/8 points, guaranteeing genetic vibrancy and longevity of lineage.' }
  ],
  counselorSummary: 'Rahul Sharma and Priya Verma have a remarkably strong matrimonial compatibility score of 29.5 out of 36 points. Moon signs Gemini and Libra share natural Air-triplicity harmony, fostering effortless intellectual companionship, shared aesthetic values, and deep mutual respect. Mars placement is neutralized. This alliance is strongly recommended for a prosperous, blissful, and enduring marriage.',
  recommendedRituals: [
    'Visit a Navagraha Temple together to seek blessings of Budha and Shukra.',
    'Chant the Vishnu Sahasranama together on Shukla Paksha Ekadashi.',
    'Gift each other silver ornaments at the time of engagement.'
  ],
  createdAt: '2026-10-02T12:00:00Z'
};

export const SAMPLE_DAILY_HOROSCOPES: Record<string, DailyHoroscope> = {
  Tula: {
    sign: 'Tula',
    englishSign: 'Libra',
    date: 'Today',
    overallRating: 5,
    luckyNumber: 6,
    luckyColor: 'Pearl White & Royal Blue',
    luckyGem: 'Diamond / White Sapphire',
    rulingPlanet: 'Shukra (Venus)',
    predictions: {
      personal: 'Cosmic transits activate your charm sector. Social gatherings and family conversations bring immense warmth and creative clarity.',
      career: 'Favorable planetary alignment for strategic partnerships, pitch presentations, and negotiating client agreements. Colleagues look to you for aesthetic and tactical balance.',
      finance: 'Surprise gains through past investments or freelance consultancies. Auspicious day to plan long-term savings or asset diversification.',
      love: 'Romance blossoms with sweet banter and shared laughter. Singles may cross paths with someone articulate and charming in intellectual circles.',
      health: 'High energy and balanced prana. A brisk evening walk and light hydration will keep stress away.'
    },
    shubhMuhuratToday: {
      abhijitMuhurat: '11:46 AM - 12:34 PM',
      amritKaal: '03:15 PM - 04:50 PM',
      shubhChoghadiya: '09:10 AM - 10:40 AM'
    },
    ashubhTimings: {
      rahuKaal: '04:30 PM - 06:00 PM',
      yamaganda: '01:30 PM - 03:00 PM',
      gulikaKaal: '07:30 AM - 09:00 AM'
    },
    dailyUpay: 'Offer a fragrant white flower (such as jasmine or white rose) to Goddess Lakshmi and recite "Om Shum Shukraya Namaha" 11 times.'
  },
  Simha: {
    sign: 'Simha',
    englishSign: 'Leo',
    date: 'Today',
    overallRating: 4.8,
    luckyNumber: 1,
    luckyColor: 'Golden Amber & Crimson',
    luckyGem: 'Ruby (Manikya)',
    rulingPlanet: 'Surya (Sun)',
    predictions: {
      personal: 'Your natural executive presence inspires everyone around you. A long-pending family matter reaches a peaceful and decisive resolution.',
      career: 'Recognition from senior management or stakeholders. Perfect timing to present bold concepts and take charge of high-impact deliverables.',
      finance: 'Steady financial inflows. Avoid speculative intraday trading today; prioritize capital preservation and gold/property planning.',
      love: 'Deep emotional honesty strengthens your bond with your partner. Plan an intimate candlelit dinner or quality time away from screens.',
      health: 'Strong physical stamina. Stay mindful of eye strain and stay hydrated during busy hours.'
    },
    shubhMuhuratToday: {
      abhijitMuhurat: '11:46 AM - 12:34 PM',
      amritKaal: '08:20 AM - 09:55 AM',
      shubhChoghadiya: '10:40 AM - 12:10 PM'
    },
    ashubhTimings: {
      rahuKaal: '04:30 PM - 06:00 PM',
      yamaganda: '01:30 PM - 03:00 PM',
      gulikaKaal: '07:30 AM - 09:00 AM'
    },
    dailyUpay: 'Offer fresh water with red kumkum to Lord Surya during sunrise while chanting the Gayatri Mantra 3 times.'
  },
  Mesha: {
    sign: 'Mesha',
    englishSign: 'Aries',
    date: 'Today',
    overallRating: 4.5,
    luckyNumber: 9,
    luckyColor: 'Coral Red & Saffron',
    luckyGem: 'Red Coral (Moonga)',
    rulingPlanet: 'Mangal (Mars)',
    predictions: {
      personal: 'Dynamic surge of drive and enthusiasm. Great day to kickstart physical fitness routines and declutter your workspace.',
      career: 'Courageous decisions at work yield fruitful traction. Keep tone diplomatic to foster team collaboration.',
      finance: 'Moderate expenses on domestic utilities and health. Inflows remain stable from principal profession.',
      love: 'Passion runs high. Ensure active listening to avoid silly misunderstandings with your significant other.',
      health: 'High energy, though avoid overly spicy foods to maintain optimal pitta balance.'
    },
    shubhMuhuratToday: {
      abhijitMuhurat: '11:46 AM - 12:34 PM',
      amritKaal: '01:10 PM - 02:40 PM',
      shubhChoghadiya: '07:30 AM - 09:00 AM'
    },
    ashubhTimings: {
      rahuKaal: '04:30 PM - 06:00 PM',
      yamaganda: '01:30 PM - 03:00 PM',
      gulikaKaal: '07:30 AM - 09:00 AM'
    },
    dailyUpay: 'Recite Hanuman Chalisa once in the evening and light a ghee lamp.'
  }
};

export const SAMPLE_AUSPICIOUS_DATES: AuspiciousDate[] = [
  {
    date: '2026-10-06',
    weekday: 'Tuesday',
    type: 'Highly Auspicious',
    category: 'Business / Signing',
    tithi: 'Shukla Dashami',
    nakshatra: 'Pushya',
    reason: 'Ravi Pushya Yoga! Highly auspicious combination for signing commercial agreements, incorporating new ventures, and capital investments.',
    recommendedAction: 'Execute critical client contracts, launch marketing campaigns, or sign partnership agreements.'
  },
  {
    date: '2026-10-10',
    weekday: 'Saturday',
    type: 'Highly Auspicious',
    category: 'Property / Vehicle',
    tithi: 'Shukla Trayodashi',
    nakshatra: 'Rohini',
    reason: 'Rohini Nakshatra with Amrit Siddhi Yoga creates steady foundation for real estate acquisitions and luxury vehicle deliveries.',
    recommendedAction: 'Registry of flat/plot, Griha Pravesh rituals, or vehicle registration.'
  },
  {
    date: '2026-10-14',
    weekday: 'Wednesday',
    type: 'Auspicious',
    category: 'Gold / Luxury',
    tithi: 'Krishna Dwitiya',
    nakshatra: 'Swati',
    reason: 'Shukra-ruled Nakshatra favors acquisition of gold, gemstone consecration, and high-value wardrobe shopping.',
    recommendedAction: 'Purchase physical 24K gold, diamond jewelry, or consecrate new astrological gemstones.'
  },
  {
    date: '2026-10-19',
    weekday: 'Monday',
    type: 'Inauspicious / Avoid',
    category: 'General',
    tithi: 'Krishna Saptami',
    nakshatra: 'Moola',
    reason: 'Gandanta Nakshatra transit and Yamaganda clash. Planetary tides generate erratic friction in delicate negotiations.',
    recommendedAction: 'Defer major financial agreements or confrontational meetings; focus on meditation and routine tasks.'
  },
  {
    date: '2026-10-24',
    weekday: 'Saturday',
    type: 'Highly Auspicious',
    category: 'Marriage / Engagement',
    tithi: 'Shukla Dwitiya',
    nakshatra: 'Uttara Phalguni',
    reason: 'Aryaman deity presiding over marriage grants lifelong harmony and family happiness for matrimonial alliances.',
    recommendedAction: 'Roka ceremony, engagement ring exchange, or finalizing wedding dates.'
  }
];

export const MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'starter',
    name: 'Shubh Starter',
    sanskritName: 'शुभ आरम्भ',
    pricePerMonth: 299,
    billingPeriod: 'month',
    originalPrice: 499,
    tagline: 'Your personal daily astrological compass & Kundli counselor',
    features: [
      'Complete Vedic Janam Kundli with 12 Bhavas & Navamsha',
      'Daily, Weekly & Monthly personalized transit forecasts',
      '5 In-depth Personal Astrologer AI consultations / month',
      'Custom Gemstone (Ratna) & Vedic Mantra recommendations',
      'Sade Sati, Manglik & Kaal Sarp Dosha status and remedies',
      'Daily Shubh Muhurat, Rahu Kaal & Choghadiya alerts'
    ],
    consultationCredits: '5 Consultations / month',
    voiceModeEnabled: false,
    matchMakingQuota: '2 Matchmaking Reports / mo',
    muhuratAccess: 'Daily Muhurat'
  },
  {
    id: 'pro',
    name: 'Kalyan Pro',
    sanskritName: 'कल्याण प्रो',
    pricePerMonth: 499,
    billingPeriod: 'month',
    originalPrice: 899,
    tagline: 'Unlimited personal astrologer access & matchmaking intelligence',
    isPopular: true,
    features: [
      'Unlimited 24/7 Personal Astrologer consultations (Chat anytime)',
      'Voice Consultation Mode with Acharya audio recitations',
      'Unlimited 36 Guna Ashtakoot Kundli Matching (Milan) reports',
      'Monthly Good & Bad Dates calendar for Business & Marriage',
      'Career promotion & Business investment timing guidance',
      'Comprehensive Vedic Upay & Remedy Vault with audio Mantras',
      'Family Kundli profiles (Save up to 4 charts)',
      'Downloadable high-res PDF Janampatri reports'
    ],
    consultationCredits: 'Unlimited 24/7 Access',
    voiceModeEnabled: true,
    matchMakingQuota: 'Unlimited Matching Reports',
    muhuratAccess: 'Full Monthly Auspicious Calendar'
  },
  {
    id: 'annual',
    name: 'Divya Unlimited',
    sanskritName: 'दिव्य वार्षिक',
    pricePerMonth: 249, // ₹2,999/yr billed annually
    billingPeriod: 'year',
    originalPrice: 499,
    tagline: 'The ultimate astrological guidance for your entire family',
    features: [
      'All features of Kalyan Pro for 365 days (Save over 50%)',
      'Family Vault: Unlimited Kundli charts for spouse, kids & parents',
      'Dedicated Muhurat planner for property purchase & vehicle delivery',
      'Annual transit report (Guru & Shani Mahadasha comprehensive outlook)',
      'VIP Priority processing on AI Astrologer consultations',
      'Exclusive astrological webinars & quarterly personalized remedy review'
    ],
    consultationCredits: 'Unlimited VIP Access',
    voiceModeEnabled: true,
    matchMakingQuota: 'Unlimited Matching Reports',
    muhuratAccess: 'Full Annual Shubh Muhurat Suite'
  }
];
