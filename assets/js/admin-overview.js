
//--- Admin Overview ---
document.addEventListener("DOMContentLoaded", function () {
    const overview = document.querySelector(".ec-adm-overview-welcome");

    if (!overview) {
        return;
    }

    const dateElement = document.getElementById("ec-adm-overview-date");
    const adminNameElement = document.getElementById("ec-adm-overview-admin-name");
    const chartCanvas = document.getElementById("ec-adm-overview-chart");
    const chartRange = document.getElementById("ec-adm-overview-chart-range");
    const chartTotal = document.getElementById("ec-adm-overview-chart-total");
    const refreshButton = document.getElementById("ec-adm-overview-refresh");

    //--- Admin Details ---
    function getStoredProfile() {
        try {
            return JSON.parse(localStorage.getItem("ec-user-profile")) || {};
        } catch (error) {
            return {};
        }
    }

    function getAdminName() {
        const profile = getStoredProfile();
        const email = sessionStorage.getItem("ec-user-email") || profile.email || "";
        const savedRole = sessionStorage.getItem("ec-user-role") || profile.role || "";

        if (savedRole && savedRole !== "admin") {
            return "Admin";
        }

        if (profile.name && profile.name.trim()) {
            return profile.name.trim().split(/\s+/)[0];
        }

        if (email.includes("@")) {
            return email.split("@")[0].split(/[._-]/)[0] || "Admin";
        }

        return "Admin";
    }

    function updateDate() {
        const today = new Date();

        if (dateElement) {
            dateElement.textContent = today.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            });
        }

        if (adminNameElement) {
            adminNameElement.textContent = getAdminName();
        }
    }

    //--- Animated Metric Counters ---
    function animateMetrics() {
        const metrics = document.querySelectorAll(
            ".ec-adm-overview-metric-value[data-count]"
        );

        metrics.forEach(function (metric) {
            const target = Number(metric.dataset.count);
            const isRevenue = metric.classList.contains("ec-adm-overview-revenue");
            const duration = 1000;
            const startTime = performance.now();

            function updateCounter(currentTime) {
                const progress = Math.min((currentTime - startTime) / duration, 1);
                const easedProgress = 1 - Math.pow(1 - progress, 3);
                const value = Math.round(target * easedProgress);

                metric.textContent = isRevenue
                    ? "₹" + value.toLocaleString("en-IN")
                    : value.toLocaleString("en-IN");

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                }
            }

            requestAnimationFrame(updateCounter);
        });
    }

    //--- Enrollment Chart Data ---
    const chartData = {
        week: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            values: [42, 58, 49, 76, 65, 92, 84],
            total: 466
        },
        month: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            values: [65, 82, 74, 105, 91, 128, 112, 145, 132, 160, 148, 182],
            total: 1424
        },
        year: {
            labels: ["2022", "2023", "2024", "2025", "2026"],
            values: [280, 430, 620, 890, 1284],
            total: 3504
        }
    };

    let activeChart = "month";
    let resizeObserver = null;

    //--- Draw Enrollment Chart ---
    function drawChart() {
        if (!chartCanvas || !chartTotal) {
            return;
        }

        const context = chartCanvas.getContext("2d");
        const chartWrap = chartCanvas.parentElement;

        if (!context || !chartWrap) {
            return;
        }

        const width = chartWrap.clientWidth;

        if (!width) {
            return;
        }

        const height = chartWrap.clientHeight || 205;
        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
        const data = chartData[activeChart];
        const styles = getComputedStyle(document.body);
        const textColor = styles.getPropertyValue("--pd-text-light").trim() || "#85859a";
        const gridColor = styles.getPropertyValue("--pd-border").trim() || "#e6e6ef";

        chartCanvas.width = Math.round(width * pixelRatio);
        chartCanvas.height = Math.round(height * pixelRatio);
        chartCanvas.style.width = width + "px";
        chartCanvas.style.height = height + "px";

        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        context.clearRect(0, 0, width, height);

        const padding = {
            top: 12,
            right: 12,
            bottom: 28,
            left: 31
        };

        const plotWidth = Math.max(0, width - padding.left - padding.right);
        const plotHeight = Math.max(0, height - padding.top - padding.bottom);
        const maximum = Math.max(...data.values) * 1.2;
        const chartBottom = padding.top + plotHeight;

        //--- Horizontal Grid Lines ---
        context.font = "10px sans-serif";
        context.textAlign = "right";
        context.textBaseline = "middle";

        for (let index = 0; index <= 4; index++) {
            const y = padding.top + (plotHeight / 4) * index;
            const labelValue = Math.round(maximum * (4 - index) / 4);

            context.beginPath();
            context.strokeStyle = gridColor;
            context.lineWidth = 1;
            context.setLineDash([3, 4]);
            context.moveTo(padding.left, y);
            context.lineTo(width - padding.right, y);
            context.stroke();
            context.setLineDash([]);

            context.fillStyle = textColor;
            context.fillText(labelValue.toLocaleString("en-IN"), padding.left - 7, y);
        }

        //--- Plot Coordinates ---
        const points = data.values.map(function (value, index) {
            const x = data.values.length === 1
                ? padding.left + plotWidth / 2
                : padding.left + (plotWidth / (data.values.length - 1)) * index;

            const y = chartBottom - (value / maximum) * plotHeight;

            return { x: x, y: y, value: value };
        });

        //--- Gradient Fill ---
        if (points.length > 1) {
            const gradient = context.createLinearGradient(0, padding.top, 0, chartBottom);
            gradient.addColorStop(0, "rgba(108, 99, 255, 0.24)");
            gradient.addColorStop(1, "rgba(108, 99, 255, 0.01)");

            context.beginPath();
            context.moveTo(points[0].x, chartBottom);
            points.forEach(function (point) {
                context.lineTo(point.x, point.y);
            });
            context.lineTo(points[points.length - 1].x, chartBottom);
            context.closePath();
            context.fillStyle = gradient;
            context.fill();
        }

        //--- Chart Line ---
        context.beginPath();
        points.forEach(function (point, index) {
            if (index === 0) {
                context.moveTo(point.x, point.y);
            } else {
                context.lineTo(point.x, point.y);
            }
        });

        context.strokeStyle = "#6c63ff";
        context.lineWidth = 2.5;
        context.lineJoin = "round";
        context.lineCap = "round";
        context.stroke();

        //--- Chart Points ---
        points.forEach(function (point) {
            context.beginPath();
            context.arc(point.x, point.y, 3, 0, Math.PI * 2);
            context.fillStyle = "#ffffff";
            context.fill();
            context.lineWidth = 2;
            context.strokeStyle = "#6c63ff";
            context.stroke();
        });

        //--- X Axis Labels ---
        context.fillStyle = textColor;
        context.font = "10px sans-serif";
        context.textAlign = "center";
        context.textBaseline = "top";

        const maximumLabels = width < 360 ? 5 : 7;
        const labelStep = Math.max(1, Math.ceil(data.labels.length / maximumLabels));

        data.labels.forEach(function (label, index) {
            const isLast = index === data.labels.length - 1;

            if (index % labelStep !== 0 && !isLast) {
                return;
            }

            const point = points[index];
            context.fillText(label, point.x, chartBottom + 10);
        });

        chartTotal.textContent = data.total.toLocaleString("en-IN");
    }

    //--- Chart Controls ---
    if (chartRange) {
        chartRange.addEventListener("change", function () {
            activeChart = chartRange.value;

            if (!chartData[activeChart]) {
                activeChart = "month";
            }

            drawChart();
        });
    }

    //--- Refresh Overview ---
    if (refreshButton) {
        refreshButton.addEventListener("click", function () {
            updateDate();
            animateMetrics();
            drawChart();

            refreshButton.classList.remove("ec-adm-overview-refreshing");
            void refreshButton.offsetWidth;
            refreshButton.classList.add("ec-adm-overview-refreshing");
        });
    }

    //--- Responsive Chart ---
    if (chartCanvas && "ResizeObserver" in window) {
        resizeObserver = new ResizeObserver(function () {
            drawChart();
        });

        resizeObserver.observe(chartCanvas.parentElement);
    } else {
        window.addEventListener("resize", drawChart);
    }

    //--- Initialize Overview ---
    updateDate();
    animateMetrics();
    drawChart();

    //--- End Admin Overview ---
});
//--- End Admin Overview ---
