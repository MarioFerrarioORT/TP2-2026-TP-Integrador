import { assertOwner } from "../projects/projectAccess.js";
import { getProjectOrFail, getTaskOrFail } from "./taskRules.js";

/**
 * Caso de uso: eliminar una tarea.
 * Reglas: el proyecto existe (404), solo el dueño puede eliminar tareas (403)
 * y la tarea existe en ese proyecto (404).
 */
async function deleteTask(projectId, taskId, actor, { projectsDao, tasksDao }) {
  const project = await getProjectOrFail(projectId, projectsDao);
  assertOwner(project, actor);
  await getTaskOrFail(taskId, project.id, tasksDao);

  await tasksDao.delete(taskId);
}

export default deleteTask;
