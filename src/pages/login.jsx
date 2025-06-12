import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const nav = useNavigate();

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      nav("/general");
    } catch (err) {
      alert("Login failed.");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-gray-100">
      <input
        type="email"
        className="border p-2 w-64"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="border p-2 w-64"
        placeholder="Password"
        onChange={(e) => setPass(e.target.value)}
      />
      <button onClick={login} className="bg-blue-500 text-white px-4 py-2">
        Login
      </button>
    </div>
  );
}
