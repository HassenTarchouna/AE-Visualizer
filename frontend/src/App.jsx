import React, { useState, useEffect } from "react";
import Router from "./router";
import Navbar from "./components/ui/Navbar";

export default function App() {
  const [dark, setDark] = useState(true); // Default to dark/futuristic theme

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      document.body.style.background =
        "linear-gradient(135deg, var(--dark-space) 0%, var(--darker-space) 50%, #16213e 100%)";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.background =
        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
    }
  }, [dark]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background particles */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full glow-cyan animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-purple-400 rounded-full glow-purple animate-bounce"></div>
        <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-pink-400 rounded-full glow-pink animate-ping"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <Navbar dark={dark} setDark={setDark} />

        <main className="p-6 max-w-7xl mx-auto">
          {/* Futuristic main container with hologram effect */}
          <div className="glass-dark border border-cyan-500/20 rounded-2xl p-8 hologram">
            <div className="relative">
              {/* Scan line effect */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>

              <Router />
            </div>
          </div>
        </main>
      </div>

      {/* Cyber corner accents */}
      <div className="fixed top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400 glow-cyan"></div>
      <div className="fixed top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-purple-400 glow-purple"></div>
      <div className="fixed bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-pink-400 glow-pink"></div>
      <div className="fixed bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400 glow-cyan"></div>
    </div>
  );
}
