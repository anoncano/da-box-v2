const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');

initializeApp({ credential: applicationDefault() });
const db = getFirestore();
const auth = getAuth();

async function ensureGlobalSettings() {
  const settingsRef = db.collection('globalSettings').doc('settings');
  const docSnap = await settingsRef.get();
  if (!docSnap.exists) {
    await settingsRef.set({
      relayHoldTime: 5000,
      inactivityTimeout: 300000,
      lockState: 'locked'
    });
    console.log('Created globalSettings/settings with defaults');
  } else {
    console.log('globalSettings/settings already exists');
  }
}

async function ensureAdminUser() {
  const email = process.env.INIT_ADMIN_EMAIL;
  const password = process.env.INIT_ADMIN_PASSWORD;
  if (!email || !password) {
    console.log('Skipping admin user creation: INIT_ADMIN_EMAIL or INIT_ADMIN_PASSWORD not set');
    return;
  }
  let user;
  try {
    user = await auth.getUserByEmail(email);
    console.log('Admin user already exists:', email);
  } catch (err) {
    user = await auth.createUser({ email, password });
    console.log('Created admin auth user:', email);
  }
  const userRef = db.collection('users').doc(user.uid);
  const userSnap = await userRef.get();
  if (!userSnap.exists) {
    await userRef.set({ email, role: 'admin' });
    console.log('Created admin Firestore document');
  } else {
    console.log('Admin Firestore document already exists');
  }
}

async function main() {
  await ensureGlobalSettings();
  await ensureAdminUser();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
