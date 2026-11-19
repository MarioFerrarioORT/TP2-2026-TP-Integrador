import { assertParticipant } from "../projects/projectAccess.js";
import presentTask from "./presentTask.js";
import { getProjectOrFail } from "./taskRules.js";

/**
 * Caso de uso: listar las tareas de un proyecto (con filtros opcionales por estado y responsable).
 * Reglas: el proyecto debe existir (404) y el actor debe participar en él (403).
 */
async function getTasks(
  projectId,
  filters,
  actor,
  { projectsDao, tasksDao, usersDao }
) {
  const project = await getProjectOrFail(projectId, projectsDao);
  assertParticipant(project, actor);

  const tasks = await tasksDao.getAll({ ...filters, projectId: project.id });
  return Promise.all(tasks.map((t) => presentTask(t, usersDao)));
}

export default getTasks;
