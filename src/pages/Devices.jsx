// src/pages/Devices.jsx
import React, { useEffect, useState } from 'react';
import { db, collection, onSnapshot, orderBy, query } from '../services/firebase';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';

export default function Devices() {
  const [devices, setDevices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const q = query(collection(db, 'devices'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDevices(data);
    });
    return () => unsubscribe();
  }, []);

  const totalPages = Math.min(Math.ceil(devices.length / itemsPerPage), 20);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDevices = devices.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Devices</h1>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Temperature</th>
            <th className="border p-2">Humidity</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentDevices.map(device => (
            <tr key={device.id} className="hover:bg-gray-50">
              <td className="border p-2">{device.name}</td>
              <td className={`border p-2 ${device.temp > 30 ? 'text-red-600' : ''}`}>{device.temp}°C</td>
              <td className={`border p-2 ${device.humidity > 70 ? 'text-red-600' : ''}`}>{device.humidity}%</td>
              <td className={`border p-2 capitalize ${device.status === 'alert' ? 'text-red-600' : ''}`}>{device.status}</td>
              <td className="border p-2">
                <Link to={`/devices/${device.id}`} className="text-blue-500 hover:underline">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
