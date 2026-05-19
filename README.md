# 🔐 Dashboard con Keycloak + Flask

Este proyecto es un dashboard de usuario con autenticación basada en **Keycloak**, backend en **Flask** y frontend en **JavaScript vanilla**.

Incluye:

- 🔐 Login con Keycloak (SSO)
- 👤 Gestión de sesión con expiración
- 📊 Dashboard de usuario dinámico
- 🌙 Tema claro / oscuro
- 💾 Persistencia de preferencias por usuario
- 🟢 Estado de sesión activo / inactivo
- 🌐 Detección de conexión online / offline
- 🎨 UI tipo dashboard moderno

---

# Tecnologías utilizadas

- Flask (Python)
- Keycloak (OAuth2 / OpenID Connect)
- JavaScript Vanilla
- HTML5 + CSS3
- LocalStorage
- Git
- Yaml

---

# ⚙️ Requisitos

- Python 3.10+
- Keycloak ejecutándose en `http://localhost:8080`
- Docker (opcional, recomendado)
- Realm configurado en Keycloak

---

# 🐳 Levantar Keycloak

```bash
docker run -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:latest start-dev
