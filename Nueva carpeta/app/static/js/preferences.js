function getCurrentUser() {
    return keycloak?.tokenParsed?.preferred_username || "guest";
}

function getUserPreferences() {

    const username = getCurrentUser();
    const saved = localStorage.getItem(`prefs_${username}`);

    try {
        return saved
            ? JSON.parse(saved)
            : { theme: "light", notifications: true };
    } catch (e) {
        console.warn("[PREFS] corrupt data reset");
        return { theme: "light", notifications: true };
    }
}