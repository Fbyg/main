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

    const token = keycloak.tokenParsed;

    if (!token) return;

    const email = token.email || "N/A";
    const username = token.preferred_username || "N/A";
    const name = token.given_name || token.name || "N/A";

    // helper
    const set = (id, value) => {
        const el = document.getElementById(id);

        if (el) {
            el.textContent = value;
        }
    };

    // info usuario
    set("emailValue", email);
    set("userValue", username);
    set("nameValue", name);

    // saludo
    const greeting = getGreeting();

    const welcome = document.getElementById("welcomeTittle");

    if (welcome) {
        welcome.textContent = `${greeting}, ${name}`;
    }

    document.title = `${greeting}, ${name}`;

    // último login
    const loginTimestamp = token.auth_time;

    const loginEl = document.getElementById("loginTime");

    if (loginEl) {

        if (!loginTimestamp) {

            loginEl.textContent = "No disponible";

        } else {

            const loginDate = new Date(loginTimestamp * 1000);

            loginEl.textContent =
                loginDate.toLocaleString("es-ES", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit"
                });
        }
    }

    // email verificado
    const emailVerified = token.email_verified;

    const emailVerifiedEl =
        document.getElementById("emailVerified");

    if (emailVerifiedEl) {

        emailVerifiedEl.textContent =
            emailVerified
                ? "✔ Sí"
                : "❌ No";

        emailVerifiedEl.style.color =
            emailVerified
                ? "#2ecc71"
                : "#ff4d4d";
    }

    // roles
    const ignoredRoles = [
        "offline_access",
        "uma_authorization",
        "default-roles-mi-realm"
    ];

    const roles = (token.realm_access?.roles || [])
        .filter(role => !ignoredRoles.includes(role));

    set(
        "roleValue",
        roles.length
            ? roles.join(", ")
            : "N/A"
    );

    // Direccion IP
    fetch('/api/ip')
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

    fetch("/api/memory")
        .then(r => r.json())
        .then(data => {
            document.getElementById("memoryUsage").textContent =
                `${data.memory_mb} MB`;
        });
    // avatar
    setAvatar(name);
    console.log(keycloak.tokenParsed);
}