import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Naprawa błędu brakujących ikon Leaflet w React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function MapView() {
  const [catches, setCatches] = useState([]);
  const [userLocation, setUserLocation] = useState([52.376, 16.952]); // Domyślnie Luboń/Poznań

  useEffect(() => {
    // 1. Pobierz ryby z pamięci
    const savedCatches = JSON.parse(localStorage.getItem('fishLog') || '[]');
    // Filtrujemy tylko te, które mają koordynaty
    const catchesWithGps = savedCatches.filter(c => c.coords && c.coords.lat && c.coords.lng);
    setCatches(catchesWithGps);

    // 2. Spróbuj wycentrować mapę na użytkowniku
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
      });
    }
  }, []);

  return (
    <div className="h-screen w-full pb-20 bg-gray-100">
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white/90 backdrop-blur-md px-6 py-2 rounded-full shadow-lg border border-blue-100">
        <p className="text-xs font-black text-blue-600 uppercase tracking-widest text-center">Twoje Miejscówki ({catches.length})</p>
      </div>

      <MapContainer 
        center={userLocation} 
        zoom={11} 
        scrollWheelZoom={true}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {catches.map((item) => (
          <Marker 
            key={item.id} 
            position={[parseFloat(item.coords.lat), parseFloat(item.coords.lng)]}
          >
            <Popup className="custom-popup">
              <div className="w-32 flex flex-col gap-1">
                <img src={item.photo} alt={item.species} className="rounded-lg h-20 object-cover shadow-sm" />
                <p className="font-black text-sm uppercase italic leading-none mt-1">{item.species}</p>
                <p className="text-blue-600 font-bold text-xs">{item.value} {item.measureType === 'length' ? 'cm' : 'kg'}</p>
                <p className="text-[8px] text-gray-400">{item.date.split(',')[0]}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}