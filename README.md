#Dashboard con Keycloak + Flask

Este proyecto es un dashboard de usuario desarrollado con Flask y JavaScript Vanilla, utilizando autenticación basada en Keycloak mediante OAuth2 / OpenID Connect.

Permite iniciar sesión mediante SSO, gestionar sesiones activas y personalizar la experiencia del usuario con una interfaz moderna tipo dashboard.

---

##Funcionalidades

- Login con Keycloak (SSO)
- Gestión de sesión con expiración automática
- Dashboard dinámico de usuario
- Cambio entre tema claro y oscuro
- Persistencia de preferencias por usuario
- Estado de sesión activo / inactivo
- Detección de conexión online / offline
- Interfaz moderna estilo dashboard
- Gestión automática del estado de autenticación
- Diseño responsive adaptable

---

##Nuevas funcionalidades añadidas

- Validación de usuarios registrados
- Aplicación de cupones de descuento
- Generación automática de tickets en PDF
- Selección entre vaso pequeño o grande
- Confirmación antes de procesar acciones importantes
- Mejoras visuales y optimización de experiencia de usuario

---

## Errores corregidos

- Corregido el error al generar pedidos
- Solucionado el bug de selección de bebidas
- Mejorada la estabilidad de sesión
- Optimización de validaciones de autenticación

---

## Tecnologías utilizadas

- Python + Flask
- Keycloak (OAuth2 / OpenID Connect)
- JavaScript Vanilla
- HTML5 + CSS3
- LocalStorage
- YAML
- Git
- Docker

---

## Requisitos

- Python 3.10 o superior
- Keycloak ejecutándose en `http://localhost:8080`
- Docker (opcional, recomendado)
- Realm configurado en Keycloak
- Navegador moderno compatible con ES6

---

## Levantar Keycloak

```bash
docker run -p 8080:8080 \
  -e KEYCLOAK_ADMIN=admin \
  -e KEYCLOAK_ADMIN_PASSWORD=admin \
  quay.io/keycloak/keycloak:latest start-dev
