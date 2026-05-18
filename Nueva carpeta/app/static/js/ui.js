document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("themeToggle");

    function applyTheme(theme) {
        document.body.classList.toggle("dark", theme === "dark");
        btn.textContent = theme === "dark" ? "☀️" : "🌙";
    }

    btn.addEventListener("click", () => {

        const prefs = getUserPreferences();

        const newTheme = document.body.classList.contains("dark")
            ? "light"
            : "dark";

        prefs.theme = newTheme;
        saveUserPreferences(prefs);

        applyTheme(newTheme);
    });

    // aplicar tema inicial
    const prefs = getUserPreferences();
    applyTheme(prefs.theme || "light");
});