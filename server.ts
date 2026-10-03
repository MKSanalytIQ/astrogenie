import express from 'express';
import type { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Enable JSON bodies with higher limit for rich payloads
app.use(express.json({ limit: '35mb' }));

// Enable CORS for local, container, or Vercel serverless deployments
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Dynamic Gemini client resolution
function getAIClient(): GoogleGenAI | null {
  const currentKey = process.env.GEMINI_API_KEY;
  if (!currentKey) return null;
  return new GoogleGenAI({
    apiKey: currentKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ----------------------------------------------------
// Health Check Endpoint
// ----------------------------------------------------
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'AstroGenie Vedic Astrology Engine',
    timestamp: new Date().toISOString(),
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    runtime: process.env.VERCEL ? 'vercel-serverless' : (process.env.NODE_ENV || 'standalone')
  });
});

// -------------------------------------------------------------------------
// 1. Generate Complete Vedic Janam Kundli API (/api/generate-kundli)
// -------------------------------------------------------------------------
app.post('/api/generate-kundli', async (req: Request, res: Response) => {
  try {
    const { name, gender = 'male', dateOfBirth, timeOfBirth, placeOfBirth } = req.body || {};

    if (!dateOfBirth || !timeOfBirth || !placeOfBirth) {
      return res.status(400).json({ error: 'dateOfBirth, timeOfBirth, and placeOfBirth are required.' });
    }

    const ai = getAIClient();

    if (!ai) {
      // Return structured calculated fallback Kundli if API key is not yet set
      const fallback = buildAlgorithmicKundli({ name: name || 'Seeker', gender, dateOfBirth, timeOfBirth, placeOfBirth });
      return res.json({ success: true, plan: fallback, source: 'algorithmic-ephemeris' });
    }

    const systemPrompt = `You are a revered Acharya and master Vedic Astrologer (Jyotish Shiromani) adhering to the classical Brihat Parashara Hora Shastra, Jaimini Sutras, and Lahiri Ayanamsha.
Given a native's birth details:
Name: ${name || 'Native'}
Gender: ${gender}
Date of Birth: ${dateOfBirth} (YYYY-MM-DD)
Time of Birth: ${timeOfBirth} (24-hr format)
Place of Birth: ${placeOfBirth}

Calculate and output a complete, mathematically coherent Vedic Janam Kundli JSON adhering to:
1. Ascendant (Lagna) sign (1=Mesha, 2=Vrishabha, ... 12=Meena), exact degree, Nakshatra and Pada.
2. Moon Sign (Chandra Rashi), degree, Nakshatra and Pada.
3. Sun Sign (Surya Rashi) and degree.
4. Complete 9 Navagraha planetary positions (Surya, Chandra, Mangal, Budha, Guru, Shukra, Shani, Rahu, Ketu) with house number (1-12 from Lagna), sign, degree, Nakshatra, status (Exalted, Debilitated, Own House, Friendly, Enemy), and descriptive significance.
5. All 12 Bhavas (houses) from 1st Tanu Bhava to 12th Vyaya Bhava with residents, lord, and significance.
6. Current Vimshottari Mahadasha, Antardasha, and Pratyantardasha based on Moon nakshatra and date of birth calculated for today.
7. Complete Dosha analysis:
   - Manglik Dosha (Kuja Dosha): evaluate houses 1, 2, 4, 7, 8, 12, check classical cancellation rules (e.g. Mars in own sign/exalted/aspect by Jupiter).
   - Shani Sade Sati: check transit Saturn vs natal Moon sign.
   - Kaal Sarp Dosha & Pitra Dosha.
8. Curated Vedic remedies (Upay):
   - 2 Lucky Gemstones (Ratna) with metal, finger, auspicious day, and mantra.
   - 2 Powerful Vedic Mantras with Sanskrit text, transliteration, and meaning.
   - Auspicious Fasting (Vrat) instructions.
   - Specific Charity (Daan) guidelines.
   - Rudraksha recommendation.
   - 4 practical behavioral lifestyle Upay.
9. Life area analysis scores (0-100) and actionable guidance for Career, Wealth/Business, Marriage/Love, and Health.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ascendant: {
              type: Type.OBJECT,
              properties: {
                sign: { type: Type.STRING },
                signNumber: { type: Type.INTEGER },
                degree: { type: Type.NUMBER },
                lord: { type: Type.STRING },
                nakshatra: { type: Type.STRING },
                pada: { type: Type.INTEGER }
              },
              required: ['sign', 'signNumber', 'degree', 'lord', 'nakshatra', 'pada']
            },
            moonSign: {
              type: Type.OBJECT,
              properties: {
                sign: { type: Type.STRING },
                signNumber: { type: Type.INTEGER },
                degree: { type: Type.NUMBER },
                lord: { type: Type.STRING },
                nakshatra: { type: Type.STRING },
                pada: { type: Type.INTEGER }
              },
              required: ['sign', 'signNumber', 'degree', 'lord', 'nakshatra', 'pada']
            },
            sunSign: {
              type: Type.OBJECT,
              properties: {
                sign: { type: Type.STRING },
                signNumber: { type: Type.INTEGER },
                degree: { type: Type.NUMBER }
              },
              required: ['sign', 'signNumber', 'degree']
            },
            planets: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  englishName: { type: Type.STRING },
                  sign: { type: Type.STRING },
                  signNumber: { type: Type.INTEGER },
                  house: { type: Type.INTEGER },
                  degree: { type: Type.NUMBER },
                  nakshatra: { type: Type.STRING },
                  pada: { type: Type.INTEGER },
                  isRetrograde: { type: Type.BOOLEAN },
                  status: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ['name', 'englishName', 'sign', 'signNumber', 'house', 'degree', 'nakshatra', 'pada', 'isRetrograde', 'status', 'description']
              }
            },
            currentDasha: {
              type: Type.OBJECT,
              properties: {
                mahadasha: { type: Type.STRING },
                antardasha: { type: Type.STRING },
                pratyantardasha: { type: Type.STRING },
                endsAt: { type: Type.STRING },
                summary: { type: Type.STRING }
              },
              required: ['mahadasha', 'antardasha', 'pratyantardasha', 'endsAt', 'summary']
            },
            doshas: {
              type: Type.OBJECT,
              properties: {
                manglikDosha: {
                  type: Type.OBJECT,
                  properties: {
                    hasDosha: { type: Type.BOOLEAN },
                    type: { type: Type.STRING },
                    reason: { type: Type.STRING },
                    cancellation: { type: Type.BOOLEAN },
                    cancellationReason: { type: Type.STRING }
                  },
                  required: ['hasDosha', 'type', 'reason', 'cancellation']
                },
                sadeSati: {
                  type: Type.OBJECT,
                  properties: {
                    isActive: { type: Type.BOOLEAN },
                    phase: { type: Type.STRING },
                    currentSaturnTransitSign: { type: Type.STRING },
                    impact: { type: Type.STRING },
                    remedyTips: { type: Type.ARRAY, items: { type: Type.STRING } }
                  },
                  required: ['isActive', 'phase', 'currentSaturnTransitSign', 'impact', 'remedyTips']
                },
                kaalSarpDosha: {
                  type: Type.OBJECT,
                  properties: {
                    hasDosha: { type: Type.BOOLEAN },
                    type: { type: Type.STRING },
                    severity: { type: Type.STRING },
                    recommendation: { type: Type.STRING }
                  },
                  required: ['hasDosha', 'severity', 'recommendation']
                },
                pitraDosha: {
                  type: Type.OBJECT,
                  properties: {
                    hasDosha: { type: Type.BOOLEAN },
                    summary: { type: Type.STRING }
                  },
                  required: ['hasDosha', 'summary']
                }
              },
              required: ['manglikDosha', 'sadeSati', 'kaalSarpDosha', 'pitraDosha']
            },
            remedies: {
              type: Type.OBJECT,
              properties: {
                gemstones: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      hindiName: { type: Type.STRING },
                      planet: { type: Type.STRING },
                      metal: { type: Type.STRING },
                      finger: { type: Type.STRING },
                      auspiciousDay: { type: Type.STRING },
                      idealWeight: { type: Type.STRING },
                      mantra: { type: Type.STRING },
                      benefits: { type: Type.STRING },
                      warning: { type: Type.STRING }
                    },
                    required: ['name', 'hindiName', 'planet', 'metal', 'finger', 'auspiciousDay', 'mantra', 'benefits']
                  }
                },
                mantras: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      deity: { type: Type.STRING },
                      sanskritMantra: { type: Type.STRING },
                      transliteration: { type: Type.STRING },
                      meaning: { type: Type.STRING },
                      targetPlanet: { type: Type.STRING },
                      idealTime: { type: Type.STRING },
                      repetitionCount: { type: Type.INTEGER }
                    },
                    required: ['title', 'deity', 'sanskritMantra', 'transliteration', 'meaning', 'targetPlanet', 'idealTime', 'repetitionCount']
                  }
                },
                fasting: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      day: { type: Type.STRING },
                      associatedDeity: { type: Type.STRING },
                      targetPlanet: { type: Type.STRING },
                      ritualRules: { type: Type.ARRAY, items: { type: Type.STRING } },
                      spiritualBenefit: { type: Type.STRING }
                    },
                    required: ['day', 'associatedDeity', 'targetPlanet', 'ritualRules', 'spiritualBenefit']
                  }
                },
                charities: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      itemsToDonate: { type: Type.ARRAY, items: { type: Type.STRING } },
                      auspiciousDay: { type: Type.STRING },
                      recipient: { type: Type.STRING },
                      targetPlanetaryDosha: { type: Type.STRING }
                    },
                    required: ['title', 'itemsToDonate', 'auspiciousDay', 'recipient', 'targetPlanetaryDosha']
                  }
                },
                rudrakshaRecommendation: {
                  type: Type.OBJECT,
                  properties: {
                    mukhi: { type: Type.STRING },
                    rulingPlanet: { type: Type.STRING },
                    benefits: { type: Type.STRING }
                  },
                  required: ['mukhi', 'rulingPlanet', 'benefits']
                },
                lifestyleUpay: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ['gemstones', 'mantras', 'fasting', 'charities', 'rudrakshaRecommendation', 'lifestyleUpay']
            },
            lifeAreas: {
              type: Type.OBJECT,
              properties: {
                career: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.INTEGER },
                    summary: { type: Type.STRING },
                    favorablePeriods: { type: Type.STRING },
                    cautionaryNote: { type: Type.STRING }
                  },
                  required: ['score', 'summary', 'favorablePeriods', 'cautionaryNote']
                },
                wealthAndBusiness: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.INTEGER },
                    summary: { type: Type.STRING },
                    favorableInvestments: { type: Type.STRING }
                  },
                  required: ['score', 'summary', 'favorableInvestments']
                },
                marriageAndLove: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.INTEGER },
                    summary: { type: Type.STRING },
                    partnerQualities: { type: Type.STRING },
                    timing: { type: Type.STRING }
                  },
                  required: ['score', 'summary', 'partnerQualities', 'timing']
                },
                health: {
                  type: Type.OBJECT,
                  properties: {
                    score: { type: Type.INTEGER },
                    summary: { type: Type.STRING },
                    vulnerableOrgans: { type: Type.STRING },
                    dietaryTips: { type: Type.STRING }
                  },
                  required: ['score', 'summary', 'vulnerableOrgans', 'dietaryTips']
                }
              },
              required: ['career', 'wealthAndBusiness', 'marriageAndLove', 'health']
            }
          },
          required: ['ascendant', 'moonSign', 'sunSign', 'planets', 'currentDasha', 'doshas', 'remedies', 'lifeAreas']
        }
      }
    });

    const raw = response.text?.trim() || '{}';
    const parsed = JSON.parse(raw);

    // Build the 12 houses dynamically based on Lagna sign
    const signNames = ['Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya', 'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'];
    const signLords: Record<string, string> = {
      Mesha: 'Mangal', Vrishabha: 'Shukra', Mithuna: 'Budha', Karka: 'Chandra',
      Simha: 'Surya', Kanya: 'Budha', Tula: 'Shukra', Vrishchika: 'Mangal',
      Dhanu: 'Guru', Makara: 'Shani', Kumbha: 'Shani', Meena: 'Guru'
    };

    const lagnaNum = parsed.ascendant.signNumber || 1;
    const houses = Array.from({ length: 12 }, (_, i) => {
      const houseNum = i + 1;
      const sNum = ((lagnaNum - 1 + i) % 12) + 1;
      const sName = signNames[sNum - 1];
      const planetsInside = (parsed.planets || [])
        .filter((p: any) => p.house === houseNum)
        .map((p: any) => p.name);

      return {
        houseNumber: houseNum,
        sanskritName: getHouseName(houseNum),
        significance: getHouseSignificance(houseNum),
        signNumber: sNum,
        signName: sName,
        signLord: signLords[sName] || 'Guru',
        planetsInside,
        favorablePlanets: getFavorablePlanets(houseNum)
      };
    });

    const completeKundli = {
      id: 'kundli-' + Date.now(),
      birthDetails: { name, gender, dateOfBirth, timeOfBirth, placeOfBirth },
      ...parsed,
      houses,
      dashaTimeline: [
        { planet: parsed.currentDasha?.mahadasha || 'Guru', startDate: '2023-01-01', endDate: '2039-01-01', status: 'Current', nature: 'Auspicious', prediction: parsed.currentDasha?.summary || 'Favorable phase for overall elevation' }
      ],
      createdAt: new Date().toISOString()
    };

    return res.json({ success: true, plan: completeKundli, source: 'gemini-3.8-flash' });
  } catch (error: any) {
    console.error('Error generating Kundli with Gemini:', error);
    // Return robust fallback Kundli on quota or connection error
    const fallback = buildAlgorithmicKundli(req.body);
    return res.json({ success: true, plan: fallback, source: 'fallback-synthesizer', errorNotice: error?.message });
  }
});

// -------------------------------------------------------------------------
// 2. Personal Astrologer Conversational Counseling API (/api/astrologer-chat)
// -------------------------------------------------------------------------
app.post('/api/astrologer-chat', async (req: Request, res: Response) => {
  try {
    const { message, activeKundli, chatHistory = [], category = 'general' } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: 'Message query is required.' });
    }

    const ai = getAIClient();

    const kundliSummary = activeKundli ? `
Native: ${activeKundli.birthDetails?.name || 'Native'} (${activeKundli.birthDetails?.dateOfBirth}, ${activeKundli.birthDetails?.timeOfBirth} at ${activeKundli.birthDetails?.placeOfBirth})
Lagna: ${activeKundli.ascendant?.sign} (${activeKundli.ascendant?.lord} lord)
Moon Sign: ${activeKundli.moonSign?.sign} (${activeKundli.moonSign?.nakshatra} nakshatra)
Current Dasha: ${activeKundli.currentDasha?.mahadasha} Mahadasha - ${activeKundli.currentDasha?.antardasha} Antardasha (ends ${activeKundli.currentDasha?.endsAt})
Manglik Status: ${activeKundli.doshas?.manglikDosha?.type} (Cancelled: ${activeKundli.doshas?.manglikDosha?.cancellation})
Sade Sati: ${activeKundli.doshas?.sadeSati?.phase}
Key Planets: ${(activeKundli.planets || []).map((p: any) => `${p.name} in House ${p.house} (${p.sign}, ${p.status})`).join('; ')}
` : 'No specific birth chart provided; ask seeker for their birth date, time, and city.';

    const systemPrompt = `You are "Acharya AstroGenie", an enlightened, deeply compassionate, and mathematically precise Vedic Astrologer and spiritual counselor.
You converse with seekers just like a wise personal family Guru who has consulted thousands of horoscopes.

YOUR CORE BEHAVIORS:
1. Warm, respectful Vedic greeting ("Namaste / Radhe Radhe / Jai Shri Krishna [Seeker Name], ...").
2. Explicitly cite the seeker's astrological placements to ground your reading (e.g. "Looking at your 10th house of career...", "Because your Moon is in Swati Nakshatra...", "In this ongoing Jupiter-Saturn Dasha...").
3. Address the seeker's specific concern directly:
   - Career & Profession (promotion timing, boss dynamics, job change vs stability)
   - Business & Wealth (partnership viability, favorable investment sectors, debt clearance)
   - Marriage & Romance (timing of marriage, partner traits, Manglik clarity, relationship peace)
   - Health & Mental Peace (remedies for anxiety, energetic blocks)
4. ALWAYS offer 2 to 3 targeted, actionable Vedic remedies (Upay / उपाय):
   - A potent Beej Mantra or Stotra (with count, e.g. 108 times, and best time of day).
   - Fasting (Vrat) or Charity (Daan) recommendation.
   - Gemstone or Rudraksha guidance (if appropriate).
   - A practical psychological or behavioral adjustment (Vedic lifestyle tip).
5. Maintain a comforting, reassuring, non-fearful tone. Vedic astrology is for empowerment and light (Jyotish = Science of Light), not fatalism.
Keep your response scannable with gentle headings, bullet points, and Sanskrit shloka quotes where fitting.`;

    if (!ai) {
      return res.json({
        success: true,
        reply: `Namaste ${activeKundli?.birthDetails?.name || 'Seeker'}, based on your ${activeKundli?.ascendant?.sign || 'Ascendant'} chart and current ${activeKundli?.currentDasha?.mahadasha || 'planetary'} Dasha:

1. **Astrological Diagnosis**: Your ${activeKundli?.currentDasha?.mahadasha || 'Jupiter'} Mahadasha is activating key houses of growth and maturity. While you may feel temporary friction in decision-making, the transit of benefics promises steady stabilization over the next 4 to 6 months.

2. **Personalized Vedic Remedies (उपाय)**:
   - **Mantra Japa**: Recite *"Om Namah Shivaya"* 108 times every morning facing East. This calms the lunar mind and clears anxiety.
   - **Charity (Daan)**: Donate yellow split chickpeas (chana dal) or bananas on Thursdays to a temple or cows.
   - **Daily Habit**: Drink water from a silver or copper glass in the morning to balance your constitutional elemental fire.

Stay centered and patient; the cosmic current is turning in your favor. Feel free to ask about your career, marriage, or financial timing!`,
        suggestedUpay: {
          mantra: 'Om Namah Shivaya (ॐ नमः शिवाय)',
          charity: 'Donate yellow lentils on Thursday',
          fasting: 'Thursday fast with salt-free meal'
        }
      });
    }

    const conversationContext = [
      { role: 'user', parts: [{ text: `Vedic Birth Chart Context:\n${kundliSummary}\n\nUser Question Category: ${category}\nQuestion: "${message}"` }] }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: conversationContext as any,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7
      }
    });

    const replyText = response.text || 'Namaste seeker, the celestial stars reveal auspicious currents ahead.';

    return res.json({
      success: true,
      reply: replyText,
      category,
      chartReference: `${activeKundli?.ascendant?.sign || 'Lagna'} / ${activeKundli?.currentDasha?.mahadasha || 'Mahadasha'}`
    });
  } catch (error: any) {
    console.error('Error in astrologer chat (using rich Vedic fallback):', error?.message);
    const fallback = generateVedicFallbackReply(req.body?.message || '', req.body?.activeKundli, req.body?.category || 'general');
    return res.json({
      success: true,
      reply: fallback.reply,
      suggestedUpay: fallback.suggestedUpay,
      category: req.body?.category || 'general',
      chartReference: `${req.body?.activeKundli?.ascendant?.sign || 'Lagna'} / ${req.body?.activeKundli?.currentDasha?.mahadasha || 'Dasha'}`,
      isResilientFallback: true
    });
  }
});

// -------------------------------------------------------------------------
// 3. Kundli Matching (Milan / Ashtakoot 36 Guna) API (/api/match-kundli)
// -------------------------------------------------------------------------
app.post('/api/match-kundli', async (req: Request, res: Response) => {
  try {
    const { boy, girl } = req.body || {};

    if (!boy?.dateOfBirth || !girl?.dateOfBirth) {
      return res.status(400).json({ error: 'Both boy and girl birth details are required for Kundli Matching.' });
    }

    const ai = getAIClient();

    if (!ai) {
      const fallbackMatch = buildAlgorithmicMatch(boy, girl);
      return res.json({ success: true, match: fallbackMatch, source: 'algorithmic-ashtakoot' });
    }

    const systemPrompt = `You are a master Vedic matchmaker and astrologer calculating classical Ashtakoot Guna Milan (36 Points) for marriage compatibility between:
Boy: ${boy.name || 'Groom'} (DOB: ${boy.dateOfBirth}, TOB: ${boy.timeOfBirth || '12:00'}, Place: ${boy.placeOfBirth})
Girl: ${girl.name || 'Bride'} (DOB: ${girl.dateOfBirth}, TOB: ${girl.timeOfBirth || '12:00'}, Place: ${girl.placeOfBirth})

Provide structured JSON with:
1. Moon sign and Nakshatra for both.
2. The 8 Ashtakoot scores with maximum and obtained points:
   - Varna (1 max)
   - Vashya (2 max)
   - Tara (3 max)
   - Yoni (4 max)
   - Graha Maitri (5 max)
   - Gana (6 max)
   - Bhakoot (7 max)
   - Nadi (8 max)
   Total score out of 36.
3. Manglik compatibility analysis (Boy Manglik status, Girl Manglik status, cancellation check, verdict).
4. Nadi Dosha and Bhakoot Dosha check.
5. In-depth counselor summary detailing marital longevity, mental harmony, financial prosperity, and progeny blessings.
6. 3 recommended pre-marital or post-marital harmony rituals.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            boyMoonSign: { type: Type.STRING },
            boyNakshatra: { type: Type.STRING },
            girlMoonSign: { type: Type.STRING },
            girlNakshatra: { type: Type.STRING },
            totalScore: { type: Type.NUMBER },
            compatibilityLevel: { type: Type.STRING },
            manglikCompatibility: {
              type: Type.OBJECT,
              properties: {
                boyManglik: { type: Type.BOOLEAN },
                girlManglik: { type: Type.BOOLEAN },
                verdict: { type: Type.STRING },
                remedyNeeded: { type: Type.BOOLEAN },
                remedyTips: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['boyManglik', 'girlManglik', 'verdict', 'remedyNeeded', 'remedyTips']
            },
            nadiDosha: {
              type: Type.OBJECT,
              properties: {
                hasNadiDosha: { type: Type.BOOLEAN },
                severity: { type: Type.STRING },
                cancellation: { type: Type.BOOLEAN },
                advice: { type: Type.STRING }
              },
              required: ['hasNadiDosha', 'severity', 'cancellation', 'advice']
            },
            bhakootDosha: {
              type: Type.OBJECT,
              properties: {
                hasBhakootDosha: { type: Type.BOOLEAN },
                advice: { type: Type.STRING }
              },
              required: ['hasBhakootDosha', 'advice']
            },
            scores: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  hindiName: { type: Type.STRING },
                  maximumPoints: { type: Type.NUMBER },
                  obtainedPoints: { type: Type.NUMBER },
                  area: { type: Type.STRING },
                  verdict: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ['name', 'hindiName', 'maximumPoints', 'obtainedPoints', 'area', 'verdict', 'explanation']
              }
            },
            counselorSummary: { type: Type.STRING },
            recommendedRituals: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['boyMoonSign', 'boyNakshatra', 'girlMoonSign', 'girlNakshatra', 'totalScore', 'compatibilityLevel', 'manglikCompatibility', 'nadiDosha', 'bhakootDosha', 'scores', 'counselorSummary', 'recommendedRituals']
        }
      }
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');

    const result = {
      id: 'match-' + Date.now(),
      boyName: boy.name || 'Groom',
      boyBirth: `${boy.dateOfBirth}, ${boy.timeOfBirth || ''}, ${boy.placeOfBirth}`,
      girlName: girl.name || 'Bride',
      girlBirth: `${girl.dateOfBirth}, ${girl.timeOfBirth || ''}, ${girl.placeOfBirth}`,
      minimumRequired: 18,
      ...parsed,
      createdAt: new Date().toISOString()
    };

    return res.json({ success: true, match: result, source: 'gemini-3.8-flash' });
  } catch (error: any) {
    console.error('Error matching Kundli:', error);
    const fallbackMatch = buildAlgorithmicMatch(req.body?.boy, req.body?.girl);
    return res.json({ success: true, match: fallbackMatch, source: 'fallback-match', errorNotice: error?.message });
  }
});

// -------------------------------------------------------------------------
// 4. Daily Horoscope & Shubh Muhurat API (/api/daily-horoscope)
// -------------------------------------------------------------------------
app.post('/api/daily-horoscope', async (req: Request, res: Response) => {
  try {
    const { sign = 'Tula' } = req.body || {};
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        success: true,
        horoscope: {
          sign,
          englishSign: getEnglishSign(sign),
          date: 'Today',
          overallRating: 4.8,
          luckyNumber: 6,
          luckyColor: 'Pearl White & Gold',
          luckyGem: 'Diamond / White Zircon',
          rulingPlanet: 'Shukra (Venus)',
          predictions: {
            personal: 'Cosmic vibrations encourage harmony in your personal affairs. Great day to express appreciation to elders and loved ones.',
            career: 'Productive collaborations at work. Strategic clarity helps you finish long-pending deliverables with poise.',
            finance: 'Favorable planetary alignment for reviewing savings and budgeting for upcoming festivities.',
            love: 'Warm emotional reciprocity. A pleasant surprise awaits you from your partner or romantic prospect.',
            health: 'Vibrant energy. Maintain adequate hydration and avoid irregular meal times.'
          },
          shubhMuhuratToday: {
            abhijitMuhurat: '11:46 AM - 12:35 PM',
            amritKaal: '03:15 PM - 04:50 PM',
            shubhChoghadiya: '09:10 AM - 10:40 AM'
          },
          ashubhTimings: {
            rahuKaal: '04:30 PM - 06:00 PM',
            yamaganda: '01:30 PM - 03:00 PM',
            gulikaKaal: '07:30 AM - 09:00 AM'
          },
          dailyUpay: 'Offer a fragrant white flower to Goddess Lakshmi and chant "Om Shum Shukraya Namaha" 11 times.'
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Generate an authentic Vedic Daily Horoscope for Rashi "${sign}" including Panchang timings, Shubh Muhurat (Abhijit, Amrit Kaal, Shubh Choghadiya), Inauspicious timings (Rahu Kaal, Yamaganda), predictions across Personal, Career, Finance, Love, Health, and a targeted Daily Upay.`,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sign: { type: Type.STRING },
            englishSign: { type: Type.STRING },
            date: { type: Type.STRING },
            overallRating: { type: Type.NUMBER },
            luckyNumber: { type: Type.INTEGER },
            luckyColor: { type: Type.STRING },
            luckyGem: { type: Type.STRING },
            rulingPlanet: { type: Type.STRING },
            predictions: {
              type: Type.OBJECT,
              properties: {
                personal: { type: Type.STRING },
                career: { type: Type.STRING },
                finance: { type: Type.STRING },
                love: { type: Type.STRING },
                health: { type: Type.STRING }
              },
              required: ['personal', 'career', 'finance', 'love', 'health']
            },
            shubhMuhuratToday: {
              type: Type.OBJECT,
              properties: {
                abhijitMuhurat: { type: Type.STRING },
                amritKaal: { type: Type.STRING },
                shubhChoghadiya: { type: Type.STRING }
              },
              required: ['abhijitMuhurat', 'amritKaal', 'shubhChoghadiya']
            },
            ashubhTimings: {
              type: Type.OBJECT,
              properties: {
                rahuKaal: { type: Type.STRING },
                yamaganda: { type: Type.STRING },
                gulikaKaal: { type: Type.STRING }
              },
              required: ['rahuKaal', 'yamaganda', 'gulikaKaal']
            },
            dailyUpay: { type: Type.STRING }
          },
          required: ['sign', 'englishSign', 'date', 'overallRating', 'luckyNumber', 'luckyColor', 'luckyGem', 'rulingPlanet', 'predictions', 'shubhMuhuratToday', 'ashubhTimings', 'dailyUpay']
        }
      }
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return res.json({ success: true, horoscope: parsed });
  } catch (error: any) {
    console.error('Error generating horoscope:', error);
    return res.status(500).json({ error: error?.message || 'Horoscope generation failed.' });
  }
});

// -------------------------------------------------------------------------
// 5. Prashna Kundli (Instant Horary Astrology) API (/api/prashna-kundli)
// -------------------------------------------------------------------------
app.post('/api/prashna-kundli', async (req: Request, res: Response) => {
  try {
    const { question, location = 'New Delhi, India' } = req.body || {};

    if (!question) {
      return res.status(400).json({ error: 'Question text is required for Prashna Kundli.' });
    }

    const ai = getAIClient();
    const now = new Date();
    const timestampStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short', year: 'numeric' });

    if (!ai) {
      const fallbackResult = {
        id: 'prashna-' + Date.now(),
        question,
        category: 'Urgent Query',
        timestamp: timestampStr,
        location,
        prashnaLagna: {
          sign: 'Dhanu (Sagittarius)',
          degree: 19.2,
          lord: 'Guru (Jupiter)',
          nakshatra: 'Purva Ashadha'
        },
        karyeshPlanet: 'Surya (Sun) & Guru (Jupiter)',
        verdict: 'Highly Auspicious (पूर्ण सफलता)',
        confidenceScore: 92,
        timingOfResult: 'Within 9 to 18 days',
        detailedDiagnosis: 'According to classical Prashna Marga, the query Lagna is fortified by benefic aspects of Jupiter. The planetary significators are direct and unhindered, indicating favorable resolution.',
        immediateUpay: {
          mantra: 'Om Namo Bhagavate Vasudevaya (ॐ नमो भगवते वासुदेवाय)',
          action: 'Feed yellow split chickpeas or bananas to holy cows on Thursday',
          direction: 'Face North-East during critical negotiations'
        }
      };
      return res.json({ success: true, result: fallbackResult });
    }

    const systemPrompt = `You are a revered Vedic Horary Astrologer (Prashna Daivajna) practicing classical Prashna Marga and Shatpanchasika.
A seeker has posed this urgent question at the current moment:
Question: "${question}"
Timestamp: ${timestampStr}
Location: ${location}

Analyze the horary planetary configuration for this exact moment and output structured JSON:
1. Prashna Lagna (sign, degree, lord, nakshatra).
2. Karyesh (the main planetary significator for the question).
3. Verdict: must be one of "Highly Auspicious (पूर्ण सफलता)", "Delayed Success (प्रतीक्षा उपरांत सिद्धि)", or "Unfavorable / Obstacles (बाधा योग)".
4. Confidence score (number between 70 and 98).
5. Timing of result (Phalaprapti Kal, e.g. "Within 10 to 18 days").
6. Detailed Parashara diagnosis explanation.
7. Immediate Upay: potent Beej Mantra, auspicious action, and favorable compass direction.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: systemPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: { type: Type.STRING },
            prashnaLagna: {
              type: Type.OBJECT,
              properties: {
                sign: { type: Type.STRING },
                degree: { type: Type.NUMBER },
                lord: { type: Type.STRING },
                nakshatra: { type: Type.STRING }
              },
              required: ['sign', 'degree', 'lord', 'nakshatra']
            },
            karyeshPlanet: { type: Type.STRING },
            verdict: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER },
            timingOfResult: { type: Type.STRING },
            detailedDiagnosis: { type: Type.STRING },
            immediateUpay: {
              type: Type.OBJECT,
              properties: {
                mantra: { type: Type.STRING },
                action: { type: Type.STRING },
                direction: { type: Type.STRING }
              },
              required: ['mantra', 'action', 'direction']
            }
          },
          required: ['category', 'prashnaLagna', 'karyeshPlanet', 'verdict', 'confidenceScore', 'timingOfResult', 'detailedDiagnosis', 'immediateUpay']
        }
      }
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    const result = {
      id: 'prashna-' + Date.now(),
      question,
      timestamp: timestampStr,
      location,
      ...parsed
    };

    return res.json({ success: true, result });
  } catch (error: any) {
    console.error('Error casting Prashna:', error);
    // Provide resilient fallback
    return res.json({
      success: true,
      result: {
        id: 'prashna-fb-' + Date.now(),
        question: req.body?.question || 'Your Query',
        timestamp: new Date().toLocaleTimeString(),
        location: req.body?.location || 'New Delhi, India',
        category: 'Horary Query',
        prashnaLagna: {
          sign: 'Mesha (Aries)',
          degree: 12.5,
          lord: 'Mangal (Mars)',
          nakshatra: 'Ashwini'
        },
        karyeshPlanet: 'Guru (Jupiter)',
        verdict: 'Highly Auspicious (पूर्ण सफलता)',
        confidenceScore: 90,
        timingOfResult: 'Within 7 to 15 days',
        detailedDiagnosis: 'Classical Prashna Marga reveals strong benefic aspects between the Lagna lord and the house of fulfillment. Maintain patience and pursue decisive communication.',
        immediateUpay: {
          mantra: 'Om Namah Shivaya (ॐ नमः शिवाय)',
          action: 'Recite Hanuman Chalisa on Tuesdays',
          direction: 'Face East'
        }
      }
    });
  }
});

// ----------------------------------------------------
// Helper Functions & Fallback Synthesizers
// ----------------------------------------------------
function getHouseName(h: number): string {
  const names = [
    'Tanu Bhava (Self & Vitality)',
    'Dhana Bhava (Wealth & Speech)',
    'Sahaja Bhava (Courage & Siblings)',
    'Sukha Bhava (Mother & Property)',
    'Putra Bhava (Children & Intellect)',
    'Ari Bhava (Debts & Competitors)',
    'Yuvati Bhava (Spouse & Partners)',
    'Randhra Bhava (Longevity & Secrets)',
    'Dharma Bhava (Fortune & Wisdom)',
    'Karma Bhava (Profession & Honor)',
    'Labha Bhava (Gains & Network)',
    'Vyaya Bhava (Moksha & Expenses)'
  ];
  return names[h - 1] || `Bhava ${h}`;
}

function getHouseSignificance(h: number): string {
  const sigs = [
    'Physical health, personality, life longevity, head',
    'Financial liquidity, family heritage, speech, throat',
    'Courage, enterprise, younger siblings, artistic hands',
    'Mother, domestic peace, vehicles, land, heart',
    'Intellectual acumen, past-life merits (Purva Punya), romance',
    'Enemies, legal disputes, daily workplace, immune health',
    'Life partner, marriage bond, commercial alliances, trade',
    'Sudden transformations, occult studies, inheritances',
    'Higher philosophy, gurus, pilgrimages, divine fortune',
    'Public reputation, career trajectory, executive authority',
    'Prosperity, expansion, elder siblings, social impact',
    'Spiritual liberation (Moksha), foreign travels, meditation'
  ];
  return sigs[h - 1] || 'Astrological significance';
}

function getFavorablePlanets(h: number): string[] {
  const map: Record<number, string[]> = {
    1: ['Surya', 'Guru', 'Shukra'],
    2: ['Guru', 'Budha', 'Chandra'],
    3: ['Mangal', 'Shani'],
    4: ['Chandra', 'Shukra', 'Guru'],
    5: ['Guru', 'Budha'],
    6: ['Mangal', 'Shani', 'Rahu'],
    7: ['Shukra', 'Guru'],
    8: ['Shani', 'Ketu'],
    9: ['Guru', 'Surya'],
    10: ['Surya', 'Mangal', 'Guru', 'Budha'],
    11: ['Guru', 'Shani', 'Budha', 'Surya'],
    12: ['Ketu', 'Guru', 'Shukra']
  };
  return map[h] || ['Guru'];
}

function getEnglishSign(sign: string): string {
  const signs: Record<string, string> = {
    Mesha: 'Aries', Vrishabha: 'Taurus', Mithuna: 'Gemini', Karka: 'Cancer',
    Simha: 'Leo', Kanya: 'Virgo', Tula: 'Libra', Vrishchika: 'Scorpio',
    Dhanu: 'Sagittarius', Makara: 'Capricorn', Kumbha: 'Aquarius', Meena: 'Pisces'
  };
  return signs[sign] || sign;
}

function buildAlgorithmicKundli(details: any) {
  const signNames = ['Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya', 'Tula', 'Vrishchika', 'Dhanu', 'Makara', 'Kumbha', 'Meena'];
  const dob = details?.dateOfBirth || '1995-10-14';
  const month = parseInt(dob.split('-')[1] || '10', 10);
  const day = parseInt(dob.split('-')[2] || '14', 10);
  
  // Calculate deterministic Lagna and Moon based on day and month
  const lagnaIdx = (month + Math.floor(day / 3)) % 12;
  const moonIdx = (month + 4) % 12;
  const lagnaSign = signNames[lagnaIdx];
  const moonSign = signNames[moonIdx];

  return {
    id: 'kundli-' + Date.now(),
    birthDetails: details,
    ascendant: {
      sign: lagnaSign,
      signNumber: lagnaIdx + 1,
      degree: 14.5,
      lord: 'Guru',
      nakshatra: 'Swati',
      pada: 3
    },
    moonSign: {
      sign: moonSign,
      signNumber: moonIdx + 1,
      degree: 12.3,
      lord: 'Chandra',
      nakshatra: 'Rohini',
      pada: 2
    },
    sunSign: {
      sign: signNames[(month + 2) % 12],
      signNumber: ((month + 2) % 12) + 1,
      degree: 21.0
    },
    planets: [
      { name: 'Surya', englishName: 'Sun', sign: signNames[(lagnaIdx + 9) % 12], signNumber: ((lagnaIdx + 9) % 12) + 1, house: 10, degree: 18.2, nakshatra: 'Pushya', pada: 2, isRetrograde: false, status: 'Friendly', description: 'Sun in 10th house creates Digbala (directional strength), giving executive leadership.' },
      { name: 'Chandra', englishName: 'Moon', sign: moonSign, signNumber: moonIdx + 1, house: 4, degree: 12.3, nakshatra: 'Rohini', pada: 2, isRetrograde: false, status: 'Exalted', description: 'Exalted Moon in 4th house grants calm mental peace, mother blessings, and property.' },
      { name: 'Mangal', englishName: 'Mars', sign: signNames[(lagnaIdx + 1) % 12], signNumber: ((lagnaIdx + 1) % 12) + 1, house: 2, degree: 22.1, nakshatra: 'Mrigashira', pada: 1, isRetrograde: false, status: 'Own House', description: 'Mars in 2nd house builds resolute wealth creation and decisive articulation.' },
      { name: 'Budha', englishName: 'Mercury', sign: signNames[(lagnaIdx + 9) % 12], signNumber: ((lagnaIdx + 9) % 12) + 1, house: 10, degree: 14.0, nakshatra: 'Ashlesha', pada: 3, isRetrograde: false, status: 'Friendly', description: 'Budhaditya Yoga in 10th house blesses razor-sharp commercial and intellectual acumen.' },
      { name: 'Guru', englishName: 'Jupiter', sign: lagnaSign, signNumber: lagnaIdx + 1, house: 1, degree: 9.4, nakshatra: 'Punarvasu', pada: 4, isRetrograde: false, status: 'Own House', description: 'Hamsa Mahapurusha Yoga! Jupiter in Lagna imparts wisdom, noble demeanor, and lifelong protection.' },
      { name: 'Shukra', englishName: 'Venus', sign: signNames[(lagnaIdx + 10) % 12], signNumber: ((lagnaIdx + 10) % 12) + 1, house: 11, degree: 26.5, nakshatra: 'Magha', pada: 2, isRetrograde: false, status: 'Friendly', description: 'Venus in 11th house generates lucrative income streams, luxury assets, and high-status connections.' },
      { name: 'Shani', englishName: 'Saturn', sign: signNames[(lagnaIdx + 4) % 12], signNumber: ((lagnaIdx + 4) % 12) + 1, house: 5, degree: 15.3, nakshatra: 'Chitra', pada: 4, isRetrograde: true, status: 'Exalted', description: 'Exalted Saturn in 5th house rewards patient research and long-term disciplined investments.' },
      { name: 'Rahu', englishName: 'North Node', sign: signNames[(lagnaIdx + 6) % 12], signNumber: ((lagnaIdx + 6) % 12) + 1, house: 7, degree: 5.1, nakshatra: 'Swati', pada: 1, isRetrograde: true, status: 'Neutral', description: 'Rahu in 7th inspires unconventional partnerships and global commercial reach.' },
      { name: 'Ketu', englishName: 'South Node', sign: lagnaSign, signNumber: lagnaIdx + 1, house: 1, degree: 5.1, nakshatra: 'Ashwini', pada: 3, isRetrograde: true, status: 'Neutral', description: 'Ketu in 1st awakens deep spiritual curiosity, intuition, and detachment from superficial vanity.' }
    ],
    houses: Array.from({ length: 12 }, (_, i) => ({
      houseNumber: i + 1,
      sanskritName: getHouseName(i + 1),
      significance: getHouseSignificance(i + 1),
      signNumber: ((lagnaIdx + i) % 12) + 1,
      signName: signNames[(lagnaIdx + i) % 12],
      signLord: 'Guru',
      planetsInside: i === 0 ? ['Guru', 'Ketu'] : (i === 1 ? ['Mangal'] : (i === 3 ? ['Chandra'] : (i === 9 ? ['Surya', 'Budha'] : (i === 10 ? ['Shukra'] : [])))),
      favorablePlanets: getFavorablePlanets(i + 1)
    })),
    currentDasha: {
      mahadasha: 'Guru',
      antardasha: 'Budha',
      pratyantardasha: 'Shukra',
      endsAt: '2028-06-25',
      summary: 'Highly auspicious Guru-Budha dasha activating career zenith, intellectual elevation, and financial stability.'
    },
    dashaTimeline: [
      { planet: 'Guru', startDate: '2022-01-01', endDate: '2038-01-01', status: 'Current', nature: 'Auspicious', prediction: '16-year golden era for prosperity, wisdom, and life achievements.' }
    ],
    doshas: {
      manglikDosha: { hasDosha: false, type: 'No Manglik', reason: 'Mars is placed in favorable 2nd house without affliction.', cancellation: true },
      sadeSati: { isActive: false, phase: 'Not in Sade Sati', currentSaturnTransitSign: 'Aquarius', impact: 'Transit Saturn is favorably placed from natal Moon.', remedyTips: ['Chant Hanuman Chalisa on Tuesdays'] },
      kaalSarpDosha: { hasDosha: false, severity: 'None', recommendation: 'Planets are freely placed without Kaal Sarp constriction.' },
      pitraDosha: { hasDosha: false, summary: 'Paternal blessings are fully intact.' }
    },
    remedies: {
      gemstones: [
        { name: 'Yellow Sapphire (Pukhraj)', hindiName: 'Pukhraj', planet: 'Guru', metal: '22K Gold', finger: 'Index finger of right hand', auspiciousDay: 'Thursday morning', idealWeight: '5.25 Ratti', mantra: 'Om Brim Brihaspataye Namaha', benefits: 'Ignites wisdom, financial growth, and family prosperity.' },
        { name: 'Emerald (Panna)', hindiName: 'Panna', planet: 'Budha', metal: 'Gold / Silver', finger: 'Little finger of right hand', auspiciousDay: 'Wednesday morning', idealWeight: '4.25 Ratti', mantra: 'Om Bum Budhaya Namaha', benefits: 'Sharpens commercial acumen, speech, and analytical success.' }
      ],
      mantras: [
        { title: 'Gayatri Mantra', deity: 'Savitr / Gayatri Devi', sanskritMantra: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात् ॥', transliteration: 'Om Bhur Bhuvah Svah Tat Savitur Varenyam Bhargo Devasya Dheemahi Dhiyo Yo Nah Prachodayat ||', meaning: 'May the divine light of the supreme Sun illuminate our intellect and dispel all ignorance.', targetPlanet: 'Surya', idealTime: 'Sunrise', repetitionCount: 108 },
        { title: 'Maha Mrityunjaya Mantra', deity: 'Lord Shiva', sanskritMantra: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् । उर्वारुकमिव बन्धनान्मृत्योर्मुक्षीय मामृतात् ॥', transliteration: 'Om Tryambakam Yajamahe Sugandhim Pushtivardhanam...', meaning: 'Divine healing prayer for vitality, mental peace, and protection from untimely obstacles.', targetPlanet: 'Chandra', idealTime: 'Morning', repetitionCount: 108 }
      ],
      fasting: [
        { day: 'Thursday (Brihaspativar)', associatedDeity: 'Lord Vishnu & Brihaspati', targetPlanet: 'Guru', ritualRules: ['Wear light yellow clothes', 'Consume one salt-free meal'], spiritualBenefit: 'Empowers career trajectory and resolves financial bottlenecks.' }
      ],
      charities: [
        { title: 'Anna Daan & Gau Seva', itemsToDonate: ['Green fodder to cows', 'Bananas & Yellow lentils to temples'], auspiciousDay: 'Thursday', recipient: 'Gaushala or needy students', targetPlanetaryDosha: 'Guru alignment' }
      ],
      rudrakshaRecommendation: { mukhi: '5 Mukhi + 7 Mukhi Rudraksha', rulingPlanet: 'Jupiter & Goddess Mahalakshmi', benefits: 'Calms cardiovascular stress and attracts stable wealth.' },
      lifestyleUpay: [
        'Face East or North-East while studying or working.',
        'Drink water stored in copper vessel in the morning.',
        'Never disrespect teachers, elders, or holy scriptures.',
        'Keep fresh flowers in the living room on Fridays.'
      ]
    },
    lifeAreas: {
      career: { score: 92, summary: 'Superb prospects in management, consultancy, technology architecture, and public entrepreneurship.', favorablePeriods: '2024-2028', cautionaryNote: 'Avoid overextending across too many projects simultaneously.' },
      wealthAndBusiness: { score: 89, summary: 'Strong Dhana Yogas ensure multiple reliable streams of passive and active wealth.', favorableInvestments: 'Sovereign gold, real estate, blue-chip equities.' },
      marriageAndLove: { score: 86, summary: 'Affectionate and supportive partner with high ethical standards.', partnerQualities: 'Cultured, articulate, compassionate, intellectually engaging.', timing: 'Highly highlighted between ages 28 and 31.' },
      health: { score: 85, summary: 'Robust constitution. Balance digestion and maintain proper sleep schedule.', vulnerableOrgans: 'Digestive fire (Agni), lower back.', dietaryTips: 'Incorporate amla, turmeric milk, and cooling fennel tea.' }
    },
    createdAt: new Date().toISOString()
  };
}

function buildAlgorithmicMatch(boy: any, girl: any) {
  return {
    id: 'match-' + Date.now(),
    boyName: boy?.name || 'Groom',
    boyBirth: `${boy?.dateOfBirth || '1995-10-14'}, ${boy?.placeOfBirth || 'Delhi'}`,
    boyMoonSign: 'Mithuna (Gemini)',
    boyNakshatra: 'Ardra (Pada 1)',
    girlName: girl?.name || 'Bride',
    girlBirth: `${girl?.dateOfBirth || '1997-04-22'}, ${girl?.placeOfBirth || 'Mumbai'}`,
    girlMoonSign: 'Tula (Libra)',
    girlNakshatra: 'Swati (Pada 4)',
    totalScore: 29.5,
    minimumRequired: 18,
    compatibilityLevel: 'Very Auspicious (24-29)',
    manglikCompatibility: {
      boyManglik: false,
      girlManglik: false,
      verdict: 'Both partners have peaceful Mars placements without Kuja Dosha. Marital peace is strongly blessed.',
      remedyNeeded: false,
      remedyTips: ['Perform a simple joint Shiv-Parvati Puja on Vivaha Panchami for lasting bliss.']
    },
    nadiDosha: {
      hasNadiDosha: false,
      severity: 'None',
      cancellation: true,
      advice: 'Different Nadis award the maximum 8/8 points, ensuring excellent progeny health and vitality.'
    },
    bhakootDosha: {
      hasBhakootDosha: false,
      advice: 'Harmonious 5-9 Trikona placement between Gemini and Libra awards full 7/7 points for family fortune.'
    },
    scores: [
      { name: 'Varna', hindiName: 'वर्ण', maximumPoints: 1, obtainedPoints: 1, area: 'Ego & Spiritual Compatibility', verdict: 'Excellent', explanation: 'Complementary spiritual inclinations promote mutual respect.' },
      { name: 'Vashya', hindiName: 'वश्य', maximumPoints: 2, obtainedPoints: 2, area: 'Mutual Magnetic Attraction', verdict: 'Excellent', explanation: 'Balanced power dynamic and deep interpersonal magnetism.' },
      { name: 'Tara', hindiName: 'तारा', maximumPoints: 3, obtainedPoints: 3, area: 'Destiny & Health Compatibility', verdict: 'Excellent', explanation: 'Kalyana Tara alignment supports long-term prosperity.' },
      { name: 'Yoni', hindiName: 'योनि', maximumPoints: 4, obtainedPoints: 2.5, area: 'Intimacy & Biological Affinity', verdict: 'Good', explanation: 'Warm romantic affinity and gentle empathy.' },
      { name: 'Graha Maitri', hindiName: 'ग्रह मैत्री', maximumPoints: 5, obtainedPoints: 5, area: 'Mental & Psychological Bond', verdict: 'Excellent', explanation: 'Planetary lords Mercury and Venus share intimate friendship.' },
      { name: 'Gana', hindiName: 'गण', maximumPoints: 6, obtainedPoints: 1, area: 'Temperament & Lifestyle Values', verdict: 'Average', explanation: 'Easily reconciled through open communication.' },
      { name: 'Bhakoot', hindiName: 'भकूट', maximumPoints: 7, obtainedPoints: 7, area: 'Family Welfare & Prosperity', verdict: 'Excellent', explanation: 'Auspicious 5-9 relationship blesses wealth and children.' },
      { name: 'Nadi', hindiName: 'नाड़ी', maximumPoints: 8, obtainedPoints: 8, area: 'Genetic & Health Harmony', verdict: 'Excellent', explanation: 'Different Nadis guarantee genetic vitality.' }
    ],
    counselorSummary: 'The horoscopes of the Groom and Bride align with an exceptional score of 29.5 out of 36 points. Both Moon signs share Air-element compatibility, ensuring seamless mental companionship and shared lifestyle values. This marriage alliance is wholeheartedly recommended by Vedic standards.',
    recommendedRituals: [
      'Recite the Vishnu Sahasranama together once a month.',
      'Visit a Navagraha temple on a Sunday or Thursday before marriage.'
    ],
    createdAt: new Date().toISOString()
  };
}

function generateVedicFallbackReply(message: string, activeKundli: any, category: string): { reply: string; suggestedUpay: any } {
  const name = activeKundli?.birthDetails?.name || 'Seeker';
  const lagna = activeKundli?.ascendant?.sign || 'Ascendant';
  const moon = activeKundli?.moonSign?.sign || 'Moon';
  const dasha = activeKundli?.currentDasha?.mahadasha || 'Jupiter (Guru)';
  const antardasha = activeKundli?.currentDasha?.antardasha || 'Saturn (Shani)';

  let reply = `Namaste ${name}. I am analyzing your ${lagna} Lagna and ${moon} Moon Sign closely regarding your inquiry.\n\n`;

  if (category === 'career' || message.toLowerCase().includes('career') || message.toLowerCase().includes('job') || message.toLowerCase().includes('promotion')) {
    reply += `1. **Astrological Diagnosis for Career (कर्म भाव)**: Your 10th house of profession and current ${dasha}-${antardasha} Dasha indicate significant shifts in authority and responsibility. While recent months may have presented tests of patience, the upcoming planetary transits signal strong recognition and promotional opportunities within the next 3 to 6 months.\n\n` +
      `2. **Key Strategic Guidance**: Stay focused on strategic leadership and documentation. Avoid impetuous resignations during retrograde windows; focus on consolidating your expertise.\n\n` +
      `3. **Targeted Upay (उपाय)**:\n` +
      `• **Surya Arghya**: Offer water with red kumkum to the rising Sun every morning facing East.\n` +
      `• **Mantra**: Recite the Gayatri Mantra or Aditya Hridaya Stotra Moola Mantra 11 times daily.\n` +
      `• **Charity**: Donate whole wheat or jaggery (Gud) on Sundays.`;
    return {
      reply,
      suggestedUpay: {
        mantra: 'Om Ghrinih Surya Adityaha Om (ॐ घृणिः सूर्य आदित्यः ॐ)',
        charity: 'Donate whole wheat or jaggery on Sundays',
        fasting: 'Sunday salt-free diet for career elevation'
      }
    };
  }

  if (category === 'marriage' || message.toLowerCase().includes('marriage') || message.toLowerCase().includes('spouse') || message.toLowerCase().includes('love')) {
    reply += `1. **Astrological Diagnosis for Marriage & Relationships (युवति भाव)**: Your 7th house and Venus placements indicate a life partner who is intellectually engaging, cultured, and supportive. ${activeKundli?.doshas?.manglikDosha?.hasDosha ? 'Your chart shows an auspicious cancellation of Kuja Dosha, ensuring marital harmony.' : 'Your 7th house receives protective benefic aspects.'}\n\n` +
      `2. **Timing of Union**: The strongest activation window for matrimonial events occurs under your benefic dasha sub-periods, especially between late autumn and early spring.\n\n` +
      `3. **Targeted Upay (उपाय)**:\n` +
      `• **Gauri-Shankar Puja**: Offer fragrant white flowers to Goddess Lakshmi and Lord Shiva on Fridays.\n` +
      `• **Mantra**: Recite *"Om Shum Shukraya Namaha"* (ॐ शुं शुक्राय नमः) 108 times on Friday mornings.\n` +
      `• **Charity**: Feed green fodder or sweetened dough balls to cows on Friday or Wednesday.`;
    return {
      reply,
      suggestedUpay: {
        mantra: 'Om Shum Shukraya Namaha (ॐ शुं शुक्राय नमः)',
        charity: 'Feed sacred cows on Friday mornings',
        fasting: 'Friday fast honoring Goddess Lakshmi'
      }
    };
  }

  if (category === 'business' || message.toLowerCase().includes('business') || message.toLowerCase().includes('invest') || message.toLowerCase().includes('money')) {
    reply += `1. **Astrological Diagnosis for Wealth & Commerce (धन व लाभ भाव)**: With your 2nd house of accumulated wealth and 11th house of gains activated, you possess natural commercial resilience. Planetary alignments favor structured asset diversification over speculative intraday risks.\n\n` +
      `2. **Favorable Sectors**: Technology architecture, consultancy, commercial leasing, and high-value partnerships.\n\n` +
      `3. **Targeted Upay (उपाय)**:\n` +
      `• **Kuber Alignment**: Keep your cash box or financial vault in the North direction (ruled by Lord Kuber).\n` +
      `• **Mantra**: Recite *"Om Gam Ganapataye Namaha"* 108 times before starting new business ventures.\n` +
      `• **Charity**: Support needy students with educational books on Thursdays.`;
    return {
      reply,
      suggestedUpay: {
        mantra: 'Om Gam Ganapataye Namaha (ॐ गं गणपतये नमः)',
        charity: 'Donate stationery/books to deserving students on Thursday',
        fasting: 'Thursday fast for Lord Brihaspati'
      }
    };
  }

  // General Vedic Counseling
  reply += `1. **Celestial Outlook**: In your ongoing ${dasha} Mahadasha, your internal vitality and discernment are steadily refining. Trust the natural divine timing of events.\n\n` +
    `2. **Universal Upay (उपाय)**:\n` +
    `• **Maha Mrityunjaya Japa**: Recite *"Om Tryambakam Yajamahe..."* or *"Om Namah Shivaya"* 108 times in the morning.\n` +
    `• **Elemental Balance**: Drink water stored in a copper vessel upon waking to balance pitta and kapha doshas.\n` +
    `• **Charity**: Practice Anna Daan (feeding birds or animals daily) to dispel subtle karmic frictions.`;

  return {
    reply,
    suggestedUpay: {
      mantra: 'Om Namah Shivaya (ॐ नमः शिवाय)',
      charity: 'Feed birds and stray animals every morning',
      fasting: 'Ekadashi or Monday fast for spiritual clarity'
    }
  };
}

// ----------------------------------------------------
// Static / Vite Middleware Setup
// ----------------------------------------------------
async function startServer() {
  if (process.env.VERCEL) {
    return;
  }

  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AstroGenie server listening on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
