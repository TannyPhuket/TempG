// src/components/Alerts/SirenController.jsx
import React, { useEffect, useState, useRef } from 'react';

export default function SirenController({ isAlert }) {
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (isAlert && !muted) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [isAlert, muted]);

  return (
    <div className="fixed bottom-4 right-4">
      <audio ref={audioRef} loop>
        <source src="/siren.mp3" type="audio/mpeg" />
      </audio>
      {isAlert && (
        <button
          onClick={() => setMuted(!muted)}
          className="bg-red-600 text-white py-2 px-4 rounded shadow-lg hover:bg-red-700 transition-all"
        >
          {muted ? 'Unmute' : 'Mute'} Siren
        </button>
      )}
    </div>
  );
}
