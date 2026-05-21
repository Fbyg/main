const keycloak = new Keycloak({
    url: "http://localhost:8080", // 🔥 IMPORTANTE
    realm: "prueba",
    clientId: "cliente"
});
let authInitialized = false;

function initAuth(onSuccess, onNotAuth) {

    const loader = document.getElementById("loader");

    keycloak.init({
        onLoad: "login-required",
        pkceMethod: "S256",
        checkLoginIframe: false
    }).then((authenticated) => {

        loader && (loader.style.display = "none");

        if (!authenticated) {
            console.warn("[AUTH] No autenticado");

            if (typeof onNotAuth === "function") {
                onNotAuth();
            }

            return;
        }

        if (authInitialized) return;
        authInitialized = true;

        if (typeof onSuccess === "function") {
            onSuccess();
        }

        updateSessionStatus();
        updateSessionTime();

        console.log("[AUTH] sesión iniciada");

    }).catch(err => {
        console.error("[AUTH] Keycloak error", err);
    });
}

document.addEventListener("DOMContentLoaded", () => {

    const btn = document.getElementById("logout");

    if (!btn) return;

    btn.addEventListener("click", () => {
        keycloak.logout({
            redirectUri: "http://localhost:5000/login"
        });
    });

});