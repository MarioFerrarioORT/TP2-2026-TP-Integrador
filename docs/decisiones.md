# Decisiones de diseño

## D1 — Un único formato de error

**Contexto:** varias capas pueden fallar (validación, reglas de negocio, persistencia) y el cliente necesita respuestas predecibles.
**Decisión:** todos los errores se responden desde un único `errorHandler` con el formato `{ error: { code, message, details? } }`. Los casos de uso lanzan `AppError` y no conocen HTTP.
**Consecuencia:** los controladores no necesitan `try/catch` (Express 5 envía al `errorHandler` los errores de funciones `async`). Un error inesperado responde 500 sin exponer detalles internos.

## D2 — `JWT_SECRET` sin valor por defecto

**Contexto:** el secreto firma los tokens; quien lo conozca puede fabricar tokens de cualquier usuario.
**Decisión:** `config/config.js` no define un valor por defecto y la aplicación se niega a arrancar si la variable falta. El `.env` no se versiona y el `.env.example` queda con el valor vacío.
**Consecuencia:** un olvido de configuración se detecta al arrancar y no en producción con un secreto conocido.

## D3 — Carpeta `usecases/` en minúscula

**Contexto:** la consigna del TP pide la carpeta `usecases/`, y esto se confirmó con el profesor.
**Decisión:** la carpeta se llama `usecases/`, todo en minúscula, y todos los imports usan esa misma grafía.
**Consecuencia:** en Linux los nombres de carpeta distinguen mayúsculas, así que un import con otra grafía fallaría en un despliegue. Usar la misma escritura en todo el proyecto evita ese problema.

## D4 — Roles y administrador

**Contexto:** el sistema necesita dos tipos de usuario y reglas de permisos que se puedan defender.
**Decisión:** hay dos roles, `usuario` y `admin`.

- El rol nunca se acepta desde el body público: el esquema de Zod descarta el campo `rol`.
- El registro público siempre crea usuarios con rol `usuario`.
- El administrador inicial se crea al arrancar desde variables de entorno (`ADMIN_EMAIL` y `ADMIN_PASSWORD`).
- El admin gestiona usuarios: listar, ver, cambiar el rol y dar de baja. La baja se rechaza (409) si el usuario es dueño de algún proyecto o tiene tareas asignadas. Un admin no puede borrarse a sí mismo.
- El admin no edita ni borra proyectos ni tareas ajenos.
- Los usuarios comunes agregan colaboradores por email, así no necesitan listar a todos los usuarios.
  **Consecuencia:** se practican los dos tipos de permisos, por rol y por pertenencia al proyecto. Las reglas de baja con proyectos y tareas se implementan en el Paso 6, cuando esas entidades existan.

## D5 — Autenticación con JWT en el header Bearer

**Decisión:** el login devuelve un token en el body y el cliente lo envía en `Authorization: Bearer <token>`. El token contiene solo `sub` (id) y `rol`, y vence según `JWT_EXPIRES_IN`.
**Consecuencia:** el rol del token se fija al emitirlo. Si un admin cambia el rol de alguien, o elimina a un usuario, el token anterior sigue siendo válido hasta que venza. Evitarlo requeriría consultar la base en cada petición, a costa de perder el carácter "sin estado" de JWT.

## D6 — Un solo error para credenciales inválidas

**Decisión:** si el email no existe o la contraseña no coincide, se responde el mismo 401 `INVALID_CREDENTIALS`.
**Consecuencia:** no se puede descubrir qué emails están registrados probando el login.

## D7 — Persistencia seleccionable por variable de entorno

**Decisión:** la fábrica `daoFactory.js` elige entre el DAO en memoria y el de Sequelize según `PERSISTENCE_TYPE`; un valor inválido impide arrancar.
**Consecuencia:** cambiar de persistencia es modificar una línea del `.env`. Casos de uso, controladores, rutas y contenedor no cambian, porque los DAO comparten interfaz y devuelven objetos planos.

## D8 — `sync()` en lugar de migraciones

**Decisión:** las tablas se crean con `sequelize.sync()` al arrancar.
**Consecuencia:** `sync()` no altera tablas existentes, así que en desarrollo se borra `database.sqlite` cuando cambia un modelo. Es una simplificación aceptable para este trabajo; en producción se usarían migraciones.

## D9 — Permisos de proyectos por pertenencia, no por rol

**Decisión:** el dueño modifica, elimina y gestiona colaboradores; dueño y colaboradores ven el proyecto. Se verifica dentro de los casos de uso con el actor del token. Un admin no tiene acceso especial a proyectos ajenos.
**Consecuencia:** `authorize("admin")` no alcanza, porque el permiso depende del proyecto concreto. Se responde 403 (y no 404) cuando el proyecto existe pero no participás.

## D10 — Relaciones con garantías en la base de datos

**Decisión:** dueño (1 a N) con `ON DELETE RESTRICT` y colaboradores (N a N) con tabla intermedia de clave primaria compuesta (projectId, userId). Las reglas también se validan en el caso de uso.
**Consecuencia:** el caso de uso da el mensaje claro (409) y la base garantiza la integridad aunque dos pedidos lleguen a la vez.

## D11 — Fechas como día y reloj inyectable

**Decisión:** las fechas son `AAAA-MM-DD` (DATEONLY) y los casos de uso obtienen "hoy" de un `clock` inyectado, nunca de `new Date()`. `fechaFin ≥ fechaCreacion` se valida en el caso de uso porque necesita el reloj o el proyecto guardado.
**Consecuencia:** se puede probar con `CLOCK_NOW` y la zona horaria no corre las fechas de calendario.

## D12 — Tareas anidadas en el proyecto, con permisos de participante

**Decisión:** las tareas viven en `/projects/:id/tasks`. Dueño y colaboradores ven, crean y editan tareas (incluido el estado y la reasignación); solo el dueño las elimina. El responsable es obligatorio y debe ser el dueño o un colaborador (409). Una tarea de otro proyecto responde 404.
**Consecuencia:** el permiso se resuelve con el proyecto de la URL, reutilizando `assertParticipant` y `assertOwner`.

## D13 — Reglas de baja con doble defensa

**Decisión:** no se elimina un proyecto con tareas, no se quita a un colaborador con tareas en ese proyecto y no se elimina a un usuario con tareas asignadas (409 en los tres casos). La base lo refuerza con `ON DELETE RESTRICT` en `tasks.projectId` y `tasks.responsableId`.
**Consecuencia:** el caso de uso da el mensaje claro y la base garantiza la integridad. El estado se valida en Zod y en el modelo, no con un CHECK en SQLite.

## D14 — Eventos de dominio con listener y notificador desacoplados

**Decisión:** los casos de uso emiten `task.assigned` y `project.memberAdded` en un bus (EventEmitter) creado e inyectado desde el contenedor, y solo después de guardar con éxito. El listener vive en `alerts/` y se comunica con un notificador de contrato `notify({ subject, body })`, elegido por `NOTIFIER_TYPE` (console, file, both).
**Consecuencia:** cambiar el canal de aviso no toca las reglas de negocio. El listener captura sus errores: un fallo de notificación no tumba la operación.

## D15 — Sin notificaciones guardadas

**Decisión:** no se implementan notificaciones persistentes con estado visto/no visto. Quedaron fuera del alcance por tiempo.
**Consecuencia:** sumarlas más adelante sería un listener más sobre los mismos eventos, sin cambiar los casos de uso.

## D16 — OpenAPI en un archivo YAML escrito a mano, con swagger-ui-express

**Decisión:** la documentación vive en `openapi.yaml` (OpenAPI 3.1.0) y se publica en `/api-docs`, en lugar de generarla desde los esquemas de Zod o con comentarios en las rutas. `DOCS_ENABLED` permite apagarla.
**Consecuencia:** el código de las rutas queda limpio y la documentación se edita en un solo lugar, pero hay que actualizarla a mano cuando cambia un endpoint. Se verificó contra las respuestas reales de la API (238 pedidos por modo, sin diferencias) y queda como limitación conocida que no hay un test que la compare automáticamente.
