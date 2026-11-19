import { assertParticipant } from "../projects/projectAccess.js";
import { DEFAULT_TASK_STATE } from "../../utils/taskStates.js";
import presentTask from "./presentTask.js";
import { getProjectOrFail, assertResponsibleInProject } from "./taskRules.js";

/**
 * Caso de uso: crear una tarea dentro de un proyecto.
 * Reglas: el proyecto existe (404), el actor participa en él (403) y el responsable
 * es el dueño o un colaborador del proyecto (409). Si no se indica estado, queda "Pendiente".
 */
async function createTask(
  projectId,
  data,
  actor,
  { projectsDao, tasksDao, usersDao }
) {
  const project = await getProjectOrFail(projectId, projectsDao);
  assertParticipant(project, actor);
  assertResponsibleInProject(project, data.responsableId);

  const task = await tasksDao.save({
    ...data,
    estado: data.estado ?? DEFAULT_TASK_STATE,
    projectId: project.id,
  });
  return presentTask(task, usersDao);
}

export default createTask;
