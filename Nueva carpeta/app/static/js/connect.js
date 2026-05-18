function pauseApp() {
    const overlay = document.getElementById("offlineOverlay");

    if (overlay) overlay.classList.remove("hidden");

    document.body.style.pointerEvents = "none";
}
function resumeApp() {
    const overlay = document.getElementById("offlineOverlay");

    if (overlay) overlay.classList.add("hidden");

    document.body.style.pointerEvents = "auto";
}
function showOnlinePopup() {

    const popup = document.getElementById("onlinePopup");

    if (!popup) return;

    popup.classList.remove("hidden");

    setTimeout(() => {
        popup.classList.add("hidden");
    }, 4000);
}