const keycloak = new Keycloak({
    url: "http://localhost:8080",
    realm: "mi-realm",
    clientId: "cliente"
});

function initAuth(onSuccess) {

    const loader = document.getElementById("loader");

    keycloak.init({
        onLoad: "check-sso",
        pkceMethod: "S256",
        checkLoginIframe: true
    }).then((authenticated) => {

        loader.style.display = "none";

        if (!authenticated) {
            console.log("No autenticado");
            return;
        }

        const tokenData = keycloak.tokenParsed;
        const token = keycloak.token;

        loadUserProfile();
        startSessionTimers();
        initReloginButton();

        const prefs = getUserPreferences();

        const btn = document.getElementById("themeToggle")

        if (prefs.theme === "dark") {
            document.body.classList.add("dark");
            btn.textContent = "☀️";
        } else {
            document.body.classList.remove("dark");
            btn.textContent = "🌙";
        }

        updateSessionStatus();
        updateSessionTime();

        sessionStatusInterval = setInterval(updateSessionStatus, 10000);
        sessionTimeInterval = setInterval(updateSessionTime, 1000);

    }).catch(err => {
        console.error("Keycloak init error", err);
    });
}

