import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CameraView from './pages/CameraView';
import Logbook from './pages/Logbook'; // <-- Sprawdź czy masz ten import!
import BottomNav from './components/BottomNav';

// Zaślepka dla zawodów
const Competitions = () => <div className="p-4">Zawody (Wkrótce)</div>;

export default function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen bg-gray-50 text-gray-900">
        <div className="flex-1 overflow-y-auto pb-20">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/camera" element={<CameraView />} />
            <Route path="/logbook" element={<Logbook />} />
            <Route path="/competitions" element={<Competitions />} />
          </Routes>
        </div>
        {/* Dolna nawigacja */}
        <BottomNav />
      </div>
    </Router>
  );
}