
//--- Admin Courses ---
document.addEventListener("DOMContentLoaded", function () {
    const elements = {
        grid: document.getElementById("ec-adm-crs-grid"),
        search: document.getElementById("ec-adm-crs-search"),
        category: document.getElementById("ec-adm-crs-category"),
        status: document.getElementById("ec-adm-crs-status"),
        sort: document.getElementById("ec-adm-crs-sort"),
        count: document.getElementById("ec-adm-crs-result-count"),
        empty: document.getElementById("ec-adm-crs-empty"),
        modal: document.getElementById("ec-adm-crs-modal"),
        deleteModal: document.getElementById("ec-adm-crs-delete-modal"),
        form: document.getElementById("ec-adm-crs-form"),
        formError: document.getElementById("ec-adm-crs-form-error"),
        toast: document.getElementById("ec-adm-crs-toast"),
        toastMessage: document.getElementById("ec-adm-crs-toast-message")
    };

    if (!elements.grid || !elements.form) {
        return;
    }

    const storageKey = "ec-adm-crs-courses";
    let courses = [];
    let pendingDeleteId = null;
    let toastTimer = null;
    let previousFocus = null;

    //--- Demo Course Data ---
    const defaultCourses = [
        {
            id: "crs-1001",
            title: "Complete Web Development",
            instructor: "Arun Kumar",
            category: "Development",
            level: "Beginner",
            duration: "12h 30m",
            price: 1499,
            enrollments: 842,
            rating: 4.9,
            image: "assets/images/web-development.webp",
            description: "Learn HTML, CSS, JavaScript, and modern techniques to build responsive websites.",
            published: true,
            createdAt: "2026-10-08T09:00:00.000Z"
        },
        {
            id: "crs-1002",
            title: "UI / UX Design Essentials",
            instructor: "Priya Sharma",
            category: "Design",
            level: "Beginner",
            duration: "8h 15m",
            price: 999,
            enrollments: 624,
            rating: 4.8,
            image: "assets/images/ui-ux-design.webp",
            description: "Explore user research, wireframes, prototyping, and practical interface design.",
            published: true,
            createdAt: "2026-10-06T09:00:00.000Z"
        },
        {
            id: "crs-1003",
            title: "Data Science Fundamentals",
            instructor: "Rahul Verma",
            category: "Data Science",
            level: "Intermediate",
            duration: "10h 40m",
            price: 1799,
            enrollments: 486,
            rating: 4.7,
            image: "assets/images/ai-tools.webp",
            description: "Discover data analysis, visualization, and foundational machine learning concepts.",
            published: true,
            createdAt: "2026-10-04T09:00:00.000Z"
        },
        {
            id: "crs-1004",
            title: "Digital Marketing Masterclass",
            instructor: "Meena Srinivasan",
            category: "Marketing",
            level: "Intermediate",
            duration: "7h 20m",
            price: 899,
            enrollments: 395,
            rating: 4.6,
            image: "assets/images/digital-marketing.webp",
            description: "Learn SEO, content strategy, social media, and campaign optimization.",
            published: true,
            createdAt: "2026-10-02T09:00:00.000Z"
        },
        {
            id: "crs-1005",
            title: "Product Strategy and Planning",
            instructor: "Kavin Raj",
            category: "Productivity",
            level: "Advanced",
            duration: "6h 45m",
            price: 1299,
            enrollments: 0,
            rating: 0,
            image: "assets/images/about-story.webp",
            description: "Develop product roadmaps, prioritize features, and turn ideas into plans.",
            published: false,
            createdAt: "2026-09-28T09:00:00.000Z"
        },
        {
            id: "crs-1006",
            title: "Productivity and Time Management",
            instructor: "Divya Mohan",
            category: "Productivity",
            level: "All levels",
            duration: "4h 10m",
            price: 599,
            enrollments: 0,
            rating: 0,
            image: "assets/images/study-smarter.webp",
            description: "Build sustainable routines, prioritize your work, and manage your time.",
            published: false,
            createdAt: "2026-09-24T09:00:00.000Z"
        }
    ];

    //--- Safe Storage ---
    function saveCourses() {
        try {
            localStorage.setItem(storageKey, JSON.stringify(courses));
            return true;
        } catch (error) {
            showToast("Could not save. Check browser storage.", true);
            return false;
        }
    }

    function loadCourses() {
        try {
            const saved = localStorage.getItem(storageKey);

            if (saved === null) {
                courses = defaultCourses.map(function (course) {
                    return { ...course };
                });
                saveCourses();
                return;
            }

            const parsed = JSON.parse(saved);

            courses = Array.isArray(parsed)
                ? parsed.filter(function (course) {
                    return course &&
                        typeof course.id === "string" &&
                        typeof course.title === "string";
                })
                : defaultCourses.map(function (course) {
                    return { ...course };
                });
        } catch (error) {
            courses = defaultCourses.map(function (course) {
                return { ...course };
            });
        }
    }

    //--- HTML Escaping ---
    function escapeHTML(value) {
        return String(value ?? "").replace(/[&<>"']/g, function (character) {
            const entities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return entities[character];
        });
    }

    //--- Formatting ---
    function formatNumber(value) {
        return Number(value || 0).toLocaleString("en-IN");
    }

    function formatPrice(value) {
        return "₹" + Number(value || 0).toLocaleString("en-IN");
    }

    function getCategoryIcon(category) {
        const icons = {
            "Development": "bi-code-slash",
            "Design": "bi-palette",
            "Data Science": "bi-bar-chart",
            "Marketing": "bi-megaphone",
            "Productivity": "bi-lightning-charge"
        };

        return icons[category] || "bi-collection-play";
    }

    //--- Toast Notifications ---
    function showToast(message, isError) {
        if (!elements.toast || !elements.toastMessage) {
            return;
        }

        elements.toastMessage.textContent = message;

        const icon = elements.toast.querySelector("i");

        if (icon) {
            icon.className = isError
                ? "bi bi-exclamation-circle"
                : "bi bi-check-circle";

            icon.style.color = isError ? "#ef4444" : "";
        }

        elements.toast.classList.add("ec-adm-crs-toast-visible");

        window.clearTimeout(toastTimer);

        toastTimer = window.setTimeout(function () {
            elements.toast.classList.remove("ec-adm-crs-toast-visible");
        }, 2800);
    }

    //--- Statistics ---
    function updateStats() {
        const published = courses.filter(function (course) {
            return course.published;
        }).length;

        const drafts = courses.length - published;

        const totalEnrollments = courses.reduce(function (total, course) {
            return total + Math.max(0, Number(course.enrollments) || 0);
        }, 0);

        document.getElementById("ec-adm-crs-stat-total").textContent =
            formatNumber(courses.length);

        document.getElementById("ec-adm-crs-stat-published").textContent =
            formatNumber(published);

        document.getElementById("ec-adm-crs-stat-drafts").textContent =
            formatNumber(drafts);

        document.getElementById("ec-adm-crs-stat-enrollments").textContent =
            formatNumber(totalEnrollments);
    }

    //--- Course Card ---
    function createCourseCard(course) {
        const statusClass = course.published
            ? "ec-adm-crs-status-published"
            : "ec-adm-crs-status-draft";

        const statusText = course.published ? "Published" : "Draft";
        const toggleText = course.published ? "Unpublish" : "Publish";
        const safeImage = typeof course.image === "string"
            ? course.image.trim()
            : "";

        return `
            <article class="ec-adm-crs-card" data-course-id="${escapeHTML(course.id)}">
                <div class="ec-adm-crs-card-image">
                    ${
                        safeImage
                            ? `<img src="${escapeHTML(safeImage)}" alt="${escapeHTML(course.title)}" loading="lazy">`
                            : `<div class="ec-adm-crs-card-image-fallback"><i class="bi ${getCategoryIcon(course.category)}"></i></div>`
                    }
                    <span class="ec-adm-crs-status ${statusClass}">${statusText}</span>
                </div>

                <div class="ec-adm-crs-card-body">
                    <div class="ec-adm-crs-card-meta">
                        <span class="ec-adm-crs-category">${escapeHTML(course.category)}</span>
                        <span class="ec-adm-crs-level">${escapeHTML(course.level)}</span>
                    </div>

                    <h3>${escapeHTML(course.title)}</h3>
                    <p class="ec-adm-crs-description">${escapeHTML(course.description)}</p>

                    <div class="ec-adm-crs-instructor">
                        <i class="bi bi-person-circle"></i>
                        <span>${escapeHTML(course.instructor)}</span>
                    </div>

                    <div class="ec-adm-crs-card-details">
                        <span><i class="bi bi-people"></i> ${formatNumber(course.enrollments)} students</span>
                        <strong>${formatPrice(course.price)}</strong>
                    </div>

                    <div class="ec-adm-crs-card-actions">
                        <button type="button" class="ec-adm-crs-action-btn ec-adm-crs-action-edit" data-action="edit" data-id="${escapeHTML(course.id)}">
                            <i class="bi bi-pencil-square"></i> Edit
                        </button>
                        <button type="button" class="ec-adm-crs-action-btn ec-adm-crs-action-toggle" data-action="toggle" data-id="${escapeHTML(course.id)}">
                            <i class="bi ${course.published ? "bi-eye-slash" : "bi-send"}"></i> ${toggleText}
                        </button>
                        <button type="button" class="ec-adm-crs-action-btn ec-adm-crs-action-delete" data-action="delete" data-id="${escapeHTML(course.id)}" aria-label="Delete ${escapeHTML(course.title)}" title="Delete course">
                            <i class="bi bi-trash3"></i>
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    //--- Search, Filter, Sort, Render ---
    function renderCourses() {
        const searchTerm = elements.search.value.trim().toLowerCase();
        const category = elements.category.value;
        const status = elements.status.value;
        const sort = elements.sort.value;

        let filteredCourses = courses.filter(function (course) {
            const searchable = [
                course.title,
                course.instructor,
                course.category,
                course.description
            ].join(" ").toLowerCase();

            const matchesSearch = searchable.includes(searchTerm);
            const matchesCategory = category === "all" || course.category === category;
            const matchesStatus = status === "all" ||
                (status === "published" && course.published) ||
                (status === "draft" && !course.published);

            return matchesSearch && matchesCategory && matchesStatus;
        });

        filteredCourses.sort(function (first, second) {
            if (sort === "title") {
                return first.title.localeCompare(second.title);
            }

            if (sort === "enrollments") {
                return (Number(second.enrollments) || 0) -
                    (Number(first.enrollments) || 0);
            }

            const firstDate = Date.parse(first.createdAt) || 0;
            const secondDate = Date.parse(second.createdAt) || 0;

            return sort === "oldest"
                ? firstDate - secondDate
                : secondDate - firstDate;
        });

        elements.grid.innerHTML = filteredCourses.map(createCourseCard).join("");

        elements.empty.hidden = filteredCourses.length > 0;
        elements.grid.hidden = filteredCourses.length === 0;

        elements.count.textContent =
            filteredCourses.length + (filteredCourses.length === 1 ? " course" : " courses");

        updateStats();

        //--- Image Fallback ---
        elements.grid.querySelectorAll(".ec-adm-crs-card-image img").forEach(function (image) {
            image.addEventListener("error", function () {
                const fallback = document.createElement("div");
                fallback.className = "ec-adm-crs-card-image-fallback";

                const icon = document.createElement("i");
                icon.className = "bi bi-image";

                fallback.appendChild(icon);
                image.replaceWith(fallback);
            }, { once: true });
        });
    }

    //--- Modal Controls ---
    function openModal(modal) {
        previousFocus = document.activeElement;

        modal.classList.add("ec-adm-crs-modal-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("ec-adm-crs-body-modal-open");

        const firstInput = modal.querySelector(
            "input:not([type='hidden']), select, textarea, button:not([data-crs-close]):not([data-delete-close])"
        );

        if (firstInput) {
            window.setTimeout(function () {
                firstInput.focus();
            }, 30);
        }
    }

    function closeModal(modal) {
        if (!modal.classList.contains("ec-adm-crs-modal-open")) {
            return;
        }

        modal.classList.remove("ec-adm-crs-modal-open");
        modal.setAttribute("aria-hidden", "true");

        if (!document.querySelector(".ec-adm-crs-modal.ec-adm-crs-modal-open")) {
            document.body.classList.remove("ec-adm-crs-body-modal-open");
        }

        if (previousFocus && document.contains(previousFocus)) {
            previousFocus.focus();
        }
    }

    function closeAllModals() {
        closeModal(elements.modal);
        closeModal(elements.deleteModal);
    }

    //--- Form Helpers ---
    function getField(id) {
        return document.getElementById(id);
    }

    function clearFormError() {
        elements.formError.hidden = true;
        elements.formError.textContent = "";
    }

    function showFormError(message) {
        elements.formError.textContent = message;
        elements.formError.hidden = false;
    }

    function resetForm() {
        elements.form.reset();
        getField("ec-adm-crs-id").value = "";
        clearFormError();
    }

    //--- Add Course ---
    function openAddForm() {
        resetForm();

        document.getElementById("ec-adm-crs-modal-title").textContent = "Create a course";
        document.getElementById("ec-adm-crs-save").innerHTML =
            '<i class="bi bi-check2-circle"></i> Save course';

        openModal(elements.modal);
    }

    //--- Edit Course ---
    function openEditForm(id) {
        const course = courses.find(function (item) {
            return item.id === id;
        });

        if (!course) {
            return;
        }

        resetForm();

        getField("ec-adm-crs-id").value = course.id;
        getField("ec-adm-crs-title").value = course.title;
        getField("ec-adm-crs-instructor").value = course.instructor;
        getField("ec-adm-crs-category-input").value = course.category;
        getField("ec-adm-crs-level").value = course.level;
        getField("ec-adm-crs-duration").value = course.duration;
        getField("ec-adm-crs-price").value = course.price;
        getField("ec-adm-crs-image").value = course.image || "";
        getField("ec-adm-crs-description").value = course.description;
        getField("ec-adm-crs-publish").checked = Boolean(course.published);

        document.getElementById("ec-adm-crs-modal-title").textContent = "Edit course";
        document.getElementById("ec-adm-crs-save").innerHTML =
            '<i class="bi bi-check2-circle"></i> Update course';

        openModal(elements.modal);
    }

    //--- Save Course ---
    elements.form.addEventListener("submit", function (event) {
        event.preventDefault();
        clearFormError();

        if (!elements.form.reportValidity()) {
            return;
        }

        const id = getField("ec-adm-crs-id").value;
        const title = getField("ec-adm-crs-title").value.trim();
        const instructor = getField("ec-adm-crs-instructor").value.trim();
        const category = getField("ec-adm-crs-category-input").value;
        const level = getField("ec-adm-crs-level").value;
        const duration = getField("ec-adm-crs-duration").value.trim();
        const price = Number(getField("ec-adm-crs-price").value);
        const image = getField("ec-adm-crs-image").value.trim();
        const description = getField("ec-adm-crs-description").value.trim();
        const published = getField("ec-adm-crs-publish").checked;

        if (!title || !instructor || !category || !level || !duration || !description) {
            showFormError("Please complete all required fields.");
            return;
        }

        if (!Number.isFinite(price) || price < 0 || price > 10000000) {
            showFormError("Enter a valid course price.");
            return;
        }

        //--- Restrict Image Paths ---
        if (image && (
            /^(javascript|data|vbscript):/i.test(image) ||
            /^(https?:)?\/\//i.test(image) ||
            /[\u0000-\u001f]/.test(image)
        )) {
            showFormError("Use a local image path from your project assets.");
            return;
        }

        const existing = courses.find(function (course) {
            return course.id === id;
        });

        const course = {
            id: existing ? existing.id : "crs-" + Date.now() + "-" + Math.random().toString(36).slice(2, 7),
            title: title,
            instructor: instructor,
            category: category,
            level: level,
            duration: duration,
            price: price,
            enrollments: existing ? Math.max(0, Number(existing.enrollments) || 0) : 0,
            rating: existing ? Math.max(0, Number(existing.rating) || 0) : 0,
            image: image,
            description: description,
            published: published,
            createdAt: existing ? existing.createdAt : new Date().toISOString()
        };

        if (existing) {
            courses = courses.map(function (item) {
                return item.id === existing.id ? course : item;
            });
        } else {
            courses.unshift(course);
        }

        if (!saveCourses()) {
            return;
        }

        renderCourses();
        closeModal(elements.modal);
        showToast(existing ? "Course updated successfully." : "Course created successfully.");
    });

    //--- Course Card Actions ---
    elements.grid.addEventListener("click", function (event) {
        const button = event.target.closest("button[data-action]");

        if (!button) {
            return;
        }

        const id = button.dataset.id;
        const action = button.dataset.action;
        const course = courses.find(function (item) {
            return item.id === id;
        });

        if (!course) {
            return;
        }

        if (action === "edit") {
            openEditForm(id);
        }

        if (action === "toggle") {
            const previousValue = course.published;
            course.published = !course.published;

            if (!saveCourses()) {
                course.published = previousValue;
                return;
            }

            renderCourses();
            showToast(course.published ? "Course published." : "Course moved to drafts.");
        }

        if (action === "delete") {
            pendingDeleteId = id;
            openModal(elements.deleteModal);
        }
    });

    //--- Confirm Delete ---
    document.getElementById("ec-adm-crs-confirm-delete").addEventListener("click", function () {
        if (!pendingDeleteId) {
            return;
        }

        const oldCourses = courses;
        courses = courses.filter(function (course) {
            return course.id !== pendingDeleteId;
        });

        if (!saveCourses()) {
            courses = oldCourses;
            return;
        }

        pendingDeleteId = null;
        closeModal(elements.deleteModal);
        renderCourses();
        showToast("Course deleted.");
    });

    //--- Filter Events ---
    elements.search.addEventListener("input", renderCourses);
    elements.category.addEventListener("change", renderCourses);
    elements.status.addEventListener("change", renderCourses);
    elements.sort.addEventListener("change", renderCourses);

    //--- Reset Filters ---
    function resetFilters() {
        elements.search.value = "";
        elements.category.value = "all";
        elements.status.value = "all";
        elements.sort.value = "newest";
        renderCourses();
    }

    document.getElementById("ec-adm-crs-clear").addEventListener("click", resetFilters);
    document.getElementById("ec-adm-crs-empty-reset").addEventListener("click", resetFilters);

    //--- Modal Close Events ---
    document.getElementById("ec-adm-crs-add").addEventListener("click", openAddForm);

    document.querySelectorAll("[data-crs-close]").forEach(function (button) {
        button.addEventListener("click", function () {
            closeModal(elements.modal);
        });
    });

    document.querySelectorAll("[data-delete-close]").forEach(function (button) {
        button.addEventListener("click", function () {
            pendingDeleteId = null;
            closeModal(elements.deleteModal);
        });
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeAllModals();
            pendingDeleteId = null;
        }

        //--- Search Shortcut ---
        if (
            event.key === "/" &&
            !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement.tagName) &&
            !event.ctrlKey &&
            !event.metaKey &&
            !event.altKey
        ) {
            event.preventDefault();
            elements.search.focus();
        }
    });

    //--- Initialize ---
    loadCourses();
    renderCourses();

    //--- End Admin Courses ---
});
//--- End Admin Courses ---
