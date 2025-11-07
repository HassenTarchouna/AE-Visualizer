import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar({ dark, setDark }) {
  const location = useLocation();

  return (
    <nav className="glass border-b border-cyan-500/20 relative z-50">
      {/* Animated Top Bar */}
      <div className="h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-pulse"></div>

      <div className="max-w-7xl mx-auto flex items-center justify-between p-4">
        {/* Logo & Navigation */}
        <div className="flex items-center space-x-8">
          {/* Cyber Logo */}
          <Link to="/" className="group relative">
            <div className="text-2xl font-black text-gradient-cyan tracking-tighter">
              AE App
            </div>
            <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            <Link
              to="/tsp"
              className={`relative px-4 py-2 rounded-lg font-mono text-sm font-medium transition-all duration-300 group ${
                location.pathname === "/tsp"
                  ? "text-cyan-300 bg-cyan-500/20 border border-cyan-500/30"
                  : "text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10"
              }`}
            >
              <span className="relative z-10">TSP_SOLVER</span>
              {location.pathname === "/tsp" && (
                <div className="absolute inset-0 bg-cyan-500/10 rounded-lg glow-cyan"></div>
              )}
              <div className="absolute -bottom-1 left-1/4 right-1/4 h-0.5 bg-cyan-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </Link>

            <Link
              to="/scheduler"
              className={`relative px-4 py-2 rounded-lg font-mono text-sm font-medium transition-all duration-300 group ${
                location.pathname === "/scheduler"
                  ? "text-purple-300 bg-purple-500/20 border border-purple-500/30"
                  : "text-slate-300 hover:text-purple-300 hover:bg-purple-500/10"
              }`}
            >
              <span className="relative z-10">SCHEDULER</span>
              {location.pathname === "/scheduler" && (
                <div className="absolute inset-0 bg-purple-500/10 rounded-lg glow-purple"></div>
              )}
              <div className="absolute -bottom-1 left-1/4 right-1/4 h-0.5 bg-purple-400 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </Link>
          </div>
        </div>

        {/* Theme Toggle & Controls */}
        <div className="flex items-center space-x-4">
          {/* System Status */}
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-400">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse glow-green"></div>
            <span>SYSTEM_ONLINE</span>
          </div>

          {/* Theme Toggle */}
          <button onClick={() => setDark(!dark)} className="relative group">
            <div className="glass border border-cyan-500/30 rounded-lg p-2 hover:border-cyan-400/50 transition-all duration-300">
              <div className="w-6 h-6 flex items-center justify-center">
                {dark ? (
                  // Sun icon for light mode
                  <div className="text-yellow-400 group-hover:scale-110 transition-transform duration-300">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full glow-yellow"></div>
                  </div>
                ) : (
                  // Moon icon for dark mode
                  <div className="text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                    <div className="w-3 h-3 bg-cyan-400 rounded-full glow-cyan"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Tooltip */}
            <div className="absolute top-full right-0 mt-2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
              {dark ? "ACTIVATE_LIGHT_MODE" : "ACTIVATE_DARK_MODE"}
            </div>
          </button>

          {/* User Profile Indicator */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-dark-space flex items-center justify-center">
                <span className="text-xs font-bold text-cyan-300">U</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Scan Line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-pulse"></div>

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400 glow-cyan"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-purple-400 glow-purple"></div>
    </nav>
  );
}
