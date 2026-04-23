import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Wind, Droplets, Gauge, Moon, MapPin } from 'lucide-react';

// Funkcja fazy księżyca (taka sama jak w CameraView dla spójności)
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

  useEffect(() => {
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
        console.error("Błąd pogody na Dashboardzie:", e);
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
    <div className="p-5 pb-24 min-h-screen bg-gray-50">
      {/* NAGŁÓWEK */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black italic text-gray-900 tracking-tighter uppercase">FishLog</h1>
          <p className="text-xs font-bold text-gray-400 flex items-center gap-1">
            <MapPin size={12} className="text-blue-500" /> {locationName}
          </p>
        </div>
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
          Ł
        </div>
      </div>

      {/* WIDGET POGODOWY */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-500 rounded-[2rem] p-6 text-white shadow-2xl shadow-blue-200 relative overflow-hidden mb-8">
        {loading ? (
          <div className="py-10 text-center animate-pulse font-bold uppercase tracking-widest text-blue-100"> Pobieranie danych... </div>
        ) : weather ? (
          <>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-6xl font-black mb-1">{weather.temp}°</p>
                <p className="text-sm font-bold opacity-80 uppercase tracking-widest">{weather.desc}</p>
              </div>
              <img 
                src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
                alt="Pogoda" 
                className="w-20 h-20 -mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/20 relative z-10">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl"><Gauge size={20} /></div>
                <div>
                  <p className="text-[10px] opacity-60 font-bold uppercase">Ciśnienie</p>
                  <p className="font-black text-sm">{weather.pressure} hPa</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl"><Wind size={20} /></div>
                <div>
                  <p className="text-[10px] opacity-60 font-bold uppercase">Wiatr</p>
                  <p className="font-black text-sm">{weather.wind} m/s</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl"><Droplets size={20} /></div>
                <div>
                  <p className="text-[10px] opacity-60 font-bold uppercase">Wilgotność</p>
                  <p className="font-black text-sm">{weather.humidity}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl"><Moon size={20} /></div>
                <div>
                  <p className="text-[10px] opacity-60 font-bold uppercase">Księżyc</p>
                  <p className="font-black text-sm">{getMoonPhase(new Date())}</p>
                </div>
              </div>
            </div>
            
            {/* Dekoracyjne koło w tle */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          </>
        ) : (
          <p>Błąd ładowania pogody.</p>
        )}
      </div>

      {/* STATYSTYKI SZYBKIEGO DOSTĘPU */}
      <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4 ml-1">Twój Sezon</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Złowione</p>
          <p className="text-3xl font-black text-gray-800">12</p>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Dni nad wodą</p>
          <p className="text-3xl font-black text-gray-800">4</p>
        </div>
      </div>

      {/* PRZYCISK APARATU (Zawsze na wierzchu) */}
      <button 
        onClick={() => navigate('/camera')}
        className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white rounded-full w-20 h-20 shadow-[0_10px_30px_rgba(37,99,235,0.4)] flex items-center justify-center border-8 border-gray-50 active:scale-90 transition-transform z-50"
      >
        <Camera size={32} />
      </button>
    </div>
  );
}