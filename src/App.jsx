import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CameraView from './pages/CameraView';
import Logbook from './pages/Logbook';
import MapView from './pages/Map';
import BottomNav from './components/BottomNav';

export default function App() {
  // Stan trybu nocnego
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('nightMode') === 'true'
  );

  const toggleDarkMode = () => {
    const newVal = !isDarkMode;
    setIsDarkMode(newVal);
    localStorage.setItem('nightMode', newVal);
  };

  return (
    <Router>
      {/* Dynamiczna klasa 'dark' na głównym kontenerze */}
      <div className={`flex flex-col h-screen overflow-hidden transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
            <Route path="/camera" element={<CameraView />} />
            <Route path="/logbook" element={<Logbook isDarkMode={isDarkMode} />} />
            <Route path="/map" element={<MapView />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </Router>
  );
}