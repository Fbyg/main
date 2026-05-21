document.addEventListener("DOMContentLoaded", () => {

    initAuth(
        () => {

            // ✔ USUARIO LOGUEADO → DASHBOARD
            loadUserProfile();

            const prefs = getUserPreferences();

            if (prefs.theme === "dark") {
                document.body.classList.add("dark");
                document.getElementById("themeToggle").textContent = "☀️";
            }

            updateSessionStatus();
            updateSessionTime();

            startSessionTimers();
        },
        () => {

            // ❌ NO LOGUEADO → TU LOGIN PROPIO
            console.log("[APP] mostrando login propio");

            document.getElementById("loginScreen")?.classList.remove("hidden");
        }
    );

});