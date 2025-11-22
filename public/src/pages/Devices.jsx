// src/pages/Devices.jsx
import React from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function Devices() {
  const devices = [
    { id: "dev-1", name: "Truck #12", temp: -2.3, status: "OK" },
    { id: "dev-2", name: "Container A", temp: 4.1, status: "WARN" },
    { id: "dev-3", name: "Warehouse 7", temp: 2.0, status: "OK" }
  ];

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-semibold mb-6">All Devices</h1>

        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-sm text-slate-500">
                <th className="py-2">Device Name</th>
                <th className="py-2">Temperature</th>
                <th className="py-2">Status</th>
                <th className="py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((d) => (
                <tr key={d.id} className="border-b last:border-none">
                  <td className="py-3">{d.name}</td>
                  <td className="py-3">{d.temp}°C</td>
                  <td className="py-3">
                    <span
                      className={`px-2 py-1 rounded text-white text-xs ${
                        d.status === "OK" ? "bg-green-500" : "bg-amber-500"
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <Link
                      to={`/devices/${d.id}`}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
