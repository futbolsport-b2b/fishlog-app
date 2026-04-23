import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

// Importy naszych stron
import Dashboard from './pages/Dashboard';
import CameraView from './pages/CameraView';
import Logbook from './pages/Logbook';
import MapView from './pages/Map'; // Upewnij się, że plik nazywa się Map.jsx
import BottomNav from './components/BottomNav';

// Tymczasowa zaślepka dla zawodów
const Competitions = () => (
  <div className="p-10 text-center">
    <h2 className="text-2xl font-bold text-gray-800 uppercase italic">Zawody</h2>
    <p className="text-gray-400 mt-4 font-bold">Moduł dostępny wkrótce...</p>
  </div>
);

export default function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen bg-gray-50 text-gray-900 overflow-hidden">
        {/* Główna treść aplikacji */}
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/camera" element={<CameraView />} />
            <Route path="/logbook" element={<Logbook />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/competitions" element={<Competitions />} />
          </Routes>
        </div>

        {/* Pasek nawigacji na dole */}
        <BottomNav />
      </div>
    </Router>
  );
}