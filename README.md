# 🔐 Dashboard con Keycloak + Flask

Este proyecto es un dashboard de usuario con autenticación basada en **Keycloak**, backend en **Flask** y frontend en **JavaScript vanilla**.

Incluye:
- Login con Keycloak (SSO)
- Gestión de sesión con expiración real
- Perfil de usuario dinámico
- Tema claro / oscuro
- Persistencia de preferencias por usuario
- Control de estado de sesión (activo / inactivo)
- Detección de conexión online/offline
- UI tipo dashboard moderno

---

## 🚀 Tecnologías utilizadas

- Flask (Python)
- Keycloak (OAuth2 / OpenID Connect)
- JavaScript Vanilla
- HTML5 + CSS3
- LocalStorage (preferencias de usuario)

---

## ⚙️ Requisitos

- Python 3.10+
- Keycloak en ejecución (localhost:8080)
- Realm configurado
- Cliente creado en Keycloak

---

## 🔧 Configuración Keycloak

Debes configurar en Keycloak:

- Realm: `mi-realm`
- Client ID: `cliente`
- Access Type: `public` o `confidential`
- Valid Redirect URIs:
