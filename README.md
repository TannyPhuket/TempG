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
        <h3 class="mt-5">ตรวจสอบคุณภาพสินค้า</h3>
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
            <tbody id="history-table"></tbody>
        </table>
        <div id="pagination" class="text-center"></div>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script>
        const channelID = "3025045"; 
        const readAPIKey = "LMLG3ZWG6FG8F3E4";
        let sirenInterval = null;
        let historyData = [];
        let currentPage = 1;
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

                    historyData = data.feeds.map(feed => {
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
                            status
                        };
                    }).reverse();

                    renderTable();
                }
            });
        }

        function renderTable() {
            const start = (currentPage - 1) * rowsPerPage;
            const end = start + rowsPerPage;
            const pageData = historyData.slice(start, end);

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

            $("#history-table").html(tableHTML);
            renderPagination();
        }

        function renderPagination() {
            const totalPages = Math.ceil(historyData.length / rowsPerPage);
            let paginationHTML = "";

            if (totalPages > 1) {
                for (let i = 1; i <= totalPages; i++) {
                    paginationHTML += `<button class="btn btn-sm ${i === currentPage ? 'btn-primary' : 'btn-outline-primary'}" onclick="changePage(${i})">${i}</button> `;
                }
            }

            $("#pagination").html(paginationHTML);
        }

        function changePage(page) {
            currentPage = page;
            renderTable();
        }

        fetchData();
        setInterval(fetchData, 15000);
    </script>
</body>
</html>
