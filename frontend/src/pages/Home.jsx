import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Cyber Header */}
      <header className="mb-12 text-center">
        <div className="relative inline-block">
          <h1 className="text-6xl font-black text-gradient-cyan mb-4 tracking-tighter">
            AE App
          </h1>
          <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
          <div className="text-sm text-cyan-300 font-mono tracking-widest mt-2 glow-cyan">
            ALGORITHMS VISUALIZER
          </div>
        </div>

        <p className="mt-6 text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Immersive visualization of{" "}
          <span className="text-cyan-400 font-semibold">Tabu Search</span>,{" "}
          <span className="text-purple-400 font-semibold">
            Simulated Annealing
          </span>{" "}
          and{" "}
          <span className="text-pink-400 font-semibold">
            Genetic Algorithms
          </span>{" "}
          for complex optimization challenges.
        </p>
      </header>

      {/* Cyber Cards Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* TSP Card */}
        <div
          className="group relative cursor-pointer transform transition-all duration-500 hover:scale-105"
          onClick={() => nav("/tsp")}
        >
          {/* Main Card */}
          <div className="glass border border-cyan-500/30 rounded-2xl p-8 relative overflow-hidden hover:border-cyan-400/60 transition-all duration-300">
            {/* Hologram Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Animated Border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-20 blur-lg transition-all duration-500"></div>

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-cyan-400 rounded-full glow-cyan animate-pulse"></div>
                <h2 className="text-2xl font-bold text-white group-hover:text-gradient-cyan transition-colors duration-300">
                  Travelling Salesman Problem
                </h2>
              </div>

              <p className="text-slate-300 leading-relaxed group-hover:text-cyan-100 transition-colors duration-300">
                Graph-based visualizer showing{" "}
                <span className="text-cyan-400">node swaps</span> and{" "}
                <span className="text-purple-400">best path evolution</span> in
                real-time with interactive network visualization.
              </p>

              {/* Tech Tags */}
              <div className="flex gap-2 mt-4">
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs font-mono border border-cyan-500/30">
                  GRAPH THEORY
                </span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-mono border border-purple-500/30">
                  OPTIMIZATION
                </span>
              </div>
            </div>

            {/* Hover Indicator */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-8 h-8 border-2 border-cyan-400 rounded-full flex items-center justify-center glow-cyan">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Scheduler Card */}
        <div
          className="group relative cursor-pointer transform transition-all duration-500 hover:scale-105"
          onClick={() => nav("/scheduler")}
        >
          {/* Main Card */}
          <div className="glass border border-purple-500/30 rounded-2xl p-8 relative overflow-hidden hover:border-purple-400/60 transition-all duration-300">
            {/* Hologram Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            {/* Animated Border */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-0 group-hover:opacity-20 blur-lg transition-all duration-500"></div>

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 bg-purple-400 rounded-full glow-purple animate-pulse"></div>
                <h2 className="text-2xl font-bold text-white group-hover:text-gradient-purple transition-colors duration-300">
                  Ordonnancement — Single Machine
                </h2>
              </div>

              <p className="text-slate-300 leading-relaxed group-hover:text-purple-100 transition-colors duration-300">
                Gantt-style visualizer showing{" "}
                <span className="text-purple-400">order sequences</span>,{" "}
                <span className="text-pink-400">completion times</span> and{" "}
                <span className="text-cyan-400">tardiness minimization</span>{" "}
                with dynamic scheduling.
              </p>

              {/* Tech Tags */}
              <div className="flex gap-2 mt-4">
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-mono border border-purple-500/30">
                  SCHEDULING
                </span>
                <span className="px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-xs font-mono border border-pink-500/30">
                  GANTT CHARTS
                </span>
              </div>
            </div>

            {/* Hover Indicator */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-8 h-8 border-2 border-purple-400 rounded-full flex items-center justify-center glow-purple">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Terminal Footer */}
      <footer className="mt-16 text-center">
        <div className="inline-flex items-center gap-2 text-slate-400 text-sm font-mono">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          SYSTEM READY — SELECT A MODULE TO BEGIN VISUALIZATION
        </div>
      </footer>
    </div>
  );
}
