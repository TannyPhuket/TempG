
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>❄️ Smart Cold Guard Dashboard</title>

  <!-- TailwindCSS -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Firebase -->
  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
    import { getDatabase, ref, onValue, set, update } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";
    
    // 🔧 Firebase Config
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

    // 🌡️ โหลดข้อมูลเรียลไทม์
    const tempEl = document.getElementById("temp");
    const humEl = document.getElementById("hum");
    const gpsEl = document.getElementById("gps");
    const statusEl = document.getElementById("status");
    const tempChartCtx = document.getElementById("tempChart").getContext("2d");

    let chartData = {
      labels: [],
      temps: []
    };

    import Chart from "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js";

    const tempChart = new Chart(tempChartCtx, {
      type: "line",
      data: {
        labels: chartData.labels,
        datasets: [{
          label: "Temperature (°C)",
          data: chartData.temps,
          borderColor: "rgba(59,130,246,1)",
          borderWidth: 3,
          tension: 0.3,
          fill: true,
          backgroundColor: "rgba(59,130,246,0.1)"
        }]
      },
      options: {
        scales: { y: { beginAtZero: false } },
        plugins: { legend: { display: false } }
      }
    });

    // 🔁 อ่านค่า /data แบบเรียลไทม์
    const dataRef = ref(db, "data");
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const t = data.temperature?.toFixed(2);
      const h = data.humidity?.toFixed(2);
      const lat = data.gps?.lat?.toFixed(5);
      const lng = data.gps?.lng?.toFixed(5);

      tempEl.textContent = `${t} °C`;
      humEl.textContent = `${h} %`;
      gpsEl.textContent = `${lat}, ${lng}`;
      statusEl.textContent = "🟢 Connected";

      const now = new Date().toLocaleTimeString();
      chartData.labels.push(now);
      chartData.temps.push(t);
      if (chartData.labels.length > 15) {
        chartData.labels.shift();
        chartData.temps.shift();
      }
      tempChart.update();
    });

    // ⚙️ อ่านค่า settings
    const maxEl = document.getElementById("maxTemp");
    const minEl = document.getElementById("minTemp");

    const settingsRef = ref(db, "settings");
    onValue(settingsRef, (snapshot) => {
      const s = snapshot.val();
      if (!s) return;
      maxEl.value = s.maxTemp;
      minEl.value = s.minTemp;
    });

    // 💾 บันทึกค่า settings
    document.getElementById("saveBtn").addEventListener("click", () => {
      const newSettings = {
        maxTemp: parseFloat(maxEl.value),
        minTemp: parseFloat(minEl.value)
      };
      update(settingsRef, newSettings)
        .then(() => showToast("✅ Settings saved successfully!"))
        .catch(() => showToast("❌ Failed to save settings!"));
    });

    // 🔔 Toast แจ้งเตือน
    function showToast(msg) {
      const toast = document.getElementById("toast");
      toast.textContent = msg;
      toast.classList.remove("hidden");
      setTimeout(() => toast.classList.add("hidden"), 3000);
    }
  </script>
</head>

<body class="bg-slate-100 min-h-screen flex flex-col items-center justify-start p-6 font-sans">

  <h1 class="text-4xl font-bold text-blue-600 mb-6 mt-4">❄️ Smart Cold Guard Dashboard</h1>

  <div id="toast" class="hidden fixed top-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-xl shadow-xl z-50 transition-all"></div>

  <!-- Dashboard Grid -->
  <div class="grid md:grid-cols-3 gap-6 w-full max-w-6xl">

    <!-- Temperature -->
    <div class="bg-white shadow-xl rounded-2xl p-6 text-center">
      <h2 class="text-xl font-semibold text-gray-600">Temperature</h2>
      <p id="temp" class="text-5xl font-bold text-blue-500 mt-4">-- °C</p>
    </div>

    <!-- Humidity -->
    <div class="bg-white shadow-xl rounded-2xl p-6 text-center">
      <h2 class="text-xl font-semibold text-gray-600">Humidity</h2>
      <p id="hum" class="text-5xl font-bold text-teal-500 mt-4">-- %</p>
    </div>

    <!-- GPS -->
    <div class="bg-white shadow-xl rounded-2xl p-6 text-center">
      <h2 class="text-xl font-semibold text-gray-600">Location</h2>
      <p id="gps" class="text-xl font-mono mt-4">--, --</p>
      <p id="status" class="mt-3 text-sm text-gray-400">🕓 Connecting...</p>
    </div>
  </div>

  <!-- Chart -->
  <div class="bg-white shadow-xl rounded-2xl p-6 mt-8 w-full max-w-4xl">
    <h2 class="text-xl font-semibold text-gray-700 mb-4">Temperature History</h2>
    <canvas id="tempChart" height="120"></canvas>
  </div>

  <!-- Settings -->
  <div class="bg-white shadow-xl rounded-2xl p-6 mt-8 w-full max-w-4xl">
    <h2 class="text-xl font-semibold text-gray-700 mb-4">Settings</h2>
    <div class="grid md:grid-cols-2 gap-4">
      <div>
        <label class="text-gray-500">Max Temperature (°C)</label>
        <input id="maxTemp" type="number" step="0.1" class="w-full border border-gray-300 rounded-lg px-3 py-2 mt-2">
      </div>
      <div>
        <label class="text-gray-500">Min Temperature (°C)</label>
        <input id="minTemp" type="number" step="0.1" class="w-full border border-gray-300 rounded-lg px-3 py-2 mt-2">
      </div>
    </div>
    <button id="saveBtn" class="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-md transition">
      💾 Save Settings
    </button>
  </div>

  <footer class="text-gray-500 text-sm mt-8 mb-4">
    © 2025 Smart Cold Guard — Developed with ❤️ by Teammy
  </footer>

</body>
</html>
