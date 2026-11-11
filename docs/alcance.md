# Alcance, prioridades y restricciones

## Objetivo

API REST de un gestor de proyectos (usuarios, proyectos con colaboradores y tareas), construida con arquitectura en capas, persistencia intercambiable (memoria y Sequelize con SQLite), eventos de dominio, autenticación con JWT y documentación OpenAPI. Trabajo individual del Taller de Nuevas Tecnologías 2.

## Dentro del alcance

| Área                 | Qué incluye                                                                                                                                                                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Entidades            | Usuario, Proyecto, Tarea y la tabla intermedia de colaboradores                                                                                                                                                                                         |
| Relaciones           | Usuario→Proyecto (1 a N, dueño), Proyecto↔Usuario (N a N, colaboradores), Proyecto→Tarea (1 a N), Usuario→Tarea (1 a N, responsable)                                                                                                                    |
| Seguridad            | Registro, login, JWT, dos roles (`usuario` y `admin`), admin inicial desde variables de entorno                                                                                                                                                         |
| Reglas de negocio    | Email único; el responsable de una tarea es el dueño o un colaborador; `fechaFin` no anterior a la creación; no repetir colaboradores ni agregar al dueño; baja de usuarios solo sin proyectos ni tareas; nadie se borra ni se cambia el rol a sí mismo |
| Arquitectura         | Rutas → controladores → casos de uso → DAO; contenedor; DAO en memoria y DAO Sequelize elegidos por `PERSISTENCE_TYPE`                                                                                                                                  |
| Validación y errores | Zod en body, params y query; `AppError`; un único `errorHandler`; `notFound`; códigos 200, 201, 204, 400, 401, 403, 404, 409 y 500                                                                                                                      |
| Eventos              | `EventEmitter` inyectado, evento `task.assigned`, listener en un módulo aparte, notificador por consola o archivo                                                                                                                                       |
| Documentación        | Swagger en `/api-docs` (OpenAPI 3), README, y `docs/` con diseño, decisiones, bitácora y especificaciones                                                                                                                                               |

## Fuera del alcance

- Interfaz gráfica (solo API).
- Refresh tokens, cierre de sesión real y revocación de tokens.
- Límite de intentos de login y cambio de contraseña.
- Que el admin edite o borre proyectos y tareas ajenos.
- Subida de archivos, comentarios en tareas, búsqueda avanzada.
- Despliegue en un servidor.

## Prioridades

Ordenadas por el peso en la nota de la consigna (sobre 10):

| Prioridad              | Qué                                                                       | Puntos                  |
| ---------------------- | ------------------------------------------------------------------------- | ----------------------- |
| **Imprescindible**     | Arquitectura en capas y separación de responsabilidades                   | 2                       |
| **Imprescindible**     | Persistencia intercambiable: dos DAO con la misma interfaz y fábrica      | 2                       |
| **Imprescindible**     | Validación (Zod) y manejo de errores centralizado                         | 1,5                     |
| **Imprescindible**     | Reglas de negocio en casos de uso y relación entre entidades              | 1                       |
| **Imprescindible**     | Eventos: emisor, listener y notificador desacoplados                      | 1                       |
| **Imprescindible**     | Swagger completo y README                                                 | 1                       |
| **Imprescindible**     | Contenedor e inyección de dependencias                                    | 0,5                     |
| **Imprescindible**     | Calidad del código y commits progresivos                                  | 0,5                     |
| **Imprescindible**     | Defensa oral (cambiar de persistencia en vivo y modificar una regla)      | 0,5                     |
| Deseable               | JWT y hash de contraseñas (ya hecho), relación N a N con tabla intermedia | extra, hasta 1 en total |
| Deseable si hay tiempo | Paginación y filtros, tests de casos de uso, segundo evento o notificador | extra                   |
| Opcional               | Notificaciones guardadas por usuario (decidir el 10 de noviembre), Docker | extra                   |

Si el tiempo aprieta, se recorta de abajo hacia arriba. Lo imprescindible no se negocia.

## Restricciones

**De la consigna**

- Node.js con ES Modules y Express.
- `index.js` limpio: solo arranca el servidor y monta el router del contenedor.
- Carpetas por responsabilidad: `routes/`, `controllers/`, `usecases/`, `dao/`, `schemas/`, `middlewares/`, `errors/`, `config/`, `container/`.
- Configuración centralizada en `config/config.js`, con `.env.example`; el `.env` no se versiona.
- Los DAO devuelven objetos planos, nunca instancias del ORM.
- Cambiar de persistencia no debe requerir tocar controladores, rutas ni casos de uso, y los dos modos deben responder igual.
- Los casos de uso no importan DAOs concretos y los controladores no conocen ningún DAO.
- El listener captura sus propios errores: una notificación fallida no tumba la operación.
- Swagger con `components/schemas` reutilizados con `$ref`, probable con "Try it out" en ambos modos.
- No subir `node_modules`, `.env` ni archivos `.sqlite`.
- Repositorio Git con commits progresivos.
- Hay que poder explicar y modificar cada parte del código en la defensa.

**Técnicas**

- Node 20.6 o superior (por `--env-file`); probado en Node 22.
- Express 5, Zod 4, Sequelize 6 y SQLite.
- Sin TypeScript ni contenedores de inyección de dependencias: la inyección es manual, con factories.
- La carpeta es `usecases/`, todo en minúscula (D3).

**De tiempo y de contexto**

- Entrega el 18 o el 25 de noviembre (a confirmar).
- Trabajo individual.
- Sequelize es un tema que no se vio en clase, así que es el principal riesgo técnico.

## Riesgos

| Riesgo                                                              | Mitigación                                                      |
| ------------------------------------------------------------------- | --------------------------------------------------------------- |
| Sequelize y las asociaciones (N a N) llevan más tiempo del previsto | Empezar el Paso 8 sin demora y no dejarlo para el último día    |
| Swagger de unos 20 endpoints se acumula al final                    | Ir agregando las rutas de cada recurso a medida que se terminan |
| Poco tiempo para ensayar la defensa                                 | Reservar al menos un día antes de la entrega                    |
| Los dos modos de persistencia responden distinto                    | Probar siempre con el mismo `requests.http` en ambos modos      |

## Estado

Pasos 1 a 3 hechos y probados. Paso 4 (autenticación y administrador) construido y en pruebas. Siguientes: Paso 5 (proyectos), 6 (tareas), 7 (evento), 8 (Sequelize) y 9 (Swagger y README).
