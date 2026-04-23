import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Book, Trophy, Map } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();
  
  // Ukrywamy menu, gdy aparat jest włączony, żeby nie zasłaniał widoku
  if (location.pathname === '/camera') return null;

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around items-center py-3 z-50 shadow-lg">
      <Link to="/" className={`flex flex-col items-center ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-400'}`}>
        <Home size={24} />
        <span className="text-[10px] mt-1">Start</span>
      </Link>
      
      <Link to="/logbook" className={`flex flex-col items-center ${location.pathname === '/logbook' ? 'text-blue-600' : 'text-gray-400'}`}>
        <Book size={24} />
        <span className="text-[10px] mt-1">Dziennik</span>
      </Link>

      {/* Miejsce na mapę w przyszłości */}
      <div className="flex flex-col items-center text-gray-300">
        <Map size={24} />
        <span className="text-[10px] mt-1">Mapa</span>
      </div>

      <Link to="/competitions" className={`flex flex-col items-center ${location.pathname === '/competitions' ? 'text-blue-600' : 'text-gray-400'}`}>
        <Trophy size={24} />
        <span className="text-[10px] mt-1">Zawody</span>
      </Link>
    </nav>
  );
}