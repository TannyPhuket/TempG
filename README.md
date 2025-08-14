<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ระบบตรวจวัดอุณหภูมิแบบเรียลไทม์</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
            background-color: #e8f4ff;
            font-family: 'Prompt', sans-serif;
        }
        .card {
            border-radius: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        .temp-value, .humid-value {
            font-size: 2.5rem;
            font-weight: bold;
        }
        .status-normal {
            color: green;
        }
        .status-alert {
            color: red;
        }
        .user-card {
            cursor: pointer;
            transition: transform 0.2s;
        }
        .user-card:hover {
            transform: scale(1.05);
        }
        .status-circle {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            display: inline-block;
        }
        .status-ok {
            background-color: green;
        }
        .status-bad {
            background-color: red;
        }
    </style>
</head>
<body class="p-3">
    <div class="container">
        <h2 class="text-center mb-4">🌡 ระบบตรวจวัดอุณหภูมิแบบเรียลไทม์</h2>
        
        <div class="row mb-4 text-center">
            <div class="col-md-6 mb-3">
                <div class="card p-4">
                    <div class="temp-value" id="temperature">-- °C</div>
                    <div>อุณหภูมิปัจจุบัน</div>
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <div class="card p-4">
                    <div class="humid-value" id="humidity">-- %</div>
                    <div>ความชื้นสัมพัทธ์</div>
                </div>
            </div>
        </div>

        <div class="card p-3 mb-4 text-center" id="status-card">
            <strong id="status-text">กำลังโหลดข้อมูล...</strong>
        </div>

        <div class="row text-center mb-4">
            <div class="col-md-4">
                <div class="card p-3 user-card" onclick="showHistory('ผู้ซื้อ')">
                    🛒 <h5>ผู้ซื้อ</h5>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card p-3 user-card" onclick="showHistory('ผู้ขาย')">
                    🏬 <h5>ผู้ขาย</h5>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card p-3 user-card" onclick="showHistory('ผู้ขนส่ง')">
                    🚚 <h5>ผู้ขนส่ง</h5>
                </div>
            </div>
        </div>

        <div class="card p-3">
            <h4>ประวัติอุณหภูมิย้อนหลัง (สูงสุด 1 เดือน)</h4>
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>วันที่</th>
                        <th>รายการสินค้า</th>
                        <th>เวลา</th>
                        <th>อุณหภูมิ (°C)</th>
                        <th>สถานะ</th>
                    </tr>
                </thead>
                <tbody id="history-table">
                </tbody>
            </table>
        </div>
    </div>

    <audio id="siren" src="https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3" preload="auto"></audio>

    <script>
        const channelID = "3025045"; // ใส่ ThingSpeak Channel ID
        const readAPIKey = "LMLG3ZWG6FG8F3E4"; // ใส่ Read API Key ถ้าตั้ง private

        function fetchData() {
            const url = `https://api.thingspeak.com/channels/${channelID}/feeds.json?results=10&api_key=${readAPIKey}`;
            $.getJSON(url, function(data) {
                if (data.feeds.length > 0) {
                    const latest = data.feeds[data.feeds.length - 1];
                    const temp = parseFloat(latest.field1);
                    const humid = parseFloat(latest.field2);

                    $("#temperature").text(temp.toFixed(1) + " °C");
                    $("#humidity").text(humid.toFixed(1) + " %");

                    if (temp > 0) {
                        $("#status-text").text("อุณหภูมิสูงเกินค่าที่กำหนด!").addClass("status-alert").removeClass("status-normal");
                        document.getElementById("siren").play();
                    } else {
                        $("#status-text").text("อุณหภูมิปกติ").addClass("status-normal").removeClass("status-alert");
                    }
                }
            });
        }

        function showHistory(userType) {
            alert("กำลังแสดงข้อมูลของ: " + userType);
            // ในเวอร์ชันสมบูรณ์จะดึงข้อมูลย้อนหลัง 1 เดือน และแสดงในตาราง
        }

        setInterval(fetchData, 5000);
        fetchData();
    </script>
</body>
</html>
