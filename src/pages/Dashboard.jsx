import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-4 relative min-h-full">
      <h1 className="text-2xl font-bold mb-6">Cześć, Wędkarzu! 🎣</h1>

      {/* Widget Pogodowy */}
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-100">
        <h2 className="text-gray-500 text-sm uppercase font-semibold mb-3">Aktualne warunki (Lokalizacja)</h2>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-4xl font-bold text-gray-800">14°C</p>
            <p className="text-sm text-gray-500 mt-1">Pochmurno</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-gray-800">1012 hPa</p>
            <p className="text-sm text-gray-500 mt-1">Wiatr: 12 km/h</p>
          </div>
        </div>
      </div>

      {/* Szybkie statystyki */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <p className="text-blue-600 text-sm font-medium">Złowione ryby</p>
          <p className="text-2xl font-bold text-blue-900 mt-1">0</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-100">
          <p className="text-green-600 text-sm font-medium">Konto PRO</p>
          <p className="text-lg font-bold text-green-900 mt-1">Aktywne</p>
        </div>
      </div>

      {/* PŁYWAJĄCY PRZYCISK KAMERY (FAB) */}
      <button 
        onClick={() => navigate('/camera')}
        className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white rounded-full w-16 h-16 shadow-xl flex items-center justify-center border-4 border-white active:scale-95 transition-transform z-50"
      >
        <Camera size={28} />
      </button>
    </div>
  );
}