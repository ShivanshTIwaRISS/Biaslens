# BiasLens – AI Fairness Audit Assistant

BiasLens uses Google Gemini to detect hidden bias in hiring policies, loan rules, and medical triage guidelines. Paste any policy text and get an instant bias score, breakdown, and a fully rewritten fair version.

## 🚀 Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Run locally**
   ```bash
   npm run dev
   ```
   Then open [http://localhost:5173](http://localhost:5173)

3. **Get a Gemini API Key**
   - Visit [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
   - Create a free API key
   - Paste it into the API key input in the app (it never leaves your browser)

## 🎯 Features
- **Bias Score (0–100)** — animated circular gauge
- **Risk Level** — Low / Medium / High with color coding
- **10 Bias Categories** — Gender, Age, Race, Disability, Socio-economic, Location, Proxy Discrimination, Exclusionary Language, Inconsistent Standards, Unequal Treatment
- **Evidence Quotes** — exact problematic phrases from your text
- **Plain-language Explanations** — why each phrase is unfair
- **Actionable Fixes** — specific suggestions per issue
- **Fairer Rewrite** — complete rewritten version ready to copy
- **3 Demo Scenarios** — Hiring Policy, Loan Approval, Medical Triage
- **Demo Fallback** — double-click the BiasLens logo to load hardcoded results (for presentations with no internet)

## 📁 Project Structure
```
src/
  App.jsx               # Main application & state management
  geminiService.js      # Gemini API integration
  sampleData.js         # Demo scenarios & fallback result
  index.css             # Full design system (dark theme)
  components/
    ScoreCircle.jsx     # Animated SVG bias score gauge
    AnalysisCards.jsx   # Collapsible bias finding cards
    RewriteCard.jsx     # Fairer rewrite with copy button
```

## 🌐 Deploy to Vercel
```bash
npm run build
npx vercel --prod
```

## ⚡ Tech Stack
- **React** (Vite) — Frontend framework
- **Plain CSS** — Custom dark design system
- **Google Gemini API** — AI analysis engine (via `gemini-1.5-flash`)
- **No backend required** — API calls go directly from browser to Gemini

## 🔒 Security Note
Your API key is entered by the user and stored only in React state. It is never sent anywhere except directly to the Google Gemini API. For production, move the key to a serverless function (Vercel API route) and set it as an environment variable.
