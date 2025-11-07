import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

export default function VisualizerTSP({ history, best }) {
  const svgRef = useRef(null);
  const [coords, setCoords] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // FIX: Handle different property names in history
  useEffect(() => {
    if (!history || history.length === 0) {
      const n = 6;
      const theta = d3.range(0, 2 * Math.PI, (2 * Math.PI) / n);
      const c = theta.map((t, i) => [
        320 + 180 * Math.cos(t),
        180 + 180 * Math.sin(t),
      ]);
      setCoords(c);
      return;
    }

    const firstStep = history[0];
    const solution =
      firstStep.current_solution ||
      firstStep.candidate_solution ||
      firstStep.best_solution;

    if (!solution) {
      console.warn("No solution found in history:", firstStep);
      const n = 6;
      const theta = d3.range(0, 2 * Math.PI, (2 * Math.PI) / n);
      const c = theta.map((t, i) => [
        320 + 180 * Math.cos(t),
        180 + 180 * Math.sin(t),
      ]);
      setCoords(c);
      return;
    }

    const n = solution.length;
    const theta = d3.range(0, 2 * Math.PI, (2 * Math.PI) / n);
    const c = theta.map((t, i) => [
      320 + 180 * Math.cos(t),
      180 + 180 * Math.sin(t),
    ]);
    setCoords(c);
  }, [history]);

  // Animate path evolution through history
  useEffect(() => {
    if (history && history.length > 0 && !isAnimating) {
      setIsAnimating(true);
      let step = 0;

      const interval = setInterval(() => {
        if (step < history.length) {
          const currentStep = history[step];
          const solution =
            currentStep.current_solution ||
            currentStep.candidate_solution ||
            currentStep.best_solution;
          if (solution) {
            setCurrentPath(solution);
          }
          step++;
        } else {
          clearInterval(interval);
          setIsAnimating(false);
          if (best) {
            setCurrentPath(best.path || best.best_solution || best);
          }
        }
      }, 200); // Slower step animation

      return () => clearInterval(interval);
    } else if (best) {
      setCurrentPath(best.path || best.best_solution || best);
    }
  }, [history, best, isAnimating]);

  // Draw graph with D3
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const w = 640,
      h = 360;
    svg.attr("width", w).attr("height", h);

    // Add gradient definitions
    const defs = svg.append("defs");

    // Node gradient
    const nodeGradient = defs
      .append("linearGradient")
      .attr("id", "nodeGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%");
    nodeGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#00f2fe");
    nodeGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#4facfe");

    // Path gradient
    const pathGradient = defs
      .append("linearGradient")
      .attr("id", "pathGradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%");
    pathGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#00f2fe");
    pathGradient
      .append("stop")
      .attr("offset", "50%")
      .attr("stop-color", "#4facfe");
    pathGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#ff2df7");

    // Draw nodes first (always visible)
    const nodes = svg
      .selectAll(".node")
      .data(coords)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d, i) => `translate(${d[0]}, ${d[1]})`)
      .style("cursor", "pointer");

    // Node glow
    nodes
      .append("circle")
      .attr("r", 16)
      .attr("fill", "url(#nodeGradient)")
      .attr("opacity", 0.3)
      .attr("filter", "blur(4px)");

    // Main node
    nodes
      .append("circle")
      .attr("r", 10)
      .attr("fill", "url(#nodeGradient)")
      .attr("stroke", "#00f2fe")
      .attr("stroke-width", 2)
      .attr("class", "node-center");

    // Node labels
    nodes
      .append("text")
      .text((d, i) => i)
      .attr("text-anchor", "middle")
      .attr("dy", 4)
      .attr("fill", "#ffffff")
      .attr("font-size", "10px")
      .attr("font-weight", "bold")
      .attr("pointer-events", "none");

    // Draw path if we have one
    if (currentPath && currentPath.length > 0 && coords.length > 0) {
      const pathCoords = currentPath
        .map((i) => {
          // Ensure we have valid coordinates
          if (
            coords[i] &&
            coords[i][0] !== undefined &&
            coords[i][1] !== undefined
          ) {
            return coords[i];
          }
          return [0, 0]; // fallback
        })
        .filter((coord) => coord[0] !== 0 || coord[1] !== 0);

      if (pathCoords.length > 0) {
        // Create closed path (return to start)
        const closedPath = [...pathCoords, pathCoords[0]];

        // FIX: Use simple straight lines that connect exactly to node centers
        const pathLine = d3
          .line()
          .x((d) => d[0])
          .y((d) => d[1]);

        // Calculate total path length for proper animation
        let totalLength = 0;
        for (let i = 0; i < closedPath.length - 1; i++) {
          const dx = closedPath[i + 1][0] - closedPath[i][0];
          const dy = closedPath[i + 1][1] - closedPath[i][1];
          totalLength += Math.sqrt(dx * dx + dy * dy);
        }

        // FIX: Create invisible path first to get accurate length
        const invisiblePath = svg
          .append("path")
          .attr("d", pathLine(closedPath))
          .attr("fill", "none")
          .attr("stroke", "transparent")
          .attr("stroke-width", 1);

        const actualLength = invisiblePath.node().getTotalLength();
        invisiblePath.remove();

        // Glow effect (full path, no animation)
        svg
          .append("path")
          .attr("d", pathLine(closedPath))
          .attr("fill", "none")
          .attr("stroke", "url(#pathGradient)")
          .attr("stroke-width", 8)
          .attr("stroke-opacity", 0.2)
          .attr("filter", "blur(8px)");

        // FIX: Main path with proper animation
        const mainPath = svg
          .append("path")
          .attr("d", pathLine(closedPath))
          .attr("fill", "none")
          .attr("stroke", "url(#pathGradient)")
          .attr("stroke-width", 4)
          .attr("stroke-linecap", "round")
          .attr("stroke-linejoin", "round")
          .style("stroke-dasharray", actualLength) // Use actual calculated length
          .style("stroke-dashoffset", actualLength) // Start fully hidden
          .attr("opacity", 1);

        // FIX: Slower, smoother animation
        mainPath
          .transition()
          .duration(3000) // 3 seconds for full path
          .ease(d3.easeLinear)
          .style("stroke-dashoffset", 0);

        // FIX: Add small connection dots to verify lines connect to nodes
        closedPath.forEach((point, index) => {
          if (index < closedPath.length - 1) {
            // Don't add dot for the closing point
            svg
              .append("circle")
              .attr("cx", point[0])
              .attr("cy", point[1])
              .attr("r", 3)
              .attr("fill", "#ff2df7")
              .attr("opacity", 0.8)
              .attr("class", "connection-dot");
          }
        });
      }
    }

    // Add hover effects
    nodes
      .on("mouseover", function () {
        d3.select(this)
          .select("circle.node-center")
          .transition()
          .duration(200)
          .attr("r", 12)
          .attr("stroke-width", 3);
      })
      .on("mouseout", function () {
        d3.select(this)
          .select("circle.node-center")
          .transition()
          .duration(200)
          .attr("r", 10)
          .attr("stroke-width", 2);
      });
  }, [coords, currentPath]);

  // If no data, show placeholder
  if (!history || history.length === 0) {
    return (
      <div className="glass border border-cyan-500/30 rounded-2xl p-8 visualizer flex flex-col items-center justify-center">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-cyan-300 font-mono text-lg mb-2">
            AWAITING TSP DATA
          </h3>
          <p className="text-slate-400 max-w-md text-sm">
            Generate example data and run an algorithm to visualize the
            Traveling Salesman Problem optimization.
          </p>
        </div>

        <div className="glass border border-cyan-500/20 rounded-xl p-4 w-64">
          <svg width="240" height="120" className="mx-auto">
            {[
              [60, 30],
              [180, 30],
              [40, 90],
              [200, 90],
              [120, 60],
            ].map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="5" fill="#00f2fe" opacity="0.5" />
                <text
                  x={x}
                  y={y + 5}
                  textAnchor="middle"
                  fill="#00f2fe"
                  fontSize="8"
                >
                  {i}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="glass border border-cyan-500/30 rounded-2xl p-6 visualizer">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-cyan-400 rounded-full glow-cyan animate-pulse"></div>
          <h3 className="text-white font-mono text-lg">TSP PATH VISUALIZER</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-cyan-300 font-mono text-sm">
            NODES: {coords.length}
          </div>
          <div className="text-purple-300 font-mono text-sm">
            ITER: {history.length}
          </div>
          {best && (
            <div className="text-green-300 font-mono text-sm">
              COST: {best.best_cost?.toFixed(2) || best.cost?.toFixed(2)}
            </div>
          )}
        </div>
      </div>

      <div className="relative">
        <svg
          ref={svgRef}
          className="w-full h-96 rounded-xl bg-slate-900/30 border border-cyan-500/20"
        />

        <div className="absolute bottom-4 left-4 glass border border-cyan-500/20 rounded-lg p-3">
          <div className="text-cyan-300 text-xs font-mono mb-2">LEGEND</div>
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-cyan-400 to-blue-400"></div>
            <span>Network Nodes</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
            <div className="w-6 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400"></div>
            <span>Optimal Path</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
            <div className="w-2 h-2 rounded-full bg-pink-400"></div>
            <span>Connection Points</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isAnimating ? "bg-green-400 animate-pulse" : "bg-cyan-400"
            }`}
          ></div>
          <span className="text-slate-400 font-mono">
            {isAnimating ? "OPTIMIZING PATH..." : "SOLUTION READY"}
          </span>
        </div>
        {best && (
          <div className="text-green-400 font-mono">
            BEST PATH LENGTH:{" "}
            {best.best_cost?.toFixed(2) || best.cost?.toFixed(2)}
          </div>
        )}
      </div>
    </div>
  );
}
