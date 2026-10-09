//--- Navbar ---
document.addEventListener("DOMContentLoaded", function () {
    const navbar = document.querySelector(".ec-navbar");
    if (!navbar) return;

    const navLinks = document.querySelectorAll(".ec-navbar-nav-link");
    const mobileLinks = document.querySelectorAll(".ec-navbar-mobile-link");
    const mobilePanel = document.querySelector(".ec-navbar-mobile");
    const toggle = document.querySelector(".ec-navbar-toggle");
    const activeLine = document.querySelector(".ec-navbar-active-line");
    const navWrapper = document.querySelector(".ec-navbar-nav-wrapper");

    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    //--- Set Active Navigation ---
    const setActiveLink = function () {
        let activeLink = null;

        navLinks.forEach(function (link) {
            const href = link.getAttribute("href");
            const isActive = href === currentPage || (currentPage === "" && href === "index.html");

            link.classList.toggle("active", isActive);

            if (isActive) {
                activeLink = link;
            }
        });

        mobileLinks.forEach(function (link) {
            const href = link.getAttribute("href");
            const isActive = href === currentPage || (currentPage === "" && href === "index.html");

            link.classList.toggle("active", isActive);
        });

        updateActiveLine(activeLink);
    };

    //--- Update Active Line ---
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

    //--- Update Sticky Navbar ---
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
        toggle.setAttribute("aria-label", "Open navigation menu");

        mobilePanel.classList.remove("active");
        document.body.classList.remove("ec-navbar-menu-open");
    };

    //--- Open Mobile Menu ---
    const openMobileMenu = function () {
        if (!toggle || !mobilePanel) return;

        toggle.classList.add("active");
        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "Close navigation menu");

        mobilePanel.classList.add("active");
        document.body.classList.add("ec-navbar-menu-open");
    };

    //--- Toggle Mobile Menu ---
    if (toggle) {
        toggle.addEventListener("click", function () {
            const isOpen = toggle.classList.contains("active");

            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    //--- Mobile Navigation Click ---
    mobileLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            closeMobileMenu();
        });
    });

    //--- Desktop Navigation Hover ---
    navLinks.forEach(function (link) {
        link.addEventListener("mouseenter", function () {
            updateActiveLine(link);
        });

        link.addEventListener("mouseleave", function () {
            const activeLink = document.querySelector(".ec-navbar-nav-link.active");
            updateActiveLine(activeLink);
        });
    });

    //--- Close Menu On Outside Click ---
    document.addEventListener("click", function (event) {
        if (!mobilePanel || !toggle) return;

        const clickedInsideNavbar = navbar.contains(event.target);

        if (!clickedInsideNavbar) {
            closeMobileMenu();
        }
    });

    //--- Close Menu On Escape ---
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });

    //--- Window Scroll ---
    window.addEventListener("scroll", function () {
        updateNavbar();
    }, {
        passive: true
    });

    //--- Window Resize ---
    window.addEventListener("resize", function () {
        setActiveLink();

        if (window.innerWidth > 991) {
            closeMobileMenu();
        }
    });

    //--- Initialize Navbar ---
    setActiveLink();
    updateNavbar();
});
//--- End Navbar ---