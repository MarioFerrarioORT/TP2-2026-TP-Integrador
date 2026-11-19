import { assertParticipant } from "../projects/projectAccess.js";
import presentTask from "./presentTask.js";
import { getProjectOrFail, getTaskOrFail } from "./taskRules.js";

/**
 * Caso de uso: obtener una tarea de un proyecto.
 * Reglas: el proyecto existe (404), el actor participa (403) y la tarea existe en ese proyecto (404).
 */
async function getTaskById(
  projectId,
  taskId,
  actor,
  { projectsDao, tasksDao, usersDao }
) {
  const project = await getProjectOrFail(projectId, projectsDao);
  assertParticipant(project, actor);

  const task = await getTaskOrFail(taskId, project.id, tasksDao);
  return presentTask(task, usersDao);
}

export default getTaskById;
