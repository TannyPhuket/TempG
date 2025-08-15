<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ThingSpeak Dashboard</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <style>
        body { background-color: #f8f9fa; }
        .status-normal { color: green; font-weight: bold; }
        .status-alert { color: red; font-weight: bold; }
        .status-circle { width: 15px; height: 15px; border-radius: 50%; display: inline-block; }
        .status-ok { background-color: green; }
        .status-bad { background-color: red; }
        .section-title { margin-top: 40px; margin-bottom: 15px; }
    </style>
</head>
<body>
    <div class="container my-4">
        <h1 class="text-center mb-4">ThingSpeak Dashboard</h1>
        <div class="row text-center mb-4">
            <div class="col">
                <h2 id="temperature" class="display-4"></h2>
                <p>อุณหภูมิ</p>
            </div>
            <div class="col">
                <h2 id="humidity" class="display-4"></h2>
                <p>ความชื้น</p>
            </div>
        </div>
        <p id="status-text" class="text-center"></p>
        <audio id="siren" src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"></audio>

        <!-- ผู้ซื้อ -->
        <h3 class="section-title">ตรวจสอบคุณภาพสินค้า (ผู้ซื้อ)</h3>
        <table class="table table-bordered">
            <thead class="table-light">
                <tr>
                    <th>วันที่</th>
                    <th>รายการสินค้า</th>
                    <th>เวลา</th>
                    <th>อุณหภูมิ (°C)</th>
                    <th>สถานะ</th>
                </tr>
            </thead>
            <tbody id="buyer-table"></tbody>
        </table>
        <div id="buyer-pagination" class="text-center"></div>

        <!-- ผู้ขนส่ง -->
        <h3 class="section-title">ตรวจสอบคุณภาพสินค้า (ผู้ขนส่ง - ย้อนหลังไม่เกิน 1 อาทิตย์)</h3>
        <table class="table table-bordered">
            <thead class="table-light">
                <tr>
                    <th>วันที่</th>
                    <th>รายการสินค้า</th>
                    <th>เวลา</th>
                    <th>อุณหภูมิ (°C)</th>
                    <th>สถานะ</th>
                </tr>
            </thead>
            <tbody id="shipper-table"></tbody>
        </table>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script>
        const channelID = "3025045"; 
        const readAPIKey = "LMLG3ZWG6FG8F3E4";
        let sirenInterval = null;
        let buyerData = [];
        let buyerCurrentPage = 1;
        const rowsPerPage = 10;

        function fetchData() {
            const url = `https://api.thingspeak.com/channels/${channelID}/feeds.json?api_key=${readAPIKey}&results=100`;
            $.getJSON(url, function(data) {
                if (data.feeds.length > 0) {
                    const latest = data.feeds[data.feeds.length - 1];
                    const temp = parseFloat(latest.field1);
                    const humid = parseFloat(latest.field2);

                    $("#temperature").text(temp.toFixed(1) + " °C");
                    $("#humidity").text(humid.toFixed(1) + " %");

                    if (temp > 0) {
                        $("#status-text").text("อุณหภูมิสูงเกินค่าที่กำหนด!")
                            .addClass("status-alert").removeClass("status-normal");
                        if (!sirenInterval) {
                            sirenInterval = setInterval(() => {
                                document.getElementById("siren").play();
                            }, 1000);
                        }
                    } else {
                        $("#status-text").text("อุณหภูมิปกติ")
                            .addClass("status-normal").removeClass("status-alert");
                        clearInterval(sirenInterval);
                        sirenInterval = null;
                    }

                    buyerData = data.feeds.map(feed => {
                        const t = parseFloat(feed.field1);
                        const dateTime = new Date(feed.created_at);
                        const date = dateTime.toLocaleDateString("th-TH");
                        const time = dateTime.toLocaleTimeString("th-TH");
                        const status = (t >= -10 && t <= 50 && t <= 0) ? 
                            `<span class="status-circle status-ok"></span>` : 
                            `<span class="status-circle status-bad"></span>`;
                        return {
                            date, 
                            product: "เนื้อดิบTanny",
                            time, 
                            temp: t.toFixed(1), 
                            status,
                            timestamp: dateTime
                        };
                    }).reverse();

                    renderBuyerTable();
                    renderShipperTable();
                }
            });
        }

        function renderBuyerTable() {
            const start = (buyerCurrentPage - 1) * rowsPerPage;
            const end = start + rowsPerPage;
            const pageData = buyerData.slice(start, end);

            let tableHTML = "";
            pageData.forEach(row => {
                tableHTML += `<tr>
                    <td>${row.date}</td>
                    <td>${row.product}</td>
                    <td>${row.time}</td>
                    <td>${row.temp}</td>
                    <td>${row.status}</td>
                </tr>`;
            });

            $("#buyer-table").html(tableHTML);
            renderBuyerPagination();
        }

        function renderBuyerPagination() {
            const totalPages = Math.ceil(buyerData.length / rowsPerPage);
            let paginationHTML = "";

            if (totalPages > 1) {
                for (let i = 1; i <= totalPages; i++) {
                    paginationHTML += `<button class="btn btn-sm ${i === buyerCurrentPage ? 'btn-primary' : 'btn-outline-primary'}" onclick="changeBuyerPage(${i})">${i}</button> `;
                }
            }

            $("#buyer-pagination").html(paginationHTML);
        }

        function changeBuyerPage(page) {
            buyerCurrentPage = page;
            renderBuyerTable();
        }

        function renderShipperTable() {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            const shipperData = buyerData.filter(row => row.timestamp >= oneWeekAgo);

            let tableHTML = "";
            shipperData.forEach(row => {
                tableHTML += `<tr>
                    <td>${row.date}</td>
                    <td>${row.product}</td>
                    <td>${row.time}</td>
                    <td>${row.temp}</td>
                    <td>${row.status}</td>
                </tr>`;
            });

            $("#shipper-table").html(tableHTML);
        }

        fetchData();
        setInterval(fetchData, 15000);
    </script>
</body>
</html>
