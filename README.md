# FasalNirnay AI (Frontend Prototype)

## Project Overview
**FasalNirnay AI** is an investor-ready agritech prototype that helps Indian farmers make smarter decisions across the full season cycle:
- What to grow (crop advisory)
- When to sell (mandi price intelligence)
- How to reduce risk (weather alerts + actionable guidance)
- How to ask questions (AI assistant chat, powered by mock logic in this prototype)

This project is a **mobile-first Next.js** experience designed to feel like a real startup product. It uses **mock data only** (no authentication, no backend) and focuses on a clean, trustworthy, premium farmer UX.

## Problem Statement
Indian farmers often face decision uncertainty due to:
- Limited access to personalized crop advisory
- Volatile mandi prices and unclear selling timing
- Weather events that can quickly damage yield
- Difficulty translating information into actions at the right time

Farmers need a simple interface that turns data into **clear next steps**.

## Solution
FasalNirnay AI provides a guided decision cockpit that combines:
- **Season + soil fit** to recommend crops
- **Mandi trend signals** to suggest selling timing (Sell Now / Wait / Monitor)
- **Weather risk alerts** with color-coded guidance
- A **chat assistant** that answers common farmer questions using the same prototype logic

All computations in this hackathon prototype are deterministic mock engines to preserve believability without requiring backend services.

## Features
- **Onboarding (Landing)**
  - Location, land size, current crop, sowing month, soil type, preferred language
  - Saves the farmer profile locally (prototype behavior)
  - "Get Advisory" navigates to the dashboard
- **Dashboard (Decision Cockpit)**
  - Standout blocks for:
    - Confidence score
    - Profit estimate range
    - Weather alert (headline + risk severity)
    - Market action (Sell Now / Wait / Monitor)
  - Adds "Today's Recommended Action" with clear next steps
- **Crop Advisory**
  - Premium crop cards with expected yield, demand, water need, risk level, and recommendation reason
  - Highlights **Best Choice**
- **Market Intelligence**
  - Trend chart (line) for mandi price movement
  - Decision badge + alert cards (likely rise/drop, nearby mandi better pricing)
  - Compact comparison chart across recommended crops
- **Weather & Risk**
  - Forecast summary with color-coded risk tiles
  - Risk alerts + practical farming recommendations
- **AI Assistant**
  - Chat-style UI with preloaded example questions
  - Mock assistant responses using the same underlying prototype logic
- **Premium UI System**
  - Earthy greens + warm neutrals
  - Rounded cards, soft shadows, subtle gradients
  - Shimmer skeletons for loading states
  - Polished bottom navigation for mobile

## Architecture (High-level)
Frontend-only Next.js app with modular, mock-driven logic:

### Routing (Screens)
- `src/app/page.tsx` - Onboarding / landing
- `src/app/dashboard/page.tsx` - Dashboard cockpit + quick stats
- `src/app/advisory/page.tsx` - Crop advisory cards
- `src/app/market/page.tsx` - Mandi intelligence + charts
- `src/app/weather/page.tsx` - Weather summary + risk actions
- `src/app/assistant/page.tsx` - AI assistant chat

### Mock Logic Engines (No Backend)
- `src/lib/advisoryEngine.ts` - Crop recommendation + dashboard stats
- `src/lib/marketEngine.ts` - Mandi decision signals + alert text
- `src/lib/weatherEngine.ts` - Weather risk report + recommendations
- `src/lib/assistantEngine.ts` - Chat assistant routing to mock outputs
- `src/lib/mockData.ts` - Realistic Indian farming dummy catalog + trends
- `src/lib/profileStorage.ts` + `src/lib/useFarmerProfile.ts` - Local profile storage + hook

### UI Components
- `src/components/ui/*` - Reusable shadcn-style primitives (Card, Button, Badge, Skeleton, etc.)
- `src/components/app/*` - Shared layout (AppShell, SectionHeader, BottomNav)
- `src/components/market/*` - Recharts charts (line/bar)
- `src/components/advisory/*` - Crop advisory card component

## How to Run Locally
From the project root:

```bash
cd fasalnirnay-ai
npm install
npm run dev -- --port 3000
```

Then open: `http://localhost:3000`
