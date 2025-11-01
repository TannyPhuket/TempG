<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Smart Cold Guard Dashboard</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: 'Kanit', sans-serif;
      background-color: #f9fafc;
      color: #111;
      margin: 0;
      padding: 0;
    }
    header {
      background-color: #007bff;
      color: #fff;
      padding: 1rem;
      font-size: 1.5rem;
      font-weight: 600;
      text-align: center;
    }
    .container {
      max-width: 850px;
      margin: 2rem auto;
      background: white;
      border-radius: 12px;
      padding: 1.5rem 2rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    h2 {
      background: #e8f2ff;
      padding: 0.6rem 1rem;
      border-radius: 8px;
      color: #007bff;
      text-align: left;
    }
    .reading {
      font-size: 2.8rem;
      font-weight: bold;
      margin: 0.5rem 0 1rem 0;
    }
    .green { color: #28a745; }
    .red { color: #dc3545; }
    .status {
      display: inline-block;
      background: #e8f2ff;
      padding: 0.5rem 1rem;
      border-radius: 999px;
      margin-top: 0.5rem;
      font-weight: 600;
      color: #007bff;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1.5rem;
      font-size: 0.95rem;
    }
    th, td {
      border-bottom: 1px solid #ddd;
      padding: 0.6rem;
      text-align: center;
    }
    th {
      background: #e8f2ff;
      color: #007bff;
    }
    #loginForm {
      text-align: center;
      margin-top: 3rem;
    }
    input {
      padding: 0.6rem;
      margin: 0.5rem;
      width: 220px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-family: inherit;
    }
    button {
      background: #007bff;
      color: white;
      padding: 0.6rem 1.5rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
    }
    button:hover {
      background: #0056b3;
    }
    .logout {
      float: right;
      margin-top: -40px;
      margin-right: 10px;
    }
    #thresholdSection input {
      width: 80px;
      text-align: center;
    }
  </style>
</head>
<body>
  <header>
    🌡️ Smart Cold Guard Dashboard
    <button id="logoutBtn" class="logout" style="display:none;">ออกจากระบบ</button>
  </header>

  <div class="container" id="loginContainer">
    <h2>เข้าสู่ระบบ</h2>
    <div id="loginForm">
      <input type="email" id="email" placeholder="อีเมล"><br>
      <input type="password" id="password" placeholder="รหัสผ่าน"><br>
      <button id="loginBtn">เข้าสู่ระบบ</button>
      <p id="loginStatus"></p>
    </div>
  </div>

  <div class="container" id="dashboard" style="display:none;">
    <h2>ข้อมูลปัจจุบัน</h2>
    <div id="temp" class="reading">-- °C</div>
    <div id="hum" class="reading">-- %</div>
    <div id="status" class="status">กำลังเชื่อมต่อ...</div>

    <div id="thresholdSection" style="display:none; margin-top:1rem;">
      <h2>ตั้งค่าอุณหภูมิแจ้งเตือน (สำหรับผู้ขาย)</h2>
      <label>ต่ำสุด:</label> <input type="number" id="minTemp" step="0.1"> °C
      <label>สูงสุด:</label> <input type="number" id="maxTemp" step="0.1"> °C
      <button id="saveThreshold">บันทึก</button>
    </div>

    <h2>ข้อมูลย้อนหลัง</h2>
    <table id="historyTable">
      <thead>
        <tr><th>วันที่</th><th>เวลา</th><th>อุณหภูมิ (°C)</th><th>ความชื้น (%)</th></tr>
      </thead>
      <tbody></tbody>
    </table>
  </div>

  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
    import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
    import { getDatabase, ref, get, set, onValue, update } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

    // CONFIG --------------------
    const firebaseConfig = {
      apiKey: "AIzaSyBHCnAFJHBz95ugYztMkxBa5b6fwqCZqfo",
      databaseURL: "https://temperature-cold-guard-default-rtdb.asia-southeast1.firebasedatabase.app/"
    };
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const auth = getAuth(app);

    const loginContainer = document.getElementById("loginContainer");
    const dashboard = document.getElementById("dashboard");
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const loginStatus = document.getElementById("loginStatus");
    const tempEl = document.getElementById("temp");
    const humEl = document.getElementById("hum");
    const statusEl = document.getElementById("status");
    const tbody = document.querySelector("#historyTable tbody");
    const thresholdSection = document.getElementById("thresholdSection");

    let userRole = null;
    let minTemp = 0;
    let maxTemp = 50;

    // LOGIN --------------------
    loginBtn.addEventListener("click", async () => {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      try {
        await signInWithEmailAndPassword(auth, email, password);
        loginStatus.textContent = "เข้าสู่ระบบสำเร็จ";
      } catch (err) {
        loginStatus.textContent = "❌ อีเมลหรือรหัสผ่านไม่ถูกต้อง";
      }
    });

    logoutBtn.addEventListener("click", async () => {
      await signOut(auth);
    });

    // MAIN --------------------
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        loginContainer.style.display = "none";
        dashboard.style.display = "block";
        logoutBtn.style.display = "inline";
        const roleSnap = await get(ref(db, "users/" + user.uid + "/role"));
        userRole = roleSnap.exists() ? roleSnap.val() : "buyer";
        if (userRole === "seller") thresholdSection.style.display = "block";
        loadDashboard();
      } else {
        loginContainer.style.display = "block";
        dashboard.style.display = "none";
        logoutBtn.style.display = "none";
      }
    });

    // ---------------- Dashboard ----------------
    async function loadDashboard() {
      onValue(ref(db, "threshold"), snap => {
        if (snap.exists()) {
          const t = snap.val();
          minTemp = t.minTemp;
          maxTemp = t.maxTemp;
          document.getElementById("minTemp").value = minTemp;
          document.getElementById("maxTemp").value = maxTemp;
        }
      });

      onValue(ref(db, "temperature"), snap => {
        if (snap.exists()) {
          const t = snap.val();
          tempEl.textContent = `${t.toFixed(1)} °C`;
          if (t < minTemp || t > maxTemp) {
            tempEl.className = "reading red";
            statusEl.textContent = "⚠️ อุณหภูมิไม่ปกติ!";
          } else {
            tempEl.className = "reading green";
            statusEl.textContent = "✅ อุณหภูมิปกติ";
          }
        }
      });

      onValue(ref(db, "humidity"), snap => {
        if (snap.exists()) {
          const h = snap.val();
          humEl.textContent = `${h.toFixed(1)} %`;
          humEl.className = "reading green";
        }
      });

      const hisSnap = await get(ref(db, "history"));
      if (hisSnap.exists()) {
        const data = hisSnap.val();
        const now = Date.now();
        let limit = 30 * 24 * 60 * 60 * 1000; // buyer/seller default 30 days
        if (userRole === "shipper") limit = 7 * 24 * 60 * 60 * 1000;
        const rows = Object.keys(data)
          .map(ts => ({ ts: Number(ts), ...data[ts] }))
          .filter(r => now - r.ts <= limit)
          .sort((a,b) => b.ts - a.ts);
        tbody.innerHTML = "";
        for (const r of rows.slice(0,50)) {
          const d = new Date(r.ts);
          tbody.innerHTML += `<tr><td>${d.toLocaleDateString("th-TH")}</td><td>${d.toLocaleTimeString("th-TH",{hour12:false})}</td><td>${r.temperature}</td><td>${r.humidity}</td></tr>`;
        }
      }
    }

    // SAVE THRESHOLD ----------------
    document.getElementById("saveThreshold").addEventListener("click", async () => {
      const newMin = parseFloat(document.getElementById("minTemp").value);
      const newMax = parseFloat(document.getElementById("maxTemp").value);
      await set(ref(db, "threshold"), { minTemp: newMin, maxTemp: newMax });
      alert("✅ บันทึกค่าเรียบร้อย");
    });
  </script>
</body>
</html>
