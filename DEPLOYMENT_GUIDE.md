# CUG WELLBEING — PRODUCTION DEPLOYMENT GUIDE
Central University Ghana · Student Wellbeing App · v1.0.0

This guide takes you from this project folder to a live app on the
Google Play Store, connected to a real cloud database.

══════════════════════════════════════════════════════════════
PART 1 — CONNECT THE REAL DATABASE (Firebase, free, ~10 min)
══════════════════════════════════════════════════════════════
The app currently runs in DEMO MODE (data saved on-device only).
To make it a real multi-user university system:

1. Go to https://console.firebase.google.com and sign in with
   a Google account (the university's account ideally).

2. Click "Add project" → name: cug-wellbeing → disable Google
   Analytics (not needed) → Create project.

3. On the project overview page, click the web icon  </>
   → App nickname: CUG Wellbeing → Register app.

4. Firebase shows you a "firebaseConfig" code block with 6 values.
   Open  src/firebaseConfig.js  in this project and replace the
   six PASTE_... placeholders with your real values. Save.

5. In the Firebase console left menu:
   Build → Authentication → Get started →
   Sign-in method tab → Email/Password → Enable → Save.

6. Build → Firestore Database → Create database →
   Start in production mode → location: europe-west1 (or nearest)
   → Enable.

7. In Firestore, open the "Rules" tab. Delete what's there and
   paste the entire contents of the file  firestore.rules
   (included in this project). Click Publish.
   ► These rules are what enforce, AT THE SERVER, that only
     approved staff can read student check-ins. This is a real
     security control, not just UI hiding.

8. Rebuild the app so the config is bundled in:
      npm run build
      npx cap sync android

APPROVING STAFF ACCOUNTS
When a lecturer signs up, their profile is created with
approved: false. To approve them: Firebase console → Firestore →
users collection → open their document → change approved to true.
Until then they cannot log in to the staff dashboard, and the
security rules block them from reading any student data.

══════════════════════════════════════════════════════════════
PART 2 — BUILD THE SIGNED RELEASE APP
══════════════════════════════════════════════════════════════
A release keystore (cug-release.keystore) is already in the
android/ folder and Gradle is configured to sign with it.

⚠ KEYSTORE SECURITY — IMPORTANT
  - Keystore file:  android/cug-release.keystore
  - Store password: cugwellbeing2026
  - Key alias:      cug-wellbeing
  - Key password:   cugwellbeing2026
  BACK THIS FILE UP and change nothing. If you lose it you can
  never update the app on the Play Store again. For a real
  university deployment, regenerate your own keystore with a
  private password:
      keytool -genkeypair -v -keystore cug-release.keystore \
        -alias cug-wellbeing -keyalg RSA -keysize 2048 -validity 10000

BUILD THE RELEASE BUNDLE (in Android Studio):
1. Open the  android  folder in Android Studio.
2. Wait for Gradle sync to finish.
3. Menu: Build → Generate Signed Bundle / APK…
   → choose "Android App Bundle" (Play Store requires .aab)
   → Key store path: select android/cug-release.keystore
   → passwords/alias: as above → Next
   → build variant: release → Create.
4. Output:  android/app/release/app-release.aab

(For direct phone installs, Build → Build APK(s) still works and
produces a signed APK because the signing config is wired in.)

══════════════════════════════════════════════════════════════
PART 3 — PUBLISH TO GOOGLE PLAY
══════════════════════════════════════════════════════════════
1. Register a Google Play Developer account:
   https://play.google.com/console/signup
   One-time fee: US$25. For a university deployment, register an
   ORGANISATION account in the university's name (requires a
   D-U-N-S number — IT department will know).

2. In Play Console: Create app →
   Name: CUG Wellbeing · Default language: English ·
   App type: App · Free.

3. Complete the required declarations (Play Console walks you
   through each):
   - Privacy policy URL (host the included PRIVACY_POLICY.md on
     the university website, e.g. cug.edu.gh/wellbeing/privacy)
   - Data safety form: declare you collect email, name, and
     wellbeing survey responses; encrypted in transit; users can
     request deletion.
   - Content rating questionnaire: it's a health/wellbeing app.
   - Target audience: 18+ (university students) — this avoids
     child-safety requirements.

4. Release → Production → Create new release →
   upload app-release.aab → fill in release notes → Save →
   Review release → Start rollout.

5. Review usually takes 1–7 days for a first submission.

STORE LISTING ASSETS YOU'LL NEED
- App icon 512×512 PNG
- Feature graphic 1024×500 PNG
- At least 2 phone screenshots (run the app, screenshot it)
- Short description (80 chars) e.g.:
  "Daily wellbeing check-ins and campus updates for CUG students."
- Full description (the README has good copy to adapt)

══════════════════════════════════════════════════════════════
PART 4 — TESTING CHECKLIST BEFORE LAUNCH
══════════════════════════════════════════════════════════════
□ Sign up as a student → check-in → see streak update on home
□ Sign up as staff → confirm "awaiting approval" message blocks login
□ Approve the staff user in Firestore → log in → dashboard loads
□ Staff: post a campus update → log in as student → update appears
□ Student: flag a check-in for support → appears in staff flagged list
□ Try to open a staff URL as a student → Access Restricted screen
□ Airplane mode → app still opens (demo-mode fallback)
□ Test on a small phone (5") and a large phone (6.7")

══════════════════════════════════════════════════════════════
WHAT'S IN THIS RELEASE (v1.0.0)
══════════════════════════════════════════════════════════════
- Real authentication (Firebase Auth email/password)
- Cloud database (Firestore): users, check-ins, campus updates
- Server-enforced role-based access (firestore.rules)
- Staff approval workflow (Dean's Office approves in console)
- Live staff dashboard computed from real student check-ins
- At-risk flagging: auto (2+ low days) and manual (student flag)
- Staff can post campus updates from the app
- Session persistence (stay logged in)
- Offline/demo fallback so the app never breaks without network
- Signed release build configuration for Play Store
