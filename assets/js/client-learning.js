//--- Client Learning ---
document.addEventListener("DOMContentLoaded", function () {

    //--- Page Elements ---
    const courseList = document.getElementById("ec-cln-course-list");
    const emptyState = document.getElementById("ec-cln-empty");
    const emptyTitle = document.getElementById("ec-cln-empty-title");
    const emptyText = document.getElementById("ec-cln-empty-text");
    const toast = document.getElementById("ec-cln-toast");
    const toastMessage = document.getElementById("ec-cln-toast-message");

    if (!courseList) {
        return;
    }

    //--- Identify Current Learner ---
    function getLearnerKey() {
        let email = "";

        try {
            const savedProfile = JSON.parse(
                localStorage.getItem("ec-user-profile") || "{}"
            );

            email = (
                sessionStorage.getItem("ec-user-email") ||
                savedProfile.email ||
                localStorage.getItem("ec-lgn-remembered-email") ||
                "guest"
            ).trim().toLowerCase();

        } catch (error) {
            email = "guest";
        }

        return email.replace(/[^a-z0-9@._-]/g, "_");
    }

    const learnerKey = getLearnerKey();

    // These enrollment keys match client-courses.js.
    const enrolledKey = "ec-cls-enrolled-" + learnerKey;
    const progressKey = "ec-cln-progress-" + learnerKey;

    //--- Read Storage Safely ---
    function readList(key) {
        try {
            const value = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(value) ? value : [];
        } catch (error) {
            return [];
        }
    }

    function readProgress() {
        try {
            const value = JSON.parse(
                localStorage.getItem(progressKey) || "{}"
            );

            return value && typeof value === "object" &&
                !Array.isArray(value) ? value : {};

        } catch (error) {
            return {};
        }
    }

    function saveProgress() {
        try {
            localStorage.setItem(progressKey, JSON.stringify(progressData));
            return true;
        } catch (error) {
            showToast("Browser storage is unavailable. Progress was not saved.", true);
            return false;
        }
    }

    //--- Course Catalogue ---
    // Keep course IDs consistent with client-courses.js.
    const courseCatalogue = [
        {
            id: "web-development",
            title: "Complete Web Development",
            category: "Development",
            image: "assets/images/web-development.webp",
            lessons: 25,
            duration: 8
        },
        {
            id: "ui-ux-design",
            title: "UI/UX Design Fundamentals",
            category: "Design",
            image: "assets/images/ui-ux-design.webp",
            lessons: 21,
            duration: 6
        },
        {
            id: "data-science",
            title: "Data Science Essentials",
            category: "Data",
            image: "assets/images/ai-tools.webp",
            lessons: 30,
            duration: 10
        },
        {
            id: "digital-marketing",
            title: "Digital Marketing Strategy",
            category: "Marketing",
            image: "assets/images/digital-marketing.webp",
            lessons: 16,
            duration: 4
        },
        {
            id: "product-strategy",
            title: "Product Strategy & Management",
            category: "Business",
            image: "assets/images/about-story.webp",
            lessons: 28,
            duration: 9
        },
        {
            id: "productivity",
            title: "Productivity Mastery",
            category: "Productivity",
            image: "assets/images/study-smarter.webp",
            lessons: 12,
            duration: 3
        }
    ];

    //--- Load Enrollments and Progress ---
    let enrolledIds = readList(enrolledKey).filter(function (id) {
        return courseCatalogue.some(function (course) {
            return course.id === id;
        });
    });

    let progressData = readProgress();
    let activeFilter = "all";
    let toastTimer;

    //--- Demo Progress for Existing Enrollments ---
    // New enrollments start at zero until a lesson is completed.
    const demoProgress = {
        "web-development": 18,
        "ui-ux-design": 8,
        "data-science": 0,
        "digital-marketing": 0,
        "product-strategy": 0,
        "productivity": 12
    };

    enrolledIds.forEach(function (id) {
        const course = courseCatalogue.find(function (item) {
            return item.id === id;
        });

        if (
            course &&
            !Object.prototype.hasOwnProperty.call(progressData, id)
        ) {
            progressData[id] = Math.min(
                course.lessons,
                demoProgress[id] || 0
            );
        }
    });

    //--- Keep Progress Only for Enrolled Courses ---
    Object.keys(progressData).forEach(function (id) {
        if (!enrolledIds.includes(id)) {
            delete progressData[id];
        }
    });

    saveProgress();

    //--- Get Course Lesson Progress ---
    function getCompletedLessons(course) {
        const value = Number(progressData[course.id]) || 0;

        return Math.max(0, Math.min(course.lessons, Math.floor(value)));
    }

    function getCoursePercent(course) {
        return Math.round(
            (getCompletedLessons(course) / course.lessons) * 100
        );
    }

    function getEnrolledCourses() {
        return enrolledIds.map(function (id) {
            return courseCatalogue.find(function (course) {
                return course.id === id;
            });
        }).filter(Boolean);
    }

    //--- Toast Notification ---
    function showToast(message, isError) {
        if (!toast || !toastMessage) {
            return;
        }

        clearTimeout(toastTimer);
        toastMessage.textContent = message;
        toast.classList.toggle("error", Boolean(isError));

        const icon = toast.querySelector("i");

        if (icon) {
            icon.className = isError
                ? "bi bi-exclamation-circle-fill"
                : "bi bi-check-circle-fill";
        }

        toast.classList.add("show");

        toastTimer = setTimeout(function () {
            toast.classList.remove("show");
        }, 3000);
    }

    //--- Update Overview Statistics ---
    function updateStatistics() {
        const enrolledCourses = getEnrolledCourses();

        const completedCourses = enrolledCourses.filter(function (course) {
            return getCoursePercent(course) === 100;
        });

        const inProgressCourses = enrolledCourses.filter(function (course) {
            const percent = getCoursePercent(course);
            return percent > 0 && percent < 100;
        });

        let totalLessons = 0;
        let completedLessons = 0;
        let weightedProgress = 0;

        enrolledCourses.forEach(function (course) {
            const completed = getCompletedLessons(course);

            totalLessons += course.lessons;
            completedLessons += completed;
            weightedProgress += getCoursePercent(course);
        });

        const averageProgress = enrolledCourses.length
            ? Math.round(weightedProgress / enrolledCourses.length)
            : 0;

        const values = {
            "ec-cln-stat-enrolled": enrolledCourses.length,
            "ec-cln-stat-progress": inProgressCourses.length,
            "ec-cln-stat-completed": completedCourses.length,
            "ec-cln-stat-hours": calculateLearningHours(completedLessons),
            "ec-cln-overall-percent": averageProgress + "%",
            "ec-cln-lessons-completed": completedLessons,
            "ec-cln-lessons-total": totalLessons + " lessons total"
        };

        Object.keys(values).forEach(function (id) {
            const element = document.getElementById(id);

            if (element) {
                element.textContent = values[id];
            }
        });

        const overallBar = document.getElementById("ec-cln-overall-bar");

        if (overallBar) {
            overallBar.style.width = averageProgress + "%";
        }

        const overallMessage = document.getElementById("ec-cln-overall-message");

        if (overallMessage) {
            if (!enrolledCourses.length) {
                overallMessage.textContent =
                    "Enroll in a course to start tracking your learning progress.";
            } else if (averageProgress === 100) {
                overallMessage.textContent =
                    "Amazing work! You have completed every course in your library.";
            } else if (averageProgress >= 60) {
                overallMessage.textContent =
                    "You're making great progress. Keep going to reach your next milestone!";
            } else {
                overallMessage.textContent =
                    "Every lesson counts. Keep learning to build your skills step by step.";
            }
        }

        setText("ec-cln-tab-all", enrolledCourses.length);
        setText("ec-cln-tab-progress", inProgressCourses.length);
        setText("ec-cln-tab-completed", completedCourses.length);
    }

    //--- Estimate Learning Hours for Demo ---
    function calculateLearningHours(completedLessons) {
        // Illustrative estimate: 20 minutes per completed lesson.
        return Math.round((completedLessons / 3) * 10) / 10;
    }

    function setText(id, value) {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = value;
        }
    }

    //--- Weekly Goal Demo ---
    // Replace with actual activity records when a backend is available.
    function updateWeeklyGoal() {
        const weeklyTarget = 5;
        const weeklyHours = Math.min(
            weeklyTarget,
            calculateLearningHours(
                getEnrolledCourses().reduce(function (total, course) {
                    return total + getCompletedLessons(course);
                }, 0)
            )
        );

        const percent = Math.min(
            100,
            Math.round((weeklyHours / weeklyTarget) * 100)
        );

        const ring = document.getElementById("ec-cln-week-ring");

        if (ring) {
            ring.style.background =
                "conic-gradient(var(--pd-primary) 0% " + percent +
                "%, #efedf7 " + percent + "% 100%)";

            ring.setAttribute("role", "progressbar");
            ring.setAttribute("aria-label", "Weekly learning goal");
            ring.setAttribute("aria-valuemin", "0");
            ring.setAttribute("aria-valuemax", "100");
            ring.setAttribute("aria-valuenow", String(percent));
        }

        setText("ec-cln-week-percent", percent + "%");
        setText("ec-cln-week-hours", weeklyHours + " hrs");
        setText("ec-cln-week-target", weeklyTarget + " hrs");

        const message = document.getElementById("ec-cln-week-message");

        if (message) {
            const remaining = Math.max(0, weeklyTarget - weeklyHours);

            message.textContent = remaining === 0
                ? "Great work! Your demo weekly learning goal is complete."
                : "Keep going! " + remaining +
                    " more hours will reach your demo weekly target.";
        }
    }

    //--- Create Course Card ---
    function createCourseCard(course) {
        const completed = getCompletedLessons(course);
        const percent = getCoursePercent(course);
        const isComplete = percent === 100;

        const article = document.createElement("article");
        article.className = "ec-cln-course-item";

        const imageWrap = document.createElement("div");
        imageWrap.className = "ec-cln-course-image";

        const image = document.createElement("img");
        image.src = course.image;
        image.alt = course.title;
        image.loading = "lazy";

        image.addEventListener("error", function () {
            image.style.display = "none";
            imageWrap.style.background = "var(--pd-primary-light)";
        });

        imageWrap.appendChild(image);

        const copy = document.createElement("div");
        copy.className = "ec-cln-course-copy";

        const top = document.createElement("div");
        top.className = "ec-cln-course-top";

        const category = document.createElement("span");
        category.className = "ec-cln-course-category";
        category.textContent = course.category;

        const status = document.createElement("span");
        status.className = "ec-cln-course-status";

        if (isComplete) {
            status.classList.add("completed");
        }

        const statusIcon = document.createElement("i");
        statusIcon.className = isComplete
            ? "bi bi-check-circle-fill"
            : "bi bi-play-circle";

        status.append(
            statusIcon,
            document.createTextNode(isComplete ? " Completed" : " In progress")
        );

        top.append(category, status);

        const title = document.createElement("h3");
        title.textContent = course.title;

        const meta = document.createElement("div");
        meta.className = "ec-cln-course-meta";

        const lessonMeta = document.createElement("span");
        lessonMeta.innerHTML = '<i class="bi bi-journal-text"></i> ';
        lessonMeta.appendChild(document.createTextNode(
            completed + "/" + course.lessons + " lessons"
        ));

        const durationMeta = document.createElement("span");
        durationMeta.innerHTML = '<i class="bi bi-clock"></i> ';
        durationMeta.appendChild(document.createTextNode(
            course.duration + " hours"
        ));

        meta.append(lessonMeta, durationMeta);

        const progressRow = document.createElement("div");
        progressRow.className = "ec-cln-course-progress-row";

        const progressLabel = document.createElement("span");
        progressLabel.textContent = "Course progress";

        const progressValue = document.createElement("strong");
        progressValue.textContent = percent + "%";

        progressRow.append(progressLabel, progressValue);

        const track = document.createElement("div");
        track.className = "ec-cln-course-track";
        track.setAttribute("role", "progressbar");
        track.setAttribute("aria-label", course.title + " progress");
        track.setAttribute("aria-valuemin", "0");
        track.setAttribute("aria-valuemax", "100");
        track.setAttribute("aria-valuenow", String(percent));

        const bar = document.createElement("span");
        bar.style.width = percent + "%";

        if (isComplete) {
            bar.style.background = "var(--pd-success)";
        }

        track.appendChild(bar);

        const bottom = document.createElement("div");
        bottom.className = "ec-cln-course-bottom";

        const remaining = document.createElement("small");
        remaining.textContent = isComplete
            ? "All lessons completed"
            : (course.lessons - completed) + " lessons remaining";

        const action = document.createElement("button");
        action.type = "button";
        action.className = "ec-cln-course-action";

        if (isComplete) {
            action.classList.add("completed");
        }

        const actionIcon = document.createElement("i");
        actionIcon.className = isComplete
            ? "bi bi-arrow-counterclockwise"
            : "bi bi-play-fill";

        action.appendChild(actionIcon);
        action.appendChild(document.createTextNode(
            isComplete ? " Review course" : " Complete next lesson"
        ));

        action.addEventListener("click", function () {
            if (isComplete) {
                showToast("You've completed this course. Keep up the great work!");
                return;
            }

            const oldValue = progressData[course.id] || 0;
            progressData[course.id] = Math.min(course.lessons, oldValue + 1);

            if (!saveProgress()) {
                progressData[course.id] = oldValue;
                return;
            }

            renderCourses();
            updateStatistics();
            updateWeeklyGoal();

            if (getCoursePercent(course) === 100) {
                showToast("Course completed! Congratulations on your achievement.");
            } else {
                showToast("Lesson completed. Your progress has been updated!");
            }
        });

        bottom.append(remaining, action);
        copy.append(top, title, meta, progressRow, track, bottom);
        article.append(imageWrap, copy);

        return article;
    }

    //--- Render Enrolled Courses ---
    function renderCourses() {
        const courses = getEnrolledCourses();

        let filtered = courses.filter(function (course) {
            const percent = getCoursePercent(course);

            if (activeFilter === "progress") {
                return percent > 0 && percent < 100;
            }

            if (activeFilter === "completed") {
                return percent === 100;
            }

            return true;
        });

        courseList.replaceChildren();

        filtered.forEach(function (course) {
            courseList.appendChild(createCourseCard(course));
        });

        const isEmpty = filtered.length === 0;

        courseList.hidden = isEmpty;
        emptyState.hidden = !isEmpty;

        if (isEmpty) {
            if (courses.length === 0) {
                emptyTitle.textContent = "Your learning journey starts here";
                emptyText.textContent =
                    "You haven't enrolled in any courses yet. Explore the course library to get started.";
            } else {
                emptyTitle.textContent = activeFilter === "completed"
                    ? "Your next achievement is waiting"
                    : "No courses in this view";

                emptyText.textContent = activeFilter === "completed"
                    ? "Finish a course to see your completed learning achievements here."
                    : "Try another tab or enroll in a new course to continue learning.";
            }
        }

        document.querySelectorAll("[data-cln-filter]").forEach(function (button) {
            const active = button.dataset.clnFilter === activeFilter;

            button.classList.toggle("active", active);
            button.setAttribute("aria-pressed", String(active));
        });
    }

    //--- Course Tabs ---
    document.querySelectorAll("[data-cln-filter]").forEach(function (button) {
        button.addEventListener("click", function () {
            activeFilter = button.dataset.clnFilter;
            renderCourses();
        });
    });

    //--- Refresh When Returning to This Page ---
    window.addEventListener("pageshow", function () {
        enrolledIds = readList(enrolledKey).filter(function (id) {
            return courseCatalogue.some(function (course) {
                return course.id === id;
            });
        });

        progressData = readProgress();

        enrolledIds.forEach(function (id) {
            const course = courseCatalogue.find(function (item) {
                return item.id === id;
            });

            if (
                course &&
                !Object.prototype.hasOwnProperty.call(progressData, id)
            ) {
                progressData[id] = Math.min(
                    course.lessons,
                    demoProgress[id] || 0
                );
            }
        });

        Object.keys(progressData).forEach(function (id) {
            if (!enrolledIds.includes(id)) {
                delete progressData[id];
            }
        });

        saveProgress();
        renderCourses();
        updateStatistics();
        updateWeeklyGoal();
    });

    //--- Initial Render ---
    renderCourses();
    updateStatistics();
    updateWeeklyGoal();

});
//--- End Client Learning ---