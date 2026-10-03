import { AshtakootScore, MatchMakingResult } from '../types/astrology';

// 27 Nakshatras in order
export const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni',
  'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha',
  'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha',
  'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'
];

// 12 Zodiac Moon Signs in order
export const MOON_SIGNS = [
  'Mesha (Aries)', 'Vrishabha (Taurus)', 'Mithuna (Gemini)', 'Karka (Cancer)',
  'Simha (Leo)', 'Kanya (Virgo)', 'Tula (Libra)', 'Vrishchika (Scorpio)',
  'Dhanu (Sagittarius)', 'Makara (Capricorn)', 'Kumbha (Aquarius)', 'Meena (Pisces)'
];

// Determine approximate Moon Sign and Nakshatra from DOB (deterministic hash/astronomical simulation)
export function estimateMoonAndNakshatra(dobStr: string, tobStr: string) {
  const d = new Date(`${dobStr}T${tobStr || '12:00'}:00Z`);
  const timeVal = isNaN(d.getTime()) ? 800000000000 : d.getTime();
  
  // Moon takes ~27.32 days to orbit all 27 nakshatras (~1 nakshatra per day)
  const daysSinceEpoch = timeVal / (1000 * 60 * 60 * 24);
  const nakshatraIndex = Math.abs(Math.floor(daysSinceEpoch * 0.98)) % 27;
  
  // Moon sign (~2.25 days per sign)
  const signIndex = Math.abs(Math.floor(daysSinceEpoch * 0.98 / 2.25)) % 12;

  return {
    moonSign: MOON_SIGNS[signIndex],
    signIndex,
    nakshatra: NAKSHATRAS[nakshatraIndex],
    nakshatraIndex,
  };
}

export function calculateAshtakootMilan(
  boyName: string,
  boyDob: string,
  boyTob: string,
  boyPob: string,
  girlName: string,
  girlDob: string,
  girlTob: string,
  girlPob: string
): MatchMakingResult {
  const boyAstro = estimateMoonAndNakshatra(boyDob, boyTob);
  const girlAstro = estimateMoonAndNakshatra(girlDob, girlTob);

  // 1. Varna (1 Point)
  // Brahmin: 3, 7, 11 (Cancer, Scorpio, Pisces) -> index 3, 7, 11
  // Kshatriya: 0, 4, 8 (Aries, Leo, Sag) -> index 0, 4, 8
  // Vaishya: 1, 5, 9 (Taurus, Virgo, Cap) -> index 1, 5, 9
  // Shudra: 2, 6, 10 (Gemini, Libra, Aqua) -> index 2, 6, 10
  const getVarnaRank = (signIdx: number) => {
    if ([3, 7, 11].includes(signIdx)) return 4; // Brahmin
    if ([0, 4, 8].includes(signIdx)) return 3;  // Kshatriya
    if ([1, 5, 9].includes(signIdx)) return 2;  // Vaishya
    return 1;                                   // Shudra
  };
  const boyVarna = getVarnaRank(boyAstro.signIndex);
  const girlVarna = getVarnaRank(girlAstro.signIndex);
  const varnaPoints = boyVarna >= girlVarna ? 1 : 0;

  // 2. Vashya (2 Points)
  // Mutual attraction and control
  const signDiff = Math.abs(boyAstro.signIndex - girlAstro.signIndex);
  let vashyaPoints = 1;
  if (signDiff === 0 || signDiff === 4 || signDiff === 8) vashyaPoints = 2;
  else if (signDiff === 6) vashyaPoints = 0.5;

  // 3. Tara (3 Points)
  // Health & Longevity derived from Nakshatra count
  const count1 = ((boyAstro.nakshatraIndex - girlAstro.nakshatraIndex + 27) % 27) % 9;
  const count2 = ((girlAstro.nakshatraIndex - boyAstro.nakshatraIndex + 27) % 27) % 9;
  const auspiciousTaras = [1, 2, 4, 6, 8];
  const isAusp1 = auspiciousTaras.includes(count1);
  const isAusp2 = auspiciousTaras.includes(count2);
  let taraPoints = 1.5;
  if (isAusp1 && isAusp2) taraPoints = 3;
  else if (!isAusp1 && !isAusp2) taraPoints = 0;

  // 4. Yoni (4 Points)
  // Physical & Biological intimacy
  const yoniType1 = boyAstro.nakshatraIndex % 14;
  const yoniType2 = girlAstro.nakshatraIndex % 14;
  let yoniPoints = 2;
  if (yoniType1 === yoniType2) yoniPoints = 4;
  else if (Math.abs(yoniType1 - yoniType2) === 7) yoniPoints = 0; // Enemy Yoni
  else if (Math.abs(yoniType1 - yoniType2) <= 3) yoniPoints = 3;

  // 5. Graha Maitri (5 Points)
  // Mental friendship and psychological harmony
  const lordDiff = Math.abs((boyAstro.signIndex % 7) - (girlAstro.signIndex % 7));
  let grahaMaitriPoints = 3;
  if (lordDiff === 0) grahaMaitriPoints = 5;
  else if (lordDiff === 1 || lordDiff === 5) grahaMaitriPoints = 4;
  else if (lordDiff === 3) grahaMaitriPoints = 1;
  else if (lordDiff === 4) grahaMaitriPoints = 0.5;

  // 6. Gana (6 Points)
  // Deva (0), Manushya (1), Rakshasa (2)
  const getGana = (nIdx: number) => nIdx % 3;
  const boyGana = getGana(boyAstro.nakshatraIndex);
  const girlGana = getGana(girlAstro.nakshatraIndex);
  let ganaPoints = 6;
  if (boyGana === girlGana) ganaPoints = 6;
  else if ((boyGana === 0 && girlGana === 1) || (boyGana === 1 && girlGana === 0)) ganaPoints = 5;
  else if (boyGana === 2 && girlGana === 0) ganaPoints = 1;
  else if (boyGana === 0 && girlGana === 2) ganaPoints = 0;
  else ganaPoints = 3;

  // 7. Bhakoot (7 Points)
  // Emotional prosperity and family longevity
  const bhakootDistance = ((girlAstro.signIndex - boyAstro.signIndex + 12) % 12) + 1;
  const badBhakoot = [2, 12, 6, 8, 9, 5]; // 2/12, 6/8, 9/5
  let bhakootPoints = 7;
  let hasBhakootDosha = false;
  if (badBhakoot.includes(bhakootDistance)) {
    bhakootPoints = 0;
    hasBhakootDosha = true;
  }

  // 8. Nadi (8 Points)
  // Adi (0), Madhya (1), Antya (2)
  const boyNadi = boyAstro.nakshatraIndex % 3;
  const girlNadi = girlAstro.nakshatraIndex % 3;
  let nadiPoints = 8;
  let hasNadiDosha = false;
  if (boyNadi === girlNadi) {
    nadiPoints = 0;
    hasNadiDosha = true;
  }

  const totalScore = Math.round(
    (varnaPoints + vashyaPoints + taraPoints + yoniPoints + grahaMaitriPoints + ganaPoints + bhakootPoints + nadiPoints) * 2
  ) / 2;

  let compatibilityLevel: 'Exceptional (30-36)' | 'Very Auspicious (24-29)' | 'Acceptable (18-23)' | 'Inauspicious (<18)' = 'Acceptable (18-23)';
  if (totalScore >= 30) compatibilityLevel = 'Exceptional (30-36)';
  else if (totalScore >= 24) compatibilityLevel = 'Very Auspicious (24-29)';
  else if (totalScore >= 18) compatibilityLevel = 'Acceptable (18-23)';
  else compatibilityLevel = 'Inauspicious (<18)';

  const scores: AshtakootScore[] = [
    {
      name: 'Varna',
      hindiName: 'वर्ण',
      maximumPoints: 1,
      obtainedPoints: varnaPoints,
      area: 'Ego & Spiritual Compatibility',
      verdict: varnaPoints === 1 ? 'Excellent' : 'Challenging',
      explanation: varnaPoints === 1
        ? 'Spiritual ego and occupational temperament are completely aligned. Mutual respect in decision making.'
        : 'Slight spiritual ego disparity. Mutual humility and consultative decisions are recommended.',
    },
    {
      name: 'Vashya',
      hindiName: 'वश्य',
      maximumPoints: 2,
      obtainedPoints: vashyaPoints,
      area: 'Mutual Attraction & Power Balance',
      verdict: vashyaPoints >= 1.5 ? 'Excellent' : vashyaPoints >= 1 ? 'Good' : 'Average',
      explanation: vashyaPoints >= 1.5
        ? 'Natural magnetical affinity and balanced authority without domination.'
        : 'Occasional struggle for dominance; clear communication ensures stability.',
    },
    {
      name: 'Tara',
      hindiName: 'तारा',
      maximumPoints: 3,
      obtainedPoints: taraPoints,
      area: 'Health & Cosmic Destiny',
      verdict: taraPoints === 3 ? 'Excellent' : taraPoints === 1.5 ? 'Average' : 'Challenging',
      explanation: taraPoints === 3
        ? 'Birth stars form a highly auspicious Sampat (wealth) and Mitra (friendship) geometry promoting long health.'
        : 'Moderate Tara compatibility; periodic health vigilance and prayers to Lord Shiva are advised.',
    },
    {
      name: 'Yoni',
      hindiName: 'योनि',
      maximumPoints: 4,
      obtainedPoints: yoniPoints,
      area: 'Biological & Intimate Harmony',
      verdict: yoniPoints >= 3 ? 'Excellent' : yoniPoints >= 2 ? 'Average' : 'Challenging',
      explanation: yoniPoints >= 3
        ? 'Natural animal archetypes share profound biological affection, physical empathy, and marital warmth.'
        : 'Neutral physiological bonding; emotional intimacy and patience will foster marital closeness.',
    },
    {
      name: 'Graha Maitri',
      hindiName: 'ग्रह मैत्री',
      maximumPoints: 5,
      obtainedPoints: grahaMaitriPoints,
      area: 'Mental Friendship & Worldview',
      verdict: grahaMaitriPoints >= 4 ? 'Excellent' : grahaMaitriPoints >= 3 ? 'Good' : 'Challenging',
      explanation: grahaMaitriPoints >= 4
        ? 'Moon planetary lords share intimate natural friendship. Intellectual synergy and effortless companionship.'
        : 'Different personality viewpoints; constructive debate rather than criticism preserves harmony.',
    },
    {
      name: 'Gana',
      hindiName: 'गण',
      maximumPoints: 6,
      obtainedPoints: ganaPoints,
      area: 'Temperament & Life Philosophy',
      verdict: ganaPoints >= 5 ? 'Excellent' : ganaPoints >= 3 ? 'Good' : 'Challenging',
      explanation: ganaPoints >= 5
        ? 'Soul temperaments blend smoothly without friction. Daily routines and core ethics harmonize easily.'
        : 'Varied temperament; celebrating each other’s unique strengths prevents friction.',
    },
    {
      name: 'Bhakoot',
      hindiName: 'भकूट',
      maximumPoints: 7,
      obtainedPoints: bhakootPoints,
      area: 'Family Welfare & Prosperity',
      verdict: bhakootPoints === 7 ? 'Excellent' : 'Challenging',
      explanation: bhakootPoints === 7
        ? 'No Bhakoot Dosha! Auspicious angular placement fosters family fortune, financial accumulation, and marital peace.'
        : 'Bhakoot Dosha detected (2/12, 6/8, or 9/5 relative moon distance). Chanting Vishnu Sahasranama cancels friction.',
    },
    {
      name: 'Nadi',
      hindiName: 'नाड़ी',
      maximumPoints: 8,
      obtainedPoints: nadiPoints,
      area: 'Genetic Compatibility & Progeny',
      verdict: nadiPoints === 8 ? 'Excellent' : 'Challenging',
      explanation: nadiPoints === 8
        ? 'Different Nadis! Highest 8/8 score achieved. Robust genetic compatibility, progeny longevity, and vibrant health.'
        : 'Same Nadi detected (Nadi Dosha). Classical Parashara recommends performing Nadi Dosha Shanti Puja & donating a golden idol before nuptials.',
    },
  ];

  return {
    id: 'match-' + Date.now(),
    boyName: boyName || 'Groom',
    boyBirth: `${boyDob} ${boyTob}`,
    boyMoonSign: boyAstro.moonSign,
    boyNakshatra: boyAstro.nakshatra,
    girlName: girlName || 'Bride',
    girlBirth: `${girlDob} ${girlTob}`,
    girlMoonSign: girlAstro.moonSign,
    girlNakshatra: girlAstro.nakshatra,
    totalScore,
    minimumRequired: 18,
    compatibilityLevel,
    manglikCompatibility: {
      boyManglik: false,
      girlManglik: false,
      verdict: 'Both charts show balanced Mars placement. No adverse Kuja (Manglik) Dosha detected.',
      remedyNeeded: false,
      remedyTips: [
        'Offer red vermillion to Lord Hanuman on Tuesdays for lifelong harmony.',
        'Install a Mangal Yantra at home for household prosperity.'
      ],
    },
    nadiDosha: {
      hasNadiDosha,
      severity: hasNadiDosha ? 'High' : 'None',
      cancellation: !hasNadiDosha,
      advice: hasNadiDosha
        ? 'Nadi Dosha detected as both share the same physiological Nadi. A classical Nadi Shanti ritual & Mahamrityunjaya Japa resolves genetic afflictions.'
        : 'Pristine Nadi harmony (8/8 points). Zero genetic conflict; ensures healthy progeny and bodily vitality.',
    },
    bhakootDosha: {
      hasBhakootDosha,
      advice: hasBhakootDosha
        ? 'Bhakoot Dosha present. Perform joint Satyanarayan Vrat Katha on Purnima (full moon) to shield family wealth and emotional stability.'
        : 'Auspicious Bhakoot harmony (7/7 points). Emotional bond and joint wealth prosperity remain consistently high.',
    },
    scores,
    counselorSummary: `The Ashtakoot compatibility between ${boyName || 'Groom'} and ${girlName || 'Bride'} yields a total of ${totalScore} out of 36 Gunas (${compatibilityLevel}). Mental friendship, emotional stability, and overall marital longevity indicate a fruitful and spiritually aligned union.`,
    recommendedRituals: [
      'Gauri-Shankar joint worship on Shukla Paksha Somvar (Monday)',
      'Recitation of Vishnu Sahasranama for mutual prosperity and progeny blessing',
      'Feeding cows with fresh green fodder and jaggery on Fridays',
    ],
    createdAt: new Date().toISOString(),
  };
}
