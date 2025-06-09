"use client";
import { useState } from "react";
import "./page.css"; // import your custom CSS

export default function Home() {
  const [isGreen, setIsGreen] = useState(true);

  return (
    <main className="bg-gray-100 h-screen flex items-center justify-center font-sans">
      <button
        onClick={() => setIsGreen((v) => !v)}
        className={`${isGreen ? "btn-green" : "btn-red"} text-white font-bold py-4 px-8 rounded-lg shadow-lg focus:outline-none focus:ring-4 transition-all duration-300 ease-in-out`}
      >
        Click Me
      </button>
    </main>
  );
}
