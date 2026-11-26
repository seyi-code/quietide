# Download Quietide APK

## One-tap (recommended)

**Latest release:** https://github.com/seyi-code/quietide/releases/latest  

Download **Quietide-debug.apk**, then install on your phone (allow install from browser/Files if asked).

## From Actions artifacts

1. https://github.com/seyi-code/quietide/actions/workflows/android-apk.yml  
2. Open the latest green run → **Artifacts** → **quietide-debug-apk**  
3. Unzip if needed → install the `.apk`

## Trigger a new build

- Push to `main`, or  
- **Actions → Android APK → Run workflow**

Each successful build updates the **apk-latest** GitHub Release and the Actions artifact (kept 14 days).

## Notes

- Debug build only — fine for you and testers, not Play Store  
- Privacy policy: https://quietide.vercel.app/privacy/  
- For Play, see [PLAY_STORE.md](./PLAY_STORE.md)
