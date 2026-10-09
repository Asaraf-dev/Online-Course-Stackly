/*--- Contact Form Section Start ---*/
document.addEventListener("DOMContentLoaded", function () {

    const contactForm = document.querySelector("#ec-cnt-contact-form");
    const nameInput = document.querySelector("#ec-cnt-name");
    const phoneInput = document.querySelector("#ec-cnt-phone");

    const popup = document.querySelector("#ec-cnt-form-popup");
    const popupClose = document.querySelector("#ec-cnt-form-popup-close");
    const popupButton = document.querySelector("#ec-cnt-form-popup-button");
    const popupOverlay = document.querySelector(".ec-cnt-form-popup-overlay");

    if (!contactForm) {
        return;
    }


    //--- Name: Allow alphabets and spaces only ---
    nameInput.addEventListener("input", function () {

        this.value = this.value.replace(/[^A-Za-z ]/g, "");

    });


    //--- Phone: Allow numbers only ---
    phoneInput.addEventListener("input", function () {

        this.value = this.value.replace(/[^0-9]/g, "").slice(0, 10);

    });


    //--- Open Success Popup ---
    const openPopup = function () {

        popup.classList.add("active");
        popup.setAttribute("aria-hidden", "false");
        document.body.classList.add("ec-cnt-form-popup-open");

        popupButton.focus();

    };


    //--- Close Success Popup ---
    const closePopup = function () {

        popup.classList.remove("active");
        popup.setAttribute("aria-hidden", "true");
        document.body.classList.remove("ec-cnt-form-popup-open");

    };


    //--- Form Submit ---
    contactForm.addEventListener("submit", function (event) {

        /*
         * Browser native validation is intentionally used.
         * If any required field, email, name, or phone validation fails,
         * the browser displays its default validation message.
         */

        if (!contactForm.checkValidity()) {
            return;
        }

        event.preventDefault();

        openPopup();

        contactForm.reset();

    });


    //--- Close Popup Button ---
    popupClose.addEventListener("click", function () {

        closePopup();

    });


    //--- Done Button ---
    popupButton.addEventListener("click", function () {

        closePopup();

    });


    //--- Close Popup When Overlay Is Clicked ---
    popupOverlay.addEventListener("click", function () {

        closePopup();

    });


    //--- Close Popup With Escape ---
    document.addEventListener("keydown", function (event) {

        if (event.key === "Escape" && popup.classList.contains("active")) {
            closePopup();
        }

    });

});
/*--- Contact Form Section End ---*/

/*--- FAQ Section Start ---*/
document.addEventListener("DOMContentLoaded", function () {

    const faqItems = document.querySelectorAll(".ec-cnt-faq-item");

    if (!faqItems.length) {
        return;
    }


    faqItems.forEach(function (item) {

        const question = item.querySelector(".ec-cnt-faq-question");

        question.addEventListener("click", function () {

            const isActive = item.classList.contains("active");


            //--- Close All FAQ Items ---
            faqItems.forEach(function (faqItem) {

                faqItem.classList.remove("active");

                const faqQuestion = faqItem.querySelector(
                    ".ec-cnt-faq-question"
                );

                faqQuestion.setAttribute(
                    "aria-expanded",
                    "false"
                );

            });


            //--- Open Selected FAQ ---
            if (!isActive) {

                item.classList.add("active");

                question.setAttribute(
                    "aria-expanded",
                    "true"
                );

            }

        });

    });

});
/*--- FAQ Section End ---*/

//--- Contact Page Scroll Reveal Animation ---

document.addEventListener("DOMContentLoaded", function () {
    const revealSelectors = [
        ".ec-all-hero-breadcrumb",
        ".ec-all-hero-eyebrow",
        ".ec-all-hero-title",
        ".ec-all-hero-description",
        ".ec-all-hero-meta",
        ".ec-cnt-intro-content",
        ".ec-cnt-intro-bottom",
        ".ec-cnt-form-content",
        ".ec-cnt-location-content",
        ".ec-cnt-location-meta",
        ".ec-cnt-faq-content",
        ".ec-cnt-faq-bottom",
        ".ec-all-cta-content"
    ];

    const revealLeftSelectors = [
        ".ec-all-hero-visual",
        ".ec-cnt-intro-details",
        ".ec-cnt-form-points",
        ".ec-cnt-location-address",
        ".ec-cnt-faq-list"
    ];

    const revealRightSelectors = [
        ".ec-cnt-form-card",
        ".ec-cnt-location-visual",
        ".ec-cnt-intro-note",
        ".ec-cnt-form-response",
        ".ec-all-cta-visual"
    ];

    const revealScaleSelectors = [
        ".ec-cnt-intro-detail",
        ".ec-cnt-form-point",
        ".ec-cnt-location-meta-item",
        ".ec-cnt-faq-item"
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
            document.querySelectorAll(selector).forEach(
                function (element, index) {
                    element.classList.add(revealClass);

                    // Stagger repeated cards and items.
                    if (
                        revealClass === "ec-cnt-reveal-scale" &&
                        element.matches(
                            ".ec-cnt-intro-detail, .ec-cnt-form-point, " +
                            ".ec-cnt-location-meta-item, .ec-cnt-faq-item"
                        )
                    ) {
                        element.classList.add(
                            "ec-cnt-reveal-delay-" +
                            ((index % 4) + 1)
                        );
                    }
                }
            );
        });
    }

    prepareReveal(revealSelectors, "ec-cnt-reveal");
    prepareReveal(revealLeftSelectors, "ec-cnt-reveal-left");
    prepareReveal(revealRightSelectors, "ec-cnt-reveal-right");
    prepareReveal(revealScaleSelectors, "ec-cnt-reveal-scale");

    // Reveal elements when they enter the viewport.
    const revealElements = document.querySelectorAll(
        ".ec-cnt-reveal, .ec-cnt-reveal-left, " +
        ".ec-cnt-reveal-right, .ec-cnt-reveal-scale"
    );

    const revealObserver = new IntersectionObserver(
        function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add(
                        "ec-cnt-reveal-visible"
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

//--- End Contact Page Scroll Reveal Animation ---