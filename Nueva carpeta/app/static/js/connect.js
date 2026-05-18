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
    }, 2000);
}

window.addEventListener("offline", () => {
    pauseApp();
});

window.addEventListener("online", async () => {
    // primero restauras UI SIEMPRE
    resumeApp();
    showOnlinePopup();

    // luego validas token (opcional)
    try {
        await keycloak.updateToken(5);
    } catch (e) {
        console.warn("Token inválido tras reconexión");
        keycloak.login();
    }
});