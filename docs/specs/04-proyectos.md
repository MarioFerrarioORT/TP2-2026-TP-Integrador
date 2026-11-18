# 04 — Proyectos y colaboradores

## Propósito

Proyectos con dueño y colaboradores (N a N), con permisos por pertenencia y persistencia intercambiable.

## Reglas

- El dueño sale del token y la fecha de creación es la de hoy (reloj inyectable); no se aceptan en el body.
- fechaFin no puede ser anterior a la fecha de creación → 400 INVALID_DATE_RANGE.
- Un usuario solo ve los proyectos donde es dueño o colaborador; si pide otro → 403 NOT_PROJECT_MEMBER.
- Solo el dueño modifica, elimina y gestiona colaboradores → 403 NOT_PROJECT_OWNER.
- Los colaboradores se agregan por email. No se puede agregar al dueño ni repetir (409).
- La base impide repetir colaborador (clave primaria compuesta projectId + userId).
- Un admin no tiene acceso especial a proyectos ajenos; sigue las mismas reglas que cualquier usuario.
- No se puede eliminar a un usuario que es dueño de proyectos (409 USER_HAS_PROJECTS).
- Al eliminar a un usuario colaborador, se quitan sus participaciones.
- Pendiente (Paso 7): no eliminar proyectos con tareas ni quitar colaboradores con tareas asignadas.

## Criterios de aceptación

- Dado un POST con "ownerId" o "fechaCreacion" en el body, entonces se ignoran.
- Dado un usuario que no participa, cuando pide GET /projects/:id, entonces 403.
- Dado un colaborador que intenta PUT o agregar colaboradores, entonces 403.
- Dado el mismo email agregado dos veces, entonces la segunda da 409.
- Dado el mismo conjunto de peticiones en ambos modos, entonces las respuestas son idénticas.
