import React, { useState } from "react";
import {
  generateTSPExample,
  generateSchedulerExample,
} from "../utils/exampleGenerators";
import { runTSP, runScheduler } from "../lib/api";

export default function AlgorithmPanel({ problem, onResult }) {
  const [algorithm, setAlgorithm] = useState("tabu");
  const [params, setParams] = useState({ iterations: 200, tabu_size: 50 });
  const [gaSelection, setGaSelection] = useState("roulette");
  const [gaCrossover, setGaCrossover] = useState("one-point");
  const [exampleData, setExampleData] = useState(null);
  const [loading, setLoading] = useState(false);

  function genExample() {
    if (problem === "tsp") {
      const ex = generateTSPExample(10);
      setExampleData(ex);
    } else {
      const ex = generateSchedulerExample(5);
      setExampleData(ex);
    }
  }

  async function run() {
    setLoading(true);
    try {
      const body = {
        algorithm: algorithm,
        problem: problem,
        params: { ...params, selection: gaSelection, crossover: gaCrossover },
        data: exampleData,
      };

      let res;
      if (problem === "tsp") res = await runTSP(body);
      else res = await runScheduler(body);

      onResult(res);
    } catch (err) {
      console.error(err);
      alert("Error running algorithm — check console");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass border border-cyan-500/30 rounded-2xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-cyan-500/20">
        <div className="w-2 h-2 bg-cyan-400 rounded-full glow-cyan animate-pulse"></div>
        <h3 className="text-lg font-bold text-white font-mono">
          ALGORITHM CONTROLS
        </h3>
      </div>

      <div className="space-y-5">
        {/* Algorithm Selection */}
        <div>
          <label className="block text-cyan-300 text-sm font-mono mb-3">
            ALGORITHM TYPE
          </label>
          <div className="grid grid-cols-3 gap-2">
            {["tabu", "sa", "ga"].map((algo) => (
              <button
                key={algo}
                onClick={() => setAlgorithm(algo)}
                className={`py-2 px-3 rounded-lg border font-mono text-xs transition-all duration-300 ${
                  algorithm === algo
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 glow-cyan"
                    : "glass border-slate-600 text-slate-400 hover:border-cyan-400/50 hover:text-cyan-300"
                }`}
              >
                {algo === "tabu" && "TABU"}
                {algo === "sa" && "RS"}
                {algo === "ga" && "GA"}
              </button>
            ))}
          </div>
        </div>

        {/* GA Options */}
        {algorithm === "ga" && (
          <div className="space-y-4 p-4 glass border border-purple-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full glow-purple"></div>
              <span className="text-purple-300 text-sm font-mono">
                GENETIC PARAMETERS
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-purple-300 text-xs font-mono mb-2">
                  SELECTION
                </label>
                <select
                  value={gaSelection}
                  onChange={(e) => setGaSelection(e.target.value)}
                  className="w-full glass border border-purple-500/30 rounded-lg p-2 text-black bg-slate-900 text-sm focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30"
                >
                  <option
                    value="roulette"
                    className="w-full glass border border-purple-500/30 rounded-lg p-2 text-black bg-slate-900 text-sm focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30"
                  >
                    Roulette Wheel
                  </option>
                  <option
                    value="rank"
                    className="w-full glass border border-purple-500/30 rounded-lg p-2 text-black bg-slate-900 text-sm focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30"
                  >
                    Rank Based
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-purple-300 text-xs font-mono mb-2">
                  CROSSOVER
                </label>
                <select
                  value={gaCrossover}
                  onChange={(e) => setGaCrossover(e.target.value)}
                  className="w-full glass border border-purple-500/30 rounded-lg p-2 text-black bg-slate-900 text-sm focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30"
                >
                  <option
                    value="one-point"
                    className="w-full glass border border-purple-500/30 rounded-lg p-2 text-black bg-slate-900 text-sm focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30"
                  >
                    One Point
                  </option>
                  <option
                    value="two-points"
                    className="w-full glass border border-purple-500/30 rounded-lg p-2 text-black bg-slate-900 text-sm focus:border-purple-400 focus:ring-1 focus:ring-purple-400/30"
                  >
                    Two Points
                  </option>
                  <option value="uniform">Uniform</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons - Fixed Layout */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={genExample}
            className="glass border border-purple-500/30 rounded-xl p-3 text-purple-300 font-mono text-sm hover:border-purple-400 hover:text-purple-200 hover:glow-purple transition-all duration-300 disabled:opacity-50"
            disabled={loading}
          >
            <div className="flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
              GENERATE DATA
            </div>
          </button>

          <button
            onClick={run}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl p-3 text-white font-mono text-sm font-bold hover:from-cyan-400 hover:to-blue-400 transform hover:scale-105 transition-all duration-300 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed shadow-lg hover:shadow-cyan-500/25"
            disabled={!exampleData || loading}
          >
            <div className="flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                  RUNNING...
                </>
              ) : (
                <>
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  EXECUTE
                </>
              )}
            </div>
          </button>
        </div>

        {/* Example Data Display */}
        {exampleData && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full glow-green animate-pulse"></div>
              <span className="text-green-300 text-sm font-mono">
                INPUT DATA
              </span>
            </div>

            <div className="glass border border-green-500/20 rounded-xl p-3 max-h-32 overflow-y-auto">
              <pre className="text-xs text-green-200 font-mono">
                {JSON.stringify(exampleData, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="mt-4 pt-3 border-t border-slate-600/50">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">STATUS:</span>
          <span
            className={
              loading
                ? "text-cyan-400 animate-pulse"
                : exampleData
                ? "text-green-400"
                : "text-slate-500"
            }
          >
            {loading ? "PROCESSING" : exampleData ? "READY" : "AWAITING DATA"}
          </span>
        </div>
      </div>
    </div>
  );
}
