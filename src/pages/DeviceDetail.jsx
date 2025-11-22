// src/pages/DeviceDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db, doc, onSnapshot } from '../services/firebase';
import TempCard from '../components/Cards/TempCard';
import HumidityCard from '../components/Cards/HumidityCard';
import StatusCard from '../components/Cards/StatusCard';
import DeviceMap from '../components/Map/DeviceMap';

export default function DeviceDetail() {
  const { id } = useParams();
  const [device, setDevice] = useState(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'devices', id), (docSnap) => {
      if (docSnap.exists()) {
        setDevice({ id: docSnap.id, ...docSnap.data() });
      }
    });

    return () => unsubscribe();
  }, [id]);

  if (!device) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-2xl font-bold">Device Detail: {device.name}</h1>
      <div className="grid grid-cols-3 gap-4">
        <TempCard value={device.temp} />
        <HumidityCard value={device.humidity} />
        <StatusCard status={device.status} />
      </div>
      <div className="h-[400px] w-full">
        <DeviceMap devices={[device]} />
      </div>
    </div>
  );
}
