// generate_history.js
import { db } from './js/firebase-config.js';
import { ref, set, get } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js';

// สร้าง History 14 วันย้อนหลัง
export async function generateHistory() {
  const histRef = ref(db,'History');
  const snapshot = await get(histRef);
  if(snapshot.exists()) return; // มีแล้วไม่สร้างซ้ำ

  const updates = {};
  const interval = 5*60*1000; // ทุก 5 นาที
  const now = new Date();

  for(let d=14; d>=0; d--){
    const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()-d, 8, 0, 0);
    const dayEnd   = new Date(now.getFullYear(), now.getMonth(), now.getDate()-d, 17, 0, 0);
    let time = dayStart.getTime();
    let overTempCount = 0;

    while(time <= dayEnd.getTime()){
      let temp = parseFloat((Math.random()*6+2).toFixed(1)); // 2-8°C
      if(overTempCount<3 && Math.random()<0.1){ 
        temp = parseFloat((8 + Math.random()*2).toFixed(1)); 
        overTempCount++; 
      }
      const hum = parseFloat((Math.random()*10+70).toFixed(1)); // 70-80%
      updates[time] = { Temperature: temp, Humidity: hum, GPS:{lat:7.890,lng:98.3817} };
      time += interval;
    }
  }
  await set(histRef, updates);
  console.log('สร้าง History 14 วันเรียบร้อย');
}

// เพิ่ม Realtime Data ทุก 5 นาที
export async function addRealtimeData(role){
  const now = Date.now();
  let temp = parseFloat((Math.random()*6+2).toFixed(1));
  const hum = parseFloat((Math.random()*10+70).toFixed(1));
  const updates = { Temperature: temp, Humidity: hum, GPS:{lat:7.890,lng:98.3817} };

  await set(ref(db,'Data'), updates);
  await set(ref(db,'History/'+now), updates);
  console.log(`${role} - เพิ่มข้อมูล Realtime: ${temp}°C`);
}
