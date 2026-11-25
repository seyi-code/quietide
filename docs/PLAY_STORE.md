# Quietide — Google Play checklist

Do this **after** a week of personal use on a signed release APK.

## Before you submit

1. Build a **release** AAB (not debug):
   ```bash
   npm run android:sync
   npx cap open android
   ```
   Android Studio → **Build → Generate Signed Bundle / APK** → Android App Bundle.

2. App ID must stay: `com.quietide.app`

3. Version in `android/app/build.gradle` (`versionCode` / `versionName`) must increase each upload.

## Store listing (suggested)

| Field | Copy |
|-------|------|
| **Title** | Quietide: Sleep & Focus |
| **Short description** | Private offline sleep sounds, focus timer, and calm breathing. No accounts. |
| **Full description** | Quietide is a calm, offline-first app for sleep, focus, and stress. Layer soft ambient sounds, set a gentle sleep timer with fade-out, run work/break focus blocks, and use short guided sessions — all on your device. No accounts, no analytics, no cloud. |
| **Category** | Health & Fitness or Lifestyle |
| **Content rating** | Everyone |
| **Privacy policy** | Required — host a one-page policy stating: local storage only, no personal data collected, no third-party trackers. |

## Data safety form

- Data collected: **No**
- Data shared: **No**
- Encryption in transit: N/A for core features (local only)
- Users can request deletion: clear app data / uninstall

## Assets

- Icon: 512×512 (use `public/icons/icon-512.png`)
- Feature graphic: 1024×500
- Phone screenshots: Home, Sleep, Focus, Guided, Settings (at least 2)

## After launch

- Keep PWA at https://quietide.vercel.app as the web fallback
- Bump `APP_VERSION` in the app when you ship native builds
