// js/generate_history.js
import { db } from './firebase-config.js';
import { ref, get, set, update } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js';

// ------------------ ฟังก์ชันสุ่มค่า ------------------
function randomTemp(baseMin=2, baseMax=8, spikes=3) {
  let val = parseFloat((Math.random()*(baseMax-baseMin)+baseMin).toFixed(1));
  if(Math.random()<0.05) val = parseFloat((8 + Math.random()*2).toFixed(1)); // โอกาส spike
  return val;
}
function randomHum(){ return parseFloat((Math.random()*10+70).toFixed(1)); } // 70-80%
function randomGPS(){
  const lat = 7.890 + (Math.random()-0.5)*0.01;
  const lng = 98.3817 + (Math.random()-0.5)*0.01;
  return {lat,lng};
}

// ------------------ สร้าง History ------------------
export async function generateHistory() {
  const histRef = ref(db,'History');
  const snapshot = await get(histRef);
  if(snapshot.exists()) return; // มีแล้วไม่สร้างซ้ำ

  const updates = {};
  const interval = 5*60*1000; // 5 นาที
  const days = 14;

  for(let d=0; d<days; d++){
    const day = new Date();
    day.setDate(day.getDate()-d);
    day.setHours(8,0,0,0); // 8 โมงเช้า
    const endTime = new Date(day); endTime.setHours(17,0,0,0); // 5 โมงเย็น

    let spikeCount = 0;
    while(day<=endTime){
      let temp = randomTemp();
      // บังคับ spike 3-5 ครั้งต่อวัน
      if(spikeCount<3 && Math.random()<0.2){ temp = 8 + Math.random()*2; spikeCount++; }
      updates[day.getTime()] = { Temperature: parseFloat(temp.toFixed(1)), Humidity: randomHum(), GPS: randomGPS() };
      day.setTime(day.getTime()+interval);
    }
  }
  await set(histRef, updates);
  console.log('✅ สร้าง History 14 วันเรียบร้อย');
}

// ------------------ เพิ่ม Realtime Data ทุก 5 นาที ------------------
export async function addRealtimeData(role='Seller') {
  const now = Date.now();
  const temp = parseFloat((Math.random()*6+2).toFixed(1));
  const hum = randomHum();
  const gps = randomGPS();
  const data = { Temperature: temp, Humidity: hum, GPS: gps };

  // Update Data
  await set(ref(db,'Data'), data);

  // บันทึก History
  await update(ref(db,'History'), { [now]: data });
  console.log(`⏱ [${role}] เพิ่ม Realtime Data เวลา ${new Date(now).toLocaleString()}`);
}
