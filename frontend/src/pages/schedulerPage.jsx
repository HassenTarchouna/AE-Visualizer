import React, { useState } from "react";
import AlgorithmPanel from "../components/AlgorithmPanel";
import VisualizerScheduler from "../components/VisualizerScheduler";
import CodeViewer from "../components/CodeViewer";

export default function SchedulerPage() {
  const [history, setHistory] = useState([]);
  const [best, setBest] = useState(null);
  const [sourceModule, setSourceModule] = useState("scheduler");
  const [isActive, setIsActive] = useState(false);

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-6 p-4">
      {/* Main Content Area - 2/3 width */}
      <div className="xl:col-span-2 space-y-6">
        {/* Status Bar */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div
              className={`w-3 h-3 rounded-full ${
                isActive
                  ? "bg-green-400 animate-pulse glow-green"
                  : "bg-purple-400 glow-purple"
              }`}
            ></div>
            <span className="text-sm font-mono text-slate-300 tracking-wider">
              {isActive ? "SCHEDULING::ACTIVE" : "SCHEDULER::READY"}
            </span>
          </div>
          <div className="h-4 w-0.5 bg-purple-500/50"></div>
          <div className="text-sm font-mono text-purple-300 flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
            SCHEDULER_MODULE::OPTIMIZATION
          </div>
          {best && (
            <>
              <div className="h-4 w-0.5 bg-purple-500/50"></div>
              <div className="text-sm font-mono text-green-300">
                BEST_SCORE: {best.cost}
              </div>
            </>
          )}
        </div>

        {/* Visualizer Container */}
        <div className="glass-dark border border-purple-500/30 rounded-2xl p-6 relative overflow-hidden group hover:border-purple-400/50 transition-all duration-500">
          {/* Animated Grid Background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 animate-pulse"></div>
          </div>

          {/* Corner Accents */}
          <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-purple-400 glow-purple rounded-tl"></div>
          <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-pink-400 glow-pink rounded-tr"></div>
          <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-purple-400 glow-purple rounded-bl"></div>
          <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-pink-400 glow-pink rounded-br"></div>

          {/* Main Visualizer */}
          <VisualizerScheduler history={history} best={best} />

          {/* Animated Border Glow */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 opacity-0 group-hover:opacity-10 blur-xl transition-all duration-500 pointer-events-none"></div>
        </div>

        {/* Code Viewer - Now below visualizer */}
        <div className="glass border border-pink-500/30 rounded-2xl p-5 relative overflow-hidden group hover:border-pink-400/50 transition-all duration-300">
          {/* Hologram Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-pink-400 rounded-full glow-pink animate-pulse"></div>
              <h3 className="text-lg font-bold text-white font-mono tracking-wide">
                ALGORITHM_SOURCE
              </h3>
            </div>

            <CodeViewer moduleName={sourceModule} />
          </div>

          {/* Bottom Accent */}
          <div className="absolute bottom-3 left-3 right-3 h-0.5 bg-gradient-to-r from-pink-400/30 to-purple-400/30 rounded-full"></div>
        </div>

        {/* Schedule Statistics */}
        {best && (
          <div className="grid grid-cols-3 gap-4">
            <div className="glass border border-purple-500/20 rounded-xl p-3 text-center">
              <div className="text-purple-300 text-xs font-mono mb-1">
                TASKS
              </div>
              <div className="text-white font-bold">
                {best.path?.length || best.current_solution?.length || 0}
              </div>
            </div>
            <div className="glass border border-pink-500/20 rounded-xl p-3 text-center">
              <div className="text-pink-300 text-xs font-mono mb-1">
                TOTAL TIME
              </div>
              <div className="text-white font-bold">
                {best.cost?.toFixed(2)}
              </div>
            </div>
            <div className="glass border border-cyan-500/20 rounded-xl p-3 text-center">
              <div className="text-cyan-300 text-xs font-mono mb-1">
                ITERATIONS
              </div>
              <div className="text-white font-bold">{history.length}</div>
            </div>
          </div>
        )}
      </div>

      {/* Control Panel Sidebar - 1/3 width (more space) */}
      <aside className="space-y-6">
        {/* Algorithm Control Panel - Takes full height */}
        <div className="glass border border-cyan-500/30 rounded-2xl p-5 relative overflow-hidden group hover:border-cyan-400/50 transition-all duration-300 h-full">
          {/* Hologram Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-cyan-400 rounded-full glow-cyan animate-pulse"></div>
              <h3 className="text-lg font-bold text-white font-mono tracking-wide">
                SCHEDULER_CONTROLS
              </h3>
            </div>

            <div className="flex-1">
              <AlgorithmPanel
                problem="scheduler"
                onResult={(res) => {
                  setHistory(res.history);
                  setBest(res.best_solution);
                  setIsActive(true);
                  setTimeout(() => setIsActive(false), 2000);
                }}
              />
            </div>
          </div>

          {/* Bottom Glow */}
          <div className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-cyan-400/30 rounded-full blur-sm group-hover:bg-cyan-400/50 transition-all duration-300"></div>
        </div>

        {/* Performance Metrics - Compact version */}
        <div className="glass border border-slate-600/50 rounded-2xl p-4">
          <div className="text-center mb-3">
            <div className="text-purple-300 text-xs font-mono">
              SYSTEM METRICS
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="text-center p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <div className="text-purple-300">MEMORY</div>
              <div className="text-white text-sm mt-1">76%</div>
            </div>
            <div className="text-center p-2 bg-pink-500/10 rounded-lg border border-pink-500/20">
              <div className="text-pink-300">CPU</div>
              <div className="text-white text-sm mt-1">38%</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Floating Particles */}
      <div className="fixed top-20 right-20 w-1 h-1 bg-purple-400 rounded-full glow-purple animate-pulse"></div>
      <div className="fixed bottom-40 left-40 w-0.5 h-0.5 bg-pink-400 rounded-full glow-pink animate-bounce delay-300"></div>
      <div className="fixed top-60 right-60 w-0.5 h-0.5 bg-cyan-400 rounded-full glow-cyan animate-ping delay-700"></div>
    </div>
  );
}
