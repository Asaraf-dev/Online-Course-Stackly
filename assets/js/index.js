/*--- Index Hero Section Start ---*/
document.addEventListener("DOMContentLoaded", function () {
    const hero = document.querySelector(".ec-ind-hero");

    if (!hero) {
        return;
    }

    const visual = hero.querySelector(".ec-ind-hero-visual");
    const orbit = hero.querySelector(".ec-ind-hero-orbit");
    const center = hero.querySelector(".ec-ind-hero-center");
    const courses = hero.querySelectorAll(".ec-ind-hero-course");

    if (!visual || !orbit || !center) {
        return;
    }

    //--- Hero Mouse Interaction ---
    const updateHeroParallax = function (event) {
        if (window.innerWidth <= 991) {
            orbit.style.transform = "";
            return;
        }

        const rect = visual.getBoundingClientRect();

        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const xPercent = (x / rect.width) - 0.5;
        const yPercent = (y / rect.height) - 0.5;

        const rotateX = yPercent * -7;
        const rotateY = xPercent * 9;

        orbit.style.transform =
            "rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg)";
    };

    const resetHeroParallax = function () {
        orbit.style.transform = "";
    };

    visual.addEventListener(
        "mousemove",
        updateHeroParallax
    );

    visual.addEventListener(
        "mouseleave",
        resetHeroParallax
    );

    //--- Course Card Interaction ---
    courses.forEach(function (course) {
        course.addEventListener("click", function () {
            courses.forEach(function (item) {
                item.classList.remove("active");
            });

            course.classList.add("active");

            const courseName =
                course.querySelector("strong");

            const centerTitle =
                center.querySelector("strong");

            const centerDescription =
                center.querySelector(
                    ".ec-ind-hero-center-inner > span:last-child"
                );

            if (
                courseName &&
                centerTitle &&
                centerDescription
            ) {
                centerTitle.textContent =
                    courseName.textContent;

                centerDescription.textContent =
                    "Ready to explore.";
            }

            center.classList.remove(
                "ec-ind-hero-center-change"
            );

            void center.offsetWidth;

            center.classList.add(
                "ec-ind-hero-center-change"
            );
        });
    });

    //--- Touch Interaction ---
    courses.forEach(function (course) {
        course.addEventListener(
            "touchstart",
            function () {
                course.classList.add("active");
            },
            {
                passive: true
            }
        );
    });

    //--- Reset Hero On Resize ---
    window.addEventListener(
        "resize",
        function () {
            if (window.innerWidth <= 991) {
                orbit.style.transform = "";
            }
        }
    );

    /*--- Index Hero Section End ---*/
});

/*--- About Us Section Start ---*/
const aboutSection = document.querySelector(".ec-ind-about");
if (aboutSection) {
    const aboutSteps = aboutSection.querySelectorAll(".ec-ind-about-step");
    const aboutProgress = aboutSection.querySelector(".ec-ind-about-journey-progress");
    const aboutStats = aboutSection.querySelectorAll(".ec-ind-about-stat-number");

    //--- Journey Steps ---
    aboutSteps.forEach(function (step, index) {
        step.addEventListener("click", function () {
            aboutSteps.forEach(function (item) {
                item.classList.remove("ec-ind-about-step-active");
            });

            step.classList.add("ec-ind-about-step-active");

            if (aboutProgress) {
                const progressValue =
                    ((index + 1) / aboutSteps.length) * 100;

                aboutProgress.style.height =
                    progressValue + "%";
            }
        });
    });

    //--- Stats Counter ---
    const animateAboutStats = function () {
        aboutStats.forEach(function (stat) {
            const target = parseFloat(
                stat.getAttribute("data-count")
            );

            if (isNaN(target)) {
                return;
            }

            const duration = 4400;
            const startTime = performance.now();

            const updateCounter = function (currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(
                    elapsed / duration,
                    1
                );

                const easedProgress =
                    1 - Math.pow(1 - progress, 3);

                const currentValue =
                    target * easedProgress;

                if (target % 1 !== 0) {
                    stat.textContent =
                        currentValue.toFixed(1);
                } else {
                    stat.textContent =
                        Math.floor(currentValue).toLocaleString();
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    if (target % 1 !== 0) {
                        stat.textContent =
                            target.toFixed(1);
                    } else {
                        stat.textContent =
                            target.toLocaleString();
                    }
                }
            };

            requestAnimationFrame(updateCounter);
        });
    };

    //--- Stats Observer ---
    const aboutObserver = new IntersectionObserver(
        function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateAboutStats();
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.25
        }
    );

    aboutObserver.observe(aboutSection);
}
/*--- About Us Section End ---*/

/*--- Popular Courses Section Start ---*/
const popularCoursesSection = document.querySelector(".ec-ind-popular");

if (popularCoursesSection) {
    const popularFilters = popularCoursesSection.querySelectorAll(".ec-ind-popular-filter");
    const popularCards = popularCoursesSection.querySelectorAll(".ec-ind-popular-card");
    const wishlistButtons = popularCoursesSection.querySelectorAll(
        ".ec-ind-popular-wishlist, .ec-ind-popular-card-wishlist"
    );

    //--- Course Filters ---
    popularFilters.forEach(function (filterButton) {
        filterButton.addEventListener("click", function () {
            const selectedFilter = filterButton.getAttribute("data-filter");

            popularFilters.forEach(function (button) {
                button.classList.remove("active");
            });

            filterButton.classList.add("active");

            popularCards.forEach(function (card) {
                const cardCategory = card.getAttribute("data-category");

                if (selectedFilter === "all" || cardCategory === selectedFilter) {
                    card.classList.remove("ec-ind-popular-card-hidden");

                    requestAnimationFrame(function () {
                        card.style.opacity = "1";
                        card.style.transform = "";
                    });
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "translateY(10px)";

                    setTimeout(function () {
                        card.classList.add("ec-ind-popular-card-hidden");
                    }, 250);
                }
            });
        });
    });

    //--- Wishlist Buttons ---
    wishlistButtons.forEach(function (wishlistButton) {
        wishlistButton.addEventListener("click", function () {
            wishlistButton.classList.toggle("active");

            const icon = wishlistButton.querySelector("i");

            if (!icon) {
                return;
            }

            if (wishlistButton.classList.contains("active")) {
                icon.classList.remove("bi-heart");
                icon.classList.add("bi-heart-fill");
            } else {
                icon.classList.remove("bi-heart-fill");
                icon.classList.add("bi-heart");
            }
        });
    });

    //--- Featured Course Image Parallax ---
    const featuredImage = popularCoursesSection.querySelector(
        ".ec-ind-popular-featured-image"
    );

    if (featuredImage && window.innerWidth > 991) {
        featuredImage.addEventListener("mousemove", function (event) {
            const image = featuredImage.querySelector("img");

            if (!image) {
                return;
            }

            const bounds = featuredImage.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - 0.5;
            const y = (event.clientY - bounds.top) / bounds.height - 0.5;

            image.style.transform =
                "scale(1.06) translate(" + (x * 10) + "px," + (y * 10) + "px)";
        });

        featuredImage.addEventListener("mouseleave", function () {
            const image = featuredImage.querySelector("img");

            if (image) {
                image.style.transform = "";
            }
        });
    }
}
/*--- Popular Courses Section End ---*/

/*--- Learning Journey Section Start ---*/
const journeySection = document.querySelector(".ec-ind-journey");

if (journeySection) {
    const journeyProgressSteps = journeySection.querySelectorAll(
        ".ec-ind-journey-progress-step"
    );

    const journeyContentSteps = journeySection.querySelectorAll(
        ".ec-ind-journey-step"
    );

    const journeyProgressLine = journeySection.querySelector(
        ".ec-ind-journey-progress-line"
    );

    const journeyCenter = journeySection.querySelector(
        ".ec-ind-journey-center"
    );

    const journeyCenterNumber = journeySection.querySelector(
        ".ec-ind-journey-center-number"
    );

    const journeyCenterTitle = journeySection.querySelector(
        ".ec-ind-journey-center-title"
    );

    const journeyCenterSmall = journeySection.querySelector(
        ".ec-ind-journey-center small"
    );

    const journeyCenterIcon = journeySection.querySelector(
        ".ec-ind-journey-center-icon i"
    );

    const journeyData = {
        1: {
            number: "01",
            title: "Discover",
            small: "Find your direction",
            icon: "bi-compass"
        },
        2: {
            number: "02",
            title: "Learn",
            small: "Build your knowledge",
            icon: "bi-lightbulb"
        },
        3: {
            number: "03",
            title: "Practice",
            small: "Make it real",
            icon: "bi-boxes"
        },
        4: {
            number: "04",
            title: "Achieve",
            small: "Take your next step",
            icon: "bi-graph-up-arrow"
        }
    };

    const activateJourneyStep = function (selectedStep) {
        journeyProgressSteps.forEach(function (step) {
            const stepNumber = parseInt(step.getAttribute("data-step"), 10);

            step.classList.remove("active");

            if (stepNumber < selectedStep) {
                step.classList.add("completed");
            } else {
                step.classList.remove("completed");
            }

            if (stepNumber === selectedStep) {
                step.classList.add("active");
            }
        });

        journeyContentSteps.forEach(function (contentStep) {
            const contentNumber = parseInt(
                contentStep.getAttribute("data-step-content"),
                10
            );

            contentStep.classList.toggle(
                "active",
                contentNumber === selectedStep
            );
        });

        if (journeyProgressLine) {
            const progressPercent =
                ((selectedStep - 1) / (journeyProgressSteps.length - 1)) * 100;

            journeyProgressLine.style.width = progressPercent + "%";
        }

        const selectedData = journeyData[selectedStep];

        if (!selectedData) {
            return;
        }

        if (journeyCenter) {
            journeyCenter.classList.remove("ec-ind-journey-center-change");

            void journeyCenter.offsetWidth;

            journeyCenter.classList.add("ec-ind-journey-center-change");
        }

        if (journeyCenterNumber) {
            journeyCenterNumber.textContent = selectedData.number;
        }

        if (journeyCenterTitle) {
            journeyCenterTitle.textContent = selectedData.title;
        }

        if (journeyCenterSmall) {
            journeyCenterSmall.textContent = selectedData.small;
        }

        if (journeyCenterIcon) {
            journeyCenterIcon.className = "bi " + selectedData.icon;
        }
    };

    journeyProgressSteps.forEach(function (step) {
        step.addEventListener("click", function () {
            const selectedStep = parseInt(
                step.getAttribute("data-step"),
                10
            );

            activateJourneyStep(selectedStep);
        });
    });

    //--- Journey Center Animation ---
    const journeyCenterAnimationStyle = document.createElement("style");

    journeyCenterAnimationStyle.textContent = `
        .ec-ind-journey-center-change {
            animation: ecIndJourneyCenterChange .45s ease;
        }

        @keyframes ecIndJourneyCenterChange {
            0% {
                transform: scale(1);
            }

            50% {
                transform: scale(1.08);
            }

            100% {
                transform: scale(1);
            }
        }
    `;

    document.head.appendChild(journeyCenterAnimationStyle);

    //--- Auto Journey ---
    let journeyAutoPlay;
    let journeyCurrentStep = 1;

    const startJourneyAutoPlay = function () {
        journeyAutoPlay = setInterval(function () {
            journeyCurrentStep++;

            if (journeyCurrentStep > 4) {
                journeyCurrentStep = 1;
            }

            activateJourneyStep(journeyCurrentStep);
        }, 5000);
    };

    const stopJourneyAutoPlay = function () {
        clearInterval(journeyAutoPlay);
    };

    journeySection.addEventListener("mouseenter", function () {
        stopJourneyAutoPlay();
    });

    journeySection.addEventListener("mouseleave", function () {
        startJourneyAutoPlay();
    });

    journeyProgressSteps.forEach(function (step) {
        step.addEventListener("click", function () {
            journeyCurrentStep = parseInt(
                step.getAttribute("data-step"),
                10
            );

            stopJourneyAutoPlay();
            startJourneyAutoPlay();
        });
    });

    //--- Journey Initial State ---
    activateJourneyStep(1);
  
}
/*--- Learning Journey Section End ---*/

/*--- Student Results / Statistics Section Start ---*/
const resultsSection = document.querySelector(".ec-ind-results");

if (resultsSection) {
    const resultCounters = resultsSection.querySelectorAll(
        ".ec-ind-results-counter"
    );

    const resultPeriodButtons = resultsSection.querySelectorAll(
        ".ec-ind-results-dashboard-tabs button"
    );

    const resultChartLine = resultsSection.querySelector(
        ".ec-ind-results-chart-line"
    );

    const resultChartFill = resultsSection.querySelector(
        ".ec-ind-results-chart-fill"
    );

    const resultChartTooltip = resultsSection.querySelector(
        ".ec-ind-results-chart-tooltip strong"
    );

    const resultChartMonths = resultsSection.querySelector(
        ".ec-ind-results-chart-months"
    );

    const resultChartData = {
        6: {
            value: "87%",
            months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            line: "M0,245 C70,230 90,210 140,215 C200,220 215,175 270,185 C330,198 340,145 400,155 C465,165 475,112 530,125 C585,138 600,92 655,105 C710,115 735,70 800,58"
        },
        12: {
            value: "94%",
            months: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            line: "M0,260 C70,248 95,220 140,225 C195,230 220,195 270,202 C330,210 350,160 400,172 C455,182 480,140 530,145 C590,155 615,105 665,118 C720,125 750,82 800,45"
        }
    };

    //--- Counter Animation ---
    const animateResultCounters = function () {
        resultCounters.forEach(function (counter) {
            const target = parseFloat(
                counter.getAttribute("data-target")
            );

            const isDecimal =
                counter.getAttribute("data-decimal") === "true";

            if (isNaN(target)) {
                return;
            }

            const duration = 1600;
            const startTime = performance.now();

            const updateCounter = function (currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = 1 - Math.pow(1 - progress, 3);
                const currentValue = target * easedProgress;

                if (isDecimal) {
                    counter.textContent = currentValue.toFixed(1);
                } else {
                    counter.textContent =
                        Math.floor(currentValue).toLocaleString();
                }

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = isDecimal
                        ? target.toFixed(1)
                        : target.toLocaleString();
                }
            };

            requestAnimationFrame(updateCounter);
        });
    };

    //--- Results Observer ---
    const resultsObserver = new IntersectionObserver(
        function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateResultCounters();
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.25
        }
    );

    resultsObserver.observe(resultsSection);

    //--- Dashboard Period Switching ---
    resultPeriodButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const selectedPeriod =
                button.getAttribute("data-result-period");

            const selectedData = resultChartData[selectedPeriod];

            if (!selectedData) {
                return;
            }

            resultPeriodButtons.forEach(function (item) {
                item.classList.remove("active");
            });

            button.classList.add("active");

            if (resultChartLine) {
                resultChartLine.style.opacity = "0";

                setTimeout(function () {
                    resultChartLine.setAttribute(
                        "d",
                        selectedData.line
                    );

                    resultChartLine.style.opacity = "1";
                }, 180);
            }

            if (resultChartFill) {
                resultChartFill.style.opacity = "0";

                setTimeout(function () {
                    resultChartFill.setAttribute(
                        "d",
                        selectedData.line +
                        " L800,300 L0,300 Z"
                    );

                    resultChartFill.style.opacity = "1";
                }, 180);
            }

            if (resultChartTooltip) {
                resultChartTooltip.textContent =
                    selectedData.value;
            }

            if (resultChartMonths) {
                resultChartMonths.innerHTML = "";

                selectedData.months.forEach(function (month) {
                    const monthElement =
                        document.createElement("span");

                    monthElement.textContent = month;
                    resultChartMonths.appendChild(monthElement);
                });
            }
        });
    });
}
/*--- Student Results / Statistics Section End ---*/

/*--- Testimonials Section Start ---*/
const testimonialsSection = document.querySelector(".ec-ind-testimonials");

if (testimonialsSection) {
    const testimonialData = [
        {
            name: "Ananya Rao",
            role: "Frontend Developer",
            image: "assets/images/client-1.webp",
            course: "Modern Web Development",
            rating: "5.0 / 5",
            text: "Stackly completely changed the way I learn. Instead of watching endless tutorials, I finally started building projects that I could actually put in my portfolio."
        },
        {
            name: "Rahul Mehta",
            role: "Product Designer",
            image: "assets/images/client-3.webp",
            course: "UI/UX Design Masterclass",
            rating: "4.9 / 5",
            text: "The projects made the biggest difference for me. I stopped second-guessing my design decisions and started creating work that I was genuinely proud to show."
        },
        {
            name: "Maya Joseph",
            role: "Data Analyst",
            image: "assets/images/client-2.webp",
            course: "Data Science with Python",
            rating: "4.9 / 5",
            text: "I came to Stackly knowing almost nothing about data analysis. The structured lessons helped me understand the concepts and actually use them on real datasets."
        },
        {
            name: "Arjun Nair",
            role: "Digital Marketer",
            image: "assets/images/client-4.webp",
            course: "Digital Marketing Strategy",
            rating: "4.8 / 5",
            text: "What I loved most was the practical approach. Every lesson gave me something I could immediately test in a real marketing campaign."
        }
    ];

    const testimonialImage = testimonialsSection.querySelector(
        "#ec-ind-testimonial-image"
    );

    const testimonialStudent = testimonialsSection.querySelector(
        "#ec-ind-testimonial-student"
    );

    const testimonialRole = testimonialsSection.querySelector(
        "#ec-ind-testimonial-role"
    );

    const testimonialNumber = testimonialsSection.querySelector(
        "#ec-ind-testimonial-number"
    );

    const testimonialText = testimonialsSection.querySelector(
        "#ec-ind-testimonial-text"
    );

    const testimonialCourse = testimonialsSection.querySelector(
        "#ec-ind-testimonial-course"
    );

    const testimonialDots = testimonialsSection.querySelectorAll(
        ".ec-ind-testimonials-dots button"
    );

    const testimonialPreviewCards = testimonialsSection.querySelectorAll(
        ".ec-ind-testimonials-preview-card"
    );

    const testimonialPrev = testimonialsSection.querySelector(
        "#ec-ind-testimonial-prev"
    );

    const testimonialNext = testimonialsSection.querySelector(
        "#ec-ind-testimonial-next"
    );

    let testimonialCurrent = 0;
    let testimonialTimer;

    //--- Update Testimonial ---
    const updateTestimonial = function (index) {
        const testimonial = testimonialData[index];

        if (!testimonial) {
            return;
        }

        testimonialCurrent = index;

        const testimonialElements = [
            testimonialText,
            testimonialStudent,
            testimonialRole,
            testimonialCourse,
            testimonialNumber
        ];

        testimonialElements.forEach(function (element) {
            if (element) {
                element.style.opacity = "0";
                element.style.transform = "translateY(8px)";
            }
        });

        if (testimonialImage) {
            testimonialImage.style.opacity = "0";
            testimonialImage.style.transform = "scale(1.04)";
        }

        setTimeout(function () {
            if (testimonialImage) {
                testimonialImage.src = testimonial.image;
                testimonialImage.alt = testimonial.name;
            }

            if (testimonialStudent) {
                testimonialStudent.textContent = testimonial.name;
            }

            if (testimonialRole) {
                testimonialRole.textContent = testimonial.role;
            }

            if (testimonialNumber) {
                testimonialNumber.textContent =
                    String(index + 1).padStart(2, "0");
            }

            if (testimonialText) {
                testimonialText.textContent = testimonial.text;
            }

            if (testimonialCourse) {
                testimonialCourse.textContent = testimonial.course;
            }

            testimonialElements.forEach(function (element) {
                if (element) {
                    element.style.opacity = "1";
                    element.style.transform = "translateY(0)";
                }
            });

            if (testimonialImage) {
                testimonialImage.style.opacity = "1";
                testimonialImage.style.transform = "scale(1)";
            }
        }, 180);

        testimonialDots.forEach(function (dot, dotIndex) {
            dot.classList.toggle(
                "active",
                dotIndex === index
            );
        });

        testimonialPreviewCards.forEach(function (card, cardIndex) {
            card.classList.toggle(
                "active",
                cardIndex === index
            );
        });
    };

    //--- Next Testimonial ---
    const showNextTestimonial = function () {
        let nextIndex = testimonialCurrent + 1;

        if (nextIndex >= testimonialData.length) {
            nextIndex = 0;
        }

        updateTestimonial(nextIndex);
    };

    //--- Previous Testimonial ---
    const showPreviousTestimonial = function () {
        let previousIndex = testimonialCurrent - 1;

        if (previousIndex < 0) {
            previousIndex = testimonialData.length - 1;
        }

        updateTestimonial(previousIndex);
    };

    //--- Navigation Buttons ---
    if (testimonialNext) {
        testimonialNext.addEventListener("click", function () {
            showNextTestimonial();
            restartTestimonialTimer();
        });
    }

    if (testimonialPrev) {
        testimonialPrev.addEventListener("click", function () {
            showPreviousTestimonial();
            restartTestimonialTimer();
        });
    }

    //--- Dots ---
    testimonialDots.forEach(function (dot) {
        dot.addEventListener("click", function () {
            const selectedIndex = parseInt(
                dot.getAttribute("data-testimonial"),
                10
            );

            updateTestimonial(selectedIndex);
            restartTestimonialTimer();
        });
    });

    //--- Preview Cards ---
    testimonialPreviewCards.forEach(function (card) {
        card.addEventListener("click", function () {
            const selectedIndex = parseInt(
                card.getAttribute("data-testimonial"),
                10
            );

            updateTestimonial(selectedIndex);
            restartTestimonialTimer();
        });
    });

    //--- Auto Slider ---
    const startTestimonialTimer = function () {
        testimonialTimer = setInterval(function () {
            showNextTestimonial();
        }, 6000);
    };

    const stopTestimonialTimer = function () {
        clearInterval(testimonialTimer);
    };

    const restartTestimonialTimer = function () {
        stopTestimonialTimer();
        startTestimonialTimer();
    };

    testimonialsSection.addEventListener("mouseenter", function () {
        stopTestimonialTimer();
    });

    testimonialsSection.addEventListener("mouseleave", function () {
        startTestimonialTimer();
    });

    //--- Keyboard Navigation ---
    document.addEventListener("keydown", function (event) {
        const sectionBounds =
            testimonialsSection.getBoundingClientRect();

        const sectionVisible =
            sectionBounds.top < window.innerHeight &&
            sectionBounds.bottom > 0;

        if (!sectionVisible) {
            return;
        }

        if (event.key === "ArrowRight") {
            showNextTestimonial();
            restartTestimonialTimer();
        }

        if (event.key === "ArrowLeft") {
            showPreviousTestimonial();
            restartTestimonialTimer();
        }
    });

    //--- Initial State ---
    updateTestimonial(0);
    startTestimonialTimer();
}
/*--- Testimonials Section End ---*/

const ssIndBlogReadButtons = document.querySelectorAll(".ec-ind-popular-featured-play");
    if (ssIndBlogReadButtons.length) {
        ssIndBlogReadButtons.forEach(function (ssButton) {
            ssButton.addEventListener("click", function (ssEvent) {
                ssEvent.preventDefault();
                ssEvent.stopPropagation();
                window.location.href = "404.html";
            });
        });
    }

    
/*--- Scroll Reveal Animation Start ---*/
document.addEventListener("DOMContentLoaded", function () {

    const revealSelectors = [
        ".ec-ind-about-header",
        ".ec-ind-about-intro",
        ".ec-ind-about-journey",
        ".ec-ind-about-stat",
        ".ec-ind-popular-header",
        ".ec-ind-popular-featured",
        ".ec-ind-popular-card",
        ".ec-ind-popular-bottom",
        ".ec-ind-journey-header",
        ".ec-ind-journey-progress",
        ".ec-ind-journey-visual",
        ".ec-ind-journey-step",
        ".ec-ind-journey-bottom-item",
        ".ec-ind-results-header",
        ".ec-ind-results-primary",
        ".ec-ind-results-stat-card",
        ".ec-ind-results-dashboard",
        ".ec-ind-results-achievement",
        ".ec-ind-testimonials-header",
        ".ec-ind-testimonials-visual",
        ".ec-ind-testimonials-content",
        ".ec-ind-testimonials-preview-card",
        ".ec-ind-testimonials-trust",
        ".ec-ind-cta-content"
    ];

    const revealElements = [];

    revealSelectors.forEach(function (selector) {
        document.querySelectorAll(selector).forEach(function (element) {
            if (!element.classList.contains("ec-reveal")) {
                element.classList.add("ec-reveal");
            }

            revealElements.push(element);
        });
    });

    //--- Avoid Animating the Same Element More Than Once ---
    const uniqueElements = [...new Set(revealElements)];

    //--- Respect Reduced Motion Preferences ---
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
        uniqueElements.forEach(function (element) {
            element.classList.add("ec-reveal-visible");
        });

        return;
    }

    //--- Reveal Elements When They Enter the Viewport ---
    const revealObserver = new IntersectionObserver(
        function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("ec-reveal-visible");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );

    uniqueElements.forEach(function (element) {
        revealObserver.observe(element);
    });

});
/*--- Scroll Reveal Animation End ---*/
