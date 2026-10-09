//--- Dashboard ---
document.addEventListener("DOMContentLoaded", function () {

    const body = document.querySelector(".ec-dash-body");
    const sidebar = document.querySelector("#ec-dash-sidebar");
    const overlay = document.querySelector("#ec-dash-overlay");
    const menuToggle = document.querySelector("#ec-dash-menu-toggle");
    const sidebarClose = document.querySelector("#ec-dash-sidebar-close");

    const pageTitle = document.querySelector("#ec-dash-page-title");
    const topbarEmail = document.querySelector("#ec-dash-topbar-email");
    const mobileEmail = document.querySelector("#ec-dash-mobile-email");
    const mobileName = document.querySelector("#ec-dash-mobile-name");
    const welcomeName = document.querySelector("#ec-dash-welcome-name");

    const navLinks = document.querySelectorAll(".ec-dash-nav-link[data-dash-link]");
    const logoutLink = document.querySelector("#ec-dash-logout");

    if (!body || !sidebar) {
        return;
    }


    //--- Read Stored Profile ---
    let profile = {};

    try {
        profile = JSON.parse(
            localStorage.getItem("ec-user-profile") || "{}"
        );
    } catch (error) {
        profile = {};
    }


    //--- Read Login Session ---
    let sessionEmail = "";
    let sessionRole = "";

    try {
        sessionEmail = sessionStorage.getItem("ec-user-email") || "";
        sessionRole = sessionStorage.getItem("ec-user-role") || "";
    } catch (error) {
        sessionEmail = "";
        sessionRole = "";
    }

    const dashboardRole = body.dataset.dashboardRole || "client";
    const displayEmail = sessionEmail || profile.email || "";
    const displayName = profile.name || displayEmail.split("@")[0] || "there";


    //--- Update Dashboard Details ---
    if (pageTitle) {
        pageTitle.textContent = dashboardRole === "admin"
            ? "Admin Dashboard"
            : "Client Dashboard";
    }

    if (topbarEmail) {
        topbarEmail.textContent = displayEmail || "Not signed in";
    }

    if (mobileEmail) {
        mobileEmail.textContent = displayEmail || "Not signed in";
    }

    if (mobileName) {
        mobileName.textContent = displayName;
    }

    if (welcomeName) {
        welcomeName.textContent = displayName;
    }


    //--- Profile Initials and Image Fallback ---
    const initials = displayName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map(function (part) {
            return part.charAt(0).toUpperCase();
        })
        .join("") || "U";

    document.querySelectorAll(".ec-dash-avatar-initials").forEach(function (element) {
        element.textContent = initials;
    });

    document.querySelectorAll(".ec-dash-avatar-image").forEach(function (image) {

        image.addEventListener("error", function () {
            image.style.display = "none";
        });

        if (image.complete && image.naturalWidth === 0) {
            image.style.display = "none";
        }

    });


    //--- Open Sidebar ---
    function openSidebar() {
        body.classList.add("ec-dash-menu-open");
        menuToggle?.setAttribute("aria-expanded", "true");
        sidebar.setAttribute("aria-hidden", "false");
        sidebarClose?.focus();
    }


    //--- Close Sidebar ---
    function closeSidebar() {
        body.classList.remove("ec-dash-menu-open");
        menuToggle?.setAttribute("aria-expanded", "false");
        sidebar.setAttribute(
            "aria-hidden",
            window.innerWidth <= 991 ? "true" : "false"
        );
    }


    //--- Initial Sidebar Accessibility ---
    sidebar.setAttribute(
        "aria-hidden",
        window.innerWidth <= 991 ? "true" : "false"
    );


    //--- Menu Toggle ---
    menuToggle?.addEventListener("click", function () {

        if (body.classList.contains("ec-dash-menu-open")) {
            closeSidebar();
        } else {
            openSidebar();
        }

    });


    //--- Close Button and Overlay ---
    sidebarClose?.addEventListener("click", closeSidebar);
    overlay?.addEventListener("click", closeSidebar);


    //--- Escape Key ---
    document.addEventListener("keydown", function (event) {

        if (
            event.key === "Escape" &&
            body.classList.contains("ec-dash-menu-open")
        ) {
            closeSidebar();
            menuToggle?.focus();
        }

    });


    //--- Close Drawer After Navigation ---
    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            navLinks.forEach(function (item) {
                item.classList.remove("active");
            });

            link.classList.add("active");

            if (window.innerWidth <= 991) {
                closeSidebar();
            }

        });

    });


    //--- Responsive Resize ---
    window.addEventListener("resize", function () {

        if (window.innerWidth > 991) {
            closeSidebar();
            sidebar.setAttribute("aria-hidden", "false");
        } else if (!body.classList.contains("ec-dash-menu-open")) {
            sidebar.setAttribute("aria-hidden", "true");
        }

    });




    //--- Logout ---
    logoutLink?.addEventListener("click", function (event) {

        event.preventDefault();

        try {
            sessionStorage.removeItem("ec-user-email");
            sessionStorage.removeItem("ec-user-role");
        } catch (error) {
            // Continue to login even if storage is unavailable.
        }

        window.location.href = "login.html";

    });


    //--- End Dashboard ---
});
//--- End Dashboard ---