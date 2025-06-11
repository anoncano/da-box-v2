"use client";
import { useState } from "react";
import "./page.css";

export default function Home() {
  const [isGreen, setIsGreen] = useState(true);

  return (
    <main className="page-container">
      <button
        onClick={() => setIsGreen(!isGreen)}
        className={isGreen ? "btn-green" : "btn-red"}
      >
        Click Me
      </button>
    </main>
  );
}
