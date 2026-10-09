/*--- Latest Articles Section Start ---*/
document.addEventListener("DOMContentLoaded", function () {

    //--- Section Elements ---
    const latestSection = document.querySelector("#ec-blg-latest");

    if (!latestSection) {
        return;
    }

    const articleGrid = document.querySelector("#ec-blg-article-grid");

    if (!articleGrid) {
        return;
    }

    const articles = Array.from(
        articleGrid.querySelectorAll(".ec-blg-latest-card")
    );

    const searchInput = document.querySelector("#ec-blg-search");
    const searchButton = document.querySelector("#ec-blg-search-button");
    const categoryFilter = document.querySelector("#ec-blg-category");
    const sortFilter = document.querySelector("#ec-blg-sort");

    const topicButtons = Array.from(
        document.querySelectorAll(".ec-blg-latest-topic")
    );

    const clearButton = document.querySelector("#ec-blg-clear");
    const emptyClearButton = document.querySelector("#ec-blg-empty-clear");

    const articleCount = document.querySelector("#ec-blg-article-count");
    const visibleCount = document.querySelector("#ec-blg-visible-count");
    const activeFilter = document.querySelector("#ec-blg-active-filter");
    const emptyState = document.querySelector("#ec-blg-empty");

    if (
        !searchInput ||
        !categoryFilter ||
        !sortFilter ||
        !emptyState
    ) {
        return;
    }

    let currentSearch = "";
    let currentTopic = "all";


    //--- Normalize Text ---
    function normalizeText(value) {
        return String(value || "").toLowerCase().trim();
    }


    //--- Update Active Topic ---
    function updateActiveTopic(topic) {
        currentTopic = topic;

        topicButtons.forEach(function (button) {
            const isActive = button.dataset.topic === currentTopic;

            button.classList.toggle("active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });
    }


    //--- Update Active Filter Label ---
    function updateActiveFilter() {
        if (!activeFilter) {
            return;
        }

        const filters = [];

        if (currentSearch.trim()) {
            filters.push('"' + currentSearch.trim() + '"');
        }

        if (currentTopic !== "all") {
            const selectedTopic = topicButtons.find(function (button) {
                return button.dataset.topic === currentTopic;
            });

            if (selectedTopic) {
                filters.push(selectedTopic.textContent.trim());
            }
        }

        if (filters.length === 0) {
            activeFilter.textContent = "All articles";
        } else {
            activeFilter.textContent = filters.join(" · ");
        }
    }


    //--- Apply Search, Category, Topic and Sort ---
    function applyFilters() {
        const searchValue = normalizeText(currentSearch);
        const categoryValue = categoryFilter.value;
        const sortValue = sortFilter.value;

        const visibleArticles = [];

        //--- Filter Each Article ---
        articles.forEach(function (article) {
            const title = normalizeText(
                article.dataset.title ||
                article.querySelector("h3")?.textContent
            );

            const category = normalizeText(article.dataset.category);
            const topic = normalizeText(article.dataset.topic);
            const articleText = normalizeText(article.textContent);

            const matchesSearch =
                !searchValue ||
                title.includes(searchValue) ||
                articleText.includes(searchValue);

            const matchesCategory =
                categoryValue === "all" ||
                category === normalizeText(categoryValue);

            const matchesTopic =
                currentTopic === "all" ||
                topic === normalizeText(currentTopic);

            const isVisible =
                matchesSearch &&
                matchesCategory &&
                matchesTopic;

            //--- Update Visibility Immediately ---
            article.classList.toggle("is-hidden", !isVisible);
            article.classList.toggle("is-filtered", !isVisible);

            article.setAttribute("aria-hidden", String(!isVisible));

            if (isVisible) {
                visibleArticles.push(article);
            }
        });


        //--- Sort Matching Articles ---
        visibleArticles.sort(function (firstArticle, secondArticle) {
            const firstDate = Number(firstArticle.dataset.date || 0);
            const secondDate = Number(secondArticle.dataset.date || 0);

            const firstPopularity = Number(
                firstArticle.dataset.popularity || 0
            );

            const secondPopularity = Number(
                secondArticle.dataset.popularity || 0
            );

            const firstMinutes = Number(
                firstArticle.dataset.minutes || 0
            );

            const secondMinutes = Number(
                secondArticle.dataset.minutes || 0
            );

            const firstTitle = firstArticle.dataset.title ||
                firstArticle.querySelector("h3")?.textContent || "";

            const secondTitle = secondArticle.dataset.title ||
                secondArticle.querySelector("h3")?.textContent || "";

            switch (sortValue) {
                case "latest":
                    return secondDate - firstDate;

                case "popular":
                    return secondPopularity - firstPopularity;

                case "read":
                    return firstMinutes - secondMinutes;

                case "long":
                    return secondMinutes - firstMinutes;

                case "title":
                    return firstTitle.localeCompare(secondTitle);

                default:
                    return 0;
            }
        });


        //--- Reorder Visible Articles Without Cloning ---
        visibleArticles.forEach(function (article) {
            articleGrid.appendChild(article);
        });

        //--- Keep Hidden Articles After Visible Articles ---
        articles.forEach(function (article) {
            if (!visibleArticles.includes(article)) {
                articleGrid.appendChild(article);
            }
        });


        //--- Update Article Counts ---
        if (articleCount) {
            articleCount.textContent = articles.length;
        }

        if (visibleCount) {
            visibleCount.textContent = visibleArticles.length;
        }


        //--- Empty State ---
        const hasResults = visibleArticles.length > 0;

        emptyState.hidden = hasResults;
        articleGrid.hidden = !hasResults;


        //--- Update Active Filter Text ---
        updateActiveFilter();
    }


    //--- Search Button ---
    if (searchButton) {
        searchButton.addEventListener("click", function () {
            currentSearch = searchInput.value.trim();
            applyFilters();
        });
    }


    //--- Search on Enter ---
    searchInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();

            currentSearch = searchInput.value.trim();
            applyFilters();
        }
    });


    //--- Live Search ---
    searchInput.addEventListener("input", function () {
        currentSearch = searchInput.value.trim();
        applyFilters();
    });


    //--- Explore Topics ---
    topicButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const selectedTopic = button.dataset.topic || "all";

            updateActiveTopic(selectedTopic);

            // Keep the category dropdown synchronized with the topic.
            categoryFilter.value = selectedTopic;

            applyFilters();
        });
    });


    //--- Category Dropdown ---
    categoryFilter.addEventListener("change", function () {
        const selectedCategory = categoryFilter.value || "all";

        // Keep topic buttons synchronized with the category dropdown.
        updateActiveTopic(selectedCategory);

        applyFilters();
    });


    //--- Sort Dropdown ---
    sortFilter.addEventListener("change", function () {
        applyFilters();
    });


    //--- Clear All Filters ---
    function clearSearch() {
        searchInput.value = "";
        currentSearch = "";

        categoryFilter.value = "all";
        sortFilter.value = "latest";

        updateActiveTopic("all");

        //--- Restore All Cards ---
        articles.forEach(function (article) {
            article.classList.remove("is-hidden", "is-filtered");
            article.setAttribute("aria-hidden", "false");
        });

        applyFilters();
    }


    //--- Clear Button ---
    if (clearButton) {
        clearButton.addEventListener("click", clearSearch);
    }


    //--- Empty State Reset Button ---
    if (emptyClearButton) {
        emptyClearButton.addEventListener("click", clearSearch);
    }


    //--- Initial State ---
    updateActiveTopic("all");

    categoryFilter.value = "all";
    sortFilter.value = "latest";

    articles.forEach(function (article) {
        article.classList.remove("is-hidden", "is-filtered");
        article.setAttribute("aria-hidden", "false");
    });

    applyFilters();

});
/*--- Latest Articles Section End ---*/


//--- Blog Page Scroll Reveal Animation ---

document.addEventListener("DOMContentLoaded", function () {
    const revealSelectors = [
        ".ec-all-hero-breadcrumb",
        ".ec-all-hero-eyebrow",
        ".ec-all-hero-title",
        ".ec-all-hero-description",
        ".ec-all-hero-meta",
        ".ec-blg-latest-header",
        ".ec-blg-latest-search",
        ".ec-blg-latest-topics",
        ".ec-blg-latest-toolbar",
        ".ec-blg-latest-status",
        ".ec-blg-popular-header",
        ".ec-blg-popular-footer",
        ".ec-all-cta-content"
    ];

    const revealLeftSelectors = [
        ".ec-all-hero-visual",
        ".ec-blg-latest-heading",
        ".ec-blg-popular-featured"
    ];

    const revealRightSelectors = [
        ".ec-blg-latest-count-box",
        ".ec-blg-latest-search-inner",
        ".ec-blg-popular-header-note",
        ".ec-blg-popular-list",
        ".ec-all-cta-visual"
    ];

    const revealScaleSelectors = [
        ".ec-blg-latest-card",
        ".ec-blg-latest-topic",
        ".ec-blg-popular-item"
    ];

    // Respect reduced-motion preferences.
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
        return;
    }

    // Add reveal classes to the selected elements.
    function prepareReveal(selectors, revealClass) {
        selectors.forEach(function (selector) {
            const elements = document.querySelectorAll(selector);

            elements.forEach(function (element, index) {
                element.classList.add(revealClass);

                // Stagger cards and repeated items.
                if (
                    revealClass === "ec-blg-reveal-scale" &&
                    element.matches(
                        ".ec-blg-latest-card, .ec-blg-latest-topic, .ec-blg-popular-item"
                    )
                ) {
                    element.classList.add(
                        "ec-blg-reveal-delay-" + ((index % 4) + 1)
                    );
                }
            });
        });
    }

    prepareReveal(revealSelectors, "ec-blg-reveal");
    prepareReveal(revealLeftSelectors, "ec-blg-reveal-left");
    prepareReveal(revealRightSelectors, "ec-blg-reveal-right");
    prepareReveal(revealScaleSelectors, "ec-blg-reveal-scale");

    // Reveal elements when they enter the viewport.
    const revealElements = document.querySelectorAll(
        ".ec-blg-reveal, .ec-blg-reveal-left, " +
        ".ec-blg-reveal-right, .ec-blg-reveal-scale"
    );

    const revealObserver = new IntersectionObserver(
        function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add(
                        "ec-blg-reveal-visible"
                    );

                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -30px 0px"
        }
    );

    revealElements.forEach(function (element) {
        revealObserver.observe(element);
    });
});

//--- End Blog Page Scroll Reveal Animation ---