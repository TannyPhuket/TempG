import { db } from './firebase-config.js';
import { ref, set } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js';

// ตั้งค่าช่วงอุณหภูมิของแช่เย็น
const minTemp = 2;  // องศาเซลเซียส
const maxTemp = 8;

// จำนวนวันย้อนหลัง
const days = 14;

// ความถี่ข้อมูล (ไม่เกิน 5 นาที)
const intervalMinutes = 5;
const intervalMs = intervalMinutes * 60 * 1000;

// เวลาเริ่มต้น (14 วันก่อน)
const now = Date.now();
const startTime = now - days * 24 * 60 * 60 * 1000;

// สุ่มค่าตามช่วง
function randomTemp() {
  return parseFloat((Math.random() * (maxTemp - minTemp) + minTemp).toFixed(1));
}

async function generateHistory() {
  const historyRef = ref(db, 'History');
  let currentTime = startTime;

  const updates = {};

  while (currentTime <= now) {
    updates[currentTime] = {
      Temperature: randomTemp(),
      Humidity: parseFloat((Math.random() * 10 + 70).toFixed(1)), // Humidity 70-80%
      GPS: { lat: 7.890, lng: 98.3817 } // ตัวอย่าง GPS Thalang, Phuket
    };
    currentTime += intervalMs;
  }

  await set(historyRef, updates);
  console.log(`สร้าง History เรียบร้อย ${Object.keys(updates).length} แถว`);
}

generateHistory();
