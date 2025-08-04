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
      max-width: 1000px;
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
      margin-bottom: 10px;
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
      flex-wrap: wrap;
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
    .embed-container {
      margin-top: 10px;
      width: 100%;
      min-height: 300px;
    }
    .embed-container iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
    select {
      background-color: #000;
      color: #fff;
      border: 1px solid #fff;
      padding: 5px;
      font-size: 1rem;
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
      <h2>🌡️ อุณหภูมิ / 💧 ความชื้น</h2>
      <p>ค่าจากเซ็นเซอร์ DHT22</p>
      <div class="big-value" id="temp">-- °C</div>
      <div class="big-value" id="hum">-- %</div>
    </div>

    <div class="card" id="statusCard">
      <h2>⚠️ สถานะระบบ</h2>
      <p id="statusText">กำลังโหลดข้อมูล...</p>
    </div>

    <div class="card">
      <h2>🔧 ตั้งค่าเกณฑ์แจ้งเตือน</h2>
      <div class="slider-container">
        <input type="range" id="thresholdSlider" class="slider" min="20" max="50" value="30" />
        <span id="thresholdValue">30°C</span>
      </div>
    </div>

    <div class="card" style="flex: 1 1 100%;">
      <h2>📊 กราฟย้อนหลัง</h2>
      <div class="slider-container">
        <label>เลือกช่วงเวลา: </label>
        <select id="rangeSelect">
          <option value="1">1 วัน</option>
          <option value="7" selected>1 สัปดาห์</option>
          <option value="30">30 วัน</option>
        </select>
      </div>
      <div class="embed-container">
        <iframe id="historyChart"></iframe>
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
    const historySelect = document.getElementById("rangeSelect");
    const historyFrame = document.getElementById("historyChart");

    let threshold = parseFloat(thresholdSlider.value);
    let alertInterval = null;
    let isAlerting = false;

    function playAlertLoop() {
      if (isAlerting) return;
      isAlerting = true;
      alertInterval = setInterval(() => {
        alertSound.play();
      }, 500);
    }

    function stopAlert() {
      clearInterval(alertInterval);
      isAlerting = false;
    }

    thresholdSlider.addEventListener("input", () => {
      threshold = parseFloat(thresholdSlider.value);
      thresholdValue.textContent = `${threshold}°C`;
    });

    function updateHistoryChart() {
      const days = historySelect.value;
      const timescale = days > 1 ? "daily" : "60";
      historyFrame.src = `https://thingspeak.com/channels/${channelID}/charts/1?api_key=${readAPIKey}&days=${days}&timescale=${timescale}&dynamic=true&type=line&bgcolor=%23000&color=%23ff0000&width=auto`;
    }

    historySelect.addEventListener("change", updateHistoryChart);

    function fetchData() {
      fetch(`https://api.thingspeak.com/channels/${channelID}/feeds.json?results=1&api_key=${readAPIKey}`)
        .then((res) => res.json())
        .then((data) => {
          const feed = data.feeds[0];
          const temp = parseFloat(feed.field1);
          const hum = parseFloat(feed.field2);

          if (!isNaN(temp) && !isNaN(hum)) {
            tempElem.textContent = `${temp.toFixed(1)}°C`;
            humElem.textContent = `${hum.toFixed(1)}%`;

            tempElem.className = "big-value " + (temp > threshold ? "red" : "green");
            humElem.className = "big-value green";

            if (temp > threshold) {
              statusCard.className = "card status-alert";
              statusText.innerHTML = `🚨 อุณหภูมิสูง (${temp.toFixed(1)}°C) เกิน ${threshold}°C`;
              playAlertLoop();
            } else {
              statusCard.className = "card status-ok";
              statusText.innerHTML = `✅ อุณหภูมิปกติ (${temp.toFixed(1)}°C) ต่ำกว่า ${threshold}°C`;
              stopAlert();
            }
          } else {
            tempElem.textContent = "-- °C";
            humElem.textContent = "-- %";
            statusText.innerText = "⚠️ ข้อมูลไม่พร้อมใช้งาน";
            stopAlert();
          }
        })
        .catch((err) => {
          statusText.innerText = "❌ ดึงข้อมูลไม่สำเร็จ";
          console.error(err);
          stopAlert();
        });
    }

    updateHistoryChart();
    fetchData();
    setInterval(fetchData, 5000);
  </script>
</body>
</html>
