<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>แดชบอร์ดแจ้งเตือน IoT</title>
  <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@400;700&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      font-family: 'Kanit', sans-serif;
      background-color: #000;
      color: #fff;
    }
    .container {
      max-width: 900px;
      margin: auto;
      padding: 20px;
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      justify-content: center;
    }
    .card {
      background-color: #111827;
      padding: 20px;
      border-radius: 15px;
      flex: 1 1 280px;
      box-shadow: 0 0 10px rgba(255,255,255,0.1);
      border: 2px solid #ffffff22;
    }
    h1 {
      text-align: center;
      font-size: 2rem;
      margin-bottom: 30px;
    }
    h2 {
      font-size: 1.2rem;
      margin-bottom: 5px;
    }
    .big-value {
      font-size: 3rem;
      font-weight: bold;
    }
    .status-ok {
      background: #1e3a1e;
      border: 2px solid #0f0;
    }
    .status-alert {
      background: #3a1e1e;
      border: 2px solid #f00;
    }
    .slider-container {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .slider {
      width: 100%;
    }
    .green {
      color: #0f0;
    }
    .red {
      color: #f00;
    }
    @media (max-width: 600px) {
      .big-value {
        font-size: 2.5rem;
      }
    }
  </style>
</head>
<body>
  <h1>📶 แดชบอร์ดแจ้งเตือน IoT</h1>
  <div class="container">

    <div class="card">
      <h2>🌡️ อุณหภูมิปัจจุบัน</h2>
      <p>ค่าที่อ่านได้แบบเรียลไทม์จากเซ็นเซอร์ DHT</p>
      <div class="big-value" id="temp">-- °C</div>
      <div class="big-value" id="hum">-- %</div>
    </div>

    <div class="card" id="statusCard">
      <h2>⚠️ สถานะระบบ</h2>
      <p id="statusText">กำลังโหลดข้อมูล...</p>
    </div>

    <div class="card">
      <h2>🔧 การตั้งค่า</h2>
      <p>ตั้งค่าเกณฑ์อุณหภูมิสำหรับการแจ้งเตือน</p>
      <div class="slider-container">
        <input type="range" id="thresholdSlider" class="slider" min="20" max="50" value="30" />
        <span id="thresholdValue">30°C</span>
      </div>
    </div>

  </div>

  <audio id="alertSound" src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg" preload="auto"></audio>

  <script>
    const channelID = 3025045;
    const readAPIKey = "LMLG3ZWG6FG8F3E4";
    const alertSound = document.getElementById("alertSound");
    const tempElem = document.getElementById("temp");
    const humElem = document.getElementById("hum");
    const statusCard = document.getElementById("statusCard");
    const statusText = document.getElementById("statusText");
    const thresholdSlider = document.getElementById("thresholdSlider");
    const thresholdValue = document.getElementById("thresholdValue");

    let threshold = parseFloat(thresholdSlider.value);
    let lastAlertTime = 0;

    function playAlertTwice() {
      const now = Date.now();
      if (now - lastAlertTime < 5000) return;
      alertSound.play();
      setTimeout(() => alertSound.play(), 2000);
      lastAlertTime = now;
    }

    thresholdSlider.addEventListener("input", () => {
      threshold = parseFloat(thresholdSlider.value);
      thresholdValue.textContent = `${threshold}°C`;
    });

    function fetchData() {
      fetch(`https://api.thingspeak.com/channels/${channelID}/feeds.json?results=1&api_key=${readAPIKey}`)
        .then((res) => res.json())
        .then((data) => {
          const feed = data.feeds[0];
          const temp = parseFloat(feed.field1);
          const hum = parseFloat(feed.field2);

          if (!isNaN(temp)) {
            tempElem.textContent = `${temp.toFixed(1)}°C`;
            humElem.textContent = `${hum.toFixed(1)}%`;

            if (temp > threshold) {
              tempElem.className = "big-value red";
              statusCard.className = "card status-alert";
              statusText.innerHTML = `🚨 ตรวจพบอุณหภูมิสูง (${temp.toFixed(1)}°C) เกินเกณฑ์ ${threshold}°C`;
              playAlertTwice();
            } else {
              tempElem.className = "big-value green";
              statusCard.className = "card status-ok";
              statusText.innerHTML = `✅ อุณหภูมิปกติอยู่ในเกณฑ์ (${temp.toFixed(1)}°C)`;
            }

          } else {
            tempElem.textContent = "-- °C";
            statusText.innerText = "⚠️ ข้อมูลไม่พร้อมใช้งาน";
          }

        })
        .catch((err) => {
          statusText.innerText = "❌ ดึงข้อมูลไม่สำเร็จ";
          console.error(err);
        });
    }

    fetchData();
    setInterval(fetchData, 5000);
  </script>
</body>
</html>
