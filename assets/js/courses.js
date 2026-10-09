/*--- All Courses / Course Library Section Start ---*/
document.addEventListener("DOMContentLoaded", function () {

    const courseGrid = document.querySelector("#ec-crs-course-grid");

    if (!courseGrid) {
        return;
    }

    const searchInput = document.querySelector("#ec-crs-search");
    const searchButton = document.querySelector("#ec-crs-search-button");

    const categoryFilter = document.querySelector("#ec-crs-category");
    const levelFilter = document.querySelector("#ec-crs-level");
    const durationFilter = document.querySelector("#ec-crs-duration");
    const sortFilter = document.querySelector("#ec-crs-sort");

    const clearButton = document.querySelector("#ec-crs-clear");
    const emptyClearButton = document.querySelector("#ec-crs-empty-clear");

    const courseCount = document.querySelector("#ec-crs-course-count");
    const visibleCount = document.querySelector("#ec-crs-visible-count");
    const activeFilter = document.querySelector("#ec-crs-active-filter");
    const emptyState = document.querySelector("#ec-crs-empty");

    const courses = Array.from(
        courseGrid.querySelectorAll(".ec-crs-library-card")
    );

    let currentSearch = "";


    //--- Search ---
    const applyFilters = function () {

        const searchValue = currentSearch.toLowerCase().trim();
        const categoryValue = categoryFilter.value;
        const levelValue = levelFilter.value;
        const durationValue = durationFilter.value;
        const sortValue = sortFilter.value;

        let visibleCourses = [];

        courses.forEach(function (course) {

            const title = course.dataset.title.toLowerCase();
            const category = course.dataset.category;
            const level = course.dataset.level;
            const duration = course.dataset.duration;
            const hours = Number(course.dataset.hours);

            const courseText = course.textContent.toLowerCase();

            const matchesSearch =
                !searchValue ||
                title.includes(searchValue) ||
                courseText.includes(searchValue);

            const matchesCategory =
                categoryValue === "all" ||
                category === categoryValue;

            const matchesLevel =
                levelValue === "all" ||
                level === levelValue;

            const matchesDuration =
                durationValue === "all" ||
                duration === durationValue ||
                (
                    durationValue === "short" &&
                    hours < 5
                ) ||
                (
                    durationValue === "medium" &&
                    hours >= 5 &&
                    hours <= 15
                ) ||
                (
                    durationValue === "long" &&
                    hours > 15
                );

            const isVisible =
                matchesSearch &&
                matchesCategory &&
                matchesLevel &&
                matchesDuration;

            if (isVisible) {

                course.classList.remove("is-hidden");
                course.classList.remove("is-filtered");

                visibleCourses.push(course);

            } else {

                course.classList.add("is-filtered");

                window.setTimeout(function () {
                    course.classList.add("is-hidden");
                }, 180);

            }

        });


        //--- Sort ---
        visibleCourses.sort(function (firstCourse, secondCourse) {

            if (sortValue === "popular") {

                return Number(secondCourse.dataset.students) -
                    Number(firstCourse.dataset.students);

            }

            if (sortValue === "newest") {

                return Number(secondCourse.dataset.date) -
                    Number(firstCourse.dataset.date);

            }

            if (sortValue === "rating") {

                return Number(secondCourse.dataset.rating) -
                    Number(firstCourse.dataset.rating);

            }

            if (sortValue === "price-low") {

                return Number(firstCourse.dataset.price) -
                    Number(secondCourse.dataset.price);

            }

            if (sortValue === "price-high") {

                return Number(secondCourse.dataset.price) -
                    Number(firstCourse.dataset.price);

            }

            if (sortValue === "title") {

                return firstCourse.dataset.title.localeCompare(
                    secondCourse.dataset.title
                );

            }

            return 0;

        });


        visibleCourses.forEach(function (course) {
            courseGrid.appendChild(course);
        });


        //--- Update Count ---
        const resultCount = visibleCourses.length;

        courseCount.textContent = courses.length;
        visibleCount.textContent = resultCount;


        //--- Empty State ---
        if (resultCount === 0) {

            emptyState.hidden = false;

        } else {

            emptyState.hidden = true;

        }


        //--- Update Active Filter ---
        updateActiveFilter();

    };


    //--- Search Button ---
    searchButton.addEventListener("click", function () {

        currentSearch = searchInput.value;

        applyFilters();

    });


    //--- Search On Enter ---
    searchInput.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            currentSearch = searchInput.value;

            applyFilters();

        }

    });


    //--- Live Search ---
    searchInput.addEventListener("input", function () {

        currentSearch = searchInput.value;

        applyFilters();

    });


    //--- Category ---
    categoryFilter.addEventListener("change", function () {

        applyFilters();

    });


    //--- Level ---
    levelFilter.addEventListener("change", function () {

        applyFilters();

    });


    //--- Duration ---
    durationFilter.addEventListener("change", function () {

        applyFilters();

    });


    //--- Sort ---
    sortFilter.addEventListener("change", function () {

        applyFilters();

    });


    //--- Clear Filters ---
    const clearFilters = function () {

        searchInput.value = "";

        currentSearch = "";

        categoryFilter.value = "all";
        levelFilter.value = "all";
        durationFilter.value = "all";
        sortFilter.value = "popular";

        courses.forEach(function (course) {

            course.classList.remove("is-filtered");
            course.classList.remove("is-hidden");

        });

        applyFilters();

    };


    clearButton.addEventListener("click", function () {

        clearFilters();

    });


    emptyClearButton.addEventListener("click", function () {

        clearFilters();

    });


    //--- Active Filter ---
    const updateActiveFilter = function () {

        const filters = [];

        if (currentSearch.trim()) {

            filters.push(
                `"${currentSearch.trim()}"`
            );

        }

        if (categoryFilter.value !== "all") {

            filters.push(
                categoryFilter.options[
                    categoryFilter.selectedIndex
                ].text
            );

        }

        if (levelFilter.value !== "all") {

            filters.push(
                levelFilter.options[
                    levelFilter.selectedIndex
                ].text
            );

        }

        if (durationFilter.value !== "all") {

            filters.push(
                durationFilter.options[
                    durationFilter.selectedIndex
                ].text
            );

        }

        if (filters.length === 0) {

            activeFilter.textContent = "All courses";

        } else {

            activeFilter.textContent = filters.join(" · ");

        }

    };


    //--- Wishlist ---
    const wishlistButtons = document.querySelectorAll(
        ".ec-crs-library-wishlist"
    );

    wishlistButtons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            event.preventDefault();
            event.stopPropagation();

            const isActive =
                button.getAttribute("aria-pressed") === "true";

            button.setAttribute(
                "aria-pressed",
                String(!isActive)
            );

            button.classList.toggle(
                "active",
                !isActive
            );

            const icon = button.querySelector("i");

            if (!icon) {
                return;
            }

            if (!isActive) {

                icon.classList.remove("bi-heart");
                icon.classList.add("bi-heart-fill");

            } else {

                icon.classList.remove("bi-heart-fill");
                icon.classList.add("bi-heart");

            }

        });

    });


    //--- Initial State ---
    courseCount.textContent = courses.length;
    visibleCount.textContent = courses.length;

    applyFilters();

});

/*--- All Courses / Course Library Section End ---*/

/*--- Learning Paths Section Start ---*/
document.addEventListener("DOMContentLoaded", function () {

    const pathsSection = document.querySelector("#ec-crs-paths");

    if (!pathsSection) {
        return;
    }

    const pathTabs = pathsSection.querySelectorAll(
        ".ec-crs-paths-tab"
    );

    const pathNumber = document.querySelector(
        "#ec-crs-path-number"
    );

    const pathLabel = document.querySelector(
        "#ec-crs-path-label"
    );

    const pathTitle = document.querySelector(
        "#ec-crs-path-title"
    );

    const pathDescription = document.querySelector(
        "#ec-crs-path-description"
    );

    const pathCourses = document.querySelector(
        "#ec-crs-path-courses"
    );

    const pathHours = document.querySelector(
        "#ec-crs-path-hours"
    );

    const pathLevel = document.querySelector(
        "#ec-crs-path-level"
    );

    const pathButton = document.querySelector(
        "#ec-crs-path-button"
    );

    const pathProgress = document.querySelector(
        "#ec-crs-path-progress"
    );

    const steps = pathsSection.querySelectorAll(
        ".ec-crs-paths-step"
    );


    const pathData = {

        developer: {
            number: "01",
            label: "Career path",
            title: "Become a Web Developer",
            description:
                "Learn the foundations of modern web development, build real projects, and develop the confidence to create complete digital experiences.",
            courses: "5",
            hours: "42",
            level: "Beginner",
            button: "Explore path",
            url: "404.html",
            progress: "25%",
            steps: [
                {
                    label: "Start",
                    title: "Web Foundations",
                    text: "Understand HTML, CSS and the fundamentals behind the modern web."
                },
                {
                    label: "Build",
                    title: "JavaScript Essentials",
                    text: "Add interaction, logic and dynamic behaviour to your projects."
                },
                {
                    label: "Practice",
                    title: "Frontend Projects",
                    text: "Turn what you know into responsive, portfolio-ready experiences."
                },
                {
                    label: "Achieve",
                    title: "Full-Stack Development",
                    text: "Connect frontend and backend skills to build complete applications."
                }
            ]
        },

        designer: {
            number: "02",
            label: "Career path",
            title: "Become a UI/UX Designer",
            description:
                "Learn how to research users, structure experiences, design interfaces, and turn ideas into intuitive digital products.",
            courses: "4",
            hours: "31",
            level: "Beginner",
            button: "Explore path",
            url: "404.html",
            progress: "25%",
            steps: [
                {
                    label: "Start",
                    title: "Design Foundations",
                    text: "Understand visual hierarchy, typography, colour and layout."
                },
                {
                    label: "Build",
                    title: "UX Research",
                    text: "Learn how to understand users and uncover meaningful product needs."
                },
                {
                    label: "Practice",
                    title: "Interface Design",
                    text: "Create polished interfaces and responsive design systems."
                },
                {
                    label: "Achieve",
                    title: "Portfolio Projects",
                    text: "Turn your design process into strong, portfolio-ready case studies."
                }
            ]
        },

        data: {
            number: "03",
            label: "Career path",
            title: "Become a Data Analyst",
            description:
                "Build the analytical mindset and technical skills needed to transform raw information into clear, useful decisions.",
            courses: "5",
            hours: "38",
            level: "Intermediate",
            button: "Explore path",
            url: "404.html",
            progress: "25%",
            steps: [
                {
                    label: "Start",
                    title: "Data Foundations",
                    text: "Learn the fundamentals of data, spreadsheets and analytical thinking."
                },
                {
                    label: "Build",
                    title: "Python for Data",
                    text: "Use Python to clean, explore and transform real datasets."
                },
                {
                    label: "Practice",
                    title: "Data Visualisation",
                    text: "Create clear dashboards and visual stories from complex information."
                },
                {
                    label: "Achieve",
                    title: "Real-World Analysis",
                    text: "Solve practical business problems with complete analytical projects."
                }
            ]
        },

        marketing: {
            number: "04",
            label: "Career path",
            title: "Become a Digital Marketer",
            description:
                "Learn how to build campaigns, understand audiences, create content, and turn digital attention into meaningful growth.",
            courses: "4",
            hours: "27",
            level: "Beginner",
            button: "Explore path",
            url: "404.html",
            progress: "25%",
            steps: [
                {
                    label: "Start",
                    title: "Marketing Foundations",
                    text: "Understand audiences, positioning and the fundamentals of digital marketing."
                },
                {
                    label: "Build",
                    title: "Content Strategy",
                    text: "Create content systems designed to attract and engage the right audience."
                },
                {
                    label: "Practice",
                    title: "Campaign Building",
                    text: "Plan and launch practical campaigns across modern digital channels."
                },
                {
                    label: "Achieve",
                    title: "Growth Strategy",
                    text: "Use data and experimentation to improve campaigns and drive growth."
                }
            ]
        }

    };


    //--- Update Path ---
    const updatePath = function (pathName) {

        const path = pathData[pathName];

        if (!path) {
            return;
        }


        pathTabs.forEach(function (tab) {

            const isActive =
                tab.dataset.path === pathName;

            tab.classList.toggle(
                "active",
                isActive
            );

            tab.setAttribute(
                "aria-selected",
                String(isActive)
            );

        });


        pathNumber.textContent = path.number;
        pathLabel.textContent = path.label;

        pathTitle.textContent = path.title;
        pathDescription.textContent = path.description;

        pathCourses.textContent = path.courses;
        pathHours.textContent = path.hours;
        pathLevel.textContent = path.level;

        pathButton.textContent = "";

        const buttonText = document.createElement("span");
        buttonText.textContent = path.button;

        const buttonIcon = document.createElement("i");
        buttonIcon.className = "bi bi-arrow-up-right";

        pathButton.appendChild(buttonText);
        pathButton.appendChild(buttonIcon);

        pathButton.href = path.url;


        pathProgress.style.height = path.progress;


        //--- Update Steps ---
        steps.forEach(function (step, index) {

            const stepData = path.steps[index];

            if (!stepData) {
                return;
            }

            const label = step.querySelector(
                ".ec-crs-paths-step-label"
            );

            const title = step.querySelector("h4");

            const text = step.querySelector("p");

            if (label) {
                label.textContent = stepData.label;
            }

            if (title) {
                title.textContent = stepData.title;
            }

            if (text) {
                text.textContent = stepData.text;
            }

            step.classList.toggle(
                "active",
                index === 0
            );

        });


        //--- Content Animation ---
        pathTitle.classList.remove(
            "ec-crs-paths-content-change"
        );

        void pathTitle.offsetWidth;

        pathTitle.classList.add(
            "ec-crs-paths-content-change"
        );

    };


    //--- Path Tabs ---
    pathTabs.forEach(function (tab) {

        tab.addEventListener("click", function () {

            const pathName = tab.dataset.path;

            updatePath(pathName);

        });

    });


    //--- Initial Path ---
    updatePath("developer");

});
/*--- Learning Paths Section End ---*/
