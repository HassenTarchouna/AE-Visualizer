// helpers to create random examples on the client side
export function generateTSPExample(n = 8) {
  // generate random coordinates with integers only
  const pts = Array.from({ length: n }, () => ({
    x: Math.floor(Math.random() * 400 + 20),
    y: Math.floor(Math.random() * 300 + 20),
  }));
  // compute matrix with integer distances
  const mat = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const dx = pts[i].x - pts[j].x;
      const dy = pts[i].y - pts[j].y;
      const distance = Math.hypot(dx, dy);
      mat[i][j] = Math.round(distance); // Round to nearest integer
    }
  }
  return mat;
}

export function generateSchedulerExample(n = 5) {
  // generate durations and due dates (for tardiness)
  const durations = Array.from({ length: n }, () =>
    Math.ceil(Math.random() * 8)
  );
  const due = durations.map((d, i) =>
    Math.ceil(
      (durations.reduce((a, b) => a + b, 0) / n) * (0.6 + Math.random() * 0.8)
    )
  );
  // For easy passing, frontend will send durations array; backend expects list of durations only.
  // We include due in 'meta' by constructing an object as convenience for the visualizer.
  const obj = { durations, due };
  return obj;
}
