import { assertParticipant } from "../projects/projectAccess.js";
import presentTask from "./presentTask.js";
import announceTaskAssigned from "./announceTaskAssigned.js";
import {
  getProjectOrFail,
  getTaskOrFail,
  assertResponsibleInProject,
} from "./taskRules.js";

/**
 * Caso de uso: actualizar una tarea (parcial). Sirve también para cambiar el estado o reasignarla.
 * Reglas: el proyecto existe (404), el actor participa (403), la tarea existe en ese proyecto (404)
 * y, si se cambia el responsable, el nuevo debe ser el dueño o un colaborador (409).
 * Efecto secundario desacoplado: si la tarea queda asignada a OTRA persona, emite "task.assigned".
 */
async function updateTask(
  projectId,
  taskId,
  changes,
  actor,
  { projectsDao, tasksDao, usersDao, events }
) {
  const project = await getProjectOrFail(projectId, projectsDao);
  assertParticipant(project, actor);
  const current = await getTaskOrFail(taskId, project.id, tasksDao);

  if (changes.responsableId !== undefined) {
    assertResponsibleInProject(project, changes.responsableId);
  }

  const updated = await tasksDao.update(taskId, changes);
  const presented = await presentTask(updated, usersDao);

  // Solo si cambió el responsable: editar el título o el estado no vuelve a avisar
  if (
    changes.responsableId !== undefined &&
    changes.responsableId !== current.responsableId
  ) {
    await announceTaskAssigned(events, usersDao, {
      task: presented,
      project,
      actor,
    });
  }

  return presented;
}

export default updateTask;
