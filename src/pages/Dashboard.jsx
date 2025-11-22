// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { db, collection, onSnapshot, query, orderBy, limit } from '../services/firebase';
import TempCard from '../components/Cards/TempCard';
import HumidityCard from '../components/Cards/HumidityCard';
import StatusCard from '../components/Cards/StatusCard';
import DeviceMap from '../components/Map/DeviceMap';

export default function Dashboard() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'devices'), orderBy('timestamp', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDevices(data);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4">
        {devices.map(device => (
          <>
            <TempCard key={device.id} value={device.temp} />
            <HumidityCard key={device.id} value={device.humidity} />
            <StatusCard key={device.id} status={device.status} />
          </>
        ))}
      </div>
      <div className="h-[400px] w-full">
        <DeviceMap devices={devices} />
      </div>
    </div>
  );
}
