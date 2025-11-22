// src/components/Cards/StatusCard.jsx
import React from 'react';

export default function StatusCard({ status }) {
  const isAlert = status === 'alert';

  return (
    <div className={`p-4 rounded shadow-md text-center ${isAlert ? 'bg-red-200 text-red-800' : 'bg-green-100 text-green-800'}`}>
      <h2 className="text-lg font-semibold">Status</h2>
      <p className="text-2xl mt-2 capitalize">{status}</p>
    </div>
  );
}
