import AppError from "../../errors/AppError.js";

/**
 * Reglas compartidas por los casos de uso de tareas.
 */

// El proyecto de la URL debe existir
async function getProjectOrFail(projectId, projectsDao) {
  const project = await projectsDao.getById(projectId);
  if (!project) {
    throw new AppError(
      "PROJECT_NOT_FOUND",
      "No existe un proyecto con ese id",
      404
    );
  }
  return project;
}

// La tarea debe existir Y pertenecer al proyecto de la URL
// (si pertenece a otro proyecto se responde 404, para no revelar tareas de proyectos ajenos)
async function getTaskOrFail(taskId, projectId, tasksDao) {
  const task = await tasksDao.getById(taskId);
  if (!task || task.projectId !== projectId) {
    throw new AppError(
      "TASK_NOT_FOUND",
      "No existe una tarea con ese id en este proyecto",
      404
    );
  }
  return task;
}

// Regla central del dominio: el responsable debe ser el dueño del proyecto o uno de sus colaboradores
function assertResponsibleInProject(project, responsableId) {
  const valid =
    project.ownerId === responsableId ||
    project.colaboradorIds.includes(responsableId);
  if (!valid) {
    throw new AppError(
      "RESPONSIBLE_NOT_IN_PROJECT",
      "El responsable debe ser el dueño del proyecto o uno de sus colaboradores",
      409
    );
  }
}

export { getProjectOrFail, getTaskOrFail, assertResponsibleInProject };
