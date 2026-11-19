import { assertParticipant } from "../projects/projectAccess.js";
import presentTask from "./presentTask.js";
import {
  getProjectOrFail,
  getTaskOrFail,
  assertResponsibleInProject,
} from "./taskRules.js";

/**
 * Caso de uso: actualizar una tarea (parcial). Sirve también para cambiar el estado o reasignarla.
 * Reglas: el proyecto existe (404), el actor participa (403), la tarea existe en ese proyecto (404)
 * y, si se cambia el responsable, el nuevo debe ser el dueño o un colaborador (409).
 */
async function updateTask(
  projectId,
  taskId,
  changes,
  actor,
  { projectsDao, tasksDao, usersDao }
) {
  const project = await getProjectOrFail(projectId, projectsDao);
  assertParticipant(project, actor);
  await getTaskOrFail(taskId, project.id, tasksDao);

  if (changes.responsableId !== undefined) {
    assertResponsibleInProject(project, changes.responsableId);
  }

  const updated = await tasksDao.update(taskId, changes);
  return presentTask(updated, usersDao);
}

export default updateTask;
