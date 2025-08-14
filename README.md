<html lang="th">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ระบบตรวจวัดอุณหภูมิ & ความชื้น - ThingSpeak Dashboard</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
  <style>
    :root{
      --ok: #16a34a;        /* green-600 */
      --bad: #dc2626;       /* red-600 */
      --bg: #eef6ff;        /* soft light */
      --card: #ffffff;
    }
    body{background: var(--bg); font-family: "Prompt", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;}
    .app-title{font-weight:700}
    .card{border:none; border-radius: 20px; box-shadow: 0 6px 20px rgba(0,0,0,.08); background: var(--card);}    
    .reading{font-size: clamp(28px, 6vw, 48px); font-weight: 800; letter-spacing: .5px;}
    .reading.ok{color: var(--ok)}
    .reading.bad{color: var(--bad)}
    .label{opacity:.8}
    .user-card{cursor:pointer; transition: transform .15s ease, box-shadow .15s ease;}
    .user-card:hover{transform: translateY(-2px); box-shadow: 0 10px 24px rgba(0,0,0,.12)}
    .status-pill{font-weight:700}
    .status-pill.ok{color:var(--ok)}
    .status-pill.bad{color:var(--bad)}
    .status-dot{width:14px; height:14px; border-radius:999px; display:inline-block;}
    .status-dot.ok{background: var(--ok)}
    .status-dot.bad{background: var(--bad)}
    .table thead th{white-space:nowrap}
    .pagination .page-link{border-radius:10px;}
    .sr-only{position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); border:0}
    .small-note{font-size:.9rem; opacity:.8}
    .footer{opacity:.7; font-size:.85rem}
    .sound-btn{min-width: 200px}
  </style>
</head>
<body class="py-4">
  <div class="container">

    <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-4">
      <h1 class="app-title m-0">🌡️ ระบบตรวจวัดอุณหภูมิ & ความชื้น</h1>
      <button id="enableSoundBtn" class="btn btn-outline-primary sound-btn">
        เปิดเสียงแจ้งเตือน
      </button>
    </div>

    <!-- Top readings -->
    <div class="row g-3 mb-3 text-center">
      <div class="col-md-6">
        <div class="card p-4 h-100">
          <div class="reading" id="temperature">-- °C</div>
          <div class="label">อุณหภูมิปัจจุบัน</div>
          <div class="small-note mt-2">ช่วงอ้างอิง: -10°C ถึง 50°C · แจ้งเตือนเมื่อ &gt; 0°C</div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card p-4 h-100">
          <div class="reading" id="humidity">-- %</div>
          <div class="label">ความชื้นสัมพัทธ์</div>
        </div>
      </div>
    </div>

    <!-- status card -->
    <div class="card p-3 mb-4">
      <div id="statusText" class="status-pill">กำลังโหลดข้อมูล...</div>
    </div>

    <!-- user roles -->
    <div class="row g-3 mb-4">
      <div class="col-md-4">
        <div class="card user-card p-3 text-center" onclick="showHistory('ผู้ซื้อ')">
          <div style="font-size:28px">🛒</div>
          <h5 class="m-0">ผู้ซื้อ</h5>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card user-card p-3 text-center" onclick="showHistory('ผู้ขาย')">
          <div style="font-size:28px">🏬</div>
          <h5 class="m-0">ผู้ขาย</h5>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card user-card p-3 text-center" onclick="showHistory('ผู้ขนส่ง')">
          <div style="font-size:28px">🚚</div>
          <h5 class="m-0">ผู้ขนส่ง</h5>
        </div>
      </div>
    </div>

    <!-- history table -->
    <div class="card p-3 mb-2">
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h4 class="m-0">1.1 ตรวจสอบคุณภาพสินค้า</h4>
        <div class="small-note">ย้อนหลังสูงสุด 1 เดือน · ใหม่อยู่ด้านบนเสมอ</div>
      </div>
      <div class="table-responsive mt-3">
        <table class="table table-striped align-middle">
          <thead>
            <tr>
              <th>วันที่</th>
              <th>รายการสินค้า</th>
              <th>เวลา</th>
              <th>อุณหภูมิ (°C)</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody id="historyBody"></tbody>
        </table>
      </div>
      <nav>
        <ul id="pager" class="pagination justify-content-center mb-0"></ul>
      </nav>
    </div>

    <div class="footer text-center mt-3">แดชบอร์ดนี้ดึงข้อมูลจาก ThingSpeak โดยตรงและอัปเดตอัตโนมัติ</div>
  </div>

  <!-- audio -->
  <audio id="siren" preload="auto">
    <source src="https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3" type="audio/mpeg" />
  </audio>

  <script>
    // ====== CONFIG ======
    const CHANNEL_ID = "3025045";
    const READ_API_KEY = "LMLG3ZWG6FG8F3E4";
    const ROWS_PER_PAGE = 10;
    const REFRESH_MS = 5000;
    const SIREN_INTERVAL_MS = 1000;
    const MIN_TEMP = -10, MAX_TEMP = 50;

    // ====== STATE ======
    let historyData = [];
    let currentPage = 1;
    let currentRole = null;
    let sirenTimer = null;
    let soundEnabled = false;

    // ====== HELPERS ======
    const elTemp = document.getElementById('temperature');
    const elHum  = document.getElementById('humidity');
    const elStatus = document.getElementById('statusText');
    const elBody = document.getElementById('historyBody');
    const elPager = document.getElementById('pager');
    const siren = document.getElementById('siren');

    function playSiren(){
      if(!soundEnabled) return;
      try{ siren.currentTime = 0; siren.play(); }catch(e){ }
    }
    function startSiren(){
      if(sirenTimer) return;
      sirenTimer = setInterval(playSiren, SIREN_INTERVAL_MS);
    }
    function stopSiren(){
      if(sirenTimer){ clearInterval(sirenTimer); sirenTimer = null; }
    }
    function tempStatusClass(t){
      const ok = (t >= MIN_TEMP && t <= MAX_TEMP && t <= 0);
      return ok ? 'ok' : 'bad';
    }
    function statusDot(t){
      const cls = tempStatusClass(t) === 'ok' ? 'ok' : 'bad';
      return `<span class="status-dot ${cls}" title="${cls==='ok'?'ปกติ':'ไม่ปกติ'}"></span>`;
    }
    function formatTH(dt){
      const d = new Date(dt);
      return {
        date: d.toLocaleDateString('th-TH'),
        time: d.toLocaleTimeString('th-TH', {hour12:false})
      };
    }

    // ====== DATA FETCHING ======
    async function fetchLatest(){
      const url = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${READ_API_KEY}&results=1`;
      const res = await fetch(url);
      const data = await res.json();
      if(!data.feeds || !data.feeds.length) return;
      const f = data.feeds[0];
      const t = parseFloat(f.field1);
      const h = parseFloat(f.field2);

      const tClass = tempStatusClass(t);
      elTemp.textContent = `${isFinite(t)?t.toFixed(1):'--'} °C`;
      elTemp.classList.remove('ok','bad'); elTemp.classList.add(tClass);

      elHum.textContent = `${isFinite(h)?h.toFixed(1):'--'} %`;
      elHum.classList.remove('ok','bad');
      elHum.classList.add( (isFinite(h) ? (h>=0 && h<=100?'ok':'bad') : '') );

      if(tClass==='bad'){
        elStatus.textContent = 'อุณหภูมิสูงเกินค่าที่กำหนด!';
        elStatus.classList.remove('ok'); elStatus.classList.add('bad');
        startSiren();
      } else {
        elStatus.textContent = 'อุณหภูมิปกติ';
        elStatus.classList.remove('bad'); elStatus.classList.add('ok');
        stopSiren();
      }
    }

    async function fetchHistoryOneMonth(){
      const url = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${READ_API_KEY}&results=8000`;
      const res = await fetch(url);
      const data = await res.json();
      const now = Date.now();
      const monthMs = 31*24*60*60*1000;

      const items = (data.feeds||[])
        .filter(f=>f.created_at)
        .map(f=>({
          created: new Date(f.created_at).getTime(),
          t: parseFloat(f.field1)
        }))
        .filter(x=> now - x.created <= monthMs && isFinite(x.t))
        .sort((a,b)=> b.created - a.created);

      historyData = items.map(x=>{
        const {date,time} = formatTH(x.created);
        return {
          date,
          product: 'สินค้า เนื้อดิบTanny',
          time,
          temp: x.t,
          dot: statusDot(x.t)
        };
      });

      currentPage = 1;
      renderTable();
    }

    // ====== RENDER ======
    function renderTable(){
      const start = (currentPage-1)*ROWS_PER_PAGE;
      const page = historyData.slice(start, start+ROWS_PER_PAGE);

      elBody.innerHTML = page.map(r=>`
        <tr>
          <td>${r.date}</td>
          <td>${r.product}</td>
          <td>${r.time}</td>
          <td class="${tempStatusClass(r.temp)}">${r.temp.toFixed(1)}</td>
          <td>${r.dot}</td>
        </tr>
      `).join('');

      renderPager();
    }

    function renderPager(){
      const total = Math.max(1, Math.ceil(historyData.length / ROWS_PER_PAGE));
      let html = '';
      const maxVisible = 10;

      const disabledPrev = (currentPage === 1) ? 'disabled' : '';
      const disabledNext = (currentPage === total) ? 'disabled' : '';

      let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      let end = start + maxVisible - 1;
      if (end > total) {
        end = total;
        start = Math.max(1, end - maxVisible + 1);
      }

      html += `<li class="page-item ${disabledPrev}">
                 <button class="page-link" onclick="goPage(${currentPage - 1})">ก่อนหน้า</button>
               </li>`;

      for (let i = start; i <= end; i++) {
        html += `<li class="page-item ${i === currentPage ? 'active' : ''}">
                   <button class="page-link" onclick="goPage(${i})">${i}</button>
                 </li>`;
      }

      html += `<li class="page-item ${disabledNext}">
                 <button class="page-link" onclick="goPage(${currentPage + 1})">ถัดไป</button>
               </li>`;

      elPager.innerHTML = html;
    }

    function goPage(page){
      const total = Math.ceil(historyData.length / ROWS_PER_PAGE);
      if(page < 1 || page > total) return;
      currentPage = page;
      renderTable();
    }

    // ====== UI actions ======
    window.showHistory = function(role){
      currentRole = role;
      const card = document.querySelector('.card.p-3.mb-2');
      card.classList.add('ring');
      setTimeout(()=>card.classList.remove('ring'), 600);
      card.scrollIntoView({behavior:'smooth'});
    }

    document.getElementById('enableSoundBtn').addEventListener('click', ()=>{
      soundEnabled = true; 
      playSiren();
      const btn = document.getElementById('enableSoundBtn');
      btn.classList.remove('btn-outline-primary');
      btn.classList.add('btn-primary');
      btn.textContent = 'เปิดเสียงแล้ว';
    });

    // ====== BOOT ======
    fetchLatest();
    fetchHistoryOneMonth();
    setInterval(fetchLatest, REFRESH_MS);
    setInterval(fetchHistoryOneMonth, 60000);
  </script>
</body>
</html>
