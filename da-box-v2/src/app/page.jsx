"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import "./page.css";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [locked, setLocked] = useState(true);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const roleSnap = await getDoc(doc(db, "users", u.uid));
        const role = roleSnap.data()?.role || "";
        if (role !== "admin" && role !== "chat admin") {
          router.push("/general");
          return;
        }
        const stateSnap = await getDoc(doc(db, "global", "state"));
        if (stateSnap.exists()) {
          setLocked(stateSnap.data().locked !== false);
        }
      }
    });
    return () => unsub();
  }, [router]);

  async function login(e) {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function toggleLock() {
    if (disabled) return;
    const stateRef = doc(db, "global", "state");
    const configRef = doc(db, "config", "settings");
    const cfgSnap = await getDoc(configRef);
    const hold = cfgSnap.exists() ? cfgSnap.data().relayHoldTime || 5000 : 5000;
    await updateDoc(stateRef, { locked: !locked });
    setLocked(!locked);
    setDisabled(true);
    setTimeout(async () => {
      await updateDoc(stateRef, { locked: true });
      setLocked(true);
      setDisabled(false);
    }, hold);
  }

  if (!user) {
    return (
      <main className="page-container">
        <form onSubmit={login} className="auth-form">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button type="submit">Sign In</button>
        </form>
      </main>
    );
  }

  return (
    <main className="page-container">
      <button
        onClick={toggleLock}
        className={locked ? "btn-red" : "btn-green"}
        disabled={disabled}
      >
        {locked ? "Locked" : "Unlocked"}
      </button>
    </main>
  );
}
