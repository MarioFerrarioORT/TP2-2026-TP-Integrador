import AppError from "../../errors/AppError.js";
import { assertOwner } from "./projectAccess.js";

/**
 * Caso de uso: eliminar un proyecto.
 * Reglas: debe existir (404) y solo el dueño puede eliminarlo (403).
 * y no puede tener tareas (409): primero hay que eliminarlas.
 */
async function deleteProject(id, actor, projectsDao, tasksDao) {
  const project = await projectsDao.getById(id);
  if (!project) {
    throw new AppError(
      "PROJECT_NOT_FOUND",
      "No existe un proyecto con ese id",
      404
    );
  }

  assertOwner(project, actor);

  const tasks = await tasksDao.getAll({ projectId: project.id, limit: 1 });
  if (tasks.length > 0) {
    throw new AppError(
      "PROJECT_HAS_TASKS",
      "No se puede eliminar un proyecto que tiene tareas",
      409
    );
  }

  await projectsDao.delete(id);
}

export default deleteProject;
