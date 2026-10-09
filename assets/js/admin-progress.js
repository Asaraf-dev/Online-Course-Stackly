
//--- Admin Progress ---
document.addEventListener("DOMContentLoaded", function () {
    const get = function (id) {
        return document.getElementById(id);
    };

    const tableBody = get("ec-adm-prg-table-body");
    const searchInput = get("ec-adm-prg-search");
    const courseFilter = get("ec-adm-prg-course-filter");
    const statusFilter = get("ec-adm-prg-status-filter");
    const sortFilter = get("ec-adm-prg-sort");
    const chartCanvas = get("ec-adm-prg-chart");
    const periodSelect = get("ec-adm-prg-period");
    const modal = get("ec-adm-prg-modal");
    const modalContent = get("ec-adm-prg-modal-content");

    if (!tableBody || !chartCanvas || !modal) {
        return;
    }

    //--- Sample Learner Records ---
    const learners = [
        { id: "ST001", name: "Arun Subramanian", email: "arun@example.com", course: "Complete Web Development", progress: 85, lastActive: "2026-10-09T08:30:00", enrolled: "2026-09-10", duration: "12h 30m" },
        { id: "ST002", name: "Priya Krishnan", email: "priya@example.com", course: "UI / UX Design Essentials", progress: 100, lastActive: "2026-10-09T07:15:00", enrolled: "2026-08-22", duration: "8h 15m" },
        { id: "ST003", name: "Rahul Varma", email: "rahul@example.com", course: "Data Science Fundamentals", progress: 42, lastActive: "2026-10-08T16:20:00", enrolled: "2026-09-19", duration: "10h 40m" },
        { id: "ST004", name: "Meena Selvam", email: "meena@example.com", course: "Digital Marketing Masterclass", progress: 68, lastActive: "2026-10-08T13:05:00", enrolled: "2026-09-01", duration: "7h 20m" },
        { id: "ST005", name: "Kavin Raj", email: "kavin@example.com", course: "Complete Web Development", progress: 15, lastActive: "2026-10-07T11:10:00", enrolled: "2026-10-01", duration: "12h 30m" },
        { id: "ST006", name: "Divya Mohan", email: "divya@example.com", course: "Productivity and Time Management", progress: 0, lastActive: "2026-10-03T09:30:00", enrolled: "2026-10-03", duration: "4h 10m" },
        { id: "ST007", name: "Naveen Kumar", email: "naveen@example.com", course: "Data Science Fundamentals", progress: 100, lastActive: "2026-10-07T15:45:00", enrolled: "2026-08-12", duration: "10h 40m" },
        { id: "ST008", name: "Lakshmi Devi", email: "lakshmi@example.com", course: "UI / UX Design Essentials", progress: 56, lastActive: "2026-10-06T12:00:00", enrolled: "2026-09-11", duration: "8h 15m" },
        { id: "ST009", name: "Sanjay Prabhu", email: "sanjay@example.com", course: "Digital Marketing Masterclass", progress: 92, lastActive: "2026-10-09T06:40:00", enrolled: "2026-08-29", duration: "7h 20m" },
        { id: "ST010", name: "Anitha Ramesh", email: "anitha@example.com", course: "Productivity and Time Management", progress: 0, lastActive: "2026-09-29T10:15:00", enrolled: "2026-09-29", duration: "4h 10m" }
    ];

    //--- Sample Chart Data ---
    const activityData = {
        week: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            values: [42, 58, 49, 76, 65, 92, 84]
        },
        month: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            values: [65, 82, 74, 105, 91, 128, 112, 145, 132, 160, 148, 182]
        },
        year: {
            labels: ["2022", "2023", "2024", "2025", "2026"],
            values: [280, 430, 620, 890, 1284]
        }
    };

    let previousFocus = null;

    //--- Text Helpers ---
    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, function (character) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[character];
        });
    }

    function initials(name) {
        return String(name || "")
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(function (part) {
                return part.charAt(0);
            })
            .join("")
            .toUpperCase() || "S";
    }

    function formatNumber(value) {
        return Number(value || 0).toLocaleString("en-IN");
    }

    function formatDate(value) {
        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "—";
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    }

    function formatLastActive(value) {
        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "—";
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short"
        });
    }

    function getStatus(progress) {
        if (progress >= 100) {
            return {
                key: "completed",
                label: "Completed",
                className: "ec-adm-prg-status-completed"
            };
        }

        if (progress > 0) {
            return {
                key: "in-progress",
                label: "In progress",
                className: "ec-adm-prg-status-in-progress"
            };
        }

        return {
            key: "not-started",
            label: "Not started",
            className: "ec-adm-prg-status-not-started"
        };
    }

    //--- Date and Overview Metrics ---
    function updateDate() {
        const dateElement = get("ec-adm-prg-date");

        if (dateElement) {
            dateElement.textContent = new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            });
        }
    }

    function updateMetrics() {
        const total = learners.length;
        const active = learners.filter(function (learner) {
            return learner.progress > 0 && learner.progress < 100;
        }).length;
        const completed = learners.filter(function (learner) {
            return learner.progress >= 100;
        }).length;
        const average = total
            ? Math.round(learners.reduce(function (sum, learner) {
                return sum + learner.progress;
            }, 0) / total)
            : 0;

        get("ec-adm-prg-total-learners").textContent = formatNumber(total);
        get("ec-adm-prg-active-learners").textContent = formatNumber(active);
        get("ec-adm-prg-completions").textContent = formatNumber(completed);
        get("ec-adm-prg-average").textContent = average + "%";

        const completionRate = total
            ? Math.round((completed / total) * 100)
            : 0;

        get("ec-adm-prg-donut-value").textContent = completionRate + "%";
        get("ec-adm-prg-donut").style.background =
            "conic-gradient(#19bd91 0% " + completionRate +
            "%, #e9e7f5 " + completionRate + "% 100%)";

        get("ec-adm-prg-completed-count").textContent = formatNumber(completed);
        get("ec-adm-prg-progress-count").textContent = formatNumber(active);
        get("ec-adm-prg-not-started-count").textContent = formatNumber(
            learners.filter(function (learner) {
                return learner.progress === 0;
            }).length
        );
    }

    //--- Course Filter Options ---
    function populateCourseFilter() {
        const currentValue = courseFilter.value || "all";
        const courseNames = Array.from(new Set(learners.map(function (learner) {
            return learner.course;
        }))).sort();

        courseFilter.innerHTML = '<option value="all">All courses</option>';

        courseNames.forEach(function (courseName) {
            const option = document.createElement("option");
            option.value = courseName;
            option.textContent = courseName;
            courseFilter.appendChild(option);
        });

        courseFilter.value = courseNames.includes(currentValue) ? currentValue : "all";
    }

    //--- Filter and Sort Learners ---
    function getFilteredLearners() {
        const term = searchInput.value.trim().toLowerCase();
        const course = courseFilter.value;
        const status = statusFilter.value;
        const sort = sortFilter.value;

        const filtered = learners.filter(function (learner) {
            const learnerStatus = getStatus(learner.progress).key;
            const searchable = [
                learner.name,
                learner.email,
                learner.course,
                learner.id
            ].join(" ").toLowerCase();

            return searchable.includes(term) &&
                (course === "all" || learner.course === course) &&
                (status === "all" || learnerStatus === status);
        });

        filtered.sort(function (first, second) {
            if (sort === "name") {
                return first.name.localeCompare(second.name);
            }

            if (sort === "progress-high") {
                return second.progress - first.progress;
            }

            if (sort === "progress-low") {
                return first.progress - second.progress;
            }

            return new Date(second.lastActive) - new Date(first.lastActive);
        });

        return filtered;
    }

    //--- Render Student Table ---
    function renderLearners() {
        const filtered = getFilteredLearners();

        tableBody.innerHTML = filtered.map(function (learner) {
            const status = getStatus(learner.progress);
            const barClass = learner.progress >= 100
                ? "ec-adm-prg-bar-completed"
                : learner.progress === 0
                    ? "ec-adm-prg-bar-started"
                    : "";

            return `
                <tr>
                    <td>
                        <div class="ec-adm-prg-student">
                            <span class="ec-adm-prg-student-avatar">${escapeHTML(initials(learner.name))}</span>
                            <span class="ec-adm-prg-student-info">
                                <strong>${escapeHTML(learner.name)}</strong>
                                <small>${escapeHTML(learner.email)}</small>
                            </span>
                        </div>
                    </td>
                    <td><span class="ec-adm-prg-course-name">${escapeHTML(learner.course)}</span></td>
                    <td>
                        <div class="ec-adm-prg-progress-cell">
                            <div class="ec-adm-prg-progress-value">
                                <span>Course progress</span><strong>${learner.progress}%</strong>
                            </div>
                            <div class="ec-adm-prg-progress-track">
                                <span class="${barClass}" style="--ec-adm-prg-progress:${learner.progress}%"></span>
                            </div>
                        </div>
                    </td>
                    <td>${formatLastActive(learner.lastActive)}</td>
                    <td><span class="ec-adm-prg-status ${status.className}">${status.label}</span></td>
                    <td><button type="button" class="ec-adm-prg-detail-btn" data-learner-id="${escapeHTML(learner.id)}"><i class="bi bi-eye"></i> View</button></td>
                </tr>
            `;
        }).join("");

        get("ec-adm-prg-result-count").textContent =
            filtered.length + (filtered.length === 1 ? " learner" : " learners");

        get("ec-adm-prg-empty").hidden = filtered.length > 0;
        get("ec-adm-prg-table-scroll").hidden = filtered.length === 0;
    }

    //--- Course Performance ---
    function renderCoursePerformance() {
        const grouped = new Map();

        learners.forEach(function (learner) {
            if (!grouped.has(learner.course)) {
                grouped.set(learner.course, {
                    name: learner.course,
                    learners: 0,
                    totalProgress: 0,
                    completed: 0
                });
            }

            const course = grouped.get(learner.course);
            course.learners += 1;
            course.totalProgress += learner.progress;

            if (learner.progress >= 100) {
                course.completed += 1;
            }
        });

        const courses = Array.from(grouped.values()).map(function (course) {
            return {
                ...course,
                average: course.learners
                    ? Math.round(course.totalProgress / course.learners)
                    : 0
            };
        }).sort(function (first, second) {
            return second.average - first.average;
        });

        const courseIcons = [
            "bi-code-slash",
            "bi-palette",
            "bi-bar-chart",
            "bi-megaphone",
            "bi-lightning-charge"
        ];

        get("ec-adm-prg-course-list").innerHTML = courses.map(function (course, index) {
            return `
                <div class="ec-adm-prg-course-row">
                    <div class="ec-adm-prg-course-info">
                        <span class="ec-adm-prg-course-icon"><i class="bi ${courseIcons[index % courseIcons.length]}"></i></span>
                        <div>
                            <strong>${escapeHTML(course.name)}</strong>
                            <small>${course.learners} demo learners · ${course.completed} completed</small>
                        </div>
                    </div>
                    <div class="ec-adm-prg-course-bar" role="progressbar" aria-label="${escapeHTML(course.name)} average progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${course.average}">
                        <span style="--ec-adm-prg-course-progress:${course.average}%"></span>
                    </div>
                    <div class="ec-adm-prg-course-result">
                        <strong>${course.average}%</strong>
                        <small>Avg. progress</small>
                    </div>
                </div>
            `;
        }).join("");
    }

    //--- Chart Drawing ---
    function drawChart() {
        const context = chartCanvas.getContext("2d");
        const wrapper = chartCanvas.parentElement;

        if (!context || !wrapper || wrapper.clientWidth === 0) {
            return;
        }

        const selectedPeriod = activityData[periodSelect.value]
            ? periodSelect.value
            : "month";
        const data = activityData[selectedPeriod];
        const width = wrapper.clientWidth;
        const height = wrapper.clientHeight || 205;
        const ratio = Math.min(window.devicePixelRatio || 1, 2);

        chartCanvas.width = Math.round(width * ratio);
        chartCanvas.height = Math.round(height * ratio);
        chartCanvas.style.width = width + "px";
        chartCanvas.style.height = height + "px";

        context.setTransform(ratio, 0, 0, ratio, 0, 0);
        context.clearRect(0, 0, width, height);

        const padding = { top: 12, right: 12, bottom: 27, left: 34 };
        const plotWidth = Math.max(0, width - padding.left - padding.right);
        const plotHeight = Math.max(0, height - padding.top - padding.bottom);
        const bottom = padding.top + plotHeight;
        const maxValue = Math.max(...data.values) * 1.2;

        const style = getComputedStyle(document.body);
        const textColor = style.getPropertyValue("--pd-text-light").trim() || "#85859a";
        const gridColor = style.getPropertyValue("--pd-border").trim() || "#e6e6ef";

        //--- Grid and Y Axis ---
        context.font = "10px sans-serif";
        context.textAlign = "right";
        context.textBaseline = "middle";

        for (let index = 0; index <= 4; index++) {
            const y = padding.top + plotHeight * index / 4;
            const value = Math.round(maxValue * (4 - index) / 4);

            context.beginPath();
            context.strokeStyle = gridColor;
            context.setLineDash([3, 4]);
            context.moveTo(padding.left, y);
            context.lineTo(width - padding.right, y);
            context.stroke();
            context.setLineDash([]);

            context.fillStyle = textColor;
            context.fillText(value.toLocaleString("en-IN"), padding.left - 7, y);
        }

        //--- Points ---
        const points = data.values.map(function (value, index) {
            const x = data.values.length === 1
                ? padding.left + plotWidth / 2
                : padding.left + plotWidth * index / (data.values.length - 1);

            return {
                x: x,
                y: bottom - (value / maxValue) * plotHeight
            };
        });

        //--- Area Fill ---
        if (points.length > 1) {
            const gradient = context.createLinearGradient(0, padding.top, 0, bottom);
            gradient.addColorStop(0, "rgba(108,99,255,.23)");
            gradient.addColorStop(1, "rgba(108,99,255,.01)");

            context.beginPath();
            context.moveTo(points[0].x, bottom);

            points.forEach(function (point) {
                context.lineTo(point.x, point.y);
            });

            context.lineTo(points[points.length - 1].x, bottom);
            context.closePath();
            context.fillStyle = gradient;
            context.fill();
        }

        //--- Line ---
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

        //--- Data Points ---
        points.forEach(function (point) {
            context.beginPath();
            context.arc(point.x, point.y, 3, 0, Math.PI * 2);
            context.fillStyle = "#fff";
            context.fill();
            context.lineWidth = 2;
            context.strokeStyle = "#6c63ff";
            context.stroke();
        });

        //--- X Axis ---
        context.fillStyle = textColor;
        context.font = "10px sans-serif";
        context.textAlign = "center";
        context.textBaseline = "top";

        const maxLabels = width < 360 ? 5 : 7;
        const step = Math.max(1, Math.ceil(data.labels.length / maxLabels));

        data.labels.forEach(function (label, index) {
            if (index % step !== 0 && index !== data.labels.length - 1) {
                return;
            }

            context.fillText(label, points[index].x, bottom + 9);
        });

        get("ec-adm-prg-chart-total").textContent =
            data.values.reduce(function (sum, value) {
                return sum + value;
            }, 0).toLocaleString("en-IN");
    }

    //--- Student Detail Modal ---
    function openStudentDetails(id, trigger) {
        const learner = learners.find(function (item) {
            return item.id === id;
        });

        if (!learner) {
            return;
        }

        previousFocus = trigger;

        const status = getStatus(learner.progress);

        modalContent.innerHTML = `
            <div class="ec-adm-prg-modal-profile">
                <span class="ec-adm-prg-modal-avatar">${escapeHTML(initials(learner.name))}</span>
                <div>
                    <strong>${escapeHTML(learner.name)}</strong>
                    <span>${escapeHTML(learner.email)}</span>
                    <span>Student ID: ${escapeHTML(learner.id)}</span>
                </div>
            </div>

            <div class="ec-adm-prg-modal-details">
                <div class="ec-adm-prg-modal-detail">
                    <span>Course progress</span>
                    <strong>${learner.progress}%</strong>
                </div>
                <div class="ec-adm-prg-modal-detail">
                    <span>Learning status</span>
                    <strong class="${status.className}">${status.label}</strong>
                </div>
                <div class="ec-adm-prg-modal-detail">
                    <span>Enrollment date</span>
                    <strong>${formatDate(learner.enrolled)}</strong>
                </div>
                <div class="ec-adm-prg-modal-detail">
                    <span>Course duration</span>
                    <strong>${escapeHTML(learner.duration)}</strong>
                </div>
            </div>

            <div class="ec-adm-prg-modal-course">
                <h4>Enrolled course</h4>
                <div class="ec-adm-prg-modal-course-row">
                    <span>${escapeHTML(learner.course)}</span>
                    <strong>${learner.progress}%</strong>
                </div>
                <div class="ec-adm-prg-progress-track">
                    <span class="${learner.progress >= 100 ? "ec-adm-prg-bar-completed" : ""}" style="--ec-adm-prg-progress:${learner.progress}%"></span>
                </div>
                <div class="ec-adm-prg-modal-course-row">
                    <span>Last active</span>
                    <strong>${formatDate(learner.lastActive)}</strong>
                </div>
            </div>
        `;

        modal.classList.add("ec-adm-prg-modal-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("ec-adm-prg-body-modal-open");

        const closeButton = modal.querySelector(".ec-adm-prg-modal-close");

        if (closeButton) {
            closeButton.focus();
        }
    }

    function closeStudentDetails() {
        modal.classList.remove("ec-adm-prg-modal-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("ec-adm-prg-body-modal-open");

        if (previousFocus && document.contains(previousFocus)) {
            previousFocus.focus();
        }
    }

    //--- Event Listeners ---
    [searchInput, courseFilter, statusFilter, sortFilter].forEach(function (control) {
        control.addEventListener(
            control.tagName === "INPUT" ? "input" : "change",
            renderLearners
        );
    });

    tableBody.addEventListener("click", function (event) {
        const button = event.target.closest("[data-learner-id]");

        if (button) {
            openStudentDetails(button.dataset.learnerId, button);
        }
    });

    document.querySelectorAll("[data-prg-close]").forEach(function (button) {
        button.addEventListener("click", closeStudentDetails);
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && modal.classList.contains("ec-adm-prg-modal-open")) {
            closeStudentDetails();
        }

        //--- Modal Focus Containment ---
        if (event.key === "Tab" && modal.classList.contains("ec-adm-prg-modal-open")) {
            const focusable = Array.from(modal.querySelectorAll(
                "button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])"
            ));

            if (!focusable.length) {
                return;
            }

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });

    function resetFilters() {
        searchInput.value = "";
        courseFilter.value = "all";
        statusFilter.value = "all";
        sortFilter.value = "recent";
        renderLearners();
    }

    get("ec-adm-prg-reset").addEventListener("click", resetFilters);
    get("ec-adm-prg-empty-reset").addEventListener("click", resetFilters);

    periodSelect.addEventListener("change", drawChart);

    //--- Responsive Chart ---
    if ("ResizeObserver" in window) {
        const observer = new ResizeObserver(drawChart);
        observer.observe(chartCanvas.parentElement);
    } else {
        window.addEventListener("resize", drawChart);
    }

    //--- Initialize ---
    updateDate();
    updateMetrics();
    populateCourseFilter();
    renderLearners();
    renderCoursePerformance();
    drawChart();

    //--- End Admin Progress ---
});
//--- End Admin Progress ---
