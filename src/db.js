// ════════════════════════════════════════════════════════════
// DATA LAYER — CUG Wellbeing
// Every screen talks to these functions. If Firebase is
// configured (src/firebaseConfig.js) they use the cloud.
// If not, they fall back to on-device storage (demo mode)
// so the app is always fully functional.
// ════════════════════════════════════════════════════════════
import { firebaseConfig, FIREBASE_ENABLED } from './firebaseConfig.js';

let fb = null; // lazily-initialised firebase handles

async function initFirebase() {
  if (!FIREBASE_ENABLED) return null;
  if (fb) return fb;
  const { initializeApp } = await import('firebase/app');
  const {
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
    signOut, onAuthStateChanged,
  } = await import('firebase/auth');
  const {
    getFirestore, doc, setDoc, getDoc, addDoc, collection,
    query, where, orderBy, limit, getDocs, serverTimestamp,
  } = await import('firebase/firestore');
  const app = initializeApp(firebaseConfig);
  fb = {
    auth: getAuth(app),
    db: getFirestore(app),
    createUserWithEmailAndPassword, signInWithEmailAndPassword,
    signOut, onAuthStateChanged,
    doc, setDoc, getDoc, addDoc, collection,
    query, where, orderBy, limit, getDocs, serverTimestamp,
  };
  return fb;
}

/* ───────── local (demo-mode) helpers ───────── */
const LS = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  },
  set(key, val) { localStorage.setItem(key, JSON.stringify(val)); },
};

const todayStr = () => new Date().toISOString().slice(0, 10);

/* seed updates so the feed is never empty (also used to seed Firestore) */
export const DEFAULT_UPDATES = [
  { cat: 'Academic', title: 'Exam timetable now available',
    body: 'Final exam schedules for Semester 2 have been released. Check the CUG portal for your room and time.' },
  { cat: 'Welfare', title: 'Counselling drop-in sessions this week',
    body: 'Student support open Mon–Fri, 10am–3pm at the Student Affairs Office. No appointment needed.' },
  { cat: 'Events', title: 'End-of-year gala — tickets open',
    body: 'Celebrate the year with fellow students. Tickets are GHS 50 on the SRC website.' },
  { cat: 'Admin', title: 'Library hours extended during exams',
    body: 'The CUG library will be open until midnight from 28 Apr through 16 May.' },
];

/* ════════════════════════════════════════════
   AUTH
════════════════════════════════════════════ */
export async function signUp({ fullName, email, password, role, idNumber }) {
  if (!fullName?.trim()) throw new Error('Please enter your full name.');
  if (!email?.includes('@')) throw new Error('Please enter a valid email address.');
  if (!password || password.length < 8) throw new Error('Password must be at least 8 characters.');
  if (!role) throw new Error('Please choose a role.');

  const f = await initFirebase();
  if (f) {
    const cred = await f.createUserWithEmailAndPassword(f.auth, email.trim(), password);
    const profile = {
      uid: cred.user.uid, fullName: fullName.trim(), email: email.trim(),
      role, idNumber: idNumber || '', createdAt: new Date().toISOString(),
      approved: role === 'student', // staff need approval; students auto-approved
    };
    await f.setDoc(f.doc(f.db, 'users', cred.user.uid), profile);
    return profile;
  }
  // demo mode
  const users = LS.get('cug_users', {});
  if (users[email]) throw new Error('An account with this email already exists.');
  const profile = {
    uid: 'local_' + Date.now(), fullName: fullName.trim(), email: email.trim(),
    role, idNumber: idNumber || '', createdAt: new Date().toISOString(), approved: true,
  };
  users[email] = { ...profile, password };
  LS.set('cug_users', users);
  LS.set('cug_session', profile);
  return profile;
}

export async function signIn({ email, password }) {
  if (!email?.includes('@')) throw new Error('Please enter a valid email address.');
  if (!password) throw new Error('Please enter your password.');

  const f = await initFirebase();
  if (f) {
    const cred = await f.signInWithEmailAndPassword(f.auth, email.trim(), password);
    const snap = await f.getDoc(f.doc(f.db, 'users', cred.user.uid));
    if (!snap.exists()) throw new Error('Account profile not found. Contact admin.');
    return snap.data();
  }
  // demo mode
  const users = LS.get('cug_users', {});
  const u = users[email];
  if (!u || u.password !== password) {
    // demo convenience: allow quick-login with role inferred from email
    const isStaff = /staff|lecturer|dr\.|prof/i.test(email);
    const profile = {
      uid: 'local_' + Date.now(),
      fullName: isStaff ? 'Dr. Mensah' : 'Yaw Owusu',
      email, role: isStaff ? 'staff' : 'student', approved: true,
      createdAt: new Date().toISOString(),
    };
    LS.set('cug_session', profile);
    return profile;
  }
  const { password: _pw, ...profile } = u;
  LS.set('cug_session', profile);
  return profile;
}

export async function signOutUser() {
  const f = await initFirebase();
  if (f) await f.signOut(f.auth);
  localStorage.removeItem('cug_session');
}

export function getLocalSession() {
  return LS.get('cug_session', null);
}

/* ════════════════════════════════════════════
   CHECK-INS
════════════════════════════════════════════ */
export async function saveCheckIn({ user, mood, tags, note, flagged }) {
  const entry = {
    uid: user.uid, name: user.fullName, mood, tags: tags || [],
    note: note || '', flagged: !!flagged,
    date: todayStr(), createdAt: new Date().toISOString(),
  };
  const f = await initFirebase();
  if (f) {
    await f.addDoc(f.collection(f.db, 'checkins'), entry);
    return entry;
  }
  const all = LS.get('cug_checkins', []);
  all.push(entry);
  LS.set('cug_checkins', all);
  return entry;
}

export async function getMyCheckIns(user) {
  const f = await initFirebase();
  if (f) {
    const q = f.query(
      f.collection(f.db, 'checkins'),
      f.where('uid', '==', user.uid),
      f.orderBy('createdAt', 'desc'),
      f.limit(60),
    );
    const snap = await f.getDocs(q);
    return snap.docs.map(d => d.data());
  }
  return LS.get('cug_checkins', [])
    .filter(c => c.uid === user.uid)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/* all check-ins (staff only — rules enforce this server-side in Firebase) */
export async function getAllCheckIns() {
  const f = await initFirebase();
  if (f) {
    const q = f.query(
      f.collection(f.db, 'checkins'),
      f.orderBy('createdAt', 'desc'),
      f.limit(500),
    );
    const snap = await f.getDocs(q);
    return snap.docs.map(d => d.data());
  }
  return LS.get('cug_checkins', []);
}

/* derived stats for the student home screen */
export function computeMyStats(checkins) {
  const days = [...new Set(checkins.map(c => c.date))].sort().reverse();
  // streak: consecutive days ending today/yesterday
  let streak = 0;
  let cursor = new Date();
  for (;;) {
    const ds = cursor.toISOString().slice(0, 10);
    if (days.includes(ds)) { streak++; cursor.setDate(cursor.getDate() - 1); }
    else if (streak === 0 && ds === todayStr()) { cursor.setDate(cursor.getDate() - 1); } // allow not-yet-today
    else break;
    if (streak > 365) break;
  }
  const week = checkins.filter(c => {
    const d = new Date(c.date);
    return (Date.now() - d.getTime()) < 7 * 86400000;
  });
  const avg = week.length
    ? (week.reduce((s, c) => s + c.mood, 0) / week.length).toFixed(1)
    : '—';
  return { streak, weekAvg: avg, weekCount: week.length, total: checkins.length };
}

/* derived staff dashboard from all check-ins */
export function computeStaffStats(checkins, users = []) {
  const today = checkins.filter(c => c.date === todayStr());
  const dist = [0, 0, 0, 0, 0];
  today.forEach(c => { if (c.mood >= 1 && c.mood <= 5) dist[c.mood - 1]++; });
  const avg = today.length
    ? (today.reduce((s, c) => s + c.mood, 0) / today.length).toFixed(1)
    : '—';

  // group recent check-ins by student to find at-risk
  const byStudent = {};
  checkins.forEach(c => {
    (byStudent[c.uid] = byStudent[c.uid] || { name: c.name, uid: c.uid, entries: [] }).entries.push(c);
  });
  const flagged = [];
  Object.values(byStudent).forEach(s => {
    s.entries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    const recent = s.entries.slice(0, 3);
    const lowDays = recent.filter(e => e.mood <= 2).length;
    const manualFlag = s.entries.some(e => e.flagged);
    if (lowDays >= 2 || manualFlag) {
      flagged.push({
        name: s.name, uid: s.uid,
        lastMood: recent[0]?.mood ?? 3,
        note: manualFlag ? 'Flagged for support' : `${lowDays} low days recently`,
      });
    }
  });

  return {
    avgToday: avg,
    checkedInToday: today.length,
    atRisk: flagged.length,
    distribution: dist,
    flagged,
  };
}

/* ════════════════════════════════════════════
   UPDATES (campus announcements)
════════════════════════════════════════════ */
export async function getUpdates() {
  const f = await initFirebase();
  if (f) {
    const snap = await f.getDocs(
      f.query(f.collection(f.db, 'updates'), f.orderBy('createdAt', 'desc'), f.limit(50)),
    );
    const docs = snap.docs.map(d => d.data());
    if (docs.length) return docs;
    // seed defaults on first run so the feed isn't empty
    for (const u of DEFAULT_UPDATES) {
      await f.addDoc(f.collection(f.db, 'updates'), { ...u, createdAt: new Date().toISOString() });
    }
    return DEFAULT_UPDATES.map(u => ({ ...u, createdAt: new Date().toISOString() }));
  }
  const stored = LS.get('cug_updates', null);
  if (stored) return stored;
  const seeded = DEFAULT_UPDATES.map((u, i) => ({
    ...u, createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  }));
  LS.set('cug_updates', seeded);
  return seeded;
}

/* staff can post a new update */
export async function postUpdate({ cat, title, body }) {
  if (!title?.trim() || !body?.trim()) throw new Error('Title and body are required.');
  const entry = { cat: cat || 'Admin', title: title.trim(), body: body.trim(), createdAt: new Date().toISOString() };
  const f = await initFirebase();
  if (f) { await f.addDoc(f.collection(f.db, 'updates'), entry); return entry; }
  const all = LS.get('cug_updates', []);
  all.unshift(entry);
  LS.set('cug_updates', all);
  return entry;
}

export function timeAgo(iso) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 3600) return `${Math.max(1, Math.floor(s / 60))}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 172800) return 'Yesterday';
  return `${Math.floor(s / 86400)} days ago`;
}

export { FIREBASE_ENABLED };
