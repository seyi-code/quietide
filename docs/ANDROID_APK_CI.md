# Download Quietide APK (GitHub Actions)

CI builds a **debug APK** you can install on your phone without Android Studio.

## Trigger a build

1. Open: https://github.com/seyi-code/quietide/actions/workflows/android-apk.yml  
2. Click **Run workflow** → **Run workflow** (branch `main`)  
3. Wait ~5–12 minutes until the job is green  
4. Open the finished run → **Artifacts** → download **quietide-debug-apk**  
5. Unzip if needed → install `app-debug.apk` on your phone  
   - Enable **Install unknown apps** for your browser/Files app if prompted

Pushes to `main` also start a build automatically (markdown-only commits are skipped).

## Notes

- This is a **debug** build (`com.quietide.app`) — fine for personal use, not for Play Store.
- For Play, use a **signed release AAB** on a PC (see [PLAY_STORE.md](./PLAY_STORE.md)).
- After you change the web app, either push to `main` or run the workflow again so the APK includes the latest `out/` assets.
- Artifact is kept for **14 days**, then GitHub deletes it.
