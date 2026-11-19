# 06 — Eventos y notificaciones

## Propósito

Desacoplar los efectos secundarios (avisar) de las reglas de negocio (asignar, agregar).

## Eventos

- `task.assigned`: al crear una tarea, o al reasignarla a otro responsable. Datos: tarea, proyecto, responsable y quién la asignó.
- `project.memberAdded`: al agregar un colaborador. Datos: proyecto, colaborador y quién lo agregó.

## Reglas

- Los casos de uso solo emiten el evento, después de guardar con éxito. No conocen al listener ni al canal.
- No se emite evento si la operación falla (400, 403, 404, 409).
- Cambiar solo el título o el estado de una tarea, o "reasignar" al mismo responsable, no emite evento.
- El listener vive en un módulo aparte y captura sus propios errores: un fallo de notificación no afecta la respuesta de la API.
- El notificador se elige con NOTIFIER_TYPE (console | file | both) y tiene el contrato notify({ subject, body }).
- Con "file", las notificaciones se agregan a notifications.log (configurable con NOTIFICATIONS_LOG_PATH).

## Criterios de aceptación

- Dada una tarea creada con responsable válido, entonces se notifica "Tarea asignada".
- Dado un notificador que falla, entonces la API igual responde 201 y se registra el error en consola.
- Dado un pedido que termina en 409, entonces no se notifica nada.
- Dado NOTIFIER_TYPE=both, entonces el aviso sale por consola y por archivo.
