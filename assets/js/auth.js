//--- Login Page ---
document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.querySelector("#ec-lgn-form");
    const emailInput = document.querySelector("#ec-lgn-email");
    const passwordInput = document.querySelector("#ec-lgn-password");
    const passwordToggle = document.querySelector("#ec-lgn-password-toggle");
    const rememberCheckbox = document.querySelector("#ec-lgn-remember");
    const roleOptions = document.querySelectorAll(".ec-lgn-role-option");
    const yearElement = document.querySelector("#ec-lgn-year");

    if (!loginForm) {
        return;
    }


    //--- Footer Year ---
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    //--- Restore Remembered Email ---
    try {
        const rememberedEmail = localStorage.getItem("ec-lgn-remembered-email");

        if (rememberedEmail) {
            emailInput.value = rememberedEmail;
            rememberCheckbox.checked = true;
        }
    } catch (error) {
        console.warn("Remembered email is unavailable in this browser.");
    }


    //--- Password Visibility ---
    passwordToggle.addEventListener("click", function () {

        const showPassword = passwordInput.type === "password";

        passwordInput.type = showPassword ? "text" : "password";

        passwordToggle.innerHTML = showPassword
            ? '<i class="bi bi-eye-slash"></i>'
            : '<i class="bi bi-eye"></i>';

        passwordToggle.setAttribute(
            "aria-label",
            showPassword ? "Hide password" : "Show password"
        );

        passwordToggle.setAttribute(
            "aria-pressed",
            String(showPassword)
        );

    });


    //--- Admin / Client Role Selection ---
    roleOptions.forEach(function (option) {

        const roleInput = option.querySelector('input[name="login-role"]');

        roleInput.addEventListener("change", function () {

            roleOptions.forEach(function (item) {
                item.classList.remove("active");
            });

            if (roleInput.checked) {
                option.classList.add("active");
            }

        });

    });


    //--- Login Submission ---
    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();

        //--- Use Native Browser Validation ---
        if (!loginForm.checkValidity()) {
            loginForm.reportValidity();
            return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const selectedRole = document.querySelector(
            'input[name="login-role"]:checked'
        );

        if (!selectedRole) {
            return;
        }

        const role = selectedRole.value;

        //--- Remember Email Only When Requested ---
        try {
            if (rememberCheckbox.checked) {
                localStorage.setItem(
                    "ec-lgn-remembered-email",
                    email
                );
            } else {
                localStorage.removeItem("ec-lgn-remembered-email");
            }

            //--- Store Current Session Details ---
            sessionStorage.setItem("ec-user-email", email);
            sessionStorage.setItem("ec-user-role", role);

        } catch (error) {
            console.warn("Browser storage is unavailable.");
        }

        /*
         * Front-end demo routing only.
         * This does not authenticate or authorize the user.
         * Verify credentials and role permissions on your backend
         * before using these redirects in production.
         */

        if (role === "admin") {
            window.location.href = "admin-dashboard.html";
        } else {
            window.location.href = "client-dashboard.html";
        }

    });

});
//--- End Login Page ---

//--- Register Page ---
document.addEventListener("DOMContentLoaded", function () {

    const registerForm = document.querySelector("#ec-reg-form");
    const nameInput = document.querySelector("#ec-reg-name");
    const phoneInput = document.querySelector("#ec-reg-phone");
    const emailInput = document.querySelector("#ec-reg-email");
    const passwordInput = document.querySelector("#ec-reg-password");
    const confirmPasswordInput = document.querySelector("#ec-reg-confirm-password");

    const passwordToggle = document.querySelector("#ec-reg-password-toggle");
    const confirmToggle = document.querySelector("#ec-reg-confirm-toggle");

    const roleOptions = document.querySelectorAll(".ec-lgn-role-option");
    const yearElement = document.querySelector("#ec-reg-year");

    if (!registerForm) {
        return;
    }


    //--- Footer Year ---
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    //--- Name: Letters and Spaces Only ---
    nameInput.addEventListener("input", function () {

        this.value = this.value.replace(/[^A-Za-z ]/g, "");

        this.setCustomValidity("");

    });


    //--- Phone: Numbers Only, Maximum 10 Digits ---
    phoneInput.addEventListener("input", function () {

        this.value = this.value.replace(/\D/g, "").slice(0, 10);

        this.setCustomValidity("");

    });


    //--- Password Visibility ---
    function setupPasswordToggle(input, button, showLabel, hideLabel) {

        button.addEventListener("click", function () {

            const showPassword = input.type === "password";

            input.type = showPassword ? "text" : "password";

            button.innerHTML = showPassword
                ? '<i class="bi bi-eye-slash"></i>'
                : '<i class="bi bi-eye"></i>';

            button.setAttribute(
                "aria-label",
                showPassword ? hideLabel : showLabel
            );

            button.setAttribute(
                "aria-pressed",
                String(showPassword)
            );

        });

    }

    setupPasswordToggle(
        passwordInput,
        passwordToggle,
        "Show password",
        "Hide password"
    );

    setupPasswordToggle(
        confirmPasswordInput,
        confirmToggle,
        "Show confirm password",
        "Hide confirm password"
    );


    //--- Validate Password Match ---
    function validatePasswordMatch() {

        if (
            confirmPasswordInput.value &&
            confirmPasswordInput.value !== passwordInput.value
        ) {
            confirmPasswordInput.setCustomValidity(
                "Passwords do not match."
            );
        } else {
            confirmPasswordInput.setCustomValidity("");
        }

    }

    passwordInput.addEventListener("input", function () {
        validatePasswordMatch();
    });

    confirmPasswordInput.addEventListener("input", function () {
        validatePasswordMatch();
    });


    //--- Admin / Client Role Selection ---
    roleOptions.forEach(function (option) {

        const roleInput = option.querySelector(
            'input[name="register-role"]'
        );

        roleInput.addEventListener("change", function () {

            roleOptions.forEach(function (item) {
                item.classList.remove("active");
            });

            if (roleInput.checked) {
                option.classList.add("active");
            }

        });

    });


    //--- Register Submission ---
    registerForm.addEventListener("submit", function (event) {

        event.preventDefault();

        validatePasswordMatch();

        //--- Native Browser Validation ---
        if (!registerForm.checkValidity()) {
            registerForm.reportValidity();
            return;
        }

        const selectedRole = document.querySelector(
            'input[name="register-role"]:checked'
        );

        if (!selectedRole) {
            return;
        }

        const profile = {
            name: nameInput.value.trim(),
            phone: phoneInput.value,
            email: emailInput.value.trim(),
            role: selectedRole.value
        };

        try {

            localStorage.setItem(
                "ec-user-profile",
                JSON.stringify(profile)
            );

            //--- Save Email for the Login Page ---
            localStorage.setItem(
                "ec-lgn-remembered-email",
                profile.email
            );

        } catch (error) {

            alert(
                "Your browser could not save your profile. " +
                "Please enable browser storage and try again."
            );

            return;
        }


        //--- Redirect to Login ---
        window.location.href = "login.html";

    });

});
//--- End Register Page ---