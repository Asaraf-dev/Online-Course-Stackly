//--- Client Overview ---
document.addEventListener("DOMContentLoaded", function () {

    //--- Page Elements ---
    const welcomeName = document.getElementById("ec-cld-welcome-name");
    const currentDate = document.getElementById("ec-cld-current-date");
    const courseList = document.getElementById("ec-cld-course-list");
    const courseEmpty = document.getElementById("ec-cld-course-empty");

    //--- Read Browser Storage ---
    function readStorage(storage, key) {
        try {
            return storage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    //--- Load Registered Profile ---
    function readProfile() {
        const savedProfile = readStorage(localStorage, "ec-user-profile");

        if (!savedProfile) {
            return null;
        }

        try {
            return JSON.parse(savedProfile);
        } catch (error) {
            console.warn("The saved learner profile could not be read.");
            return null;
        }
    }

    const profile = readProfile();
    const sessionEmail = readStorage(sessionStorage, "ec-user-email");
    const rememberedEmail = readStorage(localStorage, "ec-lgn-remembered-email");

    const loginEmail = (
        sessionEmail ||
        (profile && profile.email) ||
        rememberedEmail ||
        ""
    ).trim();

    //--- Find Learner Name ---
    function getLearnerName() {
        if (profile && profile.name) {
            return String(profile.name).trim();
        }

        if (loginEmail) {
            const emailName = loginEmail.split("@")[0]
                .replace(/[._-]+/g, " ")
                .trim();

            if (emailName) {
                return emailName
                    .split(/\s+/)
                    .map(function (word) {
                        return word.charAt(0).toUpperCase() +
                            word.slice(1);
                    })
                    .join(" ");
            }
        }

        return "Learner";
    }

    //--- Personalize Welcome ---
    if (welcomeName) {
        welcomeName.textContent = getLearnerName();
    }

    //--- Display Current Date ---
    if (currentDate) {
        currentDate.textContent = new Intl.DateTimeFormat("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric"
        }).format(new Date());
    }

    //--- Demo Learning Data ---
    // Replace this array with backend data when available.
    const courses = [
        {
            id: 1,
            title: "Complete Web Development",
            category: "Web Development",
            image: "assets/images/web-development.webp",
            progress: 72,
            lessonsCompleted: 18,
            totalLessons: 25,
            duration: "8 hours",
            action: "Continue learning"
        },
        {
            id: 2,
            title: "UI/UX Design Fundamentals",
            category: "Creative Design",
            image: "assets/images/ui-ux-design.webp",
            progress: 38,
            lessonsCompleted: 8,
            totalLessons: 21,
            duration: "6 hours",
            action: "Continue learning"
        },
        {
            id: 3,
            title: "Productivity Mastery",
            category: "Personal Growth",
            image: "assets/images/study-smarter.webp",
            progress: 100,
            lessonsCompleted: 12,
            totalLessons: 12,
            duration: "4 hours",
            action: "Review course"
        }
    ];

    //--- Demo Learning Activity ---
    const weeklyHours = 3;
    const weeklyTarget = 5;
    const totalLearningHours = 12;

    //--- Render Course Cards ---
    function renderCourses() {
        if (!courseList || !courseEmpty) {
            return;
        }

        const activeCourses = courses.filter(function (course) {
            return course.progress > 0 && course.progress < 100;
        });

        courseList.replaceChildren();

        if (activeCourses.length === 0) {
            courseEmpty.hidden = false;
            courseList.hidden = true;
            return;
        }

        courseEmpty.hidden = true;
        courseList.hidden = false;

        activeCourses.forEach(function (course) {
            const article = document.createElement("article");
            article.className = "ec-cld-course-item";

            const imageWrapper = document.createElement("div");
            imageWrapper.className = "ec-cld-course-image";

            const image = document.createElement("img");
            image.src = course.image;
            image.alt = course.title;
            image.loading = "lazy";

            image.addEventListener("error", function () {
                imageWrapper.style.background = "var(--pd-primary-light)";
                image.style.display = "none";
            });

            imageWrapper.appendChild(image);

            const copy = document.createElement("div");
            copy.className = "ec-cld-course-copy";

            const category = document.createElement("span");
            category.className = "ec-cld-course-category";
            category.textContent = course.category;

            const title = document.createElement("h3");
            title.textContent = course.title;

            const meta = document.createElement("div");
            meta.className = "ec-cld-course-meta";

            const lessonMeta = document.createElement("span");
            lessonMeta.innerHTML = '<i class="bi bi-journal-text"></i>';
            lessonMeta.appendChild(document.createTextNode(
                " " + course.lessonsCompleted + "/" +
                course.totalLessons + " lessons"
            ));

            const durationMeta = document.createElement("span");
            durationMeta.innerHTML = '<i class="bi bi-clock"></i>';
            durationMeta.appendChild(document.createTextNode(
                " " + course.duration
            ));

            meta.append(lessonMeta, durationMeta);

            const progressRow = document.createElement("div");
            progressRow.className = "ec-cld-course-progress-row";

            const progressLabel = document.createElement("span");
            progressLabel.textContent = "Course progress";

            const progressValue = document.createElement("strong");
            progressValue.textContent = course.progress + "%";

            progressRow.append(progressLabel, progressValue);

            const track = document.createElement("div");
            track.className = "ec-cld-course-track";
            track.setAttribute("role", "progressbar");
            track.setAttribute("aria-label", course.title + " progress");
            track.setAttribute("aria-valuemin", "0");
            track.setAttribute("aria-valuemax", "100");
            track.setAttribute("aria-valuenow", String(course.progress));

            const bar = document.createElement("span");
            bar.style.width = course.progress + "%";
            track.appendChild(bar);

            const bottom = document.createElement("div");
            bottom.className = "ec-cld-course-bottom";

            const remaining = document.createElement("small");
            remaining.textContent = (
                course.totalLessons - course.lessonsCompleted
            ) + " lessons remaining";

            const action = document.createElement("a");
            action.className = "ec-cld-course-action";
            action.href = "404.html";
            action.textContent = course.action + " ";

            const arrow = document.createElement("i");
            arrow.className = "bi bi-arrow-up-right";
            action.appendChild(arrow);

            bottom.append(remaining, action);

            copy.append(
                category,
                title,
                meta,
                progressRow,
                track,
                bottom
            );

            article.append(imageWrapper, copy);
            courseList.appendChild(article);
        });
    }

    //--- Update Learning Statistics ---
    function updateStatistics() {
        const enrolled = courses.length;

        const completed = courses.filter(function (course) {
            return course.progress >= 100;
        }).length;

        const active = courses.filter(function (course) {
            return course.progress > 0 && course.progress < 100;
        }).length;

        const enrolledElement = document.getElementById("ec-cld-stat-enrolled");
        const activeElement = document.getElementById("ec-cld-stat-active");
        const completedElement = document.getElementById("ec-cld-stat-completed");
        const hoursElement = document.getElementById("ec-cld-stat-hours");

        if (enrolledElement) enrolledElement.textContent = enrolled;
        if (activeElement) activeElement.textContent = active;
        if (completedElement) completedElement.textContent = completed;
        if (hoursElement) hoursElement.textContent = totalLearningHours;
    }

    //--- Update Weekly Learning Goal ---
    function updateWeeklyGoal() {
        const percentElement = document.getElementById("ec-cld-goal-percent");
        const ring = document.getElementById("ec-cld-goal-ring");
        const completedElement = document.getElementById("ec-cld-goal-completed");
        const targetElement = document.getElementById("ec-cld-goal-target");
        const messageElement = document.getElementById("ec-cld-goal-message");

        const percent = weeklyTarget > 0
            ? Math.min(100, Math.round((weeklyHours / weeklyTarget) * 100))
            : 0;

        const remainingHours = Math.max(0, weeklyTarget - weeklyHours);

        if (percentElement) {
            percentElement.textContent = percent + "%";
        }

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

        if (completedElement) {
            completedElement.textContent = weeklyHours + " hrs";
        }

        if (targetElement) {
            targetElement.textContent = weeklyTarget + " hrs";
        }

        if (messageElement) {
            if (remainingHours === 0) {
                messageElement.textContent =
                    "Fantastic work! You've reached your weekly learning goal.";
            } else {
                messageElement.textContent =
                    "You're building a great habit. " +
                    remainingHours + " more " +
                    (remainingHours === 1 ? "hour" : "hours") +
                    " will reach your weekly goal!";
            }
        }
    }

    //--- Initialize Overview ---
    renderCourses();
    updateStatistics();
    updateWeeklyGoal();

});
//--- End Client Overview ---