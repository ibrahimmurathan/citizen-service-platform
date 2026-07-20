import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(event) {
      setPosition(event.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

function LocationPicker({ onLocationChange }) {
  const [position, setPosition] = useState(null);

  const handleSetPosition = (latlng) => {
    setPosition(latlng);
    onLocationChange({ latitude: latlng.lat, longitude: latlng.lng });
  };

  return (
    <div>
      <p>Şikayetin konumunu haritadan seçin:</p>
      <MapContainer
        center={[39.925, 32.836]}
        zoom={13}
        style={{ height: "300px", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap katkıda bulunanlar"
        />
        <LocationMarker position={position} setPosition={handleSetPosition} />
      </MapContainer>
    </div>
  );
}

export default LocationPicker;