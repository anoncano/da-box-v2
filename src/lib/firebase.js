import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBahGa3t9K3US72ETh3Mauxu88xAbcLz3A",
  authDomain: "da--box-v2.firebaseapp.com",
  projectId: "da--box-v2",
  storageBucket: "da--box-v2.appspot.com",
  messagingSenderId: "933813940297",
  appId: "1:933813940297:web:51cf7a5b5beab7499f4f98",
  measurementId: "G-HYF8T3LQ52"
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
