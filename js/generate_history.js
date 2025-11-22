// generate_history.js
import { db } from './firebase-config.js';
import { ref, get, set, update } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js';

async function generateHistoryForRoles() {
  const roles = ['Seller', 'Driver', 'Buyer'];
  const histRef = ref(db, 'History');
  const snapshot = await get(histRef);
  const existingData = snapshot.exists() ? snapshot.val() : {};

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  const dayStart = 8;
  const dayEnd = 20;

  function randomTemp(normal=true) {
    if(normal) return parseFloat((Math.random()*6+2).toFixed(1)); // 2-8°C
    else return parseFloat((Math.random()*3 + 8.1).toFixed(1)); // 8.1-11°C
  }
  function randomHum() { return parseFloat((Math.random()*10+70).toFixed(1)); } // 70-80%
  const gps = {lat:7.890,lng:98.3817}; // Thalang, Phuket

  const updates = {...existingData};

  for(let day=dayStart; day<=dayEnd; day++){
    const date = new Date(year, month, day,8,0,0);
    const endTime = new Date(year, month, day,17,0,0);
    const overCount = Math.floor(Math.random()*3)+3; // 3-5 ครั้งเกิน 8°C
    const overTimes = new Set();
    while(overTimes.size<overCount){
      const randomMinute = Math.floor(Math.random()* ((17-8)*12)); // 5 min interval
      overTimes.add(randomMinute);
    }

    let time = date.getTime();
    let interval = 5*60*1000;
    let idx=0;
    while(time<=endTime.getTime()){
      const over = overTimes.has(idx);
      updates[time] = { Temperature: randomTemp(!over), Humidity: randomHum(), GPS:gps };
      time+=interval;
      idx++;
    }
  }

  // เพิ่มข้อมูลต่อจากปัจจุบัน (สุ่มต่อเนื่อง 5 นาที)
  const lastTime = Object.keys(updates).length>0 ? Math.max(...Object.keys(updates).map(t=>parseInt(t))) : Date.now();
  let nextTime = lastTime + 5*60*1000;
  const endNext = Date.now();
  while(nextTime<=endNext){
    updates[nextTime] = { Temperature: randomTemp(), Humidity: randomHum(), GPS:gps };
    nextTime += 5*60*1000;
  }

  await set(histRef, updates);
  console.log('สร้าง History วันที่ 8-20 และข้อมูลปัจจุบันเรียบร้อยแล้ว');
}

generateHistoryForRoles();
