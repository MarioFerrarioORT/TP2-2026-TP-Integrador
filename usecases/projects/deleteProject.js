import AppError from "../../errors/AppError.js";
import { assertOwner } from "./projectAccess.js";

/**
 * Caso de uso: eliminar un proyecto.
 * Reglas: debe existir (404) y solo el dueño puede eliminarlo (403).
 * (Más adelante se agrega: no se puede eliminar un proyecto que tenga tareas.)
 */
async function deleteProject(id, actor, projectsDao) {
  const project = await projectsDao.getById(id);
  if (!project) {
    throw new AppError(
      "PROJECT_NOT_FOUND",
      "No existe un proyecto con ese id",
      404
    );
  }

  assertOwner(project, actor);
  await projectsDao.delete(id);
}

export default deleteProject;
