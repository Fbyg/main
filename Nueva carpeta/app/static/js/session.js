let sessionExpired = false;

let countdownInterval = null;
let refreshInterval = null;

const IDLE_TIME = 2 * 60 * 1000; // 2 min inactividad
let idleTimeout = null;

// -------------------------
// SAFE TOKEN ACCESS
// -------------------------
function getToken() {
    return keycloak?.tokenParsed || null;
}

// -------------------------
// AUTO REFRESH TOKEN
// -------------------------
function startAutoRefresh() {

    if (refreshInterval) clearInterval(refreshInterval);

    refreshInterval = setInterval(() => {

        if (!keycloak?.authenticated) return;

        keycloak.updateToken(30)
            .then(refreshed => {
                if (refreshed) {
                    console.log("[SESSION] Token renovado");
                }
            })
            .catch(err => {
                console.warn("[SESSION] refresh failed", err);
                showExpiredSession();
            });

    }, 10000); // 👈 correcto
}

// -------------------------
// IDLE DETECTION
// -------------------------
function resetIdleTimer() {

    if (sessionExpired) return;

    clearTimeout(idleTimeout);

    idleTimeout = setTimeout(() => {
        console.warn("[SESSION] Usuario inactivo");
        showExpiredSession();
    }, IDLE_TIME);
}

function startIdleDetection() {

    ["mousemove", "keydown", "click", "scroll", "touchstart"]
        .forEach(evt => window.addEventListener(evt, resetIdleTimer));

    resetIdleTimer();
}

// -------------------------
// SESSION STATUS UI
// -------------------------
function updateSessionStatus() {

    const token = getToken();
    const el = document.getElementById("status");

    if (!el) return;

    if (!token || !keycloak?.authenticated) {
        el.textContent = "🔴 Inactiva";
        el.style.color = "red";
        return;
    }

    const now = Math.floor(Date.now() / 1000);
    const active = token.exp && token.exp > now;

    el.textContent = active ? "🟢 Activa" : "🔴 Inactiva";
    el.style.color = active ? "green" : "red";

    if (!active) {
        showExpiredSession();
    }
}

// -------------------------
// COUNTDOWN CORRECTO
// -------------------------
function startSessionCountdown() {

    if (countdownInterval) clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {

        if (!keycloak?.authenticated || sessionExpired) return;

        const token = keycloak.tokenParsed; // 👈 directo
        if (!token?.exp) return;

        const now = Math.floor(Date.now() / 1000);
        const diff = token.exp - now;

        const el = document.getElementById("sessionTime");
        if (!el) return;

        if (diff <= 0) {
            showExpiredSession();
            return;
        }

        const minutes = Math.floor(diff / 60);
        const seconds = diff % 60;

        el.textContent =
            `${minutes}m ${seconds.toString().padStart(2, "0")}s`;

    }, 1000);
}

// -------------------------
// EXPIRED SESSION HANDLER
// -------------------------
function showExpiredSession() {

    if (sessionExpired) return;
    sessionExpired = true;

    console.warn("[SESSION] Sesión expirada");

    // limpiar token
    try {
        keycloak.clearToken();
    } catch (e) {
        console.warn("[SESSION] clearToken error", e);
    }

    // detener timers
    if (countdownInterval) clearInterval(countdownInterval);
    if (refreshInterval) clearInterval(refreshInterval);
    clearTimeout(idleTimeout);

    // mostrar overlay
    const overlay = document.getElementById("expiredOverlay");

    if (overlay) {
        overlay.classList.remove("hidden");
        overlay.style.display = "flex";
    }

    // bloquear UI
    document.body.style.pointerEvents = "none";
}

// -------------------------
// INIT SYSTEM
// -------------------------
function startSessionTimers() {

    sessionExpired = false;

    startAutoRefresh();
    startIdleDetection();
    startSessionCountdown();

    console.log("[SESSION] Sistema iniciado");
}