import { useEffect, useState } from "react";
import { db, auth } from "../lib/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [relayMs, setRelayMs] = useState(5000);
  const [timeoutSec, setTimeoutSec] = useState(60);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "users"));
      setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));

      const globalDoc = await getDoc(doc(db, "global", "settings"));
      if (globalDoc.exists()) {
        setRelayMs(globalDoc.data().relayHoldTime || 5000);
        setTimeoutSec(globalDoc.data().inactivityTimeout || 60);
      }
    };
    load();
  }, []);

  const updateGlobal = async () => {
    await setDoc(doc(db, "global", "settings"), {
      relayHoldTime: relayMs,
      inactivityTimeout: timeoutSec,
    });
    alert("Updated global settings.");
  };

  const assignRole = async (id, role, value) => {
    await updateDoc(doc(db, "users", id), {
      [role]: value,
    });
    setUsers((u) =>
      u.map((user) =>
        user.id === id ? { ...user, [role]: value } : user
      )
    );
  };

  const removeUser = async (id) => {
    if (confirm("Delete user?")) {
      await deleteDoc(doc(db, "users", id));
      setUsers((u) => u.filter((user) => user.id !== id));
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Admin</h1>

      <div className="mb-6">
        <label>Relay Hold (ms): </label>
        <input
          type="number"
          value={relayMs}
          onChange={(e) => setRelayMs(Number(e.target.value))}
          className="border p-1 mx-2"
        />
        <label>Inactivity (sec): </label>
        <input
          type="number"
          value={timeoutSec}
          onChange={(e) => setTimeoutSec(Number(e.target.value))}
          className="border p-1 mx-2"
        />
        <button onClick={updateGlobal} className="bg-green-600 text-white px-2 py-1">
          Save
        </button>
      </div>

      {users.map((u) => (
        <div
          key={u.id}
          className="p-2 border mb-2 flex justify-between items-center"
        >
          <span>{u.email}</span>
          <div className="flex gap-2">
            <button
              onClick={() => assignRole(u.id, "subAdmin", !u.subAdmin)}
              className="px-2 py-1 bg-blue-500 text-white"
            >
              SubAdmin: {u.subAdmin ? "✓" : "✕"}
            </button>
            <button
              onClick={() => assignRole(u.id, "chatAdmin", true)}
              className="px-2 py-1 bg-purple-500 text-white"
            >
              ChatAdmin
            </button>
            <button
              onClick={() => removeUser(u.id)}
              className="px-2 py-1 bg-red-600 text-white"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
