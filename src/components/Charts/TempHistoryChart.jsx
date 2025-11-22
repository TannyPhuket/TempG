// src/components/Charts/TempHistoryChart.jsx
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { db, collection, query, where, orderBy, onSnapshot } from '../../services/firebase';

export default function TempHistoryChart({ deviceId, period = 'day' }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    // period: 'day', 'week', 'month'
    const now = new Date();
    let startTime;

    if (period === 'day') {
      startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === 'week') {
      const dayOfWeek = now.getDay();
      startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek);
    } else if (period === 'month') {
      startTime = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const q = query(
      collection(db, 'devices', deviceId, 'history'),
      where('timestamp', '>=', startTime),
      orderBy('timestamp')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chartData = snapshot.docs.map(doc => {
        const d = doc.data();
        return {
          time: d.timestamp.toDate().toLocaleString(),
          temp: d.temp
        };
      });
      setData(chartData);
    });

    return () => unsubscribe();
  }, [deviceId, period]);

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
