# Quietide — Android (Capacitor)

Build a native Android shell around the static export (`out/`).

## Requirements

- Node 18+
- JDK 17
- Android Studio (SDK 34+, build-tools)
- Optional: physical device or emulator

## One-time setup

```bash
npm install
npm run build
npx cap add android   # only once if android/ is missing
npx cap sync android
npx cap open android
```

In Android Studio:

1. Wait for Gradle sync
2. **Build → Generate Signed Bundle / APK** for Play, or **Run** for debug
3. Min SDK: 22+ (Capacitor 6 default)

## Day-to-day

```bash
npm run android:sync   # rebuild web + copy into android/
npx cap open android
```

## Plugins

| Plugin | Purpose |
|--------|--------|
| `@capacitor/haptics` | Breathing pulses |
| `@capacitor-community/keep-awake` | Screen on during sleep/focus |
| `@capacitor/status-bar` | Dark status bar |
| `@capacitor/app` | Back button / app state |

## Play Store notes

- App ID: `com.quietide.app`
- Privacy: local-only storage — state that in Data safety
- Content rating: Everyone

## Troubleshooting

- **Blank screen:** ensure `webDir` is `out` and `npm run build` succeeded
- **Keep-awake no-op on web:** expected; native uses the community plugin
- **Icons:** run `npm run icons` before build
