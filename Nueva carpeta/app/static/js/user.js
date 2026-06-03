function getGreeting() {

    const hour = new Date().getHours();

    if (hour < 12) return "Buenos días";
    if (hour < 19) return "Buenas tardes";

    return "Buenas noches";
}

function setAvatar(name) {

    if (!name) return;

    const initials = name
        .trim()
        .split(" ")
        .filter(Boolean)
        .map(n => n[0])
        .slice(0, 1)
        .join("")
        .toLowerCase();

    const avatar = document.getElementById("avatarHeader");

    if (avatar) {
        avatar.textContent = initials;
        avatar.style.backgroundColor = "#3aa111";
        avatar.title = name;
    }
}

function loadUserProfile() {

    // 🔐 seguridad base
    if (!keycloak?.authenticated || !keycloak?.tokenParsed) {
        console.warn("[USER] no autenticado");
        return;
    }

    const token = keycloak.tokenParsed;

    const safe = (v) => v ?? "N/A";

    const email = safe(token.email);
    const username = safe(token.preferred_username);
    const name = safe(token.given_name || token.name);

    const set = (id, value) => {

        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };

    // 👤 usuario
    set("emailValue", email);
    set("userValue", username);
    set("nameValue", name);

    // 🧠 saludo
    const greeting = getGreeting();

    const welcome = document.getElementById("welcomeTittle");

    if (welcome) {
        welcome.textContent = `${greeting}, ${name}`;
    }

    document.title = `${greeting}, ${name}`;

    // 🕒 login
    const loginEl = document.getElementById("loginTime");

    if (loginEl) {

        const ts = token.auth_time;

        loginEl.textContent = ts
            ? new Date(ts * 1000).toLocaleString("es-ES")
            : "No disponible";
    }

    // 📧 email verificado
    const emailVerifiedEl =
        document.getElementById("emailVerified");

    if (emailVerifiedEl) {

        const verified = !!token.email_verified;

        emailVerifiedEl.textContent =
            verified ? "✔ Sí" : "❌ No";

        emailVerifiedEl.style.color =
            verified ? "#2ecc71" : "#ff4d4d";
    }

    // 🔐 roles seguros
    const ignoredRoles = [
        "offline_access",
        "uma_authorization",
        "default-roles-mi-realm"
    ];

    const roles = (token.realm_access?.roles || [])
        .filter(r => !ignoredRoles.includes(r));

    set("roleValue",
        roles.length ? roles.join(", ") : "N/A"
    );

    fetch("/api/ip", {
        headers: {
            Authorization: `Bearer ${keycloak.token}`
        }
    })
    .then(r => {

        if (!r.ok) throw new Error("IP request failed");
        return r.json();
    })
    .then(data => {

        const el = document.getElementById("ipDirection");
        if (el) el.textContent = data?.ip ?? "N/A";
    })
    .catch(err => {
        console.warn("IP fetch error:", err);
    });

    fetch("/api/memory", {
        headers: {
            Authorization: `Bearer ${keycloak.token}`
        }
    })
    .then(r => {

        if (!r.ok) throw new Error("Memory request failed");
        return r.json();
    })
    .then(data => {

        const el = document.getElementById("memoryUsage");
        if (el) el.textContent = `${data.memory_mb} MB`;
    })
    .catch(err => {
        console.warn("Memory fetch error:", err);
    });

    // 🧑 avatar seguro
    if (typeof setAvatar === "function") {
        setAvatar(name);
    }

    console.log("[USER] profile loaded");
}

