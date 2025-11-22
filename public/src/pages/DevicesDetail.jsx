// src/pages/DeviceDetail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DeviceDetail() {
  const { id } = useParams();

  // mock device info
  const device = {
    id,
    name: "Truck #12",
    temp: -2.3,
    humidity: 65,
    status: "OK",
    lastUpdate: "2025-11-22 14:32",
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-semibold">Device Detail</h1>
          <Link
            to="/devices"
            className="px-3 py-1 bg-slate-700 text-white rounded hover:bg-slate-800 text-sm"
          >
            Back
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border w-full max-w-xl">
          <h2 className="text-xl font-semibold mb-4">{device.name}</h2>

          <div className="space-y-3">
            <p><strong>ID:</strong> {device.id}</p>
            <p><strong>Temperature:</strong> {device.temp}°C</p>
            <p><strong>Humidity:</strong> {device.humidity}%</p>
            <p><strong>Status:</strong> {device.status}</p>
            <p><strong>Last Update:</strong> {device.lastUpdate}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
