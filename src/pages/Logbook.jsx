import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Ruler, Weight, Trash2 } from 'lucide-react';

export default function Logbook() {
  const [catches, setCatches] = useState([]);

  // Pobieramy dane z pamięci przy uruchomieniu ekranu
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
  };

  return (
    <div className="p-4 pb-24 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Twój Dziennik</h1>

      {catches.length === 0 ? (
        <div className="text-center mt-20 text-gray-400">
          <p>Brak wpisów. Ruszaj nad wodę! 🎣</p>
        </div>
      ) : (
        <div className="space-y-6">
          {catches.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              {/* Zdjęcie */}
              <img src={item.photo} alt={item.species} className="w-full h-48 object-cover" />
              
              {/* Dane */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-bold text-gray-800">{item.species}</h2>
                  <button onClick={() => deleteCatch(item.id)} className="text-red-400 p-1">
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    {item.measureType === 'length' ? <Ruler size={16} /> : <Weight size={16} />}
                    <span className="font-bold text-blue-600">{item.value} {item.measureType === 'length' ? 'cm' : 'kg'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>{item.date.split(',')[0]}</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2 text-xs text-gray-400">
                    <a 
  href={`https://www.google.com/maps/search/?api=1&query=${item.coords.lat},${item.coords.lng}`}
  target="_blank" 
  rel="noopener noreferrer"
  className="flex items-center gap-2 col-span-2 text-xs text-blue-500 hover:underline"
>
  <MapPin size={14} />
  <span>Pokaż miejsce na mapie (N: {item.coords.lat}, E: {item.coords.lng})</span>
</a>
                    <span>{item.coords ? `N: ${item.coords.lat}, E: ${item.coords.lng}` : 'Brak danych GPS'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}