
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>🔐 Smart Cold Guard Login</title>

  <!-- TailwindCSS -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Firebase SDK -->
  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
    import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

    // 🔧 Firebase Configuration
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

    // 🎯 Login Function
    async function loginUser() {
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
      const msg = document.getElementById("msg");

      if (!email || !password) {
        msg.textContent = "⚠️ กรุณากรอกข้อมูลให้ครบถ้วน";
        msg.classList.remove("hidden");
        return;
      }

      try {
        const userRef = ref(db, "users/" + email.replace(".", "@"));
        const snapshot = await get(userRef);

        if (!snapshot.exists()) {
          msg.textContent = "❌ ไม่พบผู้ใช้นี้ในระบบ";
          msg.classList.remove("hidden");
          return;
        }

        const userData = snapshot.val();
        const userRole = userData.Role;

        // 💡 ตัวอย่าง: อาจเก็บรหัสผ่านใน Firebase ก็ได้ แต่ในนี้ข้ามไว้เพื่อความง่าย
        msg.classList.add("hidden");

        // 🔄 Redirect ตาม Role
        if (userRole === "Seller") {
          window.location.href = "dashboard.html";
        } else if (userRole === "Buyer") {
          window.location.href = "buyer.html";
        } else if (userRole === "Driver") {
          window.location.href = "driver.html";
        } else {
          msg.textContent = "⚠️ Role ของผู้ใช้ไม่ถูกต้อง";
          msg.classList.remove("hidden");
        }
      } catch (error) {
        console.error(error);
        msg.textContent = "❌ เกิดข้อผิดพลาดในการเข้าสู่ระบบ";
        msg.classList.remove("hidden");
      }
    }

    // 📲 กด Enter เพื่อเข้าสู่ระบบ
    document.addEventListener("keypress", (e) => {
      if (e.key === "Enter") loginUser();
    });

    window.loginUser = loginUser;
  </script>
</head>

<body class="bg-gradient-to-br from-blue-100 via-white to-blue-50 min-h-screen flex items-center justify-center font-sans">

  <div class="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-md text-center">
    <h1 class="text-3xl font-bold text-blue-600 mb-6">❄️ Smart Cold Guard</h1>
    <p class="text-gray-500 mb-8">เข้าสู่ระบบเพื่อจัดการตู้เย็นอัจฉริยะของคุณ</p>

    <input
      id="email"
      type="text"
      placeholder="Email (เช่น Seller@Test.com)"
      class="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
    />

    <input
      id="password"
      type="password"
      placeholder="Password (ใส่อะไรก็ได้ในเวอร์ชันทดสอบ)"
      class="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
    />

    <button
      onclick="loginUser()"
      class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md"
    >
      🔓 เข้าสู่ระบบ
    </button>

    <p id="msg" class="hidden mt-4 text-red-500 font-medium"></p>

    <footer class="mt-8 text-sm text-gray-400">
      © 2025 Smart Cold Guard System<br>
      Developed with ❤️ by Teammy
    </footer>
  </div>

</body>
</html>

<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>📊 Smart Cold Guard - Buyer Dashboard</title>

  <!-- Tailwind -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <!-- Firebase SDK -->
  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
    import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

    // ✅ Firebase Config
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

    // 🎯 โหลดข้อมูลแบบเรียลไทม์
    const tempEl = document.getElementById("temperature");
    const humEl = document.getElementById("humidity");
    const gpsEl = document.getElementById("gps");
    const chartCanvas = document.getElementById("tempChart");

    let chart;
    let labels = [];
    let tempData = [];

    function updateChart(timestamp, temp) {
      const date = new Date(timestamp).toLocaleString("th-TH");
      labels.push(date);
      tempData.push(temp);
      if (labels.length > 30) {
        labels.shift();
        tempData.shift();
      }
      chart.update();
    }

    window.onload = () => {
      chart = new Chart(chartCanvas, {
        type: "line",
        data: {
          labels,
          datasets: [{
            label: "อุณหภูมิ (°C)",
            data: tempData,
            borderColor: "rgb(37, 99, 235)",
            backgroundColor: "rgba(37, 99, 235, 0.1)",
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 0
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: { ticks: { color: "#555" }},
            y: { ticks: { color: "#555" }}
          },
          plugins: {
            legend: { labels: { color: "#333" } }
          }
        }
      });

      // 🔹 ดึงข้อมูลเรียลไทม์จาก Firebase
      onValue(ref(db, "data"), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const temp = data.temperature;
          const hum = data.humidity;
          const lat = data.gps?.lat || 0;
          const lng = data.gps?.lng || 0;
          const ts = data.timestamp || Date.now();

          tempEl.textContent = temp + " °C";
          humEl.textContent = hum + " %";
          gpsEl.textContent = lat.toFixed(5) + ", " + lng.toFixed(5);

          if (temp > -10.0) {
            tempEl.className = "text-red-600 font-bold text-4xl";
          } else {
            tempEl.className = "text-green-600 font-bold text-4xl";
          }

          updateChart(ts, temp);
        }
      });
    };
  </script>
</head>

<body class="bg-white min-h-screen flex flex-col font-sans text-gray-800">

  <!-- Header -->
  <header class="bg-blue-100 py-6 shadow-md text-center">
    <h1 class="text-3xl font-bold text-blue-700">❄️ Smart Cold Guard - Buyer Dashboard</h1>
    <p class="text-gray-600 text-sm">ข้อมูลอุณหภูมิและความชื้นย้อนหลัง 1 เดือน</p>
  </header>

  <!-- Main Content -->
  <main class="flex-grow container mx-auto px-6 py-8">
    <div class="grid md:grid-cols-3 gap-6">

      <!-- Temperature -->
      <div class="bg-blue-50 shadow-lg rounded-2xl p-6 text-center">
        <h2 class="text-lg font-semibold text-blue-700 mb-2">อุณหภูมิปัจจุบัน</h2>
        <p id="temperature" class="text-4xl font-bold text-gray-800">-- °C</p>
      </div>

      <!-- Humidity -->
      <div class="bg-blue-50 shadow-lg rounded-2xl p-6 text-center">
        <h2 class="text-lg font-semibold text-blue-700 mb-2">ความชื้นสัมพัทธ์</h2>
        <p id="humidity" class="text-4xl font-bold text-gray-800">-- %</p>
      </div>

      <!-- GPS -->
      <div class="bg-blue-50 shadow-lg rounded-2xl p-6 text-center">
        <h2 class="text-lg font-semibold text-blue-700 mb-2">พิกัดปัจจุบัน</h2>
        <p id="gps" class="text-lg text-gray-700">-- , --</p>
      </div>
    </div>

    <!-- Chart -->
    <div class="mt-10 bg-blue-50 shadow-lg rounded-2xl p-6">
      <h2 class="text-xl font-semibold text-blue-700 mb-4 text-center">📈 กราฟอุณหภูมิย้อนหลัง</h2>
      <canvas id="tempChart" height="120"></canvas>
    </div>
  </main>

  <!-- Footer -->
  <footer class="bg-blue-100 text-center py-4 text-sm text-gray-600">
    © 2025 Smart Cold Guard System | Buyer Dashboard
  </footer>
</body>
</html>

<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>❄️ Smart Cold Guard - Seller Dashboard</title>

  <!-- Tailwind -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

  <!-- Firebase -->
  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
    import { getDatabase, ref, onValue, set, update } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

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

    const tempEl = document.getElementById("temperature");
    const humEl = document.getElementById("humidity");
    const gpsEl = document.getElementById("gps");
    const chartCanvas = document.getElementById("tempChart");
    const minInput = document.getElementById("minTemp");
    const maxInput = document.getElementById("maxTemp");
    const phoneInput = document.getElementById("phone");
    const saveBtn = document.getElementById("saveBtn");
    const saveStatus = document.getElementById("saveStatus");

    let chart;
    let labels = [];
    let tempData = [];

    function updateChart(timestamp, temp) {
      const date = new Date(timestamp).toLocaleString("th-TH");
      labels.push(date);
      tempData.push(temp);
      if (labels.length > 30) {
        labels.shift();
        tempData.shift();
      }
      chart.update();
    }

    window.onload = () => {
      chart = new Chart(chartCanvas, {
        type: "line",
        data: {
          labels,
          datasets: [{
            label: "อุณหภูมิ (°C)",
            data: tempData,
            borderColor: "rgb(37, 99, 235)",
            backgroundColor: "rgba(37, 99, 235, 0.1)",
            tension: 0.4,
            borderWidth: 3,
            pointRadius: 0
          }]
        },
        options: {
          responsive: true,
          scales: {
            x: { ticks: { color: "#555" }},
            y: { ticks: { color: "#555" }}
          },
          plugins: {
            legend: { labels: { color: "#333" } }
          }
        }
      });

      // 🔹 โหลดข้อมูลจาก Firebase
      onValue(ref(db, "data"), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const temp = data.temperature;
          const hum = data.humidity;
          const lat = data.gps?.lat || 0;
          const lng = data.gps?.lng || 0;
          const ts = data.timestamp || Date.now();

          tempEl.textContent = temp + " °C";
          humEl.textContent = hum + " %";
          gpsEl.textContent = lat.toFixed(5) + ", " + lng.toFixed(5);

          if (temp > -10.0) {
            tempEl.className = "text-red-600 font-bold text-4xl";
          } else {
            tempEl.className = "text-green-600 font-bold text-4xl";
          }

          updateChart(ts, temp);
        }
      });

      // 🔹 โหลด settings
      onValue(ref(db, "settings"), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          minInput.value = data.minTemp ?? "";
          maxInput.value = data.maxTemp ?? "";
        }
      });

      // 🔹 โหลด phones
      onValue(ref(db, "phones/1"), (snapshot) => {
        if (snapshot.exists()) {
          phoneInput.value = snapshot.val();
        }
      });

      // ✅ บันทึกการตั้งค่า
      saveBtn.addEventListener("click", async () => {
        const updates = {};
        if (minInput.value && maxInput.value) {
          updates["settings/minTemp"] = parseFloat(minInput.value);
          updates["settings/maxTemp"] = parseFloat(maxInput.value);
        }
        if (phoneInput.value) {
          updates["phones/1"] = phoneInput.value.trim();
        }

        await update(ref(db), updates);
        saveStatus.textContent = "✅ บันทึกข้อมูลเรียบร้อยแล้ว!";
        saveStatus.className = "text-green-600 font-semibold";
        setTimeout(() => (saveStatus.textContent = ""), 2500);
      });
    };
  </script>
</head>

<body class="bg-white min-h-screen flex flex-col font-sans text-gray-800">

  <!-- Header -->
  <header class="bg-blue-100 py-6 shadow-md text-center">
    <h1 class="text-3xl font-bold text-blue-700">❄️ Smart Cold Guard - Seller Dashboard</h1>
    <p class="text-gray-600 text-sm">ตั้งค่าอุณหภูมิ และเบอร์โทรสำหรับรับแจ้งเตือน</p>
  </header>

  <!-- Main -->
  <main class="flex-grow container mx-auto px-6 py-8 space-y-10">

    <!-- Realtime Data -->
    <div class="grid md:grid-cols-3 gap-6">
      <div class="bg-blue-50 shadow-lg rounded-2xl p-6 text-center">
        <h2 class="text-lg font-semibold text-blue-700 mb-2">อุณหภูมิปัจจุบัน</h2>
        <p id="temperature" class="text-4xl font-bold text-gray-800">-- °C</p>
      </div>
      <div class="bg-blue-50 shadow-lg rounded-2xl p-6 text-center">
        <h2 class="text-lg font-semibold text-blue-700 mb-2">ความชื้นสัมพัทธ์</h2>
        <p id="humidity" class="text-4xl font-bold text-gray-800">-- %</p>
      </div>
      <div class="bg-blue-50 shadow-lg rounded-2xl p-6 text-center">
        <h2 class="text-lg font-semibold text-blue-700 mb-2">พิกัด GPS</h2>
        <p id="gps" class="text-lg text-gray-700">-- , --</p>
      </div>
    </div>

    <!-- Setting Form -->
    <div class="bg-blue-50 shadow-lg rounded-2xl p-6">
      <h2 class="text-xl font-semibold text-blue-700 mb-4 text-center">⚙️ การตั้งค่าระบบ</h2>

      <div class="grid md:grid-cols-3 gap-6 mb-4">
        <div>
          <label class="block mb-1 font-semibold">อุณหภูมิต่ำสุด (°C)</label>
          <input id="minTemp" type="number" class="w-full p-2 border rounded-lg" placeholder="-18" />
        </div>
        <div>
          <label class="block mb-1 font-semibold">อุณหภูมิสูงสุด (°C)</label>
          <input id="maxTemp" type="number" class="w-full p-2 border rounded-lg" placeholder="-10" />
        </div>
        <div>
          <label class="block mb-1 font-semibold">เบอร์โทรแจ้งเตือน</label>
          <input id="phone" type="text" class="w-full p-2 border rounded-lg" placeholder="66811360092" />
        </div>
      </div>

      <div class="text-center">
        <button id="saveBtn" class="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition">💾 บันทึกข้อมูล</button>
        <p id="saveStatus" class="mt-3 text-sm"></p>
      </div>
    </div>

    <!-- Chart -->
    <div class="bg-blue-50 shadow-lg rounded-2xl p-6">
      <h2 class="text-xl font-semibold text-blue-700 mb-4 text-center">📈 กราฟอุณหภูมิย้อนหลัง</h2>
      <canvas id="tempChart" height="120"></canvas>
    </div>
  </main>

  <!-- Footer -->
  <footer class="bg-blue-100 text-center py-4 text-sm text-gray-600">
    © 2025 Smart Cold Guard System | Seller Dashboard
  </footer>
</body>
</html>

<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>🚚 Smart Cold Guard - Driver Dashboard</title>

  <!-- Tailwind -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Firebase -->
  <script type="module">
    import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
    import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

    // Firebase Config
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

    const tempEl = document.getElementById("temperature");
    const humEl = document.getElementById("humidity");
    const gpsEl = document.getElementById("gps");
    const timeEl = document.getElementById("timestamp");
    const mapEl = document.getElementById("map");

    let map, marker;

    // ฟังก์ชันโหลดข้อมูลจาก Firebase
    window.onload = () => {
      onValue(ref(db, "data"), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const temp = data.temperature || 0;
          const hum = data.humidity || 0;
          const lat = data.gps?.lat || 0;
          const lng = data.gps?.lng || 0;
          const ts = data.timestamp || Date.now();

          tempEl.textContent = temp + " °C";
          humEl.textContent = hum + " %";
          gpsEl.textContent = lat.toFixed(5) + ", " + lng.toFixed(5);
          timeEl.textContent = new Date(ts).toLocaleString("th-TH");

          // อัปเดตแผนที่
          if (!map) {
            map = new google.maps.Map(mapEl, {
              center: { lat, lng },
              zoom: 13,
            });
            marker = new google.maps.Marker({
              position: { lat, lng },
              map,
              title: "ตำแหน่งรถขนส่ง",
            });
          } else {
            marker.setPosition({ lat, lng });
            map.panTo({ lat, lng });
          }
        }
      });
    };

    // ปุ่มจำลองการอัปเดตตำแหน่งใหม่
    window.updateLocation = async () => {
      const randomLat = 14.0 + Math.random() * 0.3;
      const randomLng = 100.5 + Math.random() * 0.4;
      const ts = Date.now();

      await update(ref(db, "data"), {
        gps: { lat: randomLat, lng: randomLng },
        timestamp: ts,
      });

      alert("📡 อัปเดตตำแหน่งใหม่แล้ว!");
    };
  </script>

  <!-- Google Maps -->
  <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBH-YourGoogleAPIKeyHere&callback=initMap"></script>
</head>

<body class="bg-gray-50 min-h-screen flex flex-col font-sans">

  <!-- Header -->
  <header class="bg-blue-600 text-white text-center py-5 shadow-md">
    <h1 class="text-3xl font-bold">🚚 Smart Cold Guard - Driver Dashboard</h1>
    <p class="text-blue-100">ติดตามตำแหน่งและสถานะอุณหภูมิของตู้เย็น</p>
  </header>

  <!-- Main -->
  <main class="container mx-auto px-6 py-8 flex flex-col gap-6">

    <!-- Realtime Data -->
    <div class="grid md:grid-cols-3 gap-6 text-center">
      <div class="bg-white p-6 rounded-xl shadow-lg">
        <h2 class="text-lg font-semibold text-blue-600">อุณหภูมิปัจจุบัน</h2>
        <p id="temperature" class="text-3xl font-bold text-gray-800 mt-2">-- °C</p>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-lg">
        <h2 class="text-lg font-semibold text-blue-600">ความชื้นสัมพัทธ์</h2>
        <p id="humidity" class="text-3xl font-bold text-gray-800 mt-2">-- %</p>
      </div>

      <div class="bg-white p-6 rounded-xl shadow-lg">
        <h2 class="text-lg font-semibold text-blue-600">พิกัด GPS</h2>
        <p id="gps" class="text-md text-gray-700 mt-2">-- , --</p>
      </div>
    </div>

    <!-- Map Section -->
    <div class="bg-white p-6 rounded-xl shadow-lg">
      <h2 class="text-lg font-semibold text-blue-600 mb-3 text-center">🗺️ แผนที่ติดตามตำแหน่ง</h2>
      <div id="map" class="w-full h-[400px] rounded-xl shadow-inner border"></div>
    </div>

    <!-- Timestamp -->
    <div class="text-center bg-white p-4 rounded-xl shadow-lg">
      <p class="text-gray-600">🕒 ข้อมูลล่าสุดอัปเดตเมื่อ:</p>
      <p id="timestamp" class="text-lg font-semibold text-gray-800">--</p>
    </div>

    <!-- Update Button -->
    <div class="text-center">
      <button onclick="updateLocation()" class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg shadow-md transition">
        📡 อัปเดตตำแหน่งจำลอง
      </button>
    </div>
  </main>

  <!-- Footer -->
  <footer class="bg-blue-100 text-center py-3 text-sm text-gray-600 mt-8">
    © 2025 Smart Cold Guard System | Driver Dashboard
  </footer>
</body>
</html>
