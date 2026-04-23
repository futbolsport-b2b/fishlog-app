import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, Trophy, Settings } from 'lucide-react';

export default function BottomNav() {
  const location = useLocation();
  
  // Ukrywamy pasek, jeśli użytkownik jest w trybie kamery
  if (location.pathname === '/camera') return null;

  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around items-center h-16 pb-1">
      <Link to="/" className={`flex flex-col items-center ${location.pathname === '/' ? 'text-blue-600' : 'text-gray-400'}`}>
        <Home size={24} />
        <span className="text-[10px] mt-1">Start</span>
      </Link>
      <Link to="/logbook" className={`flex flex-col items-center ${location.pathname === '/logbook' ? 'text-blue-600' : 'text-gray-400'}`}>
        <BookOpen size={24} />
        <span className="text-[10px] mt-1">Dziennik</span>
      </Link>
      
      {/* Puste miejsce na środku dla pływającego przycisku aparatu */}
      <div className="w-16"></div>

      <Link to="/competitions" className={`flex flex-col items-center ${location.pathname === '/competitions' ? 'text-blue-600' : 'text-gray-400'}`}>
        <Trophy size={24} />
        <span className="text-[10px] mt-1">Zawody</span>
      </Link>
      <Link to="/settings" className="flex flex-col items-center text-gray-400">
        <Settings size={24} />
        <span className="text-[10px] mt-1">Profil</span>
      </Link>
    </div>
  );
}