# 02 — Autenticación, autorización y administrador

## Endpoints

| Método y ruta        | Quién       | Éxito               | Errores                      |
| -------------------- | ----------- | ------------------- | ---------------------------- |
| POST /auth/register  | público     | 201                 | 400, 409                     |
| POST /auth/login     | público     | 200 { token, user } | 400, 401 INVALID_CREDENTIALS |
| GET /auth/me         | autenticado | 200                 | 401                          |
| /users (todo)        | admin       |                     | 401, 403                     |
| PATCH /users/:id/rol | admin       | 200                 | 400, 404, 409                |

## Reglas

- El registro público siempre crea usuarios con rol "usuario".
- Email inexistente y contraseña incorrecta devuelven el mismo error (no se puede averiguar qué emails existen).
- El token contiene solo sub (id) y rol, y vence según JWT_EXPIRES_IN.
- El admin inicial se crea al arrancar desde ADMIN_EMAIL y ADMIN_PASSWORD.
- Nadie puede borrarse ni cambiarse el rol a sí mismo (409).

## Criterios de aceptación

- Dado un request sin header Authorization, entonces 401 TOKEN_MISSING.
- Dado un token alterado, entonces 401 TOKEN_INVALID; dado uno vencido, 401 TOKEN_EXPIRED.
- Dado un usuario común que pide GET /users, entonces 403 FORBIDDEN.
- Dado un registro con "rol": "admin" en el body, entonces el usuario queda con rol "usuario".
