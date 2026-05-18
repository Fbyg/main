const btn = document.getElementById("themeToggle");

btn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    const prefs = getUserPreferences();

    prefs.theme = document.body.classList.contains("dark")
        ? "dark"
        : "light";

    saveUserPreferences(prefs);

    btn.textContent = prefs.theme === "dark" ? "☀️" : "🌙";
});