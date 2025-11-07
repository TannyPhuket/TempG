<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Cold Guard Dashboard</title>

  <!-- ✅ Firebase SDK -->
  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
    import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

    const firebaseConfig = {
      apiKey: "AIzaSyBHCnAFJHBz95ugYztMkxBa5b6fwqCZqfo",
      authDomain: "temperature-cold-guard.firebaseapp.com",
      databaseURL: "https://temperature-cold-guard-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "temperature-cold-guard",
      storageBucket: "temperature-cold-guard.firebasestorage.app",
      messagingSenderId: "29693405672",
      appId: "1:29693405672:web:9815de4ba98e7e4cf3dc5d",
      measurementId: "G-XDHBRJ9S3W"
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);

    // 🔹 อ่านค่าจาก Firebase แบบเรียลไทม์
    onValue(ref(db, '/data'), (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const temp = data.temperature;
      const hum = data.humidity;
      const lat = data.gps?.lat || 0;
      const lng = data.gps?.lng || 0;

      document.getElementById("temperature").innerText = `${temp.toFixed(2)} °C`;
      document.getElementById("humidity").innerText = `${hum.toFixed(2)} %`;
      document.getElementById("gps").innerText = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

      // เปลี่ยนสีตามอุณหภูมิ
      const tempEl = document.getElementById("temperature");
      if (temp > -10) tempEl.style.color = "red";
      else if (temp < -18) tempEl.style.color = "blue";
      else tempEl.style.color = "green";
    });
  </script>

  <!-- ✅ สไตล์สวย ๆ -->
  <style>
    body {
      font-family: "Prompt", sans-serif;
      background-color: #ffffff;
      color: #000;
      margin: 0;
      padding: 0;
    }

    header {
      background-color: #5ac8fa;
      color: #fff;
      text-align: center;
      padding: 1rem;
      font-size: 1.8rem;
      font-weight: 600;
    }

    .dashboard {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      padding: 2rem;
    }

    .card {
      background: #eaf6ff;
      border-radius: 20px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
      padding: 1.5rem;
      text-align: center;
      transition: 0.3s;
    }

    .card:hover {
      transform: scale(1.05);
    }

    .value {
      font-size: 2rem;
      font-weight: bold;
    }

    .label {
      font-size: 1rem;
      color: #555;
    }

    footer {
      text-align: center;
      background-color: #5ac8fa;
      color: white;
      padding: 1rem;
      margin-top: 2rem;
    }
  </style>
</head>
<body>

  <header>❄️ Cold Guard Monitoring Dashboard</header>

  <div class="dashboard">
    <div class="card">
      <div class="label">🌡️ อุณหภูมิ</div>
      <div id="temperature" class="value">-- °C</div>
    </div>

    <div class="card">
      <div class="label">💧 ความชื้น</div>
      <div id="humidity" class="value">-- %</div>
    </div>

    <div class="card">
      <div class="label">📍 ตำแหน่ง GPS</div>
      <div id="gps" class="value">-- , --</div>
    </div>
  </div>

  <footer>
    © 2025 Cold Guard | Real-time monitoring powered by Firebase & ESP32
  </footer>

</body>
</html>
