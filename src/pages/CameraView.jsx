import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Zap, Settings, Check, RotateCcw, CloudRain, Wind } from 'lucide-react';

// Funkcja pomocnicza do obliczania fazy księżyca
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

export default function CameraView() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  
  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [species, setSpecies] = useState('Szczupak');
  const [measureType, setMeasureType] = useState('length');
  const [length, setLength] = useState(72);
  const [weight, setWeight] = useState(2.5);

  const [coords, setCoords] = useState(null);
  const [gpsStatus, setGpsStatus] = useState('Szukanie satelitów...');
  
  // Nowe stany dla pogody i księżyca
  const [weather, setWeather] = useState({ temp: "--", pressure: "---", wind: "--" });
  const [moonPhase, setMoonPhase] = useState(getMoonPhase(new Date()));

 const fetchWeather = async (lat, lng) => {
    const API_KEY = "0bd29ca2194b630a75502d31666e975c"; 
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric&lang=pl`);
      const data = await res.json();
      setWeather({
        temp: Math.round(data.main.temp),
        pressure: data.main.pressure,
        wind: data.wind.speed
      });
    } catch (e) {
      console.error("Błąd pobierania pogody:", e);
    }
  };

  useEffect(() => {
    startCamera();

    let watchId = null;
    if ("geolocation" in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(5);
          const lng = position.coords.longitude.toFixed(5);
          setCoords({ lat, lng });
          setGpsStatus('GPS OK');
          // Pobierz pogodę tylko raz po uzyskaniu lokalizacji
          fetchWeather(lat, lng);
        },
        (error) => {
          setGpsStatus(error.code === 3 ? 'Słaby sygnał...' : 'Błąd GPS');
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    }

    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (err) {
      console.error("Błąd kamery:", err);
    }
  };

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    setPhoto(canvas.toDataURL('image/jpeg', 0.8));
    if (stream) stream.getTracks().forEach(track => track.stop());
  };

  const saveCatch = () => {
    setIsSaving(true);
    
    const newCatch = {
      id: Date.now(),
      photo: photo,
      species: species,
      measureType: measureType,
      value: measureType === 'length' ? length : weight,
      coords: coords,
      weather: weather,
      moon: moonPhase,
      date: new Date().toLocaleString('pl-PL'),
    };

    const existingCatches = JSON.parse(localStorage.getItem('fishLog') || '[]');
    localStorage.setItem('fishLog', JSON.stringify([newCatch, ...existingCatches]));

    setTimeout(() => {
      setIsSaving(false);
      navigate('/logbook');
    }, 1000);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden overscroll-none flex flex-col">
      <div className="absolute top-0 w-full p-4 flex justify-between items-center z-20">
        <button onClick={() => navigate('/')} className="text-white p-2"><X size={28} /></button>
        {!photo && (
          <div className="flex gap-4 text-white">
            <Settings size={24} />
            <Zap size={24} />
          </div>
        )}
      </div>

      {!photo ? (
        <>
          <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute top-20 w-full text-center z-10 text-[10px]">
            <span className={`px-3 py-1 rounded-full bg-black/50 text-white ${coords ? 'text-green-400' : 'animate-pulse'}`}>
               {coords ? `📍 N: ${coords.lat} E: ${coords.lng}` : `📡 ${gpsStatus}`}
            </span>
          </div>
          <div className="absolute bottom-10 w-full flex justify-center z-20">
            <button onClick={takePhoto} className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center">
              <div className="w-16 h-16 bg-white rounded-full"></div>
            </button>
          </div>
        </>
      ) : (
        <>
          <img src={photo} className="w-full h-full object-cover" alt="Podgląd" />
          
          {/* Nakładka danych na zdjęcie */}
          <div className="absolute top-1/4 left-4 z-20 bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10 text-white shadow-2xl">
            <p className="text-[10px] text-gray-300 font-bold tracking-widest mb-1">
              {coords ? `N: ${coords.lat} E: ${coords.lng}` : 'GPS ERROR'} | {new Date().toLocaleDateString('pl-PL')}
            </p>
            <p className="text-4xl font-black italic mb-1 uppercase tracking-tighter">{species}</p>
            <p className="text-3xl font-bold text-yellow-400 mb-3">
              {measureType === 'length' ? `${length} cm` : `${weight} kg`}
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] font-bold uppercase text-gray-200">
              <div className="flex items-center gap-1"><CloudRain size={12}/> {weather.pressure} hPa</div>
              <div className="flex items-center gap-1">🌡️ {weather.temp}°C</div>
              <div className="flex items-center gap-1"><Wind size={12}/> {weather.wind} m/s</div>
              <div className="flex items-center gap-1">🌙 {moonPhase}</div>
            </div>
          </div>

          {/* Panel dolny */}
          <div className="absolute bottom-0 w-full bg-white rounded-t-3xl p-6 z-30 shadow-2xl">
            <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-4"></div>
            
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
              {['Szczupak', 'Sandacz', 'Okoń', 'Karp', 'Amur', 'Sum'].map(f => (
                <button key={f} onClick={() => setSpecies(f)} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${species === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>{f}</button>
              ))}
            </div>

            <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
              <button onClick={() => setMeasureType('length')} className={`flex-1 py-2 text-xs font-bold rounded-lg ${measureType === 'length' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}>DŁUGOŚĆ</button>
              <button onClick={() => setMeasureType('weight')} className={`flex-1 py-2 text-xs font-bold rounded-lg ${measureType === 'weight' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400'}`}>WAGA</button>
            </div>

            <input 
              type="range" 
              min={measureType === 'length' ? "20" : "0.5"} 
              max={measureType === 'length' ? "130" : "30"} 
              step={measureType === 'length' ? "1" : "0.1"}
              value={measureType === 'length' ? length : weight} 
              onChange={(e) => measureType === 'length' ? setLength(e.target.value) : setWeight(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none mb-6 touch-none accent-blue-600"
            />

            <div className="flex gap-3">
              <button onClick={() => { setPhoto(null); startCamera(); }} className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold flex justify-center gap-2 items-center"><RotateCcw size={18}/> COFNIJ</button>
              <button onClick={saveCatch} disabled={isSaving} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-bold flex justify-center gap-2 items-center shadow-lg shadow-blue-200">
                {isSaving ? 'ZAPISYWANIE...' : <><Check size={20}/> ZAPISZ POŁÓW</>}
              </button>
            </div>
          </div>
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}