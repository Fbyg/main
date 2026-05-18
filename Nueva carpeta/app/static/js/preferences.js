function getCurrentUser() {
    return keycloak?.tokenParsed?.preferred_username || "guest";
}

function getUserPreferences() {
    const username = getCurrentUser();

    const saved = localStorage.getItem(`prefs_${username}`);

    return saved
        ? JSON.parse(saved)
        : {
            theme: "light",
            notifications: true
        };
}

function saveUserPreferences(preferences) {
    const username = getCurrentUser();

    localStorage.setItem(
        `prefs_${username}`,
        JSON.stringify(preferences)
    );
}