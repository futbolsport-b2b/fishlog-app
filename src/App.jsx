import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import BottomNav from './components/BottomNav';

// Tymczasowe zaślepki dla pozostałych ekranów
const CameraView = () => <div className="p-4">Kamera (Wkrótce)</div>;
const Logbook = () => <div className="p-4">Dziennik (Wkrótce)</div>;
const Competitions = () => <div className="p-4">Zawody (Wkrótce)</div>;

export default function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen bg-gray-50 text-gray-900">
        {/* Dynamiczny obszar wyświetlania stron */}
        <div className="flex-1 overflow-y-auto pb-20">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/camera" element={<CameraView />} />
            <Route path="/logbook" element={<Logbook />} />
            <Route path="/competitions" element={<Competitions />} />
          </Routes>
        </div>
        {/* Dolny pasek nawigacji */}
        <BottomNav />
      </div>
    </Router>
  );
}