import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function runTSP(body) {
  const r = await axios.post(`${BASE}/tsp/run`, body);
  return r.data;
}

export async function runScheduler(body) {
  const r = await axios.post(`${BASE}/sched/run`, body);
  return r.data;
}

export async function getSource(module) {
  const r = await axios.get(`${BASE}/source/${module}`);
  return r.data;
}

export default { runTSP, runScheduler, getSource };
