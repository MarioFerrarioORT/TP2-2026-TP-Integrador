# 01 — Usuarios (en memoria)

## Propósito

CRUD de usuarios con contraseña hasheada, sobre el patrón completo de capas.

## Endpoints

| Método y ruta     | Descripción                                   | Éxito | Errores       |
| ----------------- | --------------------------------------------- | ----- | ------------- |
| GET /users        | Lista, con filtros nombre, email, page, limit | 200   | 400           |
| GET /users/:id    | Obtiene uno                                   | 200   | 400, 404      |
| POST /users       | Crea                                          | 201   | 400, 409      |
| PUT /users/:id    | Actualiza parcial                             | 200   | 400, 404, 409 |
| DELETE /users/:id | Elimina                                       | 204   | 400, 404      |

## Reglas

- El email es único y se normaliza (sin espacios, en minúsculas) → 409 EMAIL_DUPLICATED.
- La contraseña tiene entre 8 y 72 caracteres y se guarda solo como hash.
- Ninguna respuesta incluye la contraseña ni su hash.
- El rol por defecto es "usuario" y no se acepta desde el body.
- Pendiente (Pasos 4 y 6): protección por rol y reglas de baja con proyectos y tareas.

## Criterios de aceptación

- Dado un body válido, cuando se crea, entonces 201 y la respuesta no contiene password ni passwordHash.
- Dado un email ya registrado (aunque cambie en mayúsculas), entonces 409.
- Dado un PUT con body vacío, entonces 400.
- Dado un id inexistente, entonces 404 USER_NOT_FOUND.
