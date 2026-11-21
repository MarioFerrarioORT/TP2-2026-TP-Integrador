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

**Commit:** `chore: inicializar proyecto con Express, configuración centralizada y variables de seguridad` (hash: f104480)

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

- `feat: agregar AppError, errorHandler, notFound, logger y validación con Zod` (hash: a6c2863)
- `docs: agregar diseño, decisiones, bitácora y especificación de la base común` (hash: 7f199a7)

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

- `feat: agregar CRUD de usuarios en memoria con contraseña hasheada` (hash: aa264c9)
- `docs: agregar especificación de usuarios y actualizar bitácora` (hash:27bbf6d)

## Paso 4 — Autenticación y administrador

**Qué se hizo**

- Servicio de tokens (JWT, HS256) y middlewares `authenticate` (401) y `authorize` (403).
- Casos de uso `registerUser`, `loginUser` y `seedAdmin`; endpoints `/auth/register`, `/auth/login` y `/auth/me`.
- Todo `/users` pasa a ser solo para admin; se agregó `PATCH /users/:id/rol`.
- Reglas: nadie puede borrarse ni cambiarse el rol a sí mismo.
- Variables obligatorias nuevas: `ADMIN_EMAIL` y `ADMIN_PASSWORD`.
- Especificación en `docs/specs/02-auth.md`.

**Qué se aprendió**

- Autenticación (401) y autorización (403) son pasos distintos y en ese orden.
- Un JWT se puede leer pero no alterar; el algoritmo se fija para evitar `alg: none`.
- Los casos de uso reciben al `actor` como dato plano y no dependen de Express.
- La seguridad se agregó sin tocar los otros recursos: solo cambió el contenedor.

**Decisiones:** D5, D6.
**Commits:**

- `feat: agregar login y registro con JWT, administrador inicial y protección de usuarios por rol` (hash: 9ca5d12)
- `docs: agregar especificación de autenticación, decisiones D5 y D6 y bitácora del paso 4` (hash: f7b731a)

## Paso 5 — Persistencia con Sequelize (usuarios)

**Qué se hizo**

- Conexión a SQLite (`connection/`), modelo `UserModel` y punto central de modelos (`dao/models/`).
- `UsersSequelizeDao` con la misma interfaz que `UsersMemoryDao`, sin devolver nunca `passwordHash` salvo en `getCredentialsByEmail`.
- La fábrica de DAOs elige según `PERSISTENCE_TYPE`, que ahora se valida al arrancar.
- Se comprobó que las mismas 28 peticiones dan respuestas idénticas en los dos modos y que los datos persisten tras un reinicio.
- Especificación en `docs/specs/03-persistencia-sequelize.md`.

**Qué se aprendió**

- Un ORM traduce entre clases/objetos y tablas/filas; el modelo describe la tabla y `sync()` la crea.
- `attributes` evita el `SELECT *` que filtraría el hash; `raw` y `.get({ plain: true })` devuelven objetos planos.
- Actualizar con el `update` estático evita que el hash entre en el objeto devuelto.
- `sync()` no modifica tablas existentes: en desarrollo se borra `database.sqlite`.
- No hubo que tocar casos de uso, controladores, rutas ni contenedor: así funciona la inversión de dependencias.

**Decisiones:** D7, D8.
**Commits:**

- `feat: agregar persistencia con Sequelize y SQLite` (hash: 0402ca7)
- `docs: agregar especificación de persistencia, decisiones D7 y D8 y bitácora del paso 5` (hash: b470a7f)

## Paso 6 — Proyectos y colaboradores

**Qué se hizo**

- Entidad Proyecto con dueño (1 a N) y colaboradores (N a N con tabla intermedia), en memoria y con Sequelize.
- Asociaciones centralizadas en `dao/models/index.js`; borrado de proyecto con transacción.
- Permisos por pertenencia en los casos de uso (dueño y colaborador); colaboradores agregados por email.
- Reloj inyectable (`utils/clock.js`, `CLOCK_NOW`) y regla de fechas.
- `deleteUser` rechaza a dueños de proyectos y limpia las participaciones como colaborador.
- 54 peticiones idénticas en los dos modos. Especificación en `docs/specs/04-proyectos.md`.

**Qué se aprendió**

- Asociaciones: `hasMany` + `belongsTo` (1 a N) y `belongsToMany` con `through` (N a N); `include` equivale a un JOIN.
- Una transacción agrupa operaciones: todas o ninguna.
- Un permiso que depende del dato concreto va en el caso de uso, no en `authorize`.
- Qué validación va en Zod (solo el pedido) y cuál en el caso de uso (necesita otros datos).
- `sync()` agrega tablas nuevas sin tocar las existentes.

**Decisiones:** D9, D10, D11.
**Commits:**

- `feat: agregar proyectos con colaboradores (N a N), permisos por pertenencia y reloj inyectable` (hash: 4adf81f)
- `docs: agregar especificación de proyectos, decisiones D9 a D11 y bitácora del paso 6` (hash: b6f5b14)

## Paso 7 — Tareas

**Qué se hizo**

- Entidad Tarea (título, descripción, estado, proyecto, responsable) en memoria y con Sequelize, anidada en `/projects/:id/tasks`.
- Regla central: el responsable debe ser el dueño o un colaborador del proyecto.
- Reglas de baja pendientes: proyecto, colaborador y usuario con tareas (409), con RESTRICT en la base.
- 73 peticiones idénticas en los dos modos. Especificación en `docs/specs/05-tareas.md`.

**Qué se aprendió**

- `mergeParams` para ver parámetros de la ruta donde se monta un router.
- Dos relaciones 1 a N desde un mismo modelo (proyecto y usuario) con `as` distintos.
- `validate: { isIn }` en el modelo, y `raw: true` para devolver objetos planos.
- Pasar las dependencias a los casos de uso como un objeto.

**Decisiones:** D12, D13.
**Commits:**

- `feat: agregar tareas con responsable del proyecto y reglas de baja` (hash: ce19437)
- `docs: agregar especificación de tareas, decisiones D12 y D13 y bitácora del paso 7` (hash: 50be84f)

## Paso 8 — Eventos y notificador

**Qué se hizo**

- Bus de eventos (EventEmitter) inyectado desde el contenedor; eventos `task.assigned` y `project.memberAdded`.
- Listener en `alerts/` que arma el mensaje y captura sus errores; notificadores de consola y archivo, combinables (`both`).
- `task.assigned` se emite al crear una tarea o al reasignarla a otra persona; no al cambiar el estado o el título.
- Probado en memoria y Sequelize, con los tres notificadores y con un notificador roto. Especificación en `docs/specs/06-eventos.md`.

**Qué se aprendió**

- `EventEmitter`: `emit` y `on`; quien emite no conoce a quien escucha.
- Un listener `async` tiene que atrapar sus errores; si no, una promesa rechazada puede tumbar el proceso.
- `Promise.allSettled` para ejecutar varias cosas aunque alguna falle.
- Emitir el evento después de guardar: cuenta algo que ya ocurrió.

**Decisiones:** D14, D15.
**Commits:**

- `feat: eventos task.assigned y project.memberAdded con listener y notificador` (hash: e9a3698)
- `docs: agregar especificación de eventos, decisiones D14 y D15 y bitácora del paso 8` (hash: 3930037)

## Paso 9 — Swagger, README y cierre

**Qué se hizo**

- `openapi.yaml` (OpenAPI 3.1.0) con los 21 endpoints, schemas y respuestas reutilizables con `$ref`, y seguridad Bearer.
- Swagger UI publicado en `/api-docs` (swagger-ui-express), con `DOCS_ENABLED`.
- README con dominio, relaciones, instalación, variables, cambio de persistencia, evento y listener, limitaciones conocidas y problemas frecuentes.
- `checklist.md` con la autoevaluación y su evidencia; `.env.example` completo; `engines` en `package.json`; `@baseUrl` en `requests.http`.
- Pruebas finales en los dos modos.

**Qué se aprendió**

- OpenAPI: `paths`, `components` y `$ref`; `securitySchemes` para el token.
- Una documentación que no se verifica se desactualiza: conviene compararla con las respuestas reales.
- Un checklist revisa todo el proyecto, no solo lo último que se escribió.

**Decisiones:** D16.
**Commits:**

- `feat: documentar la API con OpenAPI y publicarla en /api-docs` (hash: 5b7c930)
- `docs: agregar README, checklist, especificación de la documentación, decisión D16 y bitácora del paso 9` (hash: d398871)
