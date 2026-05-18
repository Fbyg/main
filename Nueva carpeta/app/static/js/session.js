let sessionStatusInterval;
let sessionTimeInterval;
let sessionExpired = false;

/* =========================
   ESTADO DE SESIÓN
========================= */

function updateSessionStatus() {

    const token = keycloak.tokenParsed;
    const status = document.getElementById("status");

    if (!token || !keycloak.authenticated) {
        status.textContent = "🔴 Inactiva";
        status.style.color = "red";
        return;
    }

    const now = Math.floor(Date.now() / 1000);
    const isActive = token.exp > now;

    status.textContent = isActive ? "🟢 Activa" : "🔴 Inactiva";
    status.style.color = isActive ? "green" : "red";

    if (!isActive && !sessionExpired) {
        showExpiredSession();
    }
}

/* =========================
   TIEMPO RESTANTE
========================= */

function updateSessionTime() {

    const token = keycloak.tokenParsed;
    if (!token || sessionExpired) return;

    const diff = token.exp * 1000 - Date.now();

    if (diff <= 0) {
        showExpiredSession();
        return;
    }

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    document.getElementById("sessionTime").textContent =
        `${minutes}m ${seconds}s`;
}

/* =========================
   EXPIRACIÓN DE SESIÓN
========================= */

function showExpiredSession() {

    if (sessionExpired) return;
    sessionExpired = true;

    clearAllIntervals();

    const overlay = document.getElementById("expiredOverlay");
    overlay.classList.remove("hidden");

    document.body.style.pointerEvents = "none";
    overlay.style.pointerEvents = "all";
}

/* =========================
   LIMPIAR INTERVALOS
========================= */

function clearAllIntervals() {

    if (sessionStatusInterval) clearInterval(sessionStatusInterval);
    if (sessionTimeInterval) clearInterval(sessionTimeInterval);
}

/* =========================
   INICIAR TIMERS
========================= */

function startSessionTimers() {

    sessionStatusInterval = setInterval(updateSessionStatus, 10000);
    sessionTimeInterval = setInterval(updateSessionTime, 1000);
}

/* =========================
   BOTÓN RELOGIN
========================= */

function initReloginButton() {

    const btn = document.getElementById("reloginBtn");

    if (!btn) return;

    btn.addEventListener("click", () => {
        keycloak.login({
            redirectUri: window.location.origin,
            prompt: "login"
        });
    });
}

/* =========================
   KEYCLOAK EVENTO EXPIRACIÓN
========================= */

keycloak.onTokenExpired = () => {
    showExpiredSession();
};