// ════════════════════════════════════════════════════════════
// FIREBASE CONFIGURATION — CUG Wellbeing
// ════════════════════════════════════════════════════════════
//
// TO CONNECT YOUR REAL DATABASE (5 minutes):
//
// 1. Go to https://console.firebase.google.com
// 2. Click "Add project" → name it "cug-wellbeing" → create
// 3. In the project, click the web icon </> to add a web app
// 4. Register the app (name: CUG Wellbeing) — Firebase shows you
//    a config block exactly like the one below
// 5. Replace the 6 placeholder values below with YOUR values
// 6. In Firebase console: Build → Authentication → Get started
//    → Sign-in method → enable "Email/Password"
// 7. In Firebase console: Build → Firestore Database → Create
//    database → Start in production mode → choose a region
// 8. In Firestore → Rules tab, paste the rules from
//    firestore.rules (included in this project) → Publish
//
// Until you do this, the app runs in DEMO MODE — everything
// works but data is stored on the device only (localStorage).
// ════════════════════════════════════════════════════════════

export const firebaseConfig = {
  apiKey:            "PASTE_YOUR_API_KEY_HERE",
  authDomain:        "PASTE_YOUR_PROJECT.firebaseapp.com",
  projectId:         "PASTE_YOUR_PROJECT_ID_HERE",
  storageBucket:     "PASTE_YOUR_PROJECT.appspot.com",
  messagingSenderId: "PASTE_YOUR_SENDER_ID_HERE",
  appId:             "PASTE_YOUR_APP_ID_HERE",
};

// The app automatically detects whether real config has been pasted.
export const FIREBASE_ENABLED = !firebaseConfig.apiKey.startsWith("PASTE_");
