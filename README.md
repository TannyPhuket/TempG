<!DOCTYPE html>
<html lang="th">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ระบบตรวจวัดอุณหภูมิและความชื้น</title>
<style>
  body { font-family: sans-serif; margin: 0; background: #f4f6f8; }
  header { background: #1976d2; color: #fff; padding: 15px; text-align: center; }
  .container { padding: 20px; max-width: 600px; margin: auto; }
  .card {
    background: #fff; border-radius: 10px; padding: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    margin-bottom: 20px; text-align: center;
  }
  .value { font-size: 2rem; font-weight: bold; }
  .menu-btn {
    display: block; width: 100%; padding: 15px; margin-bottom: 10px;
    background: #2196f3; color: #fff; border: none; border-radius: 8px;
    font-size: 1rem; cursor: pointer;
  }
  .menu-btn:hover { background: #1976d2; }
  .hidden { display: none; }
  table { width: 100%; border-collapse: collapse; margin-top: 10px; }
  th, td { border: 1px solid #ccc; padding: 8px; text-align: center; }
  th { background: #f0f0f0; }
</style>
</head>
<body>

<header>
  <h1>ระบบตรวจวัดอุณหภูมิและความชื้น</h1>
</header>

<div class="container">

  <!-- แสดงค่าปัจจุบัน -->
  <div class="card">
    <div>อุณหภูมิ</div>
    <div id="tempValue" class="value">-- °C</div>
    <div>ความชื้น</div>
    <div id="humidValue" class="value">-- %</div>
  </div>

  <!-- เมนู -->
  <div id="menu">
    <button id="btnSetAlert" class="menu-btn hidden">ตั้งค่าแจ้งเตือนอุณหภูมิ</button>
    <button id="btnHistory" class="menu-btn">ดูประวัติ</button>
    <button id="btnQC" class="menu-btn hidden">ตรวจสอบคุณภาพสินค้า</button>
  </div>

  <!-- ตั้งค่าแจ้งเตือน -->
  <div id="alertSetting" class="hidden">
    <h3>ตั้งค่าแจ้งเตือนอุณหภูมิ</h3>
    <label>อุณหภูมิต่ำสุด: <input type="number" id="minTemp"> °C</label><br><br>
    <label>อุณหภูมิสูงสุด: <input type="number" id="maxTemp"> °C</label><br><br>
    <button class="menu-btn" onclick="saveAlertSetting()">บันทึก</button>
    <button class="menu-btn" style="background:#9e9e9e" onclick="backToMenu()">กลับ</button>
  </div>

  <!-- ประวัติ -->
  <div id="history" class="hidden">
    <h3>ประวัติการวัด</h3>
    <table>
      <thead>
        <tr>
          <th>เวลา</th>
          <th>อุณหภูมิ (°C)</th>
          <th>ความชื้น (%)</th>
        </tr>
      </thead>
      <tbody id="historyTable"></tbody>
    </table>
    <button class="menu-btn" style="background:#9e9e9e" onclick="backToMenu()">กลับ</button>
  </div>

  <!-- ตรวจสอบคุณภาพ -->
  <div id="qcCheck" class="hidden">
    <h3>ตรวจสอบคุณภาพสินค้า</h3>
    <p>ผลการตรวจสอบ: <span id="qcResult">-</span></p>
    <button class="menu-btn" onclick="checkQuality()">ตรวจสอบ</button>
    <button class="menu-btn" style="background:#9e9e9e" onclick="backToMenu()">กลับ</button>
  </div>

</div>

<script>
let role = prompt("กรุณากรอกบทบาทของคุณ (seller หรือ shipper):") || "shipper";
role = role.toLowerCase();

if(role === "seller"){
  document.getElementById("btnSetAlert").classList.remove("hidden");
  document.getElementById("btnQC").classList.remove("hidden");
}

// โหลดค่าปัจจุบันจำลอง
function loadCurrent(){
  let temp = (20 + Math.random()*10).toFixed(1);
  let humid = (50 + Math.random()*20).toFixed(1);
  document.getElementById("tempValue").innerText = temp + " °C";
  document.getElementById("humidValue").innerText = humid + " %";

  let minTemp = localStorage.getItem("minTemp");
  let maxTemp = localStorage.getItem("maxTemp");
  if(role === "seller" && minTemp && maxTemp){
    if(temp < minTemp || temp > maxTemp){
      alert("⚠️ อุณหภูมิเกินค่าที่ตั้งไว้!");
    }
  }
}
setInterval(loadCurrent, 3000);
loadCurrent();

// เมนู
document.getElementById("btnSetAlert").onclick = () => {
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("alertSetting").classList.remove("hidden");
  document.getElementById("minTemp").value = localStorage.getItem("minTemp") || "";
  document.getElementById("maxTemp").value = localStorage.getItem("maxTemp") || "";
};
document.getElementById("btnHistory").onclick = () => {
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("history").classList.remove("hidden");
  loadHistory();
};
document.getElementById("btnQC").onclick = () => {
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("qcCheck").classList.remove("hidden");
};

// ฟังก์ชันบันทึกแจ้งเตือน
function saveAlertSetting(){
  let minTemp = document.getElementById("minTemp").value;
  let maxTemp = document.getElementById("maxTemp").value;
  localStorage.setItem("minTemp", minTemp);
  localStorage.setItem("maxTemp", maxTemp);
  alert("บันทึกการตั้งค่าแล้ว");
  backToMenu();
}

// กลับเมนู
function backToMenu(){
  document.querySelectorAll("#alertSetting, #history, #qcCheck").forEach(el => el.classList.add("hidden"));
  document.getElementById("menu").classList.remove("hidden");
}

// โหลดประวัติจำลอง
function loadHistory(){
  let tbody = document.getElementById("historyTable");
  tbody.innerHTML = "";
  for(let i=0; i<10; i++){
    let tr = document.createElement("tr");
    let temp = (20 + Math.random()*10).toFixed(1);
    let humid = (50 + Math.random()*20).toFixed(1);
    tr.innerHTML = `<td>${new Date().toLocaleTimeString()}</td><td>${temp}</td><td>${humid}</td>`;
    tbody.appendChild(tr);
  }
}

// ตรวจสอบคุณภาพ
function checkQuality(){
  let result = Math.random() > 0.2 ? "ผ่าน" : "ไม่ผ่าน";
  document.getElementById("qcResult").innerText = result;
}
</script>

</body>
</html>
