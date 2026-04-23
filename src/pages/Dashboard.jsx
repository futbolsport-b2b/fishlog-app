import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Wind, Droplets, Gauge, Moon, MapPin, Trophy, Calendar } from 'lucide-react';

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

export default function Dashboard() {
  const navigate = useNavigate();
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState("Szukanie...");
  
  // Stan dla statystyk
  const [stats, setStats] = useState({
    total: 0,
    uniqueDays: 0,
    biggestFish: 0,
    biggestSpecies: ""
  });

  useEffect(() => {
    // --- OBLICZANIE STATYSTYK Z DZIENNIKA ---
    const savedCatches = JSON.parse(localStorage.getItem('fishLog') || '[]');
    
    if (savedCatches.length > 0) {
      // 1. Liczba ryb
      const total = savedCatches.length;

      // 2. Unikalne dni (wyciągamy samą datę bez godziny i liczymy unikaty)
      const days = new Set(savedCatches.map(c => c.date.split(',')[0])).size;

      // 3. Największa ryba (szukamy max wartości)
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

    // --- POBIERANIE POGODY ---
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
    <div className="p-5 pb-24 min-h-screen bg-gray-50 font-sans">
      {/* NAGŁÓWEK */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black italic text-gray-900 tracking-tighter uppercase">FishLog</h1>
          <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1 uppercase tracking-widest">
            <MapPin size={10} className="text-blue-500" /> {locationName}
          </p>
        </div>
        <div className="w-10 h-10 bg-white border border-gray-200 rounded-2xl flex items-center justify-center shadow-sm">
          <Trophy size={20} className="text-yellow-500" />
        </div>
      </div>

      {/* WIDGET POGODOWY */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 rounded-[2.5rem] p-6 text-white shadow-2xl shadow-blue-200 relative overflow-hidden mb-6">
        {loading ? (
          <div className="py-10 text-center animate-pulse font-bold text-blue-100">ANALIZOWANIE WARUNKÓW...</div>
        ) : weather ? (
          <>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-6xl font-black mb-1">{weather.temp}°</p>
                <p className="text-xs font-bold opacity-80 uppercase tracking-widest">{weather.desc}</p>
              </div>
              <img src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} alt="Ikona" className="w-20 h-20" />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/10 relative z-10 text-[11px] font-bold uppercase">
              <div className="flex items-center gap-2"><Gauge size={16} className="opacity-50"/> {weather.pressure} hPa</div>
              <div className="flex items-center gap-2"><Wind size={16} className="opacity-50"/> {weather.wind} m/s</div>
              <div className="flex items-center gap-2"><Droplets size={16} className="opacity-50"/> {weather.humidity}% wilgotności</div>
              <div className="flex items-center gap-2"><Moon size={16} className="opacity-50"/> {getMoonPhase(new Date())}</div>
            </div>
          </>
        ) : null}
      </div>

      {/* STATYSTYKI SZYBKIEGO DOSTĘPU */}
      <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 ml-1">Podsumowanie Sezonu</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3">
             <Trophy size={18} />
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase">Łącznie Ryb</p>
          <p className="text-3xl font-black text-gray-800">{stats.total}</p>
        </div>
        
        <div className="bg-white p-5 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="w-8 h-8 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-3">
             <Calendar size={18} />
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase">Dni nad wodą</p>
          <p className="text-3xl font-black text-gray-800">{stats.uniqueDays}</p>
        </div>
      </div>

      {/* REKORD SEZONU */}
      <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Twój rekord sezonu</p>
          <h3 className="text-xl font-black text-gray-800 italic uppercase">
            {stats.biggestSpecies || "Brak danych"}
          </h3>
          <p className="text-blue-600 font-black text-2xl">
            {stats.biggestFish > 0 ? `${stats.biggestFish} ${stats.biggestFish > 30 ? 'cm' : 'kg'}` : "---"}
          </p>
        </div>
        <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center text-yellow-600 font-black text-2xl">
          🏆
        </div>
      </div>

      {/* GŁÓWNY PRZYCISK AKCJI */}
      <button 
        onClick={() => navigate('/camera')}
        className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white rounded-full w-20 h-20 shadow-[0_15px_40px_rgba(37,99,235,0.4)] flex items-center justify-center border-8 border-gray-50 active:scale-90 transition-transform z-50"
      >
        <Camera size={32} />
      </button>
    </div>
  );
}