let sessionStatusInterval;
let sessionTimeInterval;
let sessionExpired = false;

function getTokenSafe() {
    return keycloak?.tokenParsed || null;
}

function updateSessionStatus() {

    const token = getTokenSafe();
    const status = document.getElementById("status");

    if (!token || !keycloak.authenticated) {
        status.textContent = "🔴 Inactiva";
        status.style.color = "red";
        return;
    }

    const now = Math.floor(Date.now() / 1000);

    const isActive = token.exp && token.exp > now;

    status.textContent = isActive ? "🟢 Activa" : "🔴 Inactiva";
    status.style.color = isActive ? "green" : "red";

    if (!isActive && !sessionExpired) {
        showExpiredSession();
    }
}

function updateSessionTime() {

    const token = getTokenSafe();
    if (!token || sessionExpired) return;

    const exp = Number(token.exp);

    if (!exp) return showExpiredSession();

    const diff = exp * 1000 - Date.now();

    if (diff <= 0) {
        showExpiredSession();
        return;
    }

    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    const el = document.getElementById("sessionTime");
    if (el) el.textContent = `${minutes}m ${seconds}s`;
}

function showExpiredSession() {

    if (sessionExpired) return;
    sessionExpired = true;

    clearAllIntervals();

    try {
        keycloak.clearToken();
    } catch (e) {
        console.warn("[SESSION] clearToken failed", e);
    }

    const overlay = document.getElementById("expiredOverlay");

    if (overlay) overlay.classList.remove("hidden");

    document.body.style.pointerEvents = "none";
}

let sessionIntervals = [];

function startSessionTimers() {

    clearAllIntervals();

    const interval = setInterval(() => {

        updateSessionStatus();
        updateSessionTime();

    }, 1000);

    sessionIntervals.push(interval);
}

function clearAllIntervals() {
    sessionIntervals.forEach(clearInterval);
    sessionIntervals = [];
}
