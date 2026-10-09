//--- 404 ---
document.addEventListener("DOMContentLoaded", function () {
    const backButton = document.querySelector("#ec-404-back");

    if (!backButton) {
        return;
    }

    //--- Go Back ---
    const goBack = function () {
        const currentPage = window.location.href;
        const previousPage = document.referrer;

        if (
            previousPage &&
            previousPage !== currentPage &&
            window.history.length > 1
        ) {
            window.history.back();
        } else {
            window.location.href = "index.html";
        }
    };

    //--- Back Button ---
    backButton.addEventListener("click", function () {
        goBack();
    });
});
//--- End 404 ---