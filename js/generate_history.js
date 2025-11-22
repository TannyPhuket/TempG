import { db } from './js/firebase-config.js';
import { ref, get, set, update } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js';

async function generateHistory() {
  const histRef = ref(db, 'History');
  const snapshot = await get(histRef);
  const now = new Date();
  
  // ถ้าไม่มีข้อมูล ให้เริ่มสร้าง 14 วันย้อนหลัง
  if (!snapshot.exists()) {
    const updates = {};
    const startDate = new Date();
    startDate.setDate(now.getDate() - 14);
    startDate.setHours(8,0,0,0);

    for (let d = new Date(startDate); d <= now; d.setDate(d.getDate()+1)) {
      // สุ่มเวลาทุก 5 นาทีระหว่าง 8:00 - 17:00
      let times = [];
      for (let h=8; h<=17; h++) {
        for (let m=0; m<60; m+=5) {
          const t = new Date(d.getFullYear(), d.getMonth(), d.getDate(), h, m).getTime();
          times.push(t);
        }
      }

      // สุ่มให้เกิน 8°C 3-5 ครั้ง
      let exceedCount = Math.floor(Math.random()*3)+3; // 3-5 ครั้ง
      let exceedIndexes = [];
      while(exceedIndexes.length<exceedCount){
        const idx = Math.floor(Math.random()*times.length);
        if(!exceedIndexes.includes(idx)) exceedIndexes.push(idx);
      }

      times.forEach((ts, idx) => {
        let temp = parseFloat((Math.random()*6+2).toFixed(1)); // 2-8°C
        if(exceedIndexes.includes(idx)) temp = parseFloat((8 + Math.random()*2).toFixed(1)); // 8-10°C
        const hum = parseFloat((70 + Math.random()*10).toFixed(1)); // 70-80%
        updates[ts] = { Temperature: temp, Humidity: hum, GPS:{lat:7.890,lng:98.3817} };
      });
    }

    await set(histRef, updates);
    console.log('สร้าง History 14 วันเรียบร้อย');
  }
}

// เรียกฟังก์ชันทุกครั้งที่โหลด
generateHistory();

// ฟังก์ชันสำหรับเพิ่มข้อมูลใหม่ต่อไป (Realtime Simulation)
export async function addRealtimeData(role='Seller') {
  const dataRef = ref(db, 'Data');
  const histRef = ref(db, 'History');
  const now = new Date();
  const temp = parseFloat((Math.random()*6+2).toFixed(1)); // 2-8°C
  const hum = parseFloat((70 + Math.random()*10).toFixed(1)); // 70-80%
  const gps = { lat: 7.890, lng: 98.3817 };

  // อัปเดต Data realtime
  await set(dataRef, { Temperature: temp, Humidity: hum, GPS: gps, role });

  // เพิ่ม History
  const ts = now.getTime();
  const newData = {};
  newData[ts] = { Temperature: temp, Humidity: hum, GPS: gps };
  await update(histRef, newData);

  console.log(`Realtime Data updated for ${role} at ${now.toLocaleString()}`);
}
