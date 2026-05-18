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
        checkLoginIframe: false
    }).then((authenticated) => {

        loader.style.display = "none";

        if (!authenticated) {
            console.log("No autenticado");
            keycloak.login()
            return;
        }

        const tokenData = keycloak.tokenParsed;
        const token = keycloak.token;

        loadUserProfile();
        startSessionTimers();
        initReloginButton();

        const prefs = getUserPreferences();

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

