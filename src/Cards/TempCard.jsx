// src/components/Cards/TempCard.jsx
import React from 'react';

export default function TempCard({ value }) {
  const alert = value > 30; // ตัวอย่าง threshold

  return (
    <div className={`p-4 rounded shadow-md text-center ${alert ? 'bg-red-100 text-red-700' : 'bg-white text-gray-800'}`}>
      <h2 className="text-lg font-semibold">Temperature</h2>
      <p className="text-2xl mt-2">{value}°C</p>
    </div>
  );
}
