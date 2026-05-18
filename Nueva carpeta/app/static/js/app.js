document.addEventListener("DOMContentLoaded", () => {

    initAuth(() => {

        loadUserProfile();

        const prefs = getUserPreferences();

        if (prefs.theme === "dark") {
            document.body.classList.add("dark");
            document.getElementById("themeToggle").textContent = "☀️";
        }

        updateSessionStatus();
        updateSessionTime();

        startSessionTimers();
    });
});