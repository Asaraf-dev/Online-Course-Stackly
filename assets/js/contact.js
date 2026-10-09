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