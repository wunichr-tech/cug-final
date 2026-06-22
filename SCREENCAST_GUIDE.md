# CUG Wellbeing — Screencast (Video Walkthrough) Guide

This is your complete script and plan for the recorded video your
assignment requires: "a recorded video (screencast) talking through
how to use the mobile application and the features within it."

Target length: 5–8 minutes. Speak slowly and clearly.

══════════════════════════════════════════════════════════════
BEFORE YOU RECORD — SETUP (10 minutes)
══════════════════════════════════════════════════════════════
1. Have the app running. Easiest options:
   (a) On your phone if you built the APK, OR
   (b) In a browser with phone view:
       - In the project folder run:  npm run dev
       - Open the local address it prints (e.g. http://localhost:5173)
       - Press F12 → click the phone/tablet icon ("toggle device
         toolbar") → choose a phone like "iPhone 12 Pro" so it looks
         like a real phone.

2. Pick a screen recorder:
   - Windows: press  Win + G  (Xbox Game Bar) → Record, OR use the
     free "OBS Studio", OR PowerPoint → Insert → Screen Recording.
   - Record your microphone too so your voice is captured.

3. Do a 20-second test recording and play it back to check the
   screen and your voice are both captured clearly.

4. Prepare two accounts before recording so the demo is smooth:
   - A student account (sign up, do 2–3 check-ins so there's data).
   - If using Firebase: approve a staff account in the console first.
   - If in demo mode: just use an email with "dr." in it to enter
     as a lecturer.

══════════════════════════════════════════════════════════════
THE SCRIPT — WHAT TO SAY AND DO
══════════════════════════════════════════════════════════════

─── 1. INTRODUCTION (about 45 seconds) ───
SAY:
"Hello. My name is [your name]. In this video I'll demonstrate CUG
Wellbeing, a student wellbeing mobile application I built for Central
University Ghana. The app lets students do a quick daily wellbeing
check-in and lets lecturers see, in real time, which students may
need support. I built it using the React and Capacitor SDKs for the
app itself, and the Firebase SDK for the database. Let me show you
how it works."

DO: Have the Welcome screen visible.

─── 2. WELCOME & SIGN UP (about 1 minute) ───
SAY:
"When the app opens, the user sees the welcome screen with the
university branding. A new user taps 'Create account'."
DO: Tap Create account.

SAY:
"First they choose their role — student, or lecturer and staff.
I'll start as a student."
DO: Select Student → Continue.

SAY:
"Then they enter their name, university email, student ID, and a
password. The app checks the details are valid before continuing."
DO: Fill the form → tap Create account → you arrive at the home screen.

─── 3. STUDENT — DAILY CHECK-IN (about 1.5 minutes) ───
SAY:
"This is the student home screen. It greets the student and shows
their wellbeing summary — their streak and their average motivation.
The main feature is the daily check-in. I'll tap it."
DO: Tap the red Daily Check-in card.

SAY:
"The check-in has three quick steps. First, how am I feeling right
now? I'll choose a mood."
DO: Pick a mood → Continue.

SAY:
"Second, what's shaping that feeling? I can pick any tags that fit."
DO: Tap a few tags → Continue.

SAY:
"And third, an optional private note. This note stays private to me
unless I choose to flag it for support. I'll submit my check-in."
DO: Tap Submit → show the confirmation screen.

SAY:
"The app confirms the check-in, updates my streak, and suggests a
relevant support service. All of this is saved to the cloud database."
DO: Tap Back home → point out the streak number has updated.

─── 4. STUDENT — OTHER FEATURES (about 1 minute) ───
SAY:
"From the home screen students can also reach campus updates..."
DO: Open Updates → scroll → show the category filters.
SAY:
"...filtered by Academic, Welfare, Events, or Admin. There's also a
support hub..."
DO: Open Support → point out the 24/7 crisis line and counselling options.
SAY:
"...with a crisis line, counselling booking, and peer support. And a
profile screen showing my wellbeing history."
DO: Open Profile briefly → show the streak and month view.

─── 5. ROLE-BASED ACCESS (about 45 seconds) ───
SAY:
"Now the important part — privacy. Student wellbeing data is sensitive,
so only verified lecturers can see it. I'll sign out and sign in as a
lecturer."
DO: Profile → Sign out → Login.
SAY:
"I'll use a staff email. Notice that staff accounts must be approved
before they can access any student data — this protects students'
privacy."
DO: Log in as staff (email with "dr." in demo mode, or an approved
    account with Firebase).

─── 6. LECTURER DASHBOARD (about 1.5 minutes) ───
SAY:
"This is the lecturer dashboard, marked clearly as the lecturer view.
At the top are live statistics calculated from real student check-ins:
the average mood today, the number of at-risk students, and how many
have checked in."
DO: Point to the three stat cards.

SAY:
"Below is the motivation distribution chart showing how the whole
group is feeling today, and a list of students needing attention. The
app automatically flags any student with several low days, or who
asked for support."
DO: Scroll to the chart and the flagged students list.

SAY:
"A lecturer can also post a campus update from here, which appears
instantly for all students."
DO: Tap 'Post a campus update' → fill it in → Post → show the success
    message.

SAY:
"And they can open a student's detail view to see their trend and
reach out."
DO: Tap a flagged student → show the detail screen briefly.

─── 7. CLOSING (about 30 seconds) ───
SAY:
"To summarise: CUG Wellbeing gives students a simple daily check-in
and gives staff the live insight to support students early, with
strong privacy protection enforced by the Firebase database itself.
It was built using the React, Capacitor, Firebase, and Android SDKs,
and it's packaged and ready to publish to the Google Play Store.
Thank you for watching."
DO: Return to the home screen to end.

══════════════════════════════════════════════════════════════
RECORDING TIPS
══════════════════════════════════════════════════════════════
- Rehearse once before the real take. It will feel much smoother.
- If you make a mistake, just pause, then carry on — you can trim it,
  or simply re-record that section.
- Keep the mouse/finger movements slow so viewers can follow.
- Speak as if explaining to someone who has never seen the app.
- Save the final video as MP4. Most recorders do this by default.

══════════════════════════════════════════════════════════════
WHAT TO SUBMIT (your assignment checklist)
══════════════════════════════════════════════════════════════
□ The SDK report ............... CUG-SDK-Report.docx
□ The source export file ........ the project .zip
□ The screencast video .......... your recorded MP4 (this script)
□ Additional functionality ...... covered in section 6 of the report
□ Database connection ........... Firebase/Firestore (section 7 of report)
