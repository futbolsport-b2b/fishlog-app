import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Zap, Settings, Check, RotateCcw } from 'lucide-react';

export default function CameraView() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  
  const [stream, setStream] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Rozbudowane stany danych
  const [species, setSpecies] = useState('Szczupak');
  const [measureType, setMeasureType] = useState('length'); // 'length' lub 'weight'
  const [length, setLength] = useState(72);
  const [weight, setWeight] = useState(2.5);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Błąd dostępu do kamery:", err);
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line
  }, []);

  const takePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageUrl = canvas.toDataURL('image/jpeg', 0.8);
    setPhoto(imageUrl);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const retakePhoto = () => {
    setPhoto(null);
    startCamera();
  };

  const saveCatch = () => {
    setIsSaving(true);
    setTimeout(() => {
      alert("Zapisano log połowu! Wracamy na ekran główny.");
      navigate('/');
    }, 1500);
  };

  return (
    // Dodano overscroll-none aby dodatkowo zabezpieczyć przed przesuwaniem ekranu
    <div className="relative w-full h-screen bg-black overflow-hidden overscroll-none flex flex-col font-sans">
      
      <div className="absolute top-0 w-full p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/70 to-transparent">
        <button onClick={() => navigate('/')} className="text-white p-2 drop-shadow-md">
          <X size={28} />
        </button>
        {!photo && (
          <div className="flex gap-4">
            <button className="text-white p-2 drop-shadow-md"><Settings size={24} /></button>
            <button className="text-white p-2 drop-shadow-md"><Zap size={24} /></button>
          </div>
        )}
      </div>

      {!photo ? (
        <>
          <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
            <div className="w-[80%] h-[30%] border-2 border-white/20 rounded-xl relative">
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-white/80 rounded-tl-lg"></div>
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-white/80 rounded-tr-lg"></div>
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-white/80 rounded-bl-lg"></div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-white/80 rounded-br-lg"></div>
            </div>
          </div>
          <div className="absolute bottom-0 w-full pb-8 pt-20 flex flex-col items-center z-10 bg-gradient-to-t from-black/80 to-transparent">
            <button 
              onClick={takePhoto}
              className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center active:scale-95 transition-transform"
            >
              <div className="w-16 h-16 bg-white rounded-full"></div>
            </button>
          </div>
        </>
      ) : (
        <>
          {/* Tło pod zdjęciem usztywnione */}
          <div className="absolute inset-0 bg-black z-0 flex items-center justify-center">
            <img src={photo} alt="Złowiona ryba" className="w-full h-full object-cover" />
          </div>
          
          <div className="absolute top-1/4 left-4 z-20 bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-lg text-white">
            <p className="text-xs text-gray-300 font-semibold tracking-wider mb-1">LUBOŃ (PL) | {new Date().toLocaleDateString('pl-PL')}</p>
            <p className="text-3xl font-black italic">{species.toUpperCase()}</p>
            {/* Dynamiczne wyświetlanie wagi lub długości na zdjęciu */}
            <p className="text-2xl font-bold text-yellow-400 mb-2">
              {measureType === 'length' ? `${length} cm` : `${weight} kg`}
            </p>
            <div className="flex gap-4 text-xs font-medium text-gray-300">
              <span>GPS: OK</span>
              <span>1012 hPa</span>
              <span>14°C</span>
            </div>
          </div>

          <div className="absolute bottom-0 w-full bg-white z-30 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex flex-col p-6 pb-8 transition-transform">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>
            
            <p className="text-sm font-bold text-gray-800 mb-2">Gatunek</p>
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
              {['Szczupak', 'Sandacz', 'Okoń', 'Karp', 'Leszcz'].map(fish => (
                <button 
                  key={fish}
                  onClick={() => setSpecies(fish)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${species === fish ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}
                >
                  {fish}
                </button>
              ))}
            </div>

            {/* Przełącznik Długość / Waga */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
              <button
                onClick={() => setMeasureType('length')}
                className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all ${measureType === 'length' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
              >
                📏 Długość
              </button>
              <button
                onClick={() => setMeasureType('weight')}
                className={`flex-1 py-1.5 text-sm font-semibold rounded-md transition-all ${measureType === 'weight' ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
              >
                ⚖️ Waga
              </button>
            </div>

            {/* Dynamiczny suwak z klasą touch-none blokującą przewijanie ekranu */}
            <div className="flex justify-between items-end mb-2">
              <p className="text-sm font-bold text-gray-800">
                {measureType === 'length' ? 'Długość (cm)' : 'Waga (kg)'}
              </p>
              <p className="text-2xl font-black text-blue-600">
                {measureType === 'length' ? length : weight}
              </p>
            </div>
            <input 
              type="range" 
              min={measureType === 'length' ? "10" : "0.1"} 
              max={measureType === 'length' ? "150" : "40"} 
              step={measureType === 'length' ? "1" : "0.1"}
              value={measureType === 'length' ? length : weight} 
              onChange={(e) => measureType === 'length' ? setLength(e.target.value) : setWeight(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-6 touch-none"
            />

            <div className="flex gap-4">
              <button 
                onClick={retakePhoto}
                className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 flex items-center justify-center gap-2 active:bg-gray-200"
              >
                <RotateCcw size={20} /> Powtórz
              </button>
              <button 
                onClick={saveCatch}
                className="flex-[2] py-3 rounded-xl font-bold text-white bg-blue-600 flex items-center justify-center gap-2 active:bg-blue-700 shadow-lg"
              >
                {isSaving ? 'Zapisywanie...' : <><Check size={20} /> Zapisz Połów</>}
              </button>
            </div>
          </div>
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}