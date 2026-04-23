import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Wind, Droplets, Gauge, Moon, Sun, MapPin, Trophy, Calendar } from 'lucide-react';

// Funkcja fazy księżyca
const getMoonPhase = (date) => {
  const lp = 2551443; 
  const now = new Date(date);
  const new_moon = new Date(1970, 0, 7, 20, 35, 0);
  const phase = ((now.getTime() - new_moon.getTime()) / 1000) % lp;
  const res = Math.floor(phase / (24 * 3600));
  if (res === 0) return "Nów";
  if (res < 7) return "Pierwsza kwadra";
  if (res < 15) return "Pełnia";
  if (res < 22) return "Ostatnia kwadra";
  return "Nów";
};

export default function Dashboard({ isDarkMode, toggleDarkMode }) {
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState("Szukanie...");
  
  const [stats, setStats] = useState({
    total: 0,
    uniqueDays: 0,
    biggestFish: 0,
    biggestSpecies: ""
  });

  useEffect(() => {
    // 1. Obliczanie statystyk z Dziennika
    const savedCatches = JSON.parse(localStorage.getItem('fishLog') || '[]');
    
    if (savedCatches.length > 0) {
      const total = savedCatches.length;
      const days = new Set(savedCatches.map(c => c.date.split(',')[0])).size;
      const maxFish = savedCatches.reduce((prev, current) => {
        return (parseFloat(prev.value) > parseFloat(current.value)) ? prev : current;
      });

      setStats({
        total,
        uniqueDays: days,
        biggestFish: maxFish.value,
        biggestSpecies: maxFish.species
      });
    }

    // 2. Pobieranie pogody
    const fetchWeatherData = async (lat, lng) => {
      const API_KEY = "0bd29ca2194b630a75502d31666e975c"; 
      try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric&lang=pl`);
        const data = await res.json();
        setWeather({
          temp: Math.round(data.main.temp),
          pressure: data.main.pressure,
          wind: data.wind.speed,
          humidity: data.main.humidity,
          desc: data.weather[0].description,
          icon: data.weather[0].icon
        });
        setLocationName(data.name);
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        fetchWeatherData(pos.coords.latitude, pos.coords.longitude);
      });
    }
  }, []);

  return (
    <div className={`p-5 pb-32 min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-950' : 'bg-gray-50'}`}>
      
      {/* NAGŁÓWEK Z PRZEŁĄCZNIKIEM */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className={`text-3xl font-black italic tracking-tighter uppercase transition-colors ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            FishLog
          </h1>
          <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-widest">
            <MapPin size={10} className="text-blue-500" /> {locationName}
          </p>
        </div>
        
        <button 
          onClick={toggleDarkMode}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm border ${
            isDarkMode 
            ? 'bg-slate-900 border-slate-800 text-yellow-400' 
            : 'bg-white border-gray-100 text-slate-400'
          }`}
        >
          {isDarkMode ? <Sun size={22} fill="currentColor" /> : <Moon size={22} />}
        </button>
      </div>

      {/* WIDGET POGODOWY (Zawsze niebieski dla kontrastu) */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 rounded-[2.5rem] p-7 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden mb-8">
        {loading ? (
          <div className="py-10 text-center animate-pulse font-bold text-blue-100 uppercase tracking-tighter">Skanowanie łowiska...</div>
        ) : weather ? (
          <>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-7xl font-black mb-1">{weather.temp}°</p>
                <p className="text-xs font-bold opacity-90 uppercase tracking-[0.2em]">{weather.desc}</p>
              </div>
              <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="Ikona" className="w-24 h-24 -mt-4" />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/10 relative z-10 text-[11px] font-bold uppercase">
              <div className="flex items-center gap-2 opacity-90"><Gauge size={16} /> {weather.pressure} hPa</div>
              <div className="flex items-center gap-2 opacity-90"><Wind size={16} /> {weather.wind} m/s</div>
              <div className="flex items-center gap-2 opacity-90"><Droplets size={16} /> {weather.humidity}% wilg.</div>
              <div className="flex items-center gap-2 opacity-90"><Moon size={16} /> {getMoonPhase(new Date())}</div>
            </div>
          </>
        ) : null}
      </div>

      {/* STATYSTYKI SZYBKIEGO DOSTĘPU */}
      <h2 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ml-1 transition-colors ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>
        Twój Sezon
      </h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Karta: Łącznie Ryb */}
        <div className={`p-6 rounded-[2.5rem] border transition-all ${
          isDarkMode ? 'bg-slate-900 border-slate-800 shadow-none' : 'bg-white border-gray-100 shadow-sm'
        }`}>
          <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mb-4">
             <Trophy size={20} />
          </div>
          <p className={`text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>Złowione</p>
          <p className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{stats.total}</p>
        </div>
        
        {/* Karta: Dni nad wodą */}
        <div className={`p-6 rounded-[2.5rem] border transition-all ${
          isDarkMode ? 'bg-slate-900 border-slate-800 shadow-none' : 'bg-white border-gray-100 shadow-sm'
        }`}>
          <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center mb-4">
             <Calendar size={20} />
          </div>
          <p className={`text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>Wyprawy</p>
          <p className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{stats.uniqueDays}</p>
        </div>
      </div>

      {/* REKORD SEZONU */}
      <div className={`p-6 rounded-[2.5rem] border transition-all flex items-center justify-between ${
        isDarkMode ? 'bg-slate-900 border-slate-800 shadow-none' : 'bg-white border-gray-100 shadow-sm'
      }`}>
        <div>
          <p className={`text-[10px] font-bold uppercase mb-1 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>Największa sztuka</p>
          <h3 className={`text-xl font-black italic uppercase transition-colors ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
            {stats.biggestSpecies || "Brak danych"}
          </h3>
          <p className="text-blue-500 font-black text-3xl mt-1">
            {stats.biggestFish > 0 ? `${stats.biggestFish} ${stats.biggestFish > 35 ? 'cm' : 'kg'}` : "---"}
          </p>
        </div>
        <div className="w-20 h-20 bg-yellow-400/5 rounded-full flex items-center justify-center text-3xl shadow-inner border border-yellow-400/10">
          🏆
        </div>
      </div>

      {/* GŁÓWNY PRZYCISK AKCJI */}
      <button 
        onClick={() => navigate('/camera')}
        className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 rounded-full w-20 h-20 shadow-2xl flex items-center justify-center border-8 active:scale-90 transition-all z-50 ${
          isDarkMode 
          ? 'bg-blue-600 border-slate-950 shadow-blue-900/40' 
          : 'bg-blue-600 border-gray-50 shadow-blue-300/40'
        }`}
      >
        <Camera size={32} className="text-white" />
      </button>
    </div>
  );
}