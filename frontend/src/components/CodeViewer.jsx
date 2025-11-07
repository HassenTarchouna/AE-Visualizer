import React, { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vs, coy } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getSource } from "../lib/api";

export default function CodeViewer({ moduleName }) {
  const [code, setCode] = useState("");
  const [dark, setDark] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await getSource(moduleName);
        setCode(res.source);
      } catch (err) {
        console.error(err);
        setCode("# Error loading source code");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [moduleName]);

  return (
    <div className="glass border border-blue-500/30 rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-blue-500/20">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-400 rounded-full glow-blue animate-pulse"></div>
          <div>
            <h4 className="font-bold text-white font-mono text-sm">
              SOURCE_CODE
            </h4>
            <div className="text-blue-300 text-xs font-mono mt-1">
              {moduleName}.py
            </div>
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-blue-300 text-xs font-mono">THEME</span>
          <div className="flex glass border border-blue-500/30 rounded-lg p-1">
            <button
              onClick={() => setDark(true)}
              className={`px-2 py-1 rounded text-xs font-mono transition-all duration-300 ${
                dark
                  ? "bg-blue-500/30 text-blue-300 border border-blue-500/50"
                  : "text-slate-400 hover:text-blue-300"
              }`}
            >
              DARK
            </button>
            <button
              onClick={() => setDark(false)}
              className={`px-2 py-1 rounded text-xs font-mono transition-all duration-300 ${
                !dark
                  ? "bg-blue-500/30 text-blue-300 border border-blue-500/50"
                  : "text-slate-400 hover:text-blue-300"
              }`}
            >
              LIGHT
            </button>
          </div>
        </div>
      </div>

      {/* Code Display */}
      <div className="relative">
        {/* Loading State */}
        {loading && (
          <div className="absolute inset-0 glass rounded-xl flex items-center justify-center z-10">
            <div className="flex items-center gap-3 text-blue-400">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="font-mono text-sm">LOADING_SOURCE...</span>
            </div>
          </div>
        )}

        {/* Code Container */}
        <div className="glass border border-blue-500/20 rounded-xl overflow-hidden h-60 relative">
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-2 bg-slate-800/80 border-b border-blue-500/30">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
              <span className="text-blue-300 text-xs font-mono">
                {moduleName}.py
              </span>
            </div>
            <div className="text-slate-400 text-xs font-mono">
              {code ? `${code.split("\n").length} LINES` : "EMPTY"}
            </div>
          </div>

          {/* Syntax Highlighter */}
          <div className="h-48 overflow-auto bg-slate-900/50">
            <SyntaxHighlighter
              language="python"
              style={dark ? vs : coy}
              customStyle={{
                background: "transparent",
                padding: "1rem",
                margin: 0,
                fontSize: "0.75rem",
                lineHeight: "1.4",
              }}
              showLineNumbers={true}
              lineNumberStyle={{
                color: "#64748b",
                minWidth: "3em",
              }}
            >
              {code || "# Source code will appear here..."}
            </SyntaxHighlighter>
          </div>

          {/* Bottom Status Bar */}
          <div className="absolute bottom-0 left-0 right-0 px-4 py-1 bg-slate-800/80 border-t border-blue-500/30 flex justify-between items-center">
            <div className="text-slate-400 text-xs font-mono">
              {dark ? "DARK_THEME" : "LIGHT_THEME"}
            </div>
            <div className="text-slate-400 text-xs font-mono">PYTHON</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between text-xs">
        <div className="text-slate-400 font-mono">SOURCE_VIEWER</div>
        <div className="text-blue-400 font-mono">
          {loading ? "FETCHING..." : code ? "LOADED" : "EMPTY"}
        </div>
      </div>
    </div>
  );
}
