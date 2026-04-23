import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Ruler, Weight, Trash2, CloudRain, Wind, Moon, Share2, Download, X } from 'lucide-react';
import { toJpeg } from 'html-to-image';

export default function Logbook({ isDarkMode }) {
  const [catches, setCatches] = useState([]);
  const [selectedFish, setSelectedFish] = useState(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const savedCatches = JSON.parse(localStorage.getItem('fishLog') || '[]');
    setCatches(savedCatches);
  }, []);

  const downloadCard = () => {
    if (cardRef.current === null) return;
    toJpeg(cardRef.current, { quality: 0.95 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `FishLog-${selectedFish.species}-${selectedFish.value}.jpg`;
        link.href = dataUrl;
        link.click();
      });
  };

  return (
    <div className={`p-4 pb-24 min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <h1 className="text-2xl font-black mb-6 italic uppercase tracking-tight dark:text-white">Dziennik Trofeów</h1>

      {catches.length === 0 ? (
        <div className="text-center mt-20 text-gray-400">Dziennik jest pusty. 🎣</div>
      ) : (
        <div className="space-y-6">
          {catches.map((item) => (
            <div key={item.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 dark:border-slate-800 relative">
              <img src={item.photo} alt={item.species} className="w-full h-72 object-cover" />
              
              <div className="absolute top-4 right-4 flex gap-2">
                <button onClick={() => setSelectedFish(item)} className="bg-white/90 backdrop-blur-md p-3 rounded-2xl text-blue-600 shadow-lg">
                  <Share2 size={20} />
                </button>
                <button onClick={() => {/* funkcja delete */}} className="bg-white/90 backdrop-blur-md p-3 rounded-2xl text-red-500 shadow-lg">
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-black italic uppercase dark:text-white">{item.species}</h2>
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full font-bold text-sm">
                    {item.value} {item.measureType === 'length' ? 'cm' : 'kg'}
                  </span>
                </div>
                {/* ... reszta danych (pogoda itp) ... */}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL GENERATORA KARTY */}
      {selectedFish && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="w-full max-w-sm flex flex-col items-center">
            
            {/* KARTA DO EKSPORTU */}
            <div 
              ref={cardRef}
              className="w-full aspect-[3/4] bg-slate-900 rounded-[2rem] overflow-hidden relative shadow-2xl border-4 border-blue-500/30"
            >
              <img src={selectedFish.photo} className="absolute inset-0 w-full h-full object-cover brightness-75" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              
              <div className="absolute top-6 left-6 right-6">
                <div className="flex justify-between items-start">
                   <h2 className="text-4xl font-black italic text-white uppercase leading-none drop-shadow-lg">
                    {selectedFish.species}
                   </h2>
                   <div className="bg-blue-600 text-white px-3 py-1 rounded-lg font-black text-xl shadow-lg">
                    {selectedFish.value}{selectedFish.measureType === 'length' ? 'cm' : 'kg'}
                   </div>
                </div>
                <p className="text-blue-400 font-bold text-[10px] uppercase tracking-widest mt-2 flex items-center gap-1">
                  <MapPin size={10} /> {selectedFish.coords?.lat}, {selectedFish.coords?.lng}
                </p>
              </div>

              <div className="absolute bottom-8 left-6 right-6 flex justify-between items-end">
                <div className="text-white space-y-1">
                  <p className="text-[10px] font-bold opacity-60 uppercase">Warunki Połowu</p>
                  <div className="flex gap-4 text-xs font-black">
                    <span>🌡️ {selectedFish.weather?.temp}°C</span>
                    <span>🌬️ {selectedFish.weather?.wind}m/s</span>
                    <span>🌙 {selectedFish.moon}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-blue-500 uppercase italic">FishLog App</p>
                  <p className="text-[8px] text-white/40">{selectedFish.date}</p>
                </div>
              </div>
            </div>

            {/* PRZYCISKI MODALA */}
            <div className="flex gap-4 mt-8 w-full">
              <button onClick={() => setSelectedFish(null)} className="flex-1 py-4 bg-white/10 text-white rounded-2xl font-bold border border-white/10 flex items-center justify-center gap-2">
                <X size={20} /> ZAMKNIJ
              </button>
              <button onClick={downloadCard} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-transform">
                <Download size={20} /> POBIERZ KARTĘ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}