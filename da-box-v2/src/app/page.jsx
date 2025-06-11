"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import "./page.css";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const roleSnap = await getDoc(doc(db, "users", u.uid));
        const role = roleSnap.data()?.role || "";
        if (role === "admin") {
          router.push("/admin");
        } else if (role === "chat admin") {
          router.push("/chat");
        } else {
          router.push("/general");
        }
      }
    });
    return () => unsub();
  }, [router]);

  async function login(e) {
    e.preventDefault();
    await signInWithEmailAndPassword(auth, email, password);
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
      <p>Redirecting...</p>
    </main>
  );
}
