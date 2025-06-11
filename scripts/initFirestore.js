const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp({ credential: applicationDefault() });
const db = getFirestore();

async function main() {
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

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
