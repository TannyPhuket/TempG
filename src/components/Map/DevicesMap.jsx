// src/components/Map/DeviceMap.jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// แก้ไข default icon ของ leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function DeviceMap({ devices }) {
  const defaultPosition = [13.7563, 100.5018]; // Bangkok

  return (
    <MapContainer center={defaultPosition} zoom={6} className="h-full w-full">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {devices.map(device => (
        <Marker key={device.id} position={[device.lat, device.lng]}>
          <Popup>
            <div>
              <p><strong>{device.name}</strong></p>
              <p>Temp: {device.temp}°C</p>
              <p>Humidity: {device.humidity}%</p>
              <p>Status: {device.status}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
