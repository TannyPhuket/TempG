<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ระบบตรวจวัดอุณหภูมิและความชื้น</title>
<style>
  body {
    font-family: 'Segoe UI', Tahoma, sans-serif;
    margin: 0;
    background-color: #f8f9fa;
    color: #212529;
  }
  header {
    display: flex;
    justify-content: flex-end;
    padding: 10px;
    background: #fff;
    border-bottom: 1px solid #ccc;
  }
  #logoutBtn {
    background: #dc3545;
    color: white;
    border: none;
    padding: 8px 15px;
    cursor: pointer;
    border-radius: 5px;
    font-size: 0.9em;
  }
  #rolePage, #mainPage {
    padding: 20px;
    text-align: center;
  }
  .role-container {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 40px;
    flex-wrap: wrap;
  }
  .role-card {
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    width: 200px;
    padding: 20px;
    cursor: pointer;
    transition: transform 0.2s;
  }
  .role-card:hover {
    transform: scale(1.05);
  }
  .role-card img {
    width: 80px;
    height: 80px;
  }
  .value {
    font-size: 2em;
    margin: 10px 0;
  }
  .hidden { display: none; }
  .form-group { margin: 10px 0; }
  input {
    padding: 5px;
    font-size: 1em;
    width: 80px;
    text-align: center;
  }
  button {
    padding: 6px 12px;
    font-size: 1em;
    cursor: pointer;
    border: none;
    border-radius: 5px;
  }
  #saveBtn {
    background: #28a745;
    color: white;
  }
</style>
</head>
<body>

<!-- หน้าเลือกบทบาท -->
<div id="rolePage">
  <h2>เลือกบทบาทของคุณ</h2>
  <div class="role-container">
    <div class="role-card" onclick="selectRole('seller')">
      <img src="https://cdn-icons-png.flaticon.com/512/1995/1995525.png" alt="ผู้ขาย">
      <h3>ผู้ขาย</h3>
      <p>ตั้งค่าและตรวจสอบอุณหภูมิ</p>
    </div>
    <div class="role-card" onclick="selectRole('transporter')">
      <img src="https://cdn-icons-png.flaticon.com/512/1995/1995519.png" alt="ผู้ขนส่ง">
      <h3>ผู้ขนส่ง</h3>
      <p>ตรวจสอบข้อมูลอุณหภูมิ</p>
    </div>
    <div class="role-card" onclick="selectRole('buyer')">
      <img src="https://cdn-icons-png.flaticon.com/512/1995/1995530.png" alt="ผู้ซื้อ">
      <h3>ผู้ซื้อ</h3>
      <p>ดูข้อมูลอุณหภูมิ</p>
    </div>
  </div>
</div>

<!-- หน้าหลัก -->
<div id="mainPage" class="hidden">
  <header>
    <button id="logoutBtn" onclick="logout()">ออกจากระบบ</button>
  </header>
  <h2>📡 ระบบตรวจวัดอุณหภูมิและความชื้น</h2>

  <div>
    <div>🌡 อุณหภูมิ</div>
    <div id="tempValue" class="value">-- °C</div>
  </div>
  <div>
    <div>💧 ความชื้น</div>
    <div id="humidValue" class="value">-- %</div>
  </div>

  <!-- เฉพาะผู้ขาย -->
  <div id="alertSettings" class="hidden">
    <h3>⚙️ ตั้งค่าแจ้งเตือนอุณหภูมิ</h3>
    <div class="form-group">
      <label>ต่ำสุด: </label>
      <input type="number" id="minTemp"> °C
    </div>
    <div class="form-group">
      <label>สูงสุด: </label>
      <input type="number" id="maxTemp"> °C
    </div>
    <button id="saveBtn" onclick="saveSettings()">บันทึก</button>
  </div>
</div>

<script>
// ThingSpeak API
const CHANNEL_ID = "3025045";
const READ_API_KEY = "LMLG3ZWG6FG8F3E4";
let role = "";

// เลือกบทบาท
function selectRole(selectedRole){
  role = selectedRole;
  document.getElementById("rolePage").classList.add("hidden");
  document.getElementById("mainPage").classList.remove("hidden");
  if(role === "seller"){
    document.getElementById("alertSettings").classList.remove("hidden");
    let minTemp = localStorage.getItem("minTemp");
    let maxTemp = localStorage.getItem("maxTemp");
    if(minTemp) document.getElementById("minTemp").value = minTemp;
    if(maxTemp) document.getElementById("maxTemp").value = maxTemp;
  }
}

// ออกจากระบบ
function logout(){
  role = "";
  document.getElementById("rolePage").classList.remove("hidden");
  document.getElementById("mainPage").classList.add("hidden");
}

// โหลดค่าจาก ThingSpeak
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

// บันทึกค่าแจ้งเตือน
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

setInterval(loadCurrent, 5000);
loadCurrent();
</script>

</body>
</html>
