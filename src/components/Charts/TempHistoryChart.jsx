// src/components/Charts/TempHistoryChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useDeviceHistory from '../../hooks/useDeviceHistory';
import { useAuth } from '../../context/AuthContext';

export default function TempHistoryChart({ deviceId }) {
  const { user } = useAuth();
  const history = useDeviceHistory(deviceId, user?.role);

  const data = history.map(d => ({
    time: d.timestamp.toDate().toLocaleString(),
    temp: d.temp
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="temp" stroke="#ff7300" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
