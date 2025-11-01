<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Smart Cold Guard Dashboard</title>
  <style>
    body {
      font-family: "Segoe UI", sans-serif;
      background: #0d1117;
      color: #e6edf3;
      margin: 0;
      padding: 0;
      text-align: center;
    }
    header {
      background: #161b22;
      padding: 1rem;
      font-size: 1.5rem;
      font-weight: bold;
      color: #58a6ff;
    }
    .container {
      max-width: 700px;
      margin: 2rem auto;
      background: #161b22;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 0 20px rgba(0,0,0,0.4);
    }
    .reading {
      font-size: 2.5rem;
      font-weight: bold;
      margin: 1rem 0;
    }
    .ok { color: #3fb950; }
    .bad { color: #f85149; }
    .pill {
      display: inline-block;
      padding: 0.4rem 1rem;
      border-radius: 999px;
      font-size: 0.9rem;
      font-weight: 600;
    }
    .pill.ok { background: #238636; }
    .pill.bad { background: #da3633; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1.5rem;
      font-size: 0.9rem;
    }
    th, td {
      border-bottom: 1px solid #30363d;
      padding: 0.6rem;
    }
    th {
      color: #58a6ff;
    }
  </style>
</head>
<body>
  <header>🌡️ Smart Cold Guard Dashboard</header>

  <div class="container">
    <h2>อุณหภูมิ</h2>
    <div id="temp" class="reading">-- °C</div>

    <h2>ความชื้น</h2>
    <div id="hum" class="reading">-- %</div>

    <div id="status" class="pill">กำลังเชื่อมต่อ...</div>

    <table id="historyTable">
      <thead>
        <tr><th>วันที่</th><th>เวลา</th><th>อุณหภูมิ (°C)</th><th>ความชื้น (%)</th></tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>

  <audio id="alertSound" src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"></audio>

  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
    import { getDatabase, ref, onValue, get, child } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

    // ----------------- CONFIG -----------------
    const firebaseConfig = {
      apiKey: "AIzaSyBHCnAFJHBz95ugYztMkxBa5b6fwqCZqfo",
      databaseURL: "https://temperature-cold-guard-default-rtdb.asia-southeast1.firebasedatabase.app/"
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    // ----------------- ELEMENTS -----------------
    const elTemp = document.getElementById("temp");
    const elHum = document.getElementById("hum");
    const elStatus = document.getElementById("status");
    const elAlert = document.getElementById("alertSound");
    const tbody = document.querySelector("#historyTable tbody");

    function playAlert() { elAlert.play(); }
    function stopAlert() { elAlert.pause(); elAlert.currentTime = 0; }

    // ----------------- UPDATE UI -----------------
    function updateTemp(t) {
      elTemp.textContent = `${t.toFixed(1)} °C`;
      const klass = (t > 15 && t < 30) ? "ok" : "bad";
      elTemp.className = `reading ${klass}`;
      if (klass === "bad") {
        elStatus.textContent = "⚠️ อุณหภูมิไม่ปกติ!";
        elStatus.className = "pill bad";
        playAlert();
      } else {
        elStatus.textContent = "✅ อุณหภูมิปกติ";
        elStatus.className = "pill ok";
        stopAlert();
      }
    }

    function updateHum(h) {
      elHum.textContent = `${h.toFixed(1)} %`;
      elHum.className = `reading ${(h >= 0 && h <= 100) ? "ok" : "bad"}`;
    }

    function renderHistory(data) {
      tbody.innerHTML = "";
      const rows = Object.keys(data)
        .map(ts => ({
          ts: Number(ts),
          ...data[ts],
          date: new Date(Number(ts)).toLocaleDateString("th-TH"),
          time: new Date(Number(ts)).toLocaleTimeString("th-TH",{hour12:false})
        }))
        .sort((a,b) => b.ts - a.ts)
        .slice(0, 15);

      for (const r of rows) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${r.date}</td><td>${r.time}</td><td>${r.temperature}</td><td>${r.humidity}</td>`;
        tbody.appendChild(tr);
      }
    }

    // ----------------- REALTIME LISTENERS -----------------
    onValue(ref(db, "temperature"), snap => {
      if (snap.exists()) updateTemp(snap.val());
    });

    onValue(ref(db, "humidity"), snap => {
      if (snap.exists()) updateHum(snap.val());
    });

    // ----------------- HISTORY -----------------
    async function loadHistory() {
      const snapshot = await get(ref(db, "history"));
      if (snapshot.exists()) renderHistory(snapshot.val());
    }
    loadHistory();
    setInterval(loadHistory, 30000); // อัปเดตทุก 30 วิ
  </script>
</body>
</htm
