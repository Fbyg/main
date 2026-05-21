document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("themeToggle");

    if (!btn) {
        console.warn("[UI] themeToggle button not found");
        return;
    }

    function applyTheme(theme) {
        document.body.classList.toggle("dark", theme === "dark");
        btn.textContent = theme === "dark" ? "☀️" : "🌙";
    }

    btn.addEventListener("click", () => {

        const prefs = getUserPreferences?.() || { theme: "light" };

        const newTheme = document.body.classList.contains("dark")
            ? "light"
            : "dark";

        prefs.theme = newTheme;

        if (typeof saveUserPreferences === "function") {
            saveUserPreferences(prefs);
        } else {
            console.warn("[UI] saveUserPreferences not available");
        }

        applyTheme(newTheme);
    });

    const prefs = getUserPreferences?.() || { theme: "light" };
    applyTheme(prefs.theme || "light");
});