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
        .slice(0, 2)
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

    const set = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.textContent = value;
    };

    set("emailValue", email);
    set("userValue", username);
    set("nameValue", name);

    document.getElementById("welcomeTittle").textContent =
        `${getGreeting()}, ${name}`;

    document.title =
        `${getGreeting()}, ${name}`;

    const loginTimestamp =
        token.auth_time ||
        token.iat ||
        null;

    const loginEl = document.getElementById("loginTime");

    if (loginEl) {

        if (!loginTimestamp) {
            loginEl.textContent = "No disponible";
        } else {
            const loginDate = new Date(loginTimestamp * 1000);

            loginEl.textContent = loginDate.toLocaleString("es-ES", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            });
        }
    }

    const emailVerified = keycloak.tokenParsed?.email_verified;

    const emailVerifiedEl = document.getElementById("emailVerified");

    if (emailVerifiedEl) {
        emailVerifiedEl.textContent = emailVerified
            ? " Si"
            : " No ";

        emailVerifiedEl.style.color = emailVerified
            ? "green"
            : "red";
    }
    setAvatar(name)
}