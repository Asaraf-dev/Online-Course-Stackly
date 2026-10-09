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