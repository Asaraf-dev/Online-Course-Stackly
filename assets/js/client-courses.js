//--- Client Courses ---
document.addEventListener("DOMContentLoaded", function () {

    //--- Page Elements ---
    const grid = document.getElementById("ec-cls-grid");
    const searchInput = document.getElementById("ec-cls-search");
    const clearSearchButton = document.getElementById("ec-cls-clear-search");
    const categorySelect = document.getElementById("ec-cls-category");
    const levelSelect = document.getElementById("ec-cls-level");
    const durationSelect = document.getElementById("ec-cls-duration");
    const sortSelect = document.getElementById("ec-cls-sort");
    const resetButton = document.getElementById("ec-cls-reset");
    const savedFilterButton = document.getElementById("ec-cls-show-saved");
    const resultsCount = document.getElementById("ec-cls-results-count");
    const emptyState = document.getElementById("ec-cls-empty");
    const emptyResetButton = document.getElementById("ec-cls-empty-reset");
    const toast = document.getElementById("ec-cls-toast");
    const toastMessage = document.getElementById("ec-cls-toast-message");

    if (!grid) {
        return;
    }

    //--- Demo Course Catalogue ---
    const courses = [
        {
            id: "web-development",
            title: "Complete Web Development",
            category: "Development",
            level: "Beginner",
            duration: 8,
            lessons: 25,
            image: "assets/images/web-development.webp",
            description: "Learn HTML, CSS, JavaScript, and the fundamentals of building responsive websites.",
            featured: 1
        },
        {
            id: "ui-ux-design",
            title: "UI/UX Design Fundamentals",
            category: "Design",
            level: "Beginner",
            duration: 6,
            lessons: 21,
            image: "assets/images/ui-ux-design.webp",
            description: "Discover user research, wireframes, visual design, and intuitive user experiences.",
            featured: 2
        },
        {
            id: "data-science",
            title: "Data Science Essentials",
            category: "Data",
            level: "Intermediate",
            duration: 10,
            lessons: 30,
            image: "assets/images/ai-tools.webp",
            description: "Explore data analysis, meaningful insights, and practical analytical thinking.",
            featured: 3
        },
        {
            id: "digital-marketing",
            title: "Digital Marketing Strategy",
            category: "Marketing",
            level: "Beginner",
            duration: 4,
            lessons: 16,
            image: "assets/images/digital-marketing.webp",
            description: "Learn digital campaigns, audience targeting, content strategy, and growth basics.",
            featured: 4
        },
        {
            id: "product-strategy",
            title: "Product Strategy & Management",
            category: "Business",
            level: "Advanced",
            duration: 9,
            lessons: 28,
            image: "assets/images/about-story.webp",
            description: "Explore product planning, prioritization, roadmaps, and strategic decisions.",
            featured: 5
        },
        {
            id: "productivity",
            title: "Productivity Mastery",
            category: "Productivity",
            level: "Beginner",
            duration: 3,
            lessons: 12,
            image: "assets/images/study-smarter.webp",
            description: "Build better routines, manage your time, and make space for focused work.",
            featured: 6
        }
    ];

    //--- Storage Keys Per Learner ---
    function getLearnerKey() {
        let email = "";

        try {
            email = (
                sessionStorage.getItem("ec-user-email") ||
                JSON.parse(localStorage.getItem("ec-user-profile") || "{}").email ||
                localStorage.getItem("ec-lgn-remembered-email") ||
                "guest"
            ).trim().toLowerCase();
        } catch (error) {
            email = "guest";
        }

        return email.replace(/[^a-z0-9@._-]/g, "_");
    }

    const learnerKey = getLearnerKey();
    const savedStorageKey = "ec-cls-saved-" + learnerKey;
    const enrolledStorageKey = "ec-cls-enrolled-" + learnerKey;

    //--- Safely Read Stored Lists ---
    function readList(key) {
        try {
            const value = JSON.parse(localStorage.getItem(key) || "[]");

            return Array.isArray(value) ? value : [];
        } catch (error) {
            return [];
        }
    }

    let savedCourses = readList(savedStorageKey);
    let enrolledCourses = readList(enrolledStorageKey);
    let showSavedOnly = false;
    let toastTimer;

    //--- Persist Course Lists ---
    function saveList(key, values) {
        try {
            localStorage.setItem(key, JSON.stringify(values));
            return true;
        } catch (error) {
            showToast("Browser storage is unavailable. Your change was not saved.", true);
            return false;
        }
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

    //--- Course Lookup ---
    function isSaved(courseId) {
        return savedCourses.includes(courseId);
    }

    function isEnrolled(courseId) {
        return enrolledCourses.includes(courseId);
    }

    //--- Build Safe Course Card ---
    function createCourseCard(course) {
        const article = document.createElement("article");
        article.className = "ec-cls-course-card";

        //--- Image ---
        const imageWrap = document.createElement("div");
        imageWrap.className = "ec-cls-course-image";

        const image = document.createElement("img");
        image.src = course.image;
        image.alt = course.title;
        image.loading = "lazy";

        image.addEventListener("error", function () {
            image.style.display = "none";
            imageWrap.style.background = "var(--pd-primary-light)";
        });

        const categoryBadge = document.createElement("span");
        categoryBadge.className = "ec-cls-course-category";
        categoryBadge.textContent = course.category;

        //--- Save / Unsave ---
        const saveButton = document.createElement("button");
        saveButton.type = "button";
        saveButton.className = "ec-cls-save-btn";
        saveButton.classList.toggle("saved", isSaved(course.id));
        saveButton.setAttribute("aria-pressed", String(isSaved(course.id)));
        saveButton.setAttribute(
            "aria-label",
            (isSaved(course.id) ? "Remove saved course: " : "Save course: ") +
            course.title
        );
        saveButton.title = isSaved(course.id) ? "Remove from saved courses" : "Save course";

        const saveIcon = document.createElement("i");
        saveIcon.className = isSaved(course.id)
            ? "bi bi-bookmark-heart-fill"
            : "bi bi-bookmark-heart";

        saveButton.appendChild(saveIcon);

        saveButton.addEventListener("click", function () {
            const wasSaved = isSaved(course.id);

            if (wasSaved) {
                savedCourses = savedCourses.filter(function (id) {
                    return id !== course.id;
                });
            } else {
                savedCourses.push(course.id);
            }

            if (!saveList(savedStorageKey, savedCourses)) {
                savedCourses = readList(savedStorageKey);
                return;
            }

            renderCourses();

            showToast(
                wasSaved
                    ? "Course removed from your saved list."
                    : "Course added to your saved list."
            );
        });

        imageWrap.append(image, categoryBadge, saveButton);

        //--- Course Information ---
        const body = document.createElement("div");
        body.className = "ec-cls-course-body";

        const meta = document.createElement("div");
        meta.className = "ec-cls-course-meta";

        const duration = document.createElement("span");
        duration.innerHTML = '<i class="bi bi-clock"></i> ';
        duration.appendChild(document.createTextNode(course.duration + " hours"));

        const lessons = document.createElement("span");
        lessons.innerHTML = '<i class="bi bi-journal-text"></i> ';
        lessons.appendChild(document.createTextNode(course.lessons + " lessons"));

        meta.append(duration, lessons);

        const title = document.createElement("h3");
        title.className = "ec-cls-course-title";
        title.textContent = course.title;

        const description = document.createElement("p");
        description.className = "ec-cls-course-description";
        description.textContent = course.description;

        const footer = document.createElement("div");
        footer.className = "ec-cls-course-footer";

        const level = document.createElement("span");
        level.className = "ec-cls-course-level";

        const levelIcon = document.createElement("i");
        levelIcon.className = "bi bi-bar-chart";

        level.append(levelIcon, document.createTextNode(" " + course.level));

        const enrollButton = document.createElement("button");
        enrollButton.type = "button";
        enrollButton.className = "ec-cls-enroll-btn";
        enrollButton.classList.toggle("enrolled", isEnrolled(course.id));

        const enrollIcon = document.createElement("i");
        enrollIcon.className = isEnrolled(course.id)
            ? "bi bi-check-circle"
            : "bi bi-plus-circle";

        enrollButton.appendChild(enrollIcon);
        enrollButton.appendChild(document.createTextNode(
            isEnrolled(course.id) ? " Enrolled" : " Enroll now"
        ));

        enrollButton.setAttribute("aria-pressed", String(isEnrolled(course.id)));

        enrollButton.addEventListener("click", function () {
            if (isEnrolled(course.id)) {
                window.location.href = "404.html";
                return;
            }

            enrolledCourses.push(course.id);

            if (!saveList(enrolledStorageKey, enrolledCourses)) {
                enrolledCourses = readList(enrolledStorageKey);
                return;
            }

            renderCourses();
            updateSummary();

            showToast("You're enrolled in " + course.title + "!");
        });

        footer.append(level, enrollButton);
        body.append(meta, title, description, footer);
        article.append(imageWrap, body);

        return article;
    }

    //--- Filter and Sort Courses ---
    function getFilteredCourses() {
        const query = searchInput.value.trim().toLowerCase();
        const category = categorySelect.value;
        const level = levelSelect.value;
        const duration = durationSelect.value;
        const sort = sortSelect.value;

        let filtered = courses.filter(function (course) {
            const searchableText = [
                course.title,
                course.category,
                course.level,
                course.description
            ].join(" ").toLowerCase();

            const matchesSearch = !query || searchableText.includes(query);
            const matchesCategory = category === "all" || course.category === category;
            const matchesLevel = level === "all" || course.level === level;

            let matchesDuration = true;

            if (duration === "short") {
                matchesDuration = course.duration < 4;
            } else if (duration === "medium") {
                matchesDuration = course.duration >= 4 && course.duration <= 8;
            } else if (duration === "long") {
                matchesDuration = course.duration > 8;
            }

            const matchesSaved = !showSavedOnly || isSaved(course.id);

            return matchesSearch &&
                matchesCategory &&
                matchesLevel &&
                matchesDuration &&
                matchesSaved;
        });

        if (sort === "title-asc") {
            filtered.sort(function (a, b) {
                return a.title.localeCompare(b.title);
            });
        } else if (sort === "duration-asc") {
            filtered.sort(function (a, b) {
                return a.duration - b.duration;
            });
        } else if (sort === "duration-desc") {
            filtered.sort(function (a, b) {
                return b.duration - a.duration;
            });
        } else {
            filtered.sort(function (a, b) {
                return a.featured - b.featured;
            });
        }

        return filtered;
    }

    //--- Render Course Library ---
    function renderCourses() {
        const filteredCourses = getFilteredCourses();

        grid.replaceChildren();

        filteredCourses.forEach(function (course) {
            grid.appendChild(createCourseCard(course));
        });

        const isEmpty = filteredCourses.length === 0;

        emptyState.hidden = !isEmpty;
        grid.hidden = isEmpty;

        if (resultsCount) {
            resultsCount.textContent =
                "Showing " + filteredCourses.length +
                (filteredCourses.length === 1 ? " course" : " courses");
        }

        if (clearSearchButton) {
            clearSearchButton.hidden = searchInput.value.length === 0;
        }

        updateSummary();
        updateCategoryChips();
    }

    //--- Update Summary Counts ---
    function updateSummary() {
        document.getElementById("ec-cls-total-count").textContent = courses.length;
        document.getElementById("ec-cls-enrolled-count").textContent = enrolledCourses.length;
        document.getElementById("ec-cls-saved-count").textContent = savedCourses.length;
    }

    //--- Synchronize Category Chips ---
    function updateCategoryChips() {
        document.querySelectorAll("[data-cls-category]").forEach(function (chip) {
            const active = chip.dataset.clsCategory === categorySelect.value;

            chip.classList.toggle("active", active);
            chip.setAttribute("aria-pressed", String(active));
        });
    }

    //--- Search ---
    searchInput.addEventListener("input", renderCourses);

    //--- Filters ---
    [categorySelect, levelSelect, durationSelect, sortSelect].forEach(function (control) {
        control.addEventListener("change", renderCourses);
    });

    //--- Clear Search ---
    clearSearchButton.addEventListener("click", function () {
        searchInput.value = "";
        searchInput.focus();
        renderCourses();
    });

    //--- Category Shortcuts ---
    document.querySelectorAll("[data-cls-category]").forEach(function (chip) {
        chip.addEventListener("click", function () {
            categorySelect.value = chip.dataset.clsCategory;
            renderCourses();
        });
    });

    //--- Saved Courses Filter ---
    savedFilterButton.addEventListener("click", function () {
        showSavedOnly = !showSavedOnly;

        savedFilterButton.classList.toggle("active", showSavedOnly);
        savedFilterButton.setAttribute("aria-pressed", String(showSavedOnly));

        renderCourses();
    });

    //--- Reset Filters ---
    function resetFilters() {
        searchInput.value = "";
        categorySelect.value = "all";
        levelSelect.value = "all";
        durationSelect.value = "all";
        sortSelect.value = "featured";
        showSavedOnly = false;

        savedFilterButton.classList.remove("active");
        savedFilterButton.setAttribute("aria-pressed", "false");

        renderCourses();
    }

    resetButton.addEventListener("click", resetFilters);
    emptyResetButton.addEventListener("click", resetFilters);

    //--- Initial Render ---
    renderCourses();

});
//--- End Client Courses ---