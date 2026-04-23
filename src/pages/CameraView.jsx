import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Zap, Settings } from 'lucide-react';

export default function CameraView() {
  const videoRef = useRef(null);
  const navigate = useNavigate();
  const [isCaptured, setIsCaptured] = useState(false);

  // Uruchamianie kamery po wejściu na ten ekran
  useEffect(() => {
    let stream = null;

    const startCamera = async () => {
      try {
        // Wymuszamy użycie tylnej kamery w telefonach (environment)
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Błąd dostępu do kamery:", err);
      }
    };

    startCamera();

    // Wyłączenie kamery, gdy użytkownik wychodzi z tego ekranu (oszczędność baterii)
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    // Symulacja zrobienia zdjęcia (zamrożenie ekranu na 0.3s jak w specyfikacji)
    setIsCaptured(true);
    setTimeout(() => {
      // Tutaj w przyszłości przejdziemy do ekranu "Edycji" z suwakami
      alert("Zdjęcie zrobione! Przechodzę do nakładki danych.");
      setIsCaptured(false);
    }, 300);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col">
      
      {/* Górny pasek (minimalny) */}
      <div className="absolute top-0 w-full p-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent">
        <button onClick={() => navigate('/')} className="text-white p-2">
          <X size={28} />
        </button>
        <div className="flex gap-4">
          <button className="text-white p-2"><Settings size={24} /></button>
          <button className="text-white p-2"><Zap size={24} /></button>
        </div>
      </div>

      {/* Wizjer kamery na pełnym ekranie */}
      <video 
        ref={videoRef}
        autoPlay 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Nakładka pomocnicza: Ramka "Tu połóż rybę" */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="w-[80%] h-[30%] border-2 border-white/30 rounded-xl relative">
          {/* Narożniki ramki (celownik) */}
          <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-white/70 rounded-tl-lg"></div>
          <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-white/70 rounded-tr-lg"></div>
          <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-white/70 rounded-bl-lg"></div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-white/70 rounded-br-lg"></div>
        </div>
      </div>

      {/* Dolna strefa: Pasek informacyjny i wielki przycisk migawki */}
      <div className="absolute bottom-0 w-full pb-8 pt-12 px-6 flex flex-col items-center z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
        
        {/* Quick info (nad przyciskiem) */}
        <div className="bg-black/50 backdrop-blur-md text-white text-xs px-4 py-1.5 rounded-full mb-6">
          Luboń | {new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })} | GPS OK
        </div>

        {/* Dolny panel z przyciskiem */}
        <div className="w-full flex justify-between items-center">
          <div className="w-12 h-12 bg-white/20 rounded-lg border border-white/40"></div> {/* Miniatura ostatniego zdjęcia */}
          
          {/* Przycisk migawki */}
          <button 
            onClick={handleCapture}
            className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-all ${isCaptured ? 'bg-white scale-90' : 'bg-transparent active:bg-white/50 active:scale-95'}`}
          >
            <div className="w-16 h-16 bg-white rounded-full"></div>
          </button>
          
          <button className="text-white text-sm font-medium w-12 text-center">+ dane</button>
        </div>
      </div>

    </div>
  );
}