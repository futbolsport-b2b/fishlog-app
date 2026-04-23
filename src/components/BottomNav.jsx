import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Book, Trophy, Map } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();
  
  // Ukrywamy nawigację w trybie kamery dla pełnego skupienia na zdjęciu
  if (location.pathname === '/camera') return null;

  // Funkcja pomocnicza do sprawdzania, czy dany link jest aktywny
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 w-full bg-white/90 backdrop-blur-lg border-t border-gray-100 flex justify-around items-center py-3 pb-6 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
      
      {/* START */}
      <Link to="/" className={`flex flex-col items-center transition-colors ${isActive('/') ? 'text-blue-600' : 'text-gray-400'}`}>
        <Home size={24} strokeWidth={isActive('/') ? 2.5 : 2} />
        <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Start</span>
      </Link>
      
      {/* DZIENNIK */}
      <Link to="/logbook" className={`flex flex-col items-center transition-colors ${isActive('/logbook') ? 'text-blue-600' : 'text-gray-400'}`}>
        <Book size={24} strokeWidth={isActive('/logbook') ? 2.5 : 2} />
        <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Dziennik</span>
      </Link>

      {/* MAPA */}
      <Link to="/map" className={`flex flex-col items-center transition-colors ${isActive('/map') ? 'text-blue-600' : 'text-gray-400'}`}>
        <Map size={24} strokeWidth={isActive('/map') ? 2.5 : 2} />
        <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Mapa</span>
      </Link>

      {/* ZAWODY */}
      <Link to="/competitions" className={`flex flex-col items-center transition-colors ${isActive('/competitions') ? 'text-blue-600' : 'text-gray-400'}`}>
        <Trophy size={24} strokeWidth={isActive('/competitions') ? 2.5 : 2} />
        <span className="text-[10px] font-bold mt-1 uppercase tracking-tighter">Zawody</span>
      </Link>
      
    </nav>
  );
}