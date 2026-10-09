//--- Components ---
document.addEventListener("DOMContentLoaded", function () {
    const navbarContainer = document.querySelector("#navbar-container");
    const footerContainer = document.querySelector("#footer-container");

    //--- Load Component ---
    const loadComponent = async function (container, componentPath) {
        if (!container) return false;

        try {
            const response = await fetch(componentPath);

            if (!response.ok) {
                throw new Error("Failed to load component: " + componentPath);
            }

            const componentHTML = await response.text();

            container.innerHTML = componentHTML;

            return true;
        } catch (error) {
            console.error("Component loading error:", error);
            return false;
        }
    };

    //--- Navbar ---
    const initializeNavbar = function () {
        const navbar = document.querySelector(".ec-navbar");

        if (!navbar) return;

        const navLinks = document.querySelectorAll(".ec-navbar-nav-link");
        const mobileLinks = document.querySelectorAll(".ec-navbar-mobile-link");
        const mobilePanel = document.querySelector(".ec-navbar-mobile");
        const toggle = document.querySelector(".ec-navbar-toggle");
        const activeLine = document.querySelector(".ec-navbar-active-line");
        const navWrapper = document.querySelector(".ec-navbar-nav-wrapper");

        const currentPage = window.location.pathname.split("/").pop() || "index.html";

        //--- Active Navigation ---
        const setActiveLink = function () {
            let activeLink = null;

            navLinks.forEach(function (link) {
                const href = link.getAttribute("href");

                const isActive = href === currentPage ||
                    (currentPage === "" && href === "index.html");

                link.classList.toggle("active", isActive);

                if (isActive) {
                    activeLink = link;
                }
            });

            mobileLinks.forEach(function (link) {
                const href = link.getAttribute("href");

                const isActive = href === currentPage ||
                    (currentPage === "" && href === "index.html");

                link.classList.toggle("active", isActive);
            });

            updateActiveLine(activeLink);
        };

        //--- Active Line ---
        const updateActiveLine = function (link) {
            if (!activeLine || !navWrapper) return;

            if (link) {
                navWrapper.classList.add("has-active");

                activeLine.style.width = link.offsetWidth + "px";
                activeLine.style.left = link.offsetLeft + "px";
            } else {
                navWrapper.classList.remove("has-active");
            }
        };

        //--- Navbar Scroll ---
        const updateNavbar = function () {
            if (window.scrollY > 25) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        };

        //--- Close Mobile Menu ---
        const closeMobileMenu = function () {
            if (!toggle || !mobilePanel) return;

            toggle.classList.remove("active");

            toggle.setAttribute("aria-expanded", "false");

            toggle.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

            mobilePanel.classList.remove("active");

            document.body.classList.remove("ec-navbar-menu-open");
        };

        //--- Open Mobile Menu ---
        const openMobileMenu = function () {
            if (!toggle || !mobilePanel) return;

            toggle.classList.add("active");

            toggle.setAttribute("aria-expanded", "true");

            toggle.setAttribute(
                "aria-label",
                "Close navigation menu"
            );

            mobilePanel.classList.add("active");

            document.body.classList.add("ec-navbar-menu-open");
        };

        //--- Mobile Toggle ---
        if (toggle && mobilePanel) {
            toggle.addEventListener("click", function (event) {
                event.preventDefault();
                event.stopPropagation();

                if (mobilePanel.classList.contains("active")) {
                    closeMobileMenu();
                } else {
                    openMobileMenu();
                }
            });
        }

        //--- Mobile Navigation ---
        mobileLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                closeMobileMenu();
            });
        });

        //--- Desktop Hover ---
        navLinks.forEach(function (link) {
            link.addEventListener("mouseenter", function () {
                updateActiveLine(link);
            });

            link.addEventListener("mouseleave", function () {
                const activeLink = document.querySelector(
                    ".ec-navbar-nav-link.active"
                );

                updateActiveLine(activeLink);
            });
        });

        //--- Outside Click ---
        document.addEventListener("click", function (event) {
            if (!mobilePanel || !toggle) return;

            if (
                mobilePanel.classList.contains("active") &&
                !navbar.contains(event.target)
            ) {
                closeMobileMenu();
            }
        });

        //--- Escape Key ---
        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeMobileMenu();
            }
        });

        //--- Scroll ---
        window.addEventListener(
            "scroll",
            updateNavbar,
            {
                passive: true
            }
        );

        //--- Resize ---
        window.addEventListener("resize", function () {
            setActiveLink();

            if (window.innerWidth > 991) {
                closeMobileMenu();
            }
        });

        //--- Initialize ---
        setActiveLink();
        updateNavbar();
    };

    //--- Footer ---
    const initializeFooter = function () {
        const footer = document.querySelector(".ec-footer");

        if (!footer) return;

        const yearElement = document.querySelector("#ec-footer-year");
        const topButton = document.querySelector(".ec-footer-top-btn");
        const progressValue = document.querySelector(".ec-footer-progress-value");

        //--- Footer Year ---
        const updateFooterYear = function () {
            if (yearElement) {
                yearElement.textContent = new Date().getFullYear();
            }
        };

        //--- Scroll Progress ---
        const updateScrollProgress = function () {
            const scrollTop = window.scrollY;

            const documentHeight =
                document.documentElement.scrollHeight - window.innerHeight;

            const scrollProgress = documentHeight > 0
                ? Math.min(
                    Math.max(scrollTop / documentHeight, 0),
                    1
                )
                : 0;

            if (progressValue) {
                const circleLength = 94.2;

                progressValue.style.strokeDashoffset =
                    circleLength -
                    (circleLength * scrollProgress);
            }
        };

        //--- Scroll To Top ---
        const scrollToTop = function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        };

        if (topButton) {
            topButton.addEventListener(
                "click",
                scrollToTop
            );
        }

        window.addEventListener(
            "scroll",
            updateScrollProgress,
            {
                passive: true
            }
        );

        window.addEventListener(
            "resize",
            updateScrollProgress
        );

        updateFooterYear();
        updateScrollProgress();
    };

    //--- Load Components ---
    const initializeComponents = async function () {
        const results = await Promise.all([
            loadComponent(
                navbarContainer,
                "assets/components/navbar.html"
            ),
            loadComponent(
                footerContainer,
                "assets/components/footer.html"
            )
        ]);

        //--- Initialize Navbar After HTML Loads ---
        if (results[0]) {
            initializeNavbar();
        }

        //--- Initialize Footer After HTML Loads ---
        if (results[1]) {
            initializeFooter();
        }

        document.dispatchEvent(
            new CustomEvent("componentsLoaded")
        );
    };

    initializeComponents();
});
//--- End Components ---