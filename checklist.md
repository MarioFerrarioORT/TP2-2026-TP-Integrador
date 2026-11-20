# Checklist de buenas prácticas — Gestor de Proyectos API

Autoevaluación del proyecto. Cada ítem tiene su **evidencia**: el comando, el archivo o la prueba que lo demuestra.
✅ = se cumple · 🔧 = no se cumplía y se corrigió · ⚠️ = no se cumple, a sabiendas (figura en *Limitaciones conocidas* del README).

## Arquitectura

| | Ítem | Evidencia |
|---|---|---|
| ✅ | Los controllers solo traducen HTTP ↔ caso de uso | `controllers/`: solo códigos de estado y llamadas a los casos de uso |
| ✅ | Los casos de uso no conocen Express | `grep -rnE "\b(req\|res)\." usecases/` → sin resultados |
| ✅ | Los casos de uso no leen `process.env` ni llaman a `new Date()` | `grep -rn "new Date(" usecases/` → sin resultados; la hora llega por el reloj inyectado (`utils/clock.js`) |
| ✅ | Todas las dependencias se arman en un solo lugar | `container/container.js` |
| ✅ | La persistencia se cambia sin tocar los casos de uso | `PERSISTENCE_TYPE=memory` / `sequelize`; las mismas peticiones dan respuestas idénticas en los dos modos |

## REST y HTTP

| | Ítem | Evidencia |
|---|---|---|
| ✅ | URLs con sustantivos en plural | `/users`, `/projects`, `/projects/:id/tasks`; los colaboradores son un subrecurso: `/projects/:id/members` |
| ✅ | Crear → `201`; borrar → `204` | `ProjectsController`, `TasksController`, `UsersController` |
| ✅ | Códigos de estado con criterio | 400 forma, 401 sin sesión, 403 sin permiso, 404 no existe, 409 choca con el estado actual. Cada operación de `/api-docs` lista los suyos |
| ✅ | Ruta inexistente → `404` con el formato estándar | `middlewares/notFound.js` → `ROUTE_NOT_FOUND` |

## Validación y errores

| | Ítem | Evidencia |
|---|---|---|
| ✅ | Todo lo que entra se valida antes del caso de uso | Cada ruta con body, query o params usa `validate(...)` con esquemas de `schemas/` |
| ✅ | Mismo formato de error en toda la API | `middlewares/errorHandler.js`; documentado como schema `Error` |
| ✅ | Error inesperado → `500` genérico, sin detalles internos | `errorHandler.js`: el detalle va a la consola, no a la respuesta |
| ✅ | Cada error posible de cada endpoint está contemplado y documentado | 102 respuestas documentadas; todas se ejercitaron con 238 pedidos reales en cada modo y ninguna respuesta real quedó sin documentar |

## Seguridad

| | Ítem | Evidencia |
|---|---|---|
| ✅ | Contraseñas hasheadas que nunca salen en una respuesta | `security/passwordHasher.js` (bcrypt); los DAO piden solo los campos públicos; ninguna respuesta de las pruebas incluyó `passwordHash` |
| ✅ | `JWT_SECRET` sin valor por defecto y fuera del repositorio | `config/config.js` lanza un error si falta; `.env` está en `.gitignore` |
| ✅ | Permisos por dueño en el caso de uso, no solo por rol | `usecases/projects/projectAccess.js` (`assertParticipant`, `assertOwner`) |
| ✅ | Mismo error si el email no existe o la contraseña es incorrecta | `usecases/auth/loginUser.js` → `INVALID_CREDENTIALS` |
| ✅ | El rol nunca se acepta desde un cuerpo público | `registerUser` fuerza `usuario`; los esquemas descartan `rol` |
| ⚠️ | Un token deja de valer si se borra el usuario o cambia su rol | No: el JWT no guarda estado. Mitigado con `JWT_EXPIRES_IN`. En el README |
| ⚠️ | Límite de intentos fallidos de login | No implementado. En el README |

## Configuración y repositorio

| | Ítem | Evidencia |
|---|---|---|
| ✅ | `process.env` se lee en un solo archivo | `grep -rn "process.env" --include=*.js . \| grep -v node_modules \| grep -v config/config.js` → sin resultados |
| ✅ | `.env.example` con todas las variables | Un `.env` copiado desde `.env.example` arranca el proyecto en los dos modos |
| ✅ | `.gitignore` completo | `node_modules/`, `.env`, `*.sqlite`, `notifications.log` |
| ✅ | `package-lock.json` versionado | Está en el repositorio |
| ✅ | `package.json` declara la versión de Node | `"engines": { "node": ">=20.17.0" }` |
| ✅ | El valor que cambia según el entorno está en un solo lugar en las pruebas manuales | `requests.http` usa `@baseUrl` |

## Persistencia

| | Ítem | Evidencia |
|---|---|---|
| ✅ | Los dos adaptadores respetan la misma interfaz | Mismos métodos y mismo formato de objeto en `dao/*/*MemoryDao.js` y `*SequelizeDao.js` |
| ✅ | Las reglas de integridad tienen una segunda defensa en la base | Clave primaria compuesta en `project_members`; `ON DELETE RESTRICT` en `projects.ownerId`, `tasks.projectId` y `tasks.responsableId` |
| ✅ | Una operación que modifica dos tablas es atómica | `ProjectsSequelizeDao.delete` usa `sequelize.transaction` |
| ⚠️ | Reglas "verificar y después guardar" a prueba de carreras | Parcial: la base frena duplicados y borrados con dependencias, pero otras combinaciones (quitar un colaborador mientras se le asigna una tarea) no. En el README |
| ⚠️ | Migraciones de base de datos | No: `sync()` no modifica tablas existentes; si cambia un modelo hay que borrar `database.sqlite`. En el README |

## Eventos

| | Ítem | Evidencia |
|---|---|---|
| ✅ | Los casos de uso emiten el evento y no conocen al listener ni al canal | `usecases/tasks/announceTaskAssigned.js`; el listener y el notificador se conectan en `container/container.js` |
| ✅ | Un fallo de notificación no tumba la operación | `alerts/registerAlertListeners.js` captura sus errores; probado con un archivo de notificaciones inexistente: la API siguió respondiendo 201 y 200 |
| ⚠️ | Los avisos sobreviven a una caída del servidor | No: el bus es en memoria. En el README |

## Tests

| | Ítem | Evidencia |
|---|---|---|
| ⚠️ | Tests automáticos de los casos de uso | No hay. Las pruebas son manuales con `requests.http` en los dos modos. En el README |

## Documentación

| | Ítem | Evidencia |
|---|---|---|
| ✅ | Cada endpoint documentado con parámetros, cuerpo, respuestas y cada `code` de error | `openapi.yaml`, publicado en `/api-docs` (21 operaciones) |
| ✅ | La documentación fue verificada contra la API real | Se compararon 238 pedidos reales en cada modo con el documento: 0 diferencias |
| ⚠️ | La documentación no se desactualiza sin que falle un test | No: está escrita a mano, sin test que la compare con las rutas. En el README |
| ✅ | El README permite levantar el proyecto sin preguntar | Pasos de instalación, variables, persistencia y problemas frecuentes |
| ✅ | Limitaciones conocidas escritas | README, sección *Limitaciones conocidas* |
