/*--- What Makes Stackly Different Section Start ---*/
const differentSection = document.querySelector(".ec-abt-different");

if (differentSection) {
    const differentItems = differentSection.querySelectorAll(
        ".ec-abt-different-item"
    );

    const activateDifferentItem = function (selectedItem) {
        differentItems.forEach(function (item) {
            const trigger = item.querySelector(
                ".ec-abt-different-item-trigger"
            );

            const isSelected = item === selectedItem;

            item.classList.toggle(
                "ec-abt-different-item-active",
                isSelected
            );

            if (trigger) {
                trigger.setAttribute(
                    "aria-expanded",
                    isSelected ? "true" : "false"
                );
            }
        });
    };

    differentItems.forEach(function (item) {
        const trigger = item.querySelector(
            ".ec-abt-different-item-trigger"
        );

        if (!trigger) {
            return;
        }

        trigger.addEventListener("click", function () {
            const isActive = item.classList.contains(
                "ec-abt-different-item-active"
            );

            if (isActive) {
                item.classList.remove(
                    "ec-abt-different-item-active"
                );
                trigger.setAttribute("aria-expanded", "false");
            } else {
                activateDifferentItem(item);
            }
        });
    });
}
/*--- What Makes Stackly Different Section End ---*/

/*--- Learning Approach Section Start ---*/
const approachSection = document.querySelector(".ec-abt-approach");

if (approachSection) {
    const approachSteps = approachSection.querySelectorAll(
        ".ec-abt-approach-step"
    );

    const approachProgress = approachSection.querySelector(
        ".ec-abt-approach-path-progress"
    );

    const approachCurrent = approachSection.querySelector(
        "#ec-abt-approach-current"
    );

    const approachCurrentTitle = approachSection.querySelector(
        "#ec-abt-approach-current-title"
    );

    const approachMessages = {
        1: "Start with curiosity, then keep moving.",
        2: "Build knowledge with clarity and confidence.",
        3: "Turn knowledge into something you can use.",
        4: "Take what you know into your next opportunity."
    };

    const activateApproachStep = function (selectedStep) {
        approachSteps.forEach(function (step) {
            const stepNumber = parseInt(
                step.getAttribute("data-approach-step"),
                10
            );

            step.classList.toggle(
                "ec-abt-approach-step-active",
                stepNumber === selectedStep
            );
        });

        if (approachProgress) {
            const progressValue =
                ((selectedStep - 1) / (approachSteps.length - 1)) * 100;

            approachProgress.style.width = progressValue + "%";
        }

        if (approachCurrent) {
            approachCurrent.textContent = String(selectedStep).padStart(
                2,
                "0"
            );
        }

        if (approachCurrentTitle) {
            approachCurrentTitle.style.opacity = "0";
            approachCurrentTitle.style.transform = "translateY(5px)";

            setTimeout(function () {
                approachCurrentTitle.textContent =
                    approachMessages[selectedStep] || "";

                approachCurrentTitle.style.opacity = "1";
                approachCurrentTitle.style.transform = "translateY(0)";
            }, 150);
        }
    };

    approachSteps.forEach(function (step) {
        step.addEventListener("click", function () {
            const selectedStep = parseInt(
                step.getAttribute("data-approach-step"),
                10
            );

            activateApproachStep(selectedStep);
        });
    });

    activateApproachStep(1);
}
/*--- Learning Approach Section End ---*/

/*--- Impact / Statistics Section Start ---*/
const impactSection = document.querySelector(".ec-abt-impact");

if (impactSection) {
    const impactCounters = impactSection.querySelectorAll(
        ".ec-abt-impact-counter"
    );

    const impactBars = impactSection.querySelectorAll(
        ".ec-abt-impact-bar-fill"
    );

    const animateImpactCounters = function () {
        impactCounters.forEach(function (counter) {
            const target = parseFloat(
                counter.getAttribute("data-impact-target")
            );

            if (isNaN(target)) {
                return;
            }

            const duration = 5600;
            const startTime = performance.now();

            const updateCounter = function (currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress =
                    1 - Math.pow(1 - progress, 3);

                const currentValue = target * easedProgress;

                counter.textContent =
                    Math.floor(currentValue).toLocaleString();

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent =
                        target.toLocaleString();
                }
            };

            requestAnimationFrame(updateCounter);
        });
    };

    const animateImpactBars = function () {
        impactBars.forEach(function (bar, index) {
            setTimeout(function () {
                const impactWidth = bar.style
                    .getPropertyValue("--impact-width");

                bar.style.width = impactWidth;
            }, index * 180);
        });
    };

    const impactObserver = new IntersectionObserver(
        function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateImpactCounters();
                    animateImpactBars();
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.25
        }
    );

    impactObserver.observe(impactSection);
}
/*--- Impact / Statistics Section End ---*/

const ssIndBlogReadButtons = document.querySelectorAll(".ec-abt-story-circle,.ec-abt-impact-bottom-arrow");
if (ssIndBlogReadButtons.length) {
    ssIndBlogReadButtons.forEach(function (ssButton) {
        ssButton.addEventListener("click", function (ssEvent) {
            ssEvent.preventDefault();
            ssEvent.stopPropagation();
            window.location.href = "404.html";
        });
    });
}


/*--- About Page Scroll Reveal Start ---*/
document.addEventListener("DOMContentLoaded", function () {

    //--- Elements Revealed from the Bottom ---
    const revealSelectors = [
        ".ec-all-hero-breadcrumb",
        ".ec-all-hero-eyebrow",
        ".ec-all-hero-title",
        ".ec-all-hero-description",
        ".ec-all-hero-meta",
        ".ec-abt-story-header",
        ".ec-abt-story-content",
        ".ec-abt-story-timeline",
        ".ec-abt-philosophy-header",
        ".ec-abt-philosophy-intro",
        ".ec-abt-philosophy-quote",
        ".ec-abt-different-header",
        ".ec-abt-different-intro",
        ".ec-abt-different-bottom",
        ".ec-abt-approach-header",
        ".ec-abt-approach-intro",
        ".ec-abt-approach-bottom",
        ".ec-abt-impact-header",
        ".ec-abt-impact-intro",
        ".ec-abt-impact-bottom",
        ".ec-abt-instructors-header",
        ".ec-abt-instructors-intro",
        ".ec-abt-instructors-bottom",
        ".ec-all-cta-content"
    ];

    //--- Elements Revealed from the Left ---
    const revealLeftSelectors = [
        ".ec-abt-story-visual",
        ".ec-abt-different-intro",
        ".ec-abt-approach-title",
        ".ec-abt-impact-heading"
    ];

    //--- Elements Revealed from the Right ---
    const revealRightSelectors = [
        ".ec-all-hero-visual",
        ".ec-abt-philosophy-mark",
        ".ec-abt-impact-intro-right",
        ".ec-abt-instructors-intro-right",
        ".ec-all-cta-visual"
    ];

    //--- Elements Revealed with a Scale Effect ---
    const revealScaleSelectors = [
        ".ec-abt-philosophy-principle",
        ".ec-abt-different-item",
        ".ec-abt-approach-step",
        ".ec-abt-impact-stat",
        ".ec-abt-instructor-card"
    ];

    //--- Collect Elements and Apply Reveal Classes ---
    function prepareReveal(selectors, className) {
        selectors.forEach(function (selector) {
            document.querySelectorAll(selector).forEach(function (element) {
                element.classList.add(className);
            });
        });
    }

    prepareReveal(revealSelectors, "ec-abt-reveal");
    prepareReveal(revealLeftSelectors, "ec-abt-reveal-left");
    prepareReveal(revealRightSelectors, "ec-abt-reveal-right");
    prepareReveal(revealScaleSelectors, "ec-abt-reveal-scale");

    //--- Stagger Repeated Cards ---
    [
        ".ec-abt-philosophy-principle",
        ".ec-abt-different-item",
        ".ec-abt-approach-step",
        ".ec-abt-impact-stat",
        ".ec-abt-instructor-card"
    ].forEach(function (selector) {
        document.querySelectorAll(selector).forEach(function (element, index) {
            element.classList.add(
                "ec-abt-reveal-delay-" + ((index % 4) + 1)
            );
        });
    });

    //--- Respect Reduced Motion Preferences ---
    const allRevealElements = document.querySelectorAll(
        ".ec-abt-reveal, .ec-abt-reveal-left, " +
        ".ec-abt-reveal-right, .ec-abt-reveal-scale"
    );

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
        allRevealElements.forEach(function (element) {
            element.classList.add("ec-abt-reveal-visible");
        });

        return;
    }

    //--- Observe Elements as They Enter the Viewport ---
    const revealObserver = new IntersectionObserver(
        function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("ec-abt-reveal-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -30px 0px"
        }
    );

    allRevealElements.forEach(function (element) {
        revealObserver.observe(element);
    });

});
/*--- About Page Scroll Reveal End ---*/
