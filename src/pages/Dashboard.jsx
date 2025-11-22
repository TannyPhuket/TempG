// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { db, collection, onSnapshot, query, orderBy, limit } from '../services/firebase';
import TempCard from '../components/Cards/TempCard';
import HumidityCard from '../components/Cards/HumidityCard';
import StatusCard from '../components/Cards/StatusCard';
import DeviceMap from '../components/Map/DeviceMap';
import SirenController from '../components/Alerts/SirenController';

export default function Dashboard() {
  const [devices, setDevices] = useState([]);
  const [isAlert, setIsAlert] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'devices'), orderBy('timestamp', 'desc'), limit(10));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDevices(data);
      // ตรวจสอบ alert
      const alertExists = data.some(d => d.temp > 30); // threshold ตัวอย่าง
      setIsAlert(alertExists);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-4">
        {devices.map(device => (
          <React.Fragment key={device.id}>
            <TempCard value={device.temp} />
            <HumidityCard value={device.humidity} />
            <StatusCard status={device.status} />
          </React.Fragment>
        ))}
      </div>
      <div className="h-[400px] w-full">
        <DeviceMap devices={devices} />
      </div>
      <SirenController isAlert={isAlert} />
    </div>
  );
}
