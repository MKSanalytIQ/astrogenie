# 🕉️ AstroGenie — Personal Vedic AI Astrologer & Kundli Counselor

<div align="center">

![AstroGenie Logo](https://img.shields.io/badge/AstroGenie-Vedic%20AI%20Astrologer-F59E0B?style=for-the-badge&logo=target)
[![Vercel Deployment](https://img.shields.io/badge/Deploy-Vercel%20Ready-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-amber.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Direct, compassionate Vedic astrological guidance, 36-Guna Kundli matching, daily Muhurat, and personalized remedies (Upay) for ₹299 – ₹499/month.**

</div>

---

## 🌟 Executive Overview

**AstroGenie** is a modern full-stack Vedic Astrology platform powered by Gemini 3.8 Flash and classical Indian Jyotish principles (*Brihat Parashara Hora Shastra*, *Jaimini Sutras*, and *Lahiri Ayanamsha*). It delivers personal astrologer consultations at consumer SaaS pricing, eliminating high hourly guru fees and long wait times.

### 🎯 Key Capabilities

- **Interactive North Indian Kundli (D-1 & D-9 Navamsha)**: Dynamic SVG diamond chart with 12 clickable Bhavas, planetary resident inspect, and Lahiri Ayanamsha degrees.
- **Acharya AstroGenie Chat**: Context-aware consultation engine reading the native's Lagna, Moon Nakshatra, ongoing Vimshottari Mahadasha, and transits.
- **Vedic Remedies (उपाय) Sanctuary**:
  - Consecrated Gemstones (*Ratna*) with finger, metal, auspicious day, and prana-pratishtha mantras.
  - Sacred Vedic & Beej Mantras with audio recitation for correct Sanskrit pronunciation.
  - Auspicious Fasting (*Vrat*) and Charity (*Daan*) schedules.
  - Botanical Rudraksha recommendations (e.g. 5 Mukhi + 7 Mukhi Kavach).
- **Ashtakoot Kundli Milan (36 Gunas)**:
  - 8-fold compatibility breakdown (*Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot, Nadi*).
  - Kuja Dosha (Manglik) cancellation analysis and pre-marital harmonizing rituals.
- **Panchang & Muhurat Calendar**:
  - Live Abhijit Muhurat, Amrit Kaal, and Shubh Choghadiya.
  - Inauspicious Rahu Kaal and Yamaganda tracking.
  - Monthly Good & Bad dates calendar for Business contracts, Marriage, Property, and Gold purchases.
- **Tiered Membership Model**:
  - **Shubh Starter (₹299/mo)**: 5 consultations/mo + full Janam Kundli + gemstone/mantra guide.
  - **Kalyan Pro (₹499/mo)**: Unlimited 24/7 Astrologer chat + Voice recitation + unlimited 36 Guna matchmaking + monthly auspicious dates.
  - **Divya Annual Pass (₹2,999/yr — ₹249/mo)**: Family Vault for up to 6 charts + Wedding/Property Muhurat planner.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 19 + TypeScript + Vite |
| **Styling & UI** | Tailwind CSS (Celestial Midnight Theme `#070A12` with Molten Gold accents) |
| **Icons** | Lucide React |
| **Speech Recital** | Web Speech API for meditative Sanskrit recitation |
| **Backend API** | Express.js running on Node 22 (ESM) |
| **AI Astrological Engine** | Google Gemini 3.8 Flash (`@google/genai`) |
| **Hosting & Functions** | Vercel Serverless Functions (`/api/index.ts` + `vercel.json`) |

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/MKSanalytIQ/astrogenie.git
cd astrogenie
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Environment Variable
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

### 4. Run Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` to launch the application.

---

## ☁️ 1-Click Vercel Deployment

AstroGenie is pre-configured with `vercel.json` and `/api/index.ts`:

1. Import `MKSanalytIQ/astrogenie` in your [Vercel Dashboard](https://vercel.com).
2. Set Environment Variable:
   - `GEMINI_API_KEY`: Your Google Gemini API Key from [AI Studio](https://aistudio.google.com/).
3. Click **Deploy**!

---

## 📜 License
MIT License © 2026 AstroGenie.
