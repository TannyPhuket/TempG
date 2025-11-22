// src/pages/Dashboard.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import TempCard from "../components/Card/TempCard";

export default function Dashboard() {
  const devices = [
    { id: "dev-1", name: "Truck #12", temp: -2.3, status: "OK" },
    { id: "dev-2", name: "Container A", temp: 4.1, status: "WARN" },
    { id: "dev-3", name: "Warehouse 7", temp: 2.0, status: "OK" }
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-4">Dashboard Overview</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {devices.map((d) => (
            <TempCard key={d.id} device={d} />
          ))}
        </div>
      </main>
    </div>
  );
}
