<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ระบบตรวจวัดอุณหภูมิและความชื้น</title>
<style>
  body { font-family: sans-serif; text-align: center; padding: 20px; }
  .value { font-size: 2em; margin: 10px 0; }
  .hidden { display: none; }
  .form-group { margin: 10px 0; }
  input { padding: 5px; font-size: 1em; width: 80px; text-align: center; }
  button { padding: 5px 10px; font-size: 1em; cursor: pointer; }
</style>
</head>
<body>

<h2>📡 ระบบตรวจวัดอุณหภูมิและความชื้น</h2>

<!-- ค่าปัจจุบัน -->
<div>
  <div>🌡 อุณหภูมิ</div>
  <div id="tempValue" class="value">-- °C</div>
</div>
<div>
  <div>💧 ความชื้น</div>
  <div id="humidValue" class="value">-- %</div>
</div>

<hr>

<!-- เลือกบทบาท -->
<div>
  <label>เลือกบทบาท: </label>
  <select id="roleSelect" onchange="onRoleChange()">
    <option value="">-- เลือก --</option>
    <option value="seller">ผู้ขาย</option>
    <option value="transporter">ผู้ขนส่ง</option>
  </select>
</div>

<!-- ตั้งค่าแจ้งเตือน (เฉพาะผู้ขาย) -->
<div id="alertSettings" class="hidden">
  <h3>⚙️ ตั้งค่าแจ้งเตือนอุณหภูมิ</h3>
  <div class="form-group">
    <label>อุณหภูมิต่ำสุด: </label>
    <input type="number" id="minTemp"> °C
  </div>
  <div class="form-group">
    <label>อุณหภูมิสูงสุด: </label>
    <input type="number" id="maxTemp"> °C
  </div>
  <button onclick="saveSettings()">บันทึก</button>
</div>

<script>
// ThingSpeak API
const CHANNEL_ID = "3025045";
const READ_API_KEY = "LMLG3ZWG6FG8F3E4";

// เก็บบทบาท
let role = "";

// โหลดข้อมูลจาก ThingSpeak
function loadCurrent(){
  fetch(`https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${READ_API_KEY}&results=1`)
    .then(res => res.json())
    .then(data => {
      if(data.feeds && data.feeds.length > 0){
        let feed = data.feeds[0];
        let temp = parseFloat(feed.field1);
        let humid = parseFloat(feed.field2);

        document.getElementById("tempValue").innerText = temp.toFixed(1) + " °C";
        document.getElementById("humidValue").innerText = humid.toFixed(1) + " %";

        // ตรวจสอบแจ้งเตือนเฉพาะผู้ขาย
        if(role === "seller"){
          let minTemp = parseFloat(localStorage.getItem("minTemp"));
          let maxTemp = parseFloat(localStorage.getItem("maxTemp"));
          if(!isNaN(minTemp) && !isNaN(maxTemp)){
            if(temp < minTemp || temp > maxTemp){
              alert("⚠️ อุณหภูมิเกินค่าที่ตั้งไว้!");
            }
          }
        }
      }
    })
    .catch(err => console.error("โหลดข้อมูลล้มเหลว:", err));
}

// เปลี่ยนบทบาท
function onRoleChange(){
  role = document.getElementById("roleSelect").value;
  if(role === "seller"){
    document.getElementById("alertSettings").classList.remove("hidden");
    // โหลดค่าที่เคยตั้ง
    let minTemp = localStorage.getItem("minTemp");
    let maxTemp = localStorage.getItem("maxTemp");
    if(minTemp) document.getElementById("minTemp").value = minTemp;
    if(maxTemp) document.getElementById("maxTemp").value = maxTemp;
  } else {
    document.getElementById("alertSettings").classList.add("hidden");
  }
}

// บันทึกค่าการตั้งแจ้งเตือน
function saveSettings(){
  let minTemp = document.getElementById("minTemp").value;
  let maxTemp = document.getElementById("maxTemp").value;
  if(minTemp && maxTemp){
    localStorage.setItem("minTemp", minTemp);
    localStorage.setItem("maxTemp", maxTemp);
    alert("✅ บันทึกการตั้งค่าแล้ว");
  } else {
    alert("กรุณากรอกค่าทั้งสองช่อง");
  }
}

// โหลดค่าทุก 5 วินาที
setInterval(loadCurrent, 5000);
loadCurrent();
</script>

</body>
</html>
