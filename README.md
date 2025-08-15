<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>ระบบตรวจวัดอุณหภูมิ & ความชื้น - ThingSpeak Dashboard</title>

  <!-- Bootstrap + jQuery -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Prompt:wght@400;500;700;800&display=swap" rel="stylesheet">

  <style>
    :root{
      --ok: #16a34a;   /* green */
      --bad:#dc2626;   /* red   */
      --bg1:#e8f2ff;   /* soft gradient */
      --bg2:#ffffff;
      --card:#ffffff;
      --ink:#0f172a;
      --muted:#64748b;
      --accent:#3b82f6;
    }
    *{box-sizing:border-box}
    body{
      font-family:"Prompt",system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
      color:var(--ink);
      background: radial-gradient(1200px 700px at 20% -10%, var(--bg1), var(--bg2));
      min-height:100vh;
    }
    .shell{max-width:1100px}
    .app-card{
      background:var(--card);
      border:none;
      border-radius:22px;
      box-shadow: 0 10px 28px rgba(2,6,23,.08);
    }
    .reading{
      font-size: clamp(30px, 7vw, 52px);
      font-weight:800;
      letter-spacing:.3px;
    }
    .reading.ok{color:var(--ok)}
    .reading.bad{color:var(--bad)}
    .label{color:var(--muted)}
    .pill{font-weight:700}
    .pill.ok{color:var(--ok)}
    .pill.bad{color:var(--bad)}
    .status-dot{width:12px;height:12px;border-radius:999px;display:inline-block}
    .status-dot.ok{background:var(--ok)}
    .status-dot.bad{background:var(--bad)}

    .user-card{
      cursor:pointer;
      transition:transform .15s ease, box-shadow .15s ease;
      border:1px solid rgba(2,6,23,.05);
    }
    .user-card:hover{transform:translateY(-2px); box-shadow:0 12px 26px rgba(2,6,23,.12)}
    .section-title{font-weight:700}
    .table thead th{white-space:nowrap}
    .pagination .page-link{border-radius:10px}
    .muted{color:var(--muted)}
    .sound-btn{min-width:200px}
    .divider{height:1px;background:rgba(2,6,23,.08)}
    .mini{text-transform:uppercase;letter-spacing:.08em;font-size:.78rem;color:var(--muted)}
  </style>
</head>
<body class="py-4">
  <div class="container shell">

    <!-- Header -->
    <div class="app-card p-4 p-md-5 mb-4 text-center">
      <h1 class="fw-bold mb-1">🌡️ ระบบตรวจวัดอุณหภูมิแบบเรียลไทม์</h1>
      <div class="muted">Real-time Temperature Monitoring System</div>
      <div class="mt-3">
        <button id="enableSoundBtn" class="btn btn-outline-primary sound-btn">เปิดเสียงแจ้งเตือน</button>
      </div>
    </div>

    <!-- Top metrics -->
    <div class="row g-3 mb-3 text-center">
      <div class="col-md-6">
        <div class="app-card p-4 h-100">
          <div id="temperature" class="reading">-- °C</div>
          <div class="label">อุณหภูมิปัจจุบัน</div>
          <div class="mt-2 muted">
            ช่วงอ้างอิง: <span id="rangeNote">-10°C ถึง 50°C</span> · แจ้งเตือนเมื่อ&nbsp;<span id="alertNote">> 0°C</span>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="app-card p-4 h-100">
          <div id="humidity" class="reading">-- %</div>
          <div class="label">ความชื้นสัมพัทธ์</div>
        </div>
      </div>
    </div>

    <!-- System status -->
    <div class="app-card p-4 mb-4">
      <div class="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3">
        <div>
          <div class="mini mb-1">สถานะระบบ</div>
          <div id="statusText" class="pill">กำลังโหลดข้อมูล...</div>
        </div>
        <div class="d-flex gap-4">
          <div class="text-center">
            <div class="mini mb-1">อุณหภูมิสูงสุด</div>
            <div id="maxToday" class="fw-bold">-- °C</div>
          </div>
          <div class="text-center">
            <div class="mini mb-1">อุณหภูมิต่ำสุด</div>
            <div id="minToday" class="fw-bold">-- °C</div>
          </div>
        </div>
      </div>
    </div>

    <!-- User roles -->
    <div class="app-card p-4 mb-4">
      <div class="mini mb-3">ผู้ใช้งานระบบ</div>
      <div class="row g-3">
        <div class="col-md-4">
          <div class="app-card user-card p-3 text-center" onclick="openSection('buyer')">
            <div style="font-size:28px">🛒</div>
            <h5 class="m-0">ผู้ซื้อ</h5>
            <div class="muted">ดูย้อนหลัง 1 เดือน</div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="app-card user-card p-3 text-center" onclick="openSection('seller')">
            <div style="font-size:28px">🏬</div>
            <h5 class="m-0">ผู้ขาย</h5>
            <div class="muted">ตั้งค่าเกณฑ์แจ้งเตือน</div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="app-card user-card p-3 text-center" onclick="openSection('shipper')">
            <div style="font-size:28px">🚚</div>
            <h5 class="m-0">ผู้ขนส่ง</h5>
            <div class="muted">ย้อนหลังไม่เกิน 1 อาทิตย์</div>
          </div>
        </div>
      </div>
    </div>

    <!-- BUYER -->
    <section id="buyerSection" class="app-card p-4 mb-4" style="display:none">
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h4 class="section-title m-0">ผู้ซื้อ · ตรวจสอบคุณภาพสินค้า</h4>
        <div class="muted">แสดงรายการใหม่อยู่ด้านบน · สูงสุด 1 เดือน</div>
      </div>
      <div class="divider my-3"></div>
      <div class="table-responsive">
        <table class="table align-middle">
          <thead class="table-light">
            <tr>
              <th>วันที่</th>
              <th>รายการสินค้า</th>
              <th>เวลา</th>
              <th>อุณหภูมิ (°C)</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody id="buyerBody"></tbody>
        </table>
      </div>
      <nav><ul id="buyerPager" class="pagination justify-content-center mb-0"></ul></nav>
    </section>

    <!-- SELLER -->
    <section id="sellerSection" class="app-card p-4 mb-4" style="display:none">
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h4 class="section-title m-0">ผู้ขาย · ตรวจสอบ & ตั้งค่าแจ้งเตือน</h4>
        <div class="muted">ปรับเกณฑ์และบันทึกลงอุปกรณ์ของคุณ</div>
      </div>
      <div class="divider my-3"></div>

      <div class="row g-3">
        <div class="col-md-4">
          <label class="form-label">อุณหภูมิต่ำสุด (°C)</label>
          <input type="number" id="minTemp" class="form-control">
        </div>
        <div class="col-md-4">
          <label class="form-label">อุณหภูมิสูงสุด (°C)</label>
          <input type="number" id="maxTemp" class="form-control">
        </div>
        <div class="col-md-4">
          <label class="form-label">แจ้งเตือนเมื่อสูงกว่า (°C)</label>
          <input type="number" id="alertTemp" class="form-control">
        </div>
        <div class="col-12">
          <button class="btn btn-primary mt-2" onclick="saveSettings()">บันทึกการตั้งค่า</button>
          <span class="ms-3 muted">ช่วงอ้างอิงปัจจุบัน: <span id="rangeNote2"></span> · แจ้งเตือนเมื่อ <span id="alertNote2"></span></span>
        </div>
      </div>

      <div class="divider my-4"></div>

      <div class="table-responsive">
        <table class="table align-middle">
          <thead class="table-light">
            <tr>
              <th>วันที่</th>
              <th>รายการสินค้า</th>
              <th>เวลา</th>
              <th>อุณหภูมิ (°C)</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody id="sellerBody"></tbody>
        </table>
      </div>
      <nav><ul id="sellerPager" class="pagination justify-content-center mb-0"></ul></nav>
    </section>

    <!-- SHIPPER -->
    <section id="shipperSection" class="app-card p-4 mb-4" style="display:none">
      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h4 class="section-title m-0">ผู้ขนส่ง · ตรวจสอบคุณภาพสินค้า</h4>
        <div class="muted">ย้อนหลังได้ไม่เกิน 1 อาทิตย์ · ใหม่อยู่บน</div>
      </div>
      <div class="divider my-3"></div>
      <div class="table-responsive">
        <table class="table align-middle">
          <thead class="table-light">
            <tr>
              <th>วันที่</th>
              <th>รายการสินค้า</th>
              <th>เวลา</th>
              <th>อุณหภูมิ (°C)</th>
              <th>สถานะ</th>
            </tr>
          </thead>
          <tbody id="shipperBody"></tbody>
        </table>
      </div>
      <nav><ul id="shipperPager" class="pagination justify-content-center mb-0"></ul></nav>
    </section>

    <div class="text-center muted mb-2">แดชบอร์ดนี้ดึงข้อมูลจาก ThingSpeak และอัปเดตอัตโนมัติ</div>
  </div>

  <!-- siren sound -->
  <audio id="siren" preload="auto">
    <source src="https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3" type="audio/mpeg" />
  </audio>

  <script>
    /* ========= Config ========= */
    const CHANNEL_ID = "3025045";
    const READ_API_KEY = "LMLG3ZWG6FG8F3E4";
    const REFRESH_MS = 5000;          // รีเฟรชค่าปัจจุบันทุก 5 วิ
    const HISTORY_REFRESH_MS = 60000;  // รีเฟรชประวัติทุก 60 วิ
    const SIREN_INTERVAL_MS = 1000;
    const ROWS_PER_PAGE = 10;

    /* ========= State ========= */
    let MIN_TEMP = parseFloat(localStorage.getItem('minTemp')) || -10;
    let MAX_TEMP = parseFloat(localStorage.getItem('maxTemp')) || 50;
    let ALERT_TEMP = parseFloat(localStorage.getItem('alertTemp')) || 0;

    let buyerRows = [];   // 1 เดือน
    let sellerRows = [];  // ทั้งหมด (จากข้อมูลที่ดึงมา)
    let shipperRows = []; // 7 วัน

    let buyerPage = 1;
    let sellerPage = 1;
    let shipperPage = 1;

    let sirenTimer = null;
    let soundEnabled = false;

    /* ========= Elements ========= */
    const elTemp = document.getElementById('temperature');
    const elHum  = document.getElementById('humidity');
    const elStatus = document.getElementById('statusText');
    const elMax = document.getElementById('maxToday');
    const elMin = document.getElementById('minToday');
    const siren = document.getElementById('siren');

    const rangeNote = document.getElementById('rangeNote');
    const alertNote = document.getElementById('alertNote');
    const rangeNote2 = document.getElementById('rangeNote2');
    const alertNote2 = document.getElementById('alertNote2');

    /* ========= Utilities ========= */
    function playSiren(){ if(!soundEnabled) return; try{ siren.currentTime = 0; siren.play(); }catch{} }
    function startSiren(){ if(!sirenTimer) sirenTimer = setInterval(playSiren, SIREN_INTERVAL_MS); }
    function stopSiren(){ if(sirenTimer){ clearInterval(sirenTimer); sirenTimer = null; } }

    function tempClass(t){ return (t >= MIN_TEMP && t <= MAX_TEMP && t <= ALERT_TEMP) ? 'ok' : 'bad'; }
    function dot(t){ return `<span class="status-dot ${tempClass(t)}"></span>`; }
    function toTH(ts){
      const d = new Date(ts);
      return {
        date: d.toLocaleDateString('th-TH'),
        time: d.toLocaleTimeString('th-TH',{hour12:false})
      };
    }
    function setNotes(){
      rangeNote.textContent = `${MIN_TEMP}°C ถึง ${MAX_TEMP}°C`;
      alertNote.textContent = `> ${ALERT_TEMP}°C`;
      rangeNote2.textContent = `${MIN_TEMP}°C ถึง ${MAX_TEMP}°C`;
      alertNote2.textContent = `> ${ALERT_TEMP}°C`;
    }
    setNotes();

    /* ========= Fetch latest ========= */
    async function fetchLatest(){
      const url = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${READ_API_KEY}&results=1`;
      const res = await fetch(url); const data = await res.json();
      if(!data.feeds || !data.feeds.length) return;
      const f = data.feeds[0];
      const t = parseFloat(f.field1);
      const h = parseFloat(f.field2);

      const klass = tempClass(t);
      elTemp.textContent = isFinite(t) ? `${t.toFixed(1)} °C` : '-- °C';
      elTemp.className = `reading ${klass}`;
      elHum.textContent = isFinite(h) ? `${h.toFixed(1)} %` : '-- %';
      elHum.className = `reading ${(isFinite(h)&&h>=0&&h<=100)?'ok':'bad'}`;

      if(klass==='bad'){ elStatus.textContent='อุณหภูมิไม่ปกติ!'; elStatus.className='pill bad'; startSiren(); }
      else { elStatus.textContent='อุณหภูมิปกติ'; elStatus.className='pill ok'; stopSiren(); }
    }

    /* ========= Fetch history & build tables ========= */
    async function fetchHistory(){
      const url = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${READ_API_KEY}&results=8000`;
      const res = await fetch(url); const data = await res.json();
      const feeds = data.feeds || [];
      if(!feeds.length) return;

      // สถิติสูงสุด/ต่ำสุดของวันปัจจุบัน
      const today = new Date(); today.setHours(0,0,0,0);
      const todayTemps = feeds
        .filter(f=>f.created_at)
        .map(f=>({ts:new Date(f.created_at), t:parseFloat(f.field1)}))
        .filter(x=>isFinite(x.t) && x.ts >= today)
        .map(x=>x.t);
      if(todayTemps.length){
        elMax.textContent = Math.max(...todayTemps).toFixed(1) + ' °C';
        elMin.textContent = Math.min(...todayTemps).toFixed(1) + ' °C';
      } else { elMax.textContent='-- °C'; elMin.textContent='-- °C'; }

      const now = Date.now();
      const monthMs = 31*24*60*60*1000;
      const weekMs  = 7*24*60*60*1000;

      // แปลงข้อมูลเป็นแถว
      const rows = feeds
        .filter(f=>f.created_at)
        .map(f=>{
          const t = parseFloat(f.field1);
          const ts = new Date(f.created_at).getTime();
          if(!isFinite(t)) return null;
          const {date,time} = toTH(ts);
          return { ts, date, time, temp:t, product:'สินค้า เนื้อดิบTanny', dot:dot(t) };
        })
        .filter(Boolean)
        .sort((a,b)=> b.ts - a.ts); // ใหม่ → เก่า

      // แยกตามบทบาท
      sellerRows = rows.slice(); // ทั้งหมดที่มี
      buyerRows  = rows.filter(r => (now - r.ts) <= monthMs);
      shipperRows= rows.filter(r => (now - r.ts) <= weekMs);

      // render
      buyerPage=1; sellerPage=1; shipperPage=1;
      renderTable('buyer');
      renderTable('seller');
      renderTable('shipper');
    }

    /* ========= Render helpers ========= */
    function renderTable(role){
      let rows = role==='buyer' ? buyerRows : role==='seller' ? sellerRows : shipperRows;
      let page = role==='buyer' ? buyerPage : role==='seller' ? sellerPage : shipperPage;

      const start = (page-1)*ROWS_PER_PAGE;
      const pageRows = rows.slice(start, start+ROWS_PER_PAGE);

      const bodyId = role+'Body';
      document.getElementById(bodyId).innerHTML = pageRows.map(r=>`
        <tr>
          <td>${r.date}</td>
          <td>${r.product}</td>
          <td>${r.time}</td>
          <td class="${tempClass(r.temp)}">${r.temp.toFixed(1)}</td>
          <td>${r.dot}</td>
        </tr>
      `).join('');

      renderPager(role);
    }

    function renderPager(role){
      let rows = role==='buyer' ? buyerRows : role==='seller' ? sellerRows : shipperRows;
      let page = role==='buyer' ? buyerPage : role==='seller' ? sellerPage : shipperPage;
      const total = Math.max(1, Math.ceil(rows.length/ROWS_PER_PAGE));

      let html = `<li class="page-item ${page===1?'disabled':''}">
                    <button class="page-link" onclick="goPage('${role}', ${page-1})">ก่อนหน้า</button>
                  </li>`;
      const maxVisible = 8;
      let start = Math.max(1, page - Math.floor(maxVisible/2));
      let end   = Math.min(total, start + maxVisible - 1);
      if(end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

      for(let i=start;i<=end;i++){
        html += `<li class="page-item ${i===page?'active':''}">
                  <button class="page-link" onclick="goPage('${role}', ${i})">${i}</button>
                </li>`;
      }
      html += `<li class="page-item ${page===total?'disabled':''}">
                <button class="page-link" onclick="goPage('${role}', ${page+1})">ถัดไป</button>
              </li>`;

      document.getElementById(role+'Pager').innerHTML = html;
    }

    function goPage(role, n){
      const total = Math.max(1, Math.ceil(
        (role==='buyer'?buyerRows:role==='seller'?sellerRows:shipperRows).length / ROWS_PER_PAGE
      ));
      if(n<1 || n>total) return;
      if(role==='buyer') buyerPage=n;
      else if(role==='seller') sellerPage=n;
      else shipperPage=n;
      renderTable(role);
      // เลื่อนลงเล็กน้อยให้เห็นตาราง
      document.getElementById(role+'Section').scrollIntoView({behavior:'smooth', block:'start'});
    }

    /* ========= UI actions ========= */
    function openSection(role){
      document.getElementById('buyerSection').style.display = (role==='buyer')?'block':'none';
      document.getElementById('sellerSection').style.display = (role==='seller')?'block':'none';
      document.getElementById('shipperSection').style.display = (role==='shipper')?'block':'none';
      // โหลดตาราง (ถ้าเพิ่งเปิด)
      if(role==='buyer') renderTable('buyer');
      if(role==='seller') renderTable('seller');
      if(role==='shipper') renderTable('shipper');
      document.getElementById(role+'Section').scrollIntoView({behavior:'smooth'});
    }
    window.openSection = openSection;

    function saveSettings(){
      const mt = parseFloat(document.getElementById('minTemp').value);
      const xt = parseFloat(document.getElementById('maxTemp').value);
      const at = parseFloat(document.getElementById('alertTemp').value);
      if(isFinite(mt)) MIN_TEMP = mt;
      if(isFinite(xt)) MAX_TEMP = xt;
      if(isFinite(at)) ALERT_TEMP = at;
      localStorage.setItem('minTemp', MIN_TEMP);
      localStorage.setItem('maxTemp', MAX_TEMP);
      localStorage.setItem('alertTemp', ALERT_TEMP);
      setNotes();
      alert('บันทึกการตั้งค่าเรียบร้อย');
    }
    window.saveSettings = saveSettings;

    // เติมค่าเริ่มต้นในฟอร์มผู้ขาย
    document.getElementById('minTemp').value = MIN_TEMP;
    document.getElementById('maxTemp').value = MAX_TEMP;
    document.getElementById('alertTemp').value = ALERT_TEMP;

    // ปุ่มเปิดเสียง (จำเป็นตามนโยบายเบราว์เซอร์)
    document.getElementById('enableSoundBtn').addEventListener('click', ()=>{
      soundEnabled = true; playSiren();
      const btn = document.getElementById('enableSoundBtn');
      btn.classList.replace('btn-outline-primary','btn-primary');
      btn.textContent = 'เปิดเสียงแล้ว';
    });

    /* ========= Boot ========= */
    fetchLatest();
    fetchHistory();
    setInterval(fetchLatest, REFRESH_MS);
    setInterval(fetchHistory, HISTORY_REFRESH_MS);
  </script>
</body>
</html>
