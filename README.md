# Quietide

**Sleep · Relax · Focus · Stress Relief**

A calm, private, offline-first web + native app for better sleep, guided breathing, deep focus, and quick stress resets.

**Name:** Quietide — selected after checking Stillora, Lunara & Quietide. Stillora and Lunara are heavily used by similar wellness apps; Quietide has smaller competing sound apps but the exact GitHub name was free.

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
- **Sound Mixer** – Brown/pink noise, rain, ocean, forest, wind (Web Audio synthesized, fully offline)
- **Onboarding** – 3-step first-run intro
- **Settings** – Total minutes tracked + JSON export of sessions
- **PWA** – Installable, offline-capable (manifest + service worker)
- **Capacitor** – iOS/Android ready (haptics on breathe phases)

### Design
Dark-first calm UI, large touch targets, slow animations, privacy-first (no accounts, no analytics, local storage only).

---

## Architecture

- **Next.js 14** App Router + TypeScript
- **Tailwind CSS**
- **Zustand** + persist for sounds, timer, sessions
- **Web Audio API** – synthesized ambient layers (no large audio assets required)
- **Capacitor 6** – haptics, splash, status bar
- **Static export** (`output: "export"`) for Capacitor + easy Vercel deploy

---

## Capacitor (iOS / Android)

```bash
npm run build
npx cap add ios
npx cap add android
npx cap sync
npx cap open ios   # or android
```

App ID: `com.quietide.app`

---

## Deploy (Vercel)

1. Connect the GitHub repo
2. Framework preset: Next.js
3. Build command: `npm run build`
4. Output directory: `out` (because of static export)

Or just push — Vercel will detect it.

---

## License

Private / personal use for now. Adjust as needed.
