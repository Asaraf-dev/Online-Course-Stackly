//--- Footer ---
document.addEventListener("DOMContentLoaded", function () {
    const footer = document.querySelector(".ec-footer");
    if (!footer) return;
    const yearElement = document.querySelector("#ec-footer-year");
    const topButton = document.querySelector(".ec-footer-top-btn");
    const progressValue = document.querySelector(".ec-footer-progress-value");
    const updateFooterYear = function () {
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    };
    const updateScrollProgress = function () {
        const scrollTop = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollProgress = documentHeight > 0 ? Math.min(Math.max(scrollTop / documentHeight, 0), 1) : 0;
        if (progressValue) {
            const circleLength = 94.2;
            progressValue.style.strokeDashoffset = circleLength - (circleLength * scrollProgress);
        }
    };
    const scrollToTop = function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };
    if (topButton) {
        topButton.addEventListener("click", scrollToTop);
    }
    window.addEventListener("scroll", updateScrollProgress, {
        passive: true
    });
    window.addEventListener("resize", updateScrollProgress);
    updateFooterYear();
    updateScrollProgress();
});
//--- End Footer ---