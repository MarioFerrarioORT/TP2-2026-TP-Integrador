# 05 — Tareas

## Propósito

Tareas dentro de un proyecto, con estado y un responsable que debe pertenecer al proyecto.

## Reglas

- Una tarea tiene título, descripción, estado (Pendiente | En proceso | Finalizado) y un responsable. El proyecto sale de la URL.
- El responsable es obligatorio y debe ser el dueño o un colaborador → 409 RESPONSIBLE_NOT_IN_PROJECT.
- Sin estado en el body, la tarea queda "Pendiente".
- Dueño y colaboradores ven, crean y editan tareas (incluye cambiar estado y reasignar). No participantes → 403.
- Solo el dueño elimina tareas → 403 NOT_PROJECT_OWNER.
- Una tarea pedida por la URL de otro proyecto → 404 TASK_NOT_FOUND.
- No se elimina un proyecto con tareas (409 PROJECT_HAS_TASKS).
- No se quita a un colaborador con tareas asignadas en ese proyecto (409 MEMBER_HAS_TASKS).
- No se elimina un usuario con tareas asignadas (409 USER_HAS_TASKS).
- La base refuerza las dos últimas con claves foráneas ON DELETE RESTRICT.

## Criterios de aceptación

- Dado un POST con responsable que no participa, entonces 409.
- Dado un POST con "projectId" o "id" en el body, entonces se ignoran.
- Dado un colaborador con tareas, cuando el dueño intenta quitarlo, entonces 409.
- Dado el mismo conjunto de peticiones en ambos modos, entonces las respuestas son idénticas.
