import EVENTS from "../../events/eventNames.js";

/**
 * Emite "task.assigned". Se llama DESPUÉS de guardar la tarea: el evento cuenta algo que YA ocurrió.
 * El caso de uso solo emite el aviso; no sabe quién escucha ni por qué canal se notifica.
 * `task` es la tarea ya presentada (con el responsable completo) y `actor` quien la asignó.
 */
async function announceTaskAssigned(
  events,
  usersDao,
  { task, project, actor }
) {
  const assigner = await usersDao.getById(actor.id);
  events.emit(EVENTS.TASK_ASSIGNED, {
    taskId: task.id,
    titulo: task.titulo,
    projectId: project.id,
    proyecto: project.titulo,
    responsable: {
      id: task.responsable.id,
      nombre: task.responsable.nombre,
      email: task.responsable.email,
    },
    asignadoPor: assigner ? assigner.nombre : "un usuario",
  });
}

export default announceTaskAssigned;
