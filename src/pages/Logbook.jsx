import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Ruler, Weight, Trash2, CloudRain, Wind, Moon } from 'lucide-react';

export default function Logbook() {
  const [catches, setCatches] = useState([]);

  useEffect(() => {
    const savedCatches = JSON.parse(localStorage.getItem('fishLog') || '[]');
    setCatches(savedCatches);
  }, []);

  const deleteCatch = (id) => {
    if (window.confirm("Czy na pewno chcesz usunąć ten wpis?")) {
      const updated = catches.filter(c => c.id !== id);
      setCatches(updated);
      localStorage.setItem('fishLog', JSON.stringify(updated));
    }
  }

  return (
    <div className="p-4 pb-24 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6 italic uppercase tracking-tight">Twoje Trofea</h1>

      {catches.length === 0 ? (
        <div className="text-center mt-20 text-gray-400">
          <p>Dziennik jest pusty. Ruszaj na ryby! 🎣</p>
        </div>
      ) : (
        <div className="space-y-6">
          {catches.map((item) => (
            <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
              {/* ZDJĘCIE Z TWOIM OVERLAYEM */}
              <div className="relative">
                <img src={item.photo} alt={item.species} className="w-full h-64 object-cover" />
                <div className="absolute top-2 right-2">
                   <button onClick={() => deleteCatch(item.id)} className="bg-white/80 backdrop-blur-md p-2 rounded-full text-red-500 shadow-sm">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              
              {/* DANE POD ZDJĘCIEM */}
              <div className="p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-black text-gray-800 uppercase italic">{item.species}</h2>
                  <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold">
                    {item.measureType === 'length' ? <Ruler size={16} /> : <Weight size={16} />}
                    <span>{item.value} {item.measureType === 'length' ? 'cm' : 'kg'}</span>
                  </div>
                </div>

                {/* PASEK POGODOWY (DYNAMICZNY) */}
                {item.weather && (
                  <div className="grid grid-cols-4 gap-2 mb-4 p-3 bg-gray-50 rounded-2xl text-[10px] font-bold text-gray-500 uppercase text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-blue-500">🌡️</span> {item.weather.temp}°C
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <CloudRain size={14} className="text-blue-500"/> {item.weather.pressure} hPa
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Wind size={14} className="text-blue-500"/> {item.weather.wind} m/s
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <Moon size={14} className="text-blue-500"/> {item.moon || '--'}
                    </div>
                  </div>
                )}

                {/* DATA I GPS */}
                <div className="flex flex-col gap-2 border-t pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar size={16} />
                    <span>{item.date}</span>
                  </div>
                  
                  {item.coords && (
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${item.coords.lat},${item.coords.lng}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 font-semibold"
                    >
                      <MapPin size={16} />
                      <span>Zobacz miejsce na mapie</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}