// src/Routes.tsx (or inside main.tsx)
import { Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import Dashboard from "./pages/Dashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        {/* Default redirect to structures */}
        <Route index element={<Navigate to="/collection/structures" replace />} />
        
        {/* The :category part matches "structures", "tools", etc. */}
        <Route path="collection/:category" element={<Dashboard />} />
        
        {/* You can add more routes for Library, Trash, etc. */}
        <Route path="library/trash" element={<div className="p-10">Trash Page</div>} />
      </Route>
    </Routes>
  );
}