import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CameraView from './pages/CameraView';
import BottomNav from './components/BottomNav';

// Zaślepki zostawiamy TYLKO dla Dziennika i Zawodów
const Logbook = () => <div className="p-4">Dziennik (Wkrótce)</div>;
const Competitions = () => <div className="p-4">Zawody (Wkrótce)</div>;

export default function App() {
  return (
    <Router>
      <div className="flex flex-col h-screen bg-gray-50 text-gray-900">
        <div className="flex-1 overflow-y-auto pb-20">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* Tutaj aplikacja ładuje nasz prawdziwy moduł kamery! */}
            <Route path="/camera" element={<CameraView />} />
            <Route path="/logbook" element={<Logbook />} />
            <Route path="/competitions" element={<Competitions />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </Router>
  );
}