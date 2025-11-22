// src/pages/Settings.jsx
import React, { useEffect, useState } from 'react';
import { db, doc, getDoc, setDoc } from '../services/firebase';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const [tempThreshold, setTempThreshold] = useState(30);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'seller') {
      const fetchSettings = async () => {
        const docRef = doc(db, 'settings', 'thresholds');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTempThreshold(docSnap.data().tempThreshold);
        }
        setLoading(false);
      };
      fetchSettings();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleSave = async () => {
    await setDoc(doc(db, 'settings', 'thresholds'), { tempThreshold });
    alert('Threshold saved successfully!');
  };

  if (loading) return <div className="p-6">Loading...</div>;

  if (user?.role !== 'seller') return <div className="p-6">Access Denied</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="flex flex-col gap-4 max-w-sm">
        <label className="flex flex-col">
          <span>Temperature Alert Threshold (°C)</span>
          <input
            type="number"
            value={tempThreshold}
            onChange={(e) => setTempThreshold(Number(e.target.value))}
            className="border px-3 py-2 rounded mt-1"
          />
        </label>
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-all"
        >
          Save
        </button>
      </div>
    </div>
  );
}
