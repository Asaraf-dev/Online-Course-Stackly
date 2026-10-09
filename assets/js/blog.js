/*--- Latest Articles Section Start ---*/
document.addEventListener("DOMContentLoaded", function () {

    const latestSection = document.querySelector("#ec-blg-latest");

    if (!latestSection) {
        return;
    }

    const articleGrid = document.querySelector("#ec-blg-article-grid");

    const articles = Array.from(
        articleGrid.querySelectorAll(".ec-blg-latest-card")
    );

    const searchInput = document.querySelector("#ec-blg-search");
    const searchButton = document.querySelector("#ec-blg-search-button");

    const categoryFilter = document.querySelector("#ec-blg-category");
    const sortFilter = document.querySelector("#ec-blg-sort");

    const topicButtons = document.querySelectorAll(
        ".ec-blg-latest-topic"
    );

    const clearButton = document.querySelector("#ec-blg-clear");
    const emptyClearButton = document.querySelector(
        "#ec-blg-empty-clear"
    );

    const articleCount = document.querySelector(
        "#ec-blg-article-count"
    );

    const visibleCount = document.querySelector(
        "#ec-blg-visible-count"
    );

    const activeFilter = document.querySelector(
        "#ec-blg-active-filter"
    );

    const emptyState = document.querySelector(
        "#ec-blg-empty"
    );

    let currentSearch = "";
    let currentTopic = "all";


    //--- Apply Filters ---
    const applyFilters = function () {

        const searchValue =
            currentSearch.toLowerCase().trim();

        const categoryValue =
            categoryFilter.value;

        const sortValue =
            sortFilter.value;

        let visibleArticles = [];


        articles.forEach(function (article) {

            const title =
                article.dataset.title.toLowerCase();

            const category =
                article.dataset.category;

            const topic =
                article.dataset.topic;

            const articleText =
                article.textContent.toLowerCase();


            const matchesSearch =
                !searchValue ||
                title.includes(searchValue) ||
                articleText.includes(searchValue);


            const matchesCategory =
                categoryValue === "all" ||
                category === categoryValue;


            const matchesTopic =
                currentTopic === "all" ||
                topic === currentTopic;


            const isVisible =
                matchesSearch &&
                matchesCategory &&
                matchesTopic;


            if (isVisible) {

                article.classList.remove("is-hidden");
                article.classList.remove("is-filtered");

                visibleArticles.push(article);

            } else {

                article.classList.add("is-filtered");

                window.setTimeout(function () {

                    article.classList.add("is-hidden");

                }, 180);

            }

        });


        //--- Sort Articles ---
        visibleArticles.sort(function (
            firstArticle,
            secondArticle
        ) {

            if (sortValue === "latest") {

                return Number(
                    secondArticle.dataset.date
                ) - Number(
                    firstArticle.dataset.date
                );

            }


            if (sortValue === "popular") {

                return Number(
                    secondArticle.dataset.popularity
                ) - Number(
                    firstArticle.dataset.popularity
                );

            }


            if (sortValue === "read") {

                return Number(
                    firstArticle.dataset.minutes
                ) - Number(
                    secondArticle.dataset.minutes
                );

            }


            if (sortValue === "long") {

                return Number(
                    secondArticle.dataset.minutes
                ) - Number(
                    firstArticle.dataset.minutes
                );

            }


            if (sortValue === "title") {

                return firstArticle.dataset.title.localeCompare(
                    secondArticle.dataset.title
                );

            }


            return 0;

        });


        //--- Reorder Grid ---
        visibleArticles.forEach(function (article) {

            articleGrid.appendChild(article);

        });


        //--- Update Counts ---
        articleCount.textContent = articles.length;

        visibleCount.textContent =
            visibleArticles.length;


        //--- Empty State ---
        if (visibleArticles.length === 0) {

            emptyState.hidden = false;

        } else {

            emptyState.hidden = true;

        }


        updateActiveFilter();

    };


    //--- Search Button ---
    searchButton.addEventListener(
        "click",
        function () {

            currentSearch =
                searchInput.value;

            applyFilters();

        }
    );


    //--- Search Enter ---
    searchInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                event.preventDefault();

                currentSearch =
                    searchInput.value;

                applyFilters();

            }

        }
    );


    //--- Live Search ---
    searchInput.addEventListener(
        "input",
        function () {

            currentSearch =
                searchInput.value;

            applyFilters();

        }
    );


    //--- Category ---
    categoryFilter.addEventListener(
        "change",
        function () {

            applyFilters();

        }
    );


    //--- Sort ---
    sortFilter.addEventListener(
        "change",
        function () {

            applyFilters();

        }
    );


    //--- Topic Navigation ---
    topicButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                currentTopic =
                    button.dataset.topic;


                topicButtons.forEach(
                    function (topicButton) {

                        const isActive =
                            topicButton === button;

                        topicButton.classList.toggle(
                            "active",
                            isActive
                        );

                        topicButton.setAttribute(
                            "aria-pressed",
                            String(isActive)
                        );

                    }
                );


                // Keep category filter in sync.
                if (currentTopic === "all") {

                    categoryFilter.value = "all";

                } else {

                    categoryFilter.value =
                        currentTopic;

                }


                applyFilters();

            }
        );

    });


    //--- Category / Topic Synchronisation ---
    categoryFilter.addEventListener(
        "change",
        function () {

            const selectedCategory =
                categoryFilter.value;

            currentTopic =
                selectedCategory;


            topicButtons.forEach(
                function (button) {

                    const isActive =
                        button.dataset.topic === selectedCategory;

                    button.classList.toggle(
                        "active",
                        isActive
                    );

                    button.setAttribute(
                        "aria-pressed",
                        String(isActive)
                    );

                }
            );

            applyFilters();

        }
    );


    //--- Clear All ---
    const clearSearch = function () {

        searchInput.value = "";

        currentSearch = "";

        currentTopic = "all";

        categoryFilter.value = "all";

        sortFilter.value = "latest";


        topicButtons.forEach(
            function (button) {

                const isActive =
                    button.dataset.topic === "all";

                button.classList.toggle(
                    "active",
                    isActive
                );

                button.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );

            }
        );


        articles.forEach(
            function (article) {

                article.classList.remove(
                    "is-filtered"
                );

                article.classList.remove(
                    "is-hidden"
                );

            }
        );


        applyFilters();

    };


    clearButton.addEventListener(
        "click",
        function () {

            clearSearch();

        }
    );


    emptyClearButton.addEventListener(
        "click",
        function () {

            clearSearch();

        }
    );


    //--- Active Filter Label ---
    const updateActiveFilter = function () {

        const filters = [];


        if (currentSearch.trim()) {

            filters.push(
                `"${currentSearch.trim()}"`
            );

        }


        if (currentTopic !== "all") {

            filters.push(
                document.querySelector(
                    `.ec-blg-latest-topic[data-topic="${currentTopic}"]`
                ).textContent.trim()
            );

        }


        if (filters.length === 0) {

            activeFilter.textContent =
                "All articles";

        } else {

            activeFilter.textContent =
                filters.join(" · ");

        }

    };


    //--- Initial State ---
    articleCount.textContent =
        articles.length;

    visibleCount.textContent =
        articles.length;

    applyFilters();

});
/*--- Latest Articles Section End ---*/

/*--- Popular / Trending Articles Section Start ---*/
/*--- Popular / Trending Articles Section End ---*/

/*--- Section Start ---*/
/*--- Section End ---*/

/*--- Section Start ---*/
/*--- Section End ---*/

/*--- Section Start ---*/
/*--- Section End ---*/

/*--- Section Start ---*/
/*--- Section End ---*/