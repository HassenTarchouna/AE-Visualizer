import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TSPPage from "./pages/TSPPage";
import SchedulerPage from "./pages/SchedulerPage";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tsp" element={<TSPPage />} />
      <Route path="/scheduler" element={<SchedulerPage />} />
    </Routes>
  );
}
