import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import Dashboard from './pages/Dashboard'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />}>
          {/* Redirect root to Structures by default */}
          <Route index element={<Navigate to="/collection/structures" replace />} />
          
          {/* Dynamic Category Route */}
          <Route path="collection/:category" element={<Dashboard />} />
          
          {/* Fallback routes */}
          <Route path="library/all" element={<Dashboard />} />
          <Route path="library/trash" element={<div className="p-10">Trash (Coming Soon)</div>} />
        </Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>,
)