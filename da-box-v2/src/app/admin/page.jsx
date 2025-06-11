"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "../../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import "../page.css";

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [hold, setHold] = useState(5000);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        router.push("/");
        return;
      }
      const roleSnap = await getDoc(doc(db, "users", u.uid));
      if (roleSnap.data()?.role !== "admin") {
        router.push("/");
        return;
      }
      const cfgSnap = await getDoc(doc(db, "config", "settings"));
      if (cfgSnap.exists()) setHold(cfgSnap.data().relayHoldTime || 5000);
      const snap = await getDocs(collection(db, "users"));
      const list = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() }));
      setUsers(list);
    });
    return () => unsub();
  }, [router]);

  async function changeRole(uid, role) {
    await updateDoc(doc(db, "users", uid), { role });
  }

  async function saveHold() {
    await updateDoc(doc(db, "config", "settings"), { relayHoldTime: Number(hold) });
  }

  return (
    <main className="admin-container">
      <h1>User Management</h1>
      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.email}
            <select value={u.role || ""} onChange={(e) => changeRole(u.id, e.target.value)}>
              <option value="">none</option>
              <option value="chat admin">chat admin</option>
              <option value="sub admin">sub admin</option>
              <option value="chat blocked">chat blocked</option>
            </select>
          </li>
        ))}
      </ul>
      <div>
        <label>Relay Hold Time (ms)</label>
        <input type="number" value={hold} onChange={(e) => setHold(e.target.value)} />
        <button onClick={saveHold}>Save</button>
      </div>
      <button onClick={() => router.push("/register")}>Token Link</button>
      <button onClick={() => signOut(auth)}>Sign Out</button>
    </main>
  );
}
