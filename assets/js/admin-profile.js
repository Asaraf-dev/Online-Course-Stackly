//--- Admin Profile ---
document.addEventListener("DOMContentLoaded", function () {

    //--- Profile Elements ---
    const profileForm = document.getElementById("ec-adm-pro-form");
    const nameInput = document.getElementById("ec-adm-pro-name");
    const phoneInput = document.getElementById("ec-adm-pro-phone");
    const emailInput = document.getElementById("ec-adm-pro-email");
    const roleInput = document.getElementById("ec-adm-pro-role");
    const accountEmailInput = document.getElementById("ec-adm-pro-account-email");

    const summaryName = document.getElementById("ec-adm-pro-summary-name");
    const summaryEmail = document.getElementById("ec-adm-pro-summary-email");
    const summaryRole = document.getElementById("ec-adm-pro-summary-role");
    const summaryInitials = document.getElementById("ec-adm-pro-avatar-initials");
    const summaryAvatar = document.getElementById("ec-adm-pro-avatar-image");

    const detailRole = document.getElementById("ec-adm-pro-detail-role");
    const detailEmail = document.getElementById("ec-adm-pro-detail-email");

    const formMessage = document.getElementById("ec-adm-pro-form-message");
    const toast = document.getElementById("ec-adm-pro-toast");
    const toastText = document.getElementById("ec-adm-pro-toast-text");

    if (!profileForm) {
        return;
    }

    let originalName = "";
    let originalPhone = "";
    let toastTimer;


    //--- Read Browser Storage Safely ---
    function readStorage(storage, key) {
        try {
            return storage.getItem(key);
        } catch (error) {
            return null;
        }
    }


    //--- Read Registered Profile ---
    function readProfile() {
        const storedProfile = readStorage(localStorage, "ec-user-profile");

        if (!storedProfile) {
            return null;
        }

        try {
            const profile = JSON.parse(storedProfile);

            if (!profile || typeof profile !== "object") {
                return null;
            }

            return profile;

        } catch (error) {
            console.warn("The saved profile could not be read.");
            return null;
        }
    }


    //--- Current Login Session ---
    //--- Current Login Session ---
    const profile = readProfile();

    const sessionEmail = readStorage(sessionStorage, "ec-user-email");
    const sessionRole = readStorage(sessionStorage, "ec-user-role");
    const rememberedEmail = readStorage(localStorage, "ec-lgn-remembered-email");

    const registeredEmail = profile && profile.email
        ? String(profile.email).trim()
        : "";

    const loginEmail = (
        sessionEmail ||
        registeredEmail ||
        rememberedEmail ||
        ""
    ).trim();

    const accountRole = sessionRole || (profile && profile.role) || "admin";


    //--- Format Role Name ---
    function formatRole(role) {
        const normalizedRole = String(role || "admin").toLowerCase();

        if (normalizedRole === "admin") {
            return "Administrator";
        }

        if (normalizedRole === "client") {
            return "Client";
        }

        return normalizedRole.charAt(0).toUpperCase() +
            normalizedRole.slice(1);
    }


    //--- Generate Profile Initials ---
    function getInitials(name) {
        const words = String(name || "Administrator")
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        if (words.length === 0) {
            return "A";
        }

        if (words.length === 1) {
            return words[0].charAt(0).toUpperCase();
        }

        return (
            words[0].charAt(0) +
            words[words.length - 1].charAt(0)
        ).toUpperCase();
    }


    //--- Display Toast Message ---
    function showToast(message, isError) {
        clearTimeout(toastTimer);

        toastText.textContent = message;
        toast.classList.toggle("error", Boolean(isError));
        toast.classList.add("show");

        toastTimer = setTimeout(function () {
            toast.classList.remove("show");
        }, 3500);
    }


    //--- Update Form Message ---
    function setFormMessage(message, isError) {
        formMessage.replaceChildren();

        const icon = document.createElement("i");

        icon.className = isError
            ? "bi bi-exclamation-circle"
            : "bi bi-info-circle";

        formMessage.append(icon, document.createTextNode(" " + message));
        formMessage.style.color = isError
            ? "var(--pd-danger)"
            : "";
    }



    //--- Render Profile Information ---
    function renderProfile() {
        const name = profile && profile.name
            ? String(profile.name).trim()
            : "";

        const phone = profile && profile.phone
            ? String(profile.phone).trim()
            : "";

        const displayName = name || "Administrator";
        const roleName = formatRole(accountRole);

        //--- Safely Update Form Fields ---
        if (nameInput) nameInput.value = name;
        if (phoneInput) phoneInput.value = phone;
        if (emailInput) emailInput.value = loginEmail;
        if (roleInput) roleInput.value = roleName;

        if (accountEmailInput) {
            accountEmailInput.value =
                registeredEmail || loginEmail || "Not available";
        }

        //--- Safely Update Profile Summary ---
        if (summaryName) {
            summaryName.textContent = displayName;
        }

        if (summaryEmail) {
            summaryEmail.textContent =
                loginEmail || "No login email available";
        }

        if (summaryRole) {
            summaryRole.textContent = roleName;
        }

        if (summaryInitials) {
            summaryInitials.textContent = getInitials(displayName);
        }

        //--- Safely Update Account Details ---
        if (detailRole) {
            detailRole.textContent = roleName;
        }

        if (detailEmail) {
            detailEmail.textContent = loginEmail || "Not available";
        }

        originalName = name;
        originalPhone = phone;

        //--- Report Missing Elements ---
        [
            ["ec-adm-pro-summary-role", summaryRole],
            ["ec-adm-pro-detail-email", detailEmail],
            ["ec-adm-pro-form-message", formMessage],
            ["ec-adm-pro-toast", toast],
            ["ec-adm-pro-toast-text", toastText]
        ].forEach(function (item) {
            if (!item[1]) {
                console.warn("Missing profile HTML element:", item[0]);
            }
        });
    }



    //--- Load Profile ---
    renderProfile();



    //--- Name: Allow Letters and Spaces Only ---
    nameInput.addEventListener("input", function () {
        const cursorPosition = this.selectionStart;
        const previousValue = this.value;
        const filteredValue = previousValue.replace(/[^A-Za-z ]/g, "");

        if (previousValue !== filteredValue) {
            this.value = filteredValue;

            const newPosition = Math.min(
                cursorPosition - 1,
                filteredValue.length
            );

            this.setSelectionRange(
                Math.max(0, newPosition),
                Math.max(0, newPosition)
            );
        }

        this.setCustomValidity("");
    });

    //--- Phone: Allow Numbers Only, Maximum 10 Digits ---
    phoneInput.addEventListener("input", function () {
        this.value = this.value.replace(/[^0-9]/g, "").slice(0, 10);
        this.setCustomValidity("");
    });



    //--- Save Profile Changes ---
    profileForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!profileForm.checkValidity()) {
            profileForm.reportValidity();
            return;
        }

        const name = nameInput.value.trim().replace(/\s+/g, " ");
        const phone = phoneInput.value.trim();

        if (!/^[A-Za-z ]+$/.test(name)) {
            nameInput.setCustomValidity(
                "Please enter a name using letters and spaces only."
            );

            nameInput.reportValidity();
            return;
        }

        if (!/^\d{10}$/.test(phone)) {
            phoneInput.setCustomValidity(
                "Please enter exactly 10 digits."
            );

            phoneInput.reportValidity();
            return;
        }
    });



    //--- Restore Initials When Avatar Cannot Load ---
    summaryAvatar.addEventListener("error", function () {
        summaryAvatar.style.display = "none";
    });


});
//--- End Admin Profile ---


const ssIndBlogReadButtons = document.querySelectorAll(".ec-adm-pro-reset-btn,.ec-adm-pro-save-btn");
if (ssIndBlogReadButtons.length) {
    ssIndBlogReadButtons.forEach(function (ssButton) {
        ssButton.addEventListener("click", function (ssEvent) {
            ssEvent.preventDefault();
            ssEvent.stopPropagation();
            window.location.href = "404.html";
        });
    });
}