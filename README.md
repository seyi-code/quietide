# Quietide

**Sleep · Relax · Focus · Stress Relief**

A calm, private, offline-first web + native app for better sleep, guided breathing, deep focus, and quick stress resets.

---

## Quick Start

```bash
cd quietide
npm install
npm run dev
```

Open http://localhost:3000

---

## Current Features

### Core
- **Home** – Clean mode cards
- **Breathe** – Box, 4-7-8, Coherent visual pacer
- **Stress SOS** – Auto-starts 90-second Box breathing reset
- **Focus** – Work / break timer with session logging
- **Sleep** – Timer (15–120 min) + multi-layer soundscape + automatic fade-out in the last 30 s

### Sound Mixer
- Independent volume for each layer (Brown / Pink noise, Rain, Ocean, Forest, Wind)
- Synthesized with Web Audio API (fully offline)
- Ready for real MP3 drop-in later

### Other
- Sleep timer with fade-out
- Haptics helper for breathe phases (Capacitor)
- Onboarding (3 steps)
- Session history + total minutes
- JSON export of sessions
- PWA (manifest + service worker)
- Capacitor 6 ready (iOS / Android)

---

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Zustand + persist
- Web Audio API
- Capacitor 6
- Static export (`output: "export"`)

---

## Capacitor

```bash
npm run build
npx cap add ios
npx cap add android
npx cap sync
npx cap open ios   # or android
```

App ID: `com.quietide.app`

---

## Privacy

Everything stays on device. No accounts, no analytics, no cloud sync.
