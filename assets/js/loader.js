//--- Loader ---
const ecLoader = document.getElementById("ec-loader");
const ecLoaderMessage = document.getElementById("ec-loader-message");
const ecLoaderParticles = document.getElementById("ec-loader-particles");

let ecLoaderMessageInterval = null;
let ecLoaderHideTimeout = null;
let ecLoaderMessageTimeout = null;

//--- Loader Messages ---
const ecLoaderMessages = [
    "Preparing your learning space...",
    "Getting your courses ready...",
    "Setting up your experience...",
    "Loading ideas and inspiration...",
    "Almost ready to learn..."
];

let ecLoaderMessageIndex = 0;

//--- Show Loader ---
function ecShowLoader() {
    if (!ecLoader) {
        return;
    }

    clearTimeout(ecLoaderHideTimeout);
    clearTimeout(ecLoaderMessageTimeout);
    clearInterval(ecLoaderMessageInterval);

    ecLoader.style.display = "flex";

    ecLoader.classList.remove(
        "ec-loader-hidden",
        "ec-loader-exit"
    );

    document.body.classList.add("ec-loader-active");

    ecLoaderMessageIndex = 0;

    if (ecLoaderMessage) {
        ecLoaderMessage.textContent = ecLoaderMessages[0];
        ecLoaderMessage.style.opacity = "1";
        ecLoaderMessage.style.transform = "translateY(0)";
    }

    ecLoaderMessageInterval = setInterval(function () {
        ecLoaderMessageIndex++;

        if (ecLoaderMessageIndex >= ecLoaderMessages.length) {
            ecLoaderMessageIndex = 0;
        }

        if (!ecLoaderMessage) {
            return;
        }

        ecLoaderMessage.style.opacity = "0";
        ecLoaderMessage.style.transform = "translateY(6px)";

        ecLoaderMessageTimeout = setTimeout(function () {
            if (!ecLoaderMessage) {
                return;
            }

            ecLoaderMessage.textContent =
                ecLoaderMessages[ecLoaderMessageIndex];

            ecLoaderMessage.style.opacity = "1";
            ecLoaderMessage.style.transform = "translateY(0)";
        }, 250);
    }, 1500);
}

//--- Hide Loader ---
function ecHideLoader() {
    if (!ecLoader) {
        return;
    }

    clearTimeout(ecLoaderHideTimeout);

    ecLoaderHideTimeout = setTimeout(function () {
        clearInterval(ecLoaderMessageInterval);
        clearTimeout(ecLoaderMessageTimeout);

        ecLoader.classList.add("ec-loader-exit");

        document.body.classList.remove("ec-loader-active");

        setTimeout(function () {
            if (!ecLoader) {
                return;
            }

            ecLoader.classList.add("ec-loader-hidden");
            ecLoader.style.display = "none";
        }, 700);
    }, 450);
}

//--- Create Particles ---
function ecCreateLoaderParticles() {
    if (!ecLoaderParticles) {
        return;
    }

    if (
        ecLoaderParticles.querySelector(
            ".ec-loader-particle"
        )
    ) {
        return;
    }

    for (let i = 0; i < 35; i++) {
        const ecParticle = document.createElement("span");

        ecParticle.className = "ec-loader-particle";

        ecParticle.style.left =
            Math.random() * 100 + "%";

        ecParticle.style.top =
            Math.random() * 100 + "%";

        const ecParticleSize =
            2 + Math.random() * 3;

        ecParticle.style.width =
            ecParticleSize + "px";

        ecParticle.style.height =
            ecParticleSize + "px";

        ecParticle.style.animationDelay =
            Math.random() * 5 + "s";

        ecParticle.style.animationDuration =
            4 + Math.random() * 5 + "s";

        ecLoaderParticles.appendChild(
            ecParticle
        );
    }
}

//--- Mouse Glow ---
document.addEventListener(
    "mousemove",
    function (ecLoaderEvent) {
        if (
            !ecLoader ||
            ecLoader.classList.contains(
                "ec-loader-hidden"
            )
        ) {
            return;
        }

        ecLoader.style.setProperty(
            "--ec-loader-x",
            ecLoaderEvent.clientX + "px"
        );

        ecLoader.style.setProperty(
            "--ec-loader-y",
            ecLoaderEvent.clientY + "px"
        );
    }
);

//--- Initial Page Load ---
document.addEventListener(
    "DOMContentLoaded",
    function () {
        ecCreateLoaderParticles();
        ecShowLoader();
    }
);

//--- Window Loaded ---
window.addEventListener(
    "load",
    function () {
        ecHideLoader();
    }
);

//--- Browser Back / Forward ---
window.addEventListener(
    "pageshow",
    function (ecLoaderEvent) {
        if (ecLoaderEvent.persisted) {
            if (ecLoader) {
                ecLoader.style.display = "flex";
            }

            ecShowLoader();

            setTimeout(function () {
                ecHideLoader();
            }, 500);
        }
    }
);
//--- End Loader ---