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
