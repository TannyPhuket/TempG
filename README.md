[Index.html..txt](https://github.com/user-attachments/files/21570389/Index.html.txt)
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>ESP32 Monitor</title>
  <style>
    body { margin:0; padding:0; font-family:sans-serif; background:#eef2f5; }
    .container { max-width:600px; margin:auto; padding:20px; }
    .card { background:#fff; border-radius:8px; padding:20px; margin-bottom:20px; box-shadow:0 2px 8px rgba(0,0,0,0.1); }
    .value { font-size:2em; margin:10px 0; }
    .alert { color:#c00; font-weight:bold; }
    .normal { color:#080; }
    /* Responsive iframe container */
    .embed-container { position:relative; width:100%; padding-bottom:50%; height:0; overflow:hidden; }
    .embed-container iframe { position:absolute; top:0; left:0; width:100%; height:100%; border:0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <h2>🌡️ ESP32 Temp & Humidity</h2>
      <div class="value">Temp: <span id="temp">--</span> °C</div>
      <div class="value">Humidity: <span id="hum">--</span> %</div>
      <p id="status" class="normal">Waiting for data...</p>
      <audio id="alertSound" src="https://actions.google.com/sounds/v1/alarms/beep_short.ogg" preload="auto"></audio>
    </div>
    <div class="card">
      <h3>📈 Temperature History (last 60 points)</h3>
      <div class="embed-container">
        <iframe id="chartTemp"></iframe>
      </div>
    </div>
  </div>

  <script>
    const channelID = 3025045;
    const readAPIKey = 'LMLG3ZWG6FG8F3E4';

    function fetchLatest() {
      fetch(`https://api.thingspeak.com/channels/${channelID}/feeds.json?results=1&api_key=${readAPIKey}`)
        .then(r => r.json())
        .then(data => {
          const f = data.feeds[0];
          const temp = parseFloat(f.field1);
          const hum = parseFloat(f.field2);
          document.getElementById('temp').textContent = temp.toFixed(1);
          document.getElementById('hum').textContent = hum.toFixed(1);
          const st = document.getElementById('status');
          if (temp > 30) {
            st.textContent = '🚨 High Temp!';
            st.className = 'alert';
            document.getElementById('alertSound').play();
          } else {
            st.textContent = '✅ Temp Normal';
            st.className = 'normal';
          }
        })
        .catch(e => {
          console.error(e);
          document.getElementById('status').textContent = '⚠️ Cannot fetch data';
        });
    }

    function setChart() {
      const iframe = document.getElementById('chartTemp');
      iframe.src = `https://thingspeak.com/channels/${channelID}/charts/1?api_key=${readAPIKey}&results=60&dynamic=true&type=line&bgcolor=%23ffffff&color=%23ff0000`;
    }

    setChart();
    fetchLatest();
    setInterval(fetchLatest, 5000);
  </script>
</body>
</html>
