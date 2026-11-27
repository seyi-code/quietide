# Quietide

**Sleep · Focus · Breathe · Guided calm**

Private, offline-first app for sleep sounds, focus timers, breathing, and short guided sessions. No accounts. No cloud.

| | |
|--|--|
| **Web / PWA** | https://quietide.vercel.app/ |
| **Android APK** | https://github.com/seyi-code/quietide/releases/latest |
| **Privacy** | https://quietide.vercel.app/privacy/ |

---

## Install

### Phone (PWA)
1. Open https://quietide.vercel.app/ in Chrome  
2. Menu → **Install app** / **Add to Home screen**  
3. Open each tab once online so offline works later  

### Android APK (debug)
1. https://github.com/seyi-code/quietide/releases/latest  
2. Download **Quietide-debug.apk**  
3. Allow install from browser/Files if prompted  

CI rebuilds the APK on every push to `main` and updates that release.

---

## Features

- **Sleep** — layered ambient sounds, timer, fade-out (sounds only after you press Start)
- **Focus** — work/break timer, optional ambient + end chime, history chart
- **Breathe** — box, 4-7-8, coherent pacer · Stress SOS
- **Guided** — short on-device spoken cues (including 90-second ground)
- **Mood check-in** → suggested next step
- Dark / light / system theme
- Session history, JSON export, delete per entry
- PWA + Capacitor Android shell (haptics, keep-awake, status bar)

---

## Dev

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static export → out/
npm run android:sync # build + Capacitor sync
```

App ID: `com.quietide.app`  
Stack: Next.js 14 (static export) · TypeScript · Tailwind · Zustand · Web Audio · Capacitor 6

Docs: [docs/ANDROID.md](docs/ANDROID.md) · [docs/ANDROID_APK_CI.md](docs/ANDROID_APK_CI.md) · [docs/PLAY_STORE.md](docs/PLAY_STORE.md)

---

## Privacy

Everything stays on device. No accounts, no analytics, no session cloud sync.  
Policy: https://quietide.vercel.app/privacy/
