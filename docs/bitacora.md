# Bitácora

## Paso 1 — Setup

- Proyecto Express con ES Modules, configuración centralizada y variables de seguridad.
- JWT_SECRET sin valor por defecto: la app no arranca si falta.

## Paso 2 — Base común

- AppError, logger, notFound, errorHandler y validate (Zod).
- Aprendí: los errores se responden en un solo lugar; en Express 5 los errores de funciones async llegan solos al errorHandler.

# Bitácora

Cada entrada resume un paso: qué se hizo, qué se aprendió y en qué commit quedó.

## Paso 1 — Setup del proyecto

**Qué se hizo**

- Se creó el proyecto con Express 5 y módulos ES (`"type": "module"`).
- Se instalaron las dependencias: `express`, `sequelize`, `sqlite3`, `zod`, `bcryptjs` y `jsonwebtoken`.
- Se centralizó la configuración en `config/config.js`, leyendo variables de entorno con `--env-file=.env`.
- Se creó `.env.example` y se dejó el `.env` fuera de git junto con `node_modules/` y `*.sqlite`.
- Se creó la estructura de carpetas por capas.

**Qué se aprendió**

- `process.env` siempre devuelve texto, por eso los números se convierten con `Number(...)`.
- Un valor por defecto en un secreto es un riesgo: ver D2.

**Commit:** `chore: inicializar proyecto con Express, configuración centralizada y variables de seguridad` (hash: **\_\_**)

## Paso 2 — Base común: errores y validación

**Qué se hizo**

- Clase `AppError` con `code`, `message`, `statusCode` y `details`.
- Middlewares `logger`, `notFound`, `errorHandler` y `validate` (Zod, para body, params y query).
- `errorHandler` también convierte un JSON mal formado en un 400 `INVALID_JSON`.
- Especificación en `docs/specs/00-base-comun.md`.

**Qué se aprendió**

- Un middleware es una función `(req, res, next)`; el de errores tiene 4 parámetros.
- El orden de registro importa: `logger`, `express.json`, rutas, `notFound`, `errorHandler`.
- `validate` reemplaza `req.body` por el dato ya validado y convertido, y Zod descarta los campos no declarados.
- En Express 5 `req.query` se recalcula en cada acceso, por eso `validate` lo redefine.

**Decisiones:** D1, D2.
**Commits:**

- `feat: agregar AppError, errorHandler, notFound, logger y validación con Zod` (hash: **\_\_**)
- `docs: agregar diseño, decisiones, bitácora y especificación de la base común` (hash: **\_\_**)

## Paso 3 — Usuarios en memoria

**Qué se hizo**

- CRUD completo de usuarios con la arquitectura en capas: ruta → controlador → caso de uso → DAO.
- Hasheador de contraseñas (`security/passwordHasher.js`, con `bcryptjs` asíncrono) inyectado en los casos de uso.
- `UsersMemoryDao`: ninguna lectura devuelve `passwordHash`, salvo `getCredentialsByEmail`, que se usará en el login.
- Primera versión del contenedor (`container/container.js`) y de la factory de DAOs (`dao/daoFactory.js`).
- Esquemas de Zod: el email se normaliza (sin espacios, en minúsculas), la contraseña tiene entre 8 y 72 caracteres y el `rol` del body se descarta.
- Reglas de negocio en los casos de uso: email único (409), usuario inexistente (404) y contraseña siempre hasheada.
- Especificación en `docs/specs/01-usuarios.md` y archivo `requests.http` para probar.

**Qué se aprendió**

- Un caso de uso recibe el DAO y el hasher por parámetro y no importa ninguna implementación concreta.
- `makeUserUseCases` usa closures para "enganchar" las dependencias, y así el controlador no sabe que existen.
- Todos los métodos del DAO en memoria son `async`, porque el de Sequelize lo será y los dos tienen que ser intercambiables.
- El contenedor es el único archivo que conoce todas las piezas concretas.
- Un `PUT` con el mismo email del propio usuario no debe dar error de duplicado.

**Pendiente de este recurso**

- Protección por rol y reglas de baja con proyectos y tareas (Pasos 4 y 6).
- Adaptador Sequelize (Paso 8).

**Decisiones:** D3, D4.
**Commits:**

- `feat: agregar CRUD de usuarios en memoria con contraseña hasheada` (hash: **\_\_**)
- `docs: agregar especificación de usuarios y actualizar bitácora` (hash: **\_\_**)
