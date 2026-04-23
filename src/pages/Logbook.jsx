import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Ruler, Weight, Trash2, Share2, Download, X, Search, Filter, DownloadCloud, UploadCloud } from 'lucide-react';
import { toJpeg } from 'html-to-image';

export default function Logbook({ isDarkMode }) {
  const [catches, setCatches] = useState([]);
  const [filteredCatches, setFilteredCatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecies, setFilterSpecies] = useState('Wszystkie');
  const [selectedFish, setSelectedFish] = useState(null);
  const cardRef = useRef(null);

  // Pobieranie danych
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('fishLog') || '[]');
    setCatches(saved);
    setFilteredCatches(saved);
  }, []);

  // Logika filtrowania i szukania
  useEffect(() => {
    let result = catches;
    if (searchTerm) {
      result = result.filter(c => c.species.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (filterSpecies !== 'Wszystkie') {
      result = result.filter(c => c.species === filterSpecies);
    }
    setFilteredCatches(result);
  }, [searchTerm, filterSpecies, catches]);

  const deleteCatch = (id) => {
    if (window.confirm("Usunąć ten połów na stałe?")) {
      const updated = catches.filter(c => c.id !== id);
      setCatches(updated);
      localStorage.setItem('fishLog', JSON.stringify(updated));
    }
  };

  // EKSPORT DANYCH DO PLIKU (Backup)
  const exportData = () => {
    const dataStr = JSON.stringify(catches);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', `fishlog_backup_${new Date().toLocaleDateString()}.json`);
    link.click();
  };

  const downloadCard = () => {
    if (cardRef.current === null) return;
    toJpeg(cardRef.current, { quality: 0.95 })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `Trofeum-${selectedFish.species}.jpg`;
        link.href = dataUrl;
        link.click();
      });
  };

  const speciesList = ['Wszystkie', ...new Set(catches.map(c => c.species))];

  return (
    <div className={`p-4 pb-32 min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-950' : 'bg-gray-50'}`}>
      
      {/* NAGŁÓWEK I BACKUP */}
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-2xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Dziennik</h1>
        <button 
          onClick={exportData}
          className="flex items-center gap-2 text-[10px] font-bold bg-blue-600/10 text-blue-600 px-3 py-2 rounded-xl border border-blue-600/20"
        >
          <DownloadCloud size={14} /> KOPIA ZAPASOWA
        </button>
      </div>

      {/* PASEK SZUKANIA I FILTRÓW */}
      <div className="space-y-3 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Szukaj gatunku..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-12 pr-4 py-4 rounded-2xl border text-sm font-bold transition-all outline-none focus:ring-2 focus:ring-blue-500 ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-200'}`}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {speciesList.map(s => (
            <button 
              key={s}
              onClick={() => setFilterSpecies(s)}
              className={`px-4 py-2 rounded-full text-[10px] font-black uppercase whitespace-nowrap transition-all ${filterSpecies === s ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : (isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-white text-gray-500 border')}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* LISTA RYB */}
      {filteredCatches.length === 0 ? (
        <div className="text-center mt-20 opacity-30 font-bold uppercase tracking-widest">Brak wyników</div>
      ) : (
        <div className="grid gap-6">
          {filteredCatches.map((item) => (
            <div key={item.id} className={`rounded-[2.5rem] overflow-hidden border transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-100 shadow-sm'}`}>
              <div className="relative h-64">
                <img src={item.photo} className="w-full h-full object-cover" alt={item.species} />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={() => setSelectedFish(item)} className="p-3 bg-white/90 backdrop-blur-md rounded-2xl text-blue-600 shadow-lg active:scale-90 transition-transform"><Share2 size={20} /></button>
                  <button onClick={() => deleteCatch(item.id)} className="p-3 bg-white/90 backdrop-blur-md rounded-2xl text-red-500 shadow-lg active:scale-90 transition-transform"><Trash2 size={20} /></button>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className={`text-2xl font-black italic uppercase ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{item.species}</h2>
                  <div className="bg-blue-600 text-white px-4 py-1 rounded-full font-black text-sm italic tracking-tighter">
                    {item.value} {item.measureType === 'length' ? 'cm' : 'kg'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-gray-100 dark:border-slate-800 pt-4 mt-2">
                   <div className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-2"><Calendar size={14}/> {item.date}</div>
                   {item.coords && (
                    <a href={`https://www.google.com/maps?q=${item.coords.lat},${item.coords.lng}`} target="_blank" className="text-[10px] font-bold text-blue-500 uppercase flex items-center gap-2"><MapPin size={14}/> Mapa Google</a>
                   )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL GENERATORA (Podobnie jak wcześniej, ale z poprawionym exportem) */}
      {selectedFish && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
           <div className="w-full max-w-sm">
              <div ref={cardRef} className="w-full aspect-[3/4] bg-slate-950 rounded-[2.5rem] overflow-hidden relative border-4 border-blue-500/20 shadow-2xl">
                 <img src={selectedFish.photo} className="absolute inset-0 w-full h-full object-cover brightness-[0.7]" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                 
                 <div className="absolute top-8 left-8 right-8 flex justify-between items-start">
                    <div className="text-white">
                       <h3 className="text-4xl font-black italic uppercase leading-none drop-shadow-xl">{selectedFish.species}</h3>
                       <p className="text-blue-400 font-bold text-[10px] tracking-[0.2em] mt-2 uppercase flex items-center gap-1">
                          <MapPin size={10} /> {selectedFish.coords?.lat} {selectedFish.coords?.lng}
                       </p>
                    </div>
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl font-black text-xl shadow-2xl italic tracking-tighter">
                       {selectedFish.value}{selectedFish.measureType === 'length' ? 'cm' : 'kg'}
                    </div>
                 </div>

                 <div className="absolute bottom-10 left-8 right-8 flex justify-between items-end border-t border-white/20 pt-6">
                    <div className="text-white space-y-1">
                       <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Warunki</p>
                       <div className="flex gap-4 text-xs font-black">
                          <span>🌡️ {selectedFish.weather?.temp}°C</span>
                          <span>🌬️ {selectedFish.weather?.wind}m/s</span>
                          <span>🌙 {selectedFish.moon}</span>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] font-black text-blue-500 uppercase italic">FishLog Pro</p>
                       <p className="text-[8px] text-white/30 font-bold">{selectedFish.date.split(',')[0]}</p>
                    </div>
                 </div>
              </div>

              <div className="flex gap-4 mt-8">
                 <button onClick={() => setSelectedFish(null)} className="flex-1 py-4 bg-white/10 text-white rounded-2xl font-bold border border-white/10 active:scale-95 transition-transform uppercase text-xs">Anuluj</button>
                 <button onClick={downloadCard} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-2xl active:scale-95 transition-transform flex items-center justify-center gap-2 uppercase text-xs tracking-widest">
                    <Download size={20} /> Pobierz
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}