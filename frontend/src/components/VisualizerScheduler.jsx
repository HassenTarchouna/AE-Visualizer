export default function VisualizerScheduler({ history, best }) {
  // For simplicity render the last history step or best
  const snapshot =
    history && history.length > 0 ? history[history.length - 1] : null;

  // FIX: Handle different property names across algorithms
  const order = snapshot
    ? snapshot.current_solution ||
      snapshot.candidate_solution ||
      snapshot.best_solution
    : best
    ? best.current_solution || best.best_solution || best
    : null;

  const durations = snapshot ? snapshot.durations : null;

  // If no order, show placeholder
  if (!order)
    return (
      <div className="glass border border-purple-500/30 rounded-2xl p-8 visualizer flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-purple-300 font-mono text-lg mb-2">
            AWAITING SCHEDULE
          </h3>
          <p className="text-slate-400 max-w-md">
            Generate example data and run an algorithm to visualize the
            scheduling optimization process.
          </p>
        </div>
      </div>
    );

  // compute cumulative times
  let total = 0;
  const items = order.map((idx, i) => {
    const dur = durations ? durations[idx] : 1;
    const start = total;
    total += dur;
    const end = total;
    const tardiness = Math.max(
      0,
      end -
        (durations && durations[idx + "__due"] ? durations[idx + "__due"] : 0)
    );
    return { idx, dur, start, end, tardiness };
  });

  const maxTime = Math.max(...items.map((item) => item.end));
  const scale = 100 / maxTime;

  return (
    <div className="glass border border-purple-500/30 rounded-2xl p-6 visualizer">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-purple-400 rounded-full glow-purple animate-pulse"></div>
          <h3 className="text-white font-mono text-lg">SCHEDULE VISUALIZER</h3>
        </div>
        <div className="text-purple-300 font-mono text-sm">
          ITERATION: {history?.length || 0}
        </div>
      </div>

      {/* Order Sequence */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full glow-cyan"></div>
          <h4 className="text-cyan-300 font-mono text-sm">TASK SEQUENCE</h4>
        </div>
        <div className="flex gap-2 flex-wrap">
          {items.map((it, index) => (
            <div key={it.idx} className="relative group">
              <div className="px-3 py-2 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 rounded-lg text-cyan-300 font-mono text-sm transition-all duration-300 group-hover:scale-105 group-hover:glow-cyan">
                TASK_{it.idx}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-400 rounded-full glow-cyan"></div>
              </div>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
                Duration: {it.dur} | Position: {index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gantt Chart */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full glow-purple"></div>
          <h4 className="text-purple-300 font-mono text-sm">GANTT CHART</h4>
        </div>

        <div className="glass border border-purple-500/20 rounded-xl p-4">
          {/* Timeline Header */}
          <div className="flex justify-between text-slate-400 text-xs font-mono mb-3">
            <span>TIME 0</span>
            <span>TIME {maxTime}</span>
          </div>

          {/* Gantt Bars */}
          <div className="relative h-20">
            {/* Timeline */}
            <div className="absolute inset-0 border-t border-slate-600/50"></div>

            {items.map((it, index) => (
              <div
                key={it.idx}
                className="absolute h-12 rounded-lg group cursor-pointer transition-all duration-300 hover:scale-y-110 hover:z-10"
                style={{
                  left: `${it.start * scale}%`,
                  width: `${it.dur * scale}%`,
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                {/* Main Bar */}
                <div
                  className={`w-full h-full rounded-lg flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                    it.tardiness > 0
                      ? "bg-gradient-to-r from-red-500/80 to-pink-500/80 text-white shadow-lg shadow-red-500/25"
                      : "bg-gradient-to-r from-green-500/80 to-cyan-500/80 text-white shadow-lg shadow-green-500/25"
                  }`}
                >
                  T{it.idx}
                </div>

                {/* Duration Label */}
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-slate-300 font-mono whitespace-nowrap">
                  {it.dur}u
                </div>

                {/* Hover Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 glass border border-purple-500/30 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20">
                  <div className="text-cyan-300">Task {it.idx}</div>
                  <div className="text-slate-300">Start: {it.start}</div>
                  <div className="text-slate-300">End: {it.end}</div>
                  {it.tardiness > 0 && (
                    <div className="text-red-400">
                      Tardiness: +{it.tardiness}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Time Markers */}
          <div className="flex justify-between mt-2">
            {[...Array(Math.floor(maxTime / 5) + 1)].map((_, i) => (
              <div key={i} className="text-slate-500 text-xs font-mono">
                {i * 5}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 glass border border-cyan-500/20 rounded-lg">
          <div className="text-cyan-300 text-xs font-mono mb-1">TOTAL TIME</div>
          <div className="text-white font-bold text-lg">{maxTime}</div>
        </div>
        <div className="text-center p-3 glass border border-purple-500/20 rounded-lg">
          <div className="text-purple-300 text-xs font-mono mb-1">TASKS</div>
          <div className="text-white font-bold text-lg">{items.length}</div>
        </div>
        <div className="text-center p-3 glass border border-red-500/20 rounded-lg">
          <div className="text-red-300 text-xs font-mono mb-1">TARDINESS</div>
          <div className="text-white font-bold text-lg">
            {items.filter((item) => item.tardiness > 0).length}
          </div>
        </div>
      </div>
    </div>
  );
}
