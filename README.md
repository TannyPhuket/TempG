<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>ESP32 Temp Monitor</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: sans-serif;
      background: #000;
      color: #fff;
    }
    .container {
      max-width: 600px;
      margin: auto;
      padding: 20px;
    }
    .card {
      background: #111;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      border: 1px solid #fff;
    }
    .value {
      font-size: 2em;
      margin: 10px 0;
    }
    .green {
      color: #0f0;
    }
    .red {
      color: #f00;
    }
    .embed-container {
      position: relative;
      width: 100%;
      padding-bottom: 50%;
      height: 0;
      overflow: hidden;
      border: 1px solid #fff;
    }
    .embed-container iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <h2>🌡️ ESP32 Temp & Humidity</h2>
      <div class="value">Temp: <span id="temp">--</span> °C</div>
      <div class="value">Humidity: <span id="hum">--</span> %</div>
      <p id="status">Waiting for data...</p>
      <audio id="alertSound" src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg" preload="auto"></audio>
    </div>
    <div class="card">
      <h3>📈 Temperature Graph</h3>
      <div class="embed-container">
        <iframe id="chartTemp"
          src="https://thingspeak.com/channels/3025045/charts/1?api_key=LMLG3ZWG6FG8F3E4&results=60&dynamic=true&type=line&bgcolor=%23000&color=%23ff0000&linecolor=%23ff0000"
          allowfullscreen>
        </iframe>
      </div>
    </div>
  </div>

  <script>
    const channelID = 3025045;
    const readAPIKey = 'LMLG3ZWG6FG8F3E4';
    const alertSound = document.getElementById('alertSound');

    function playAlertTwice() {
      alertSound.play();
      setTimeout(() => alertSound.play(), 2000); // เว้น 2 วิ
    }

    function fetchLatest() {
      fetch(`https://api.thingspeak.com/channels/${channelID}/feeds.json?results=1&api_key=${readAPIKey}`)
        .then(r => r.json())
        .then(data => {
          const f = data.feeds[0];
          const temp = parseFloat(f.field1);
          const hum = parseFloat(f.field2);
          const tempElem = document.getElementById('temp');
          const humElem = document.getElementById('hum');
          const statusElem = document.getElementById('status');

          if (!isNaN(temp)) {
            tempElem.textContent = temp.toFixed(1);
            humElem.textContent = hum.toFixed(1);
            if (temp > 30) {
              tempElem.className = 'red';
              statusElem.textContent = '🚨 High Temperature!';
              statusElem.className = 'red';
              playAlertTwice();
            } else {
              tempElem.className = 'green';
              statusElem.textContent = '✅ Temperature Normal';
              statusElem.className = 'green';
            }
          } else {
            tempElem.textContent = '--';
            statusElem.textContent = '⚠️ Data not available';
            statusElem.className = '';
          }
        })
        .catch(err => {
          console.error(err);
          document.getElementById('status').textContent = '⚠️ Cannot fetch data';
        });
    }

    fetchLatest();
    setInterval(fetchLatest, 5000);
  </script>
</body>
</html>
