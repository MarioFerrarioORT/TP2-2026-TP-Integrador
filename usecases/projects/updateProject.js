import AppError from "../../errors/AppError.js";
import { assertOwner } from "./projectAccess.js";
import presentProject from "./presentProject.js";

/**
 * Caso de uso: actualizar un proyecto (parcial).
 * Reglas: debe existir (404), solo el dueño puede modificarlo (403)
 * y la fecha de fin no puede ser anterior a la fecha de creación del proyecto (400).
 */
async function updateProject(id, changes, actor, projectsDao, usersDao) {
  const project = await projectsDao.getById(id);
  if (!project) {
    throw new AppError(
      "PROJECT_NOT_FOUND",
      "No existe un proyecto con ese id",
      404
    );
  }

  assertOwner(project, actor);

  if (changes.fechaFin && changes.fechaFin < project.fechaCreacion) {
    throw new AppError(
      "INVALID_DATE_RANGE",
      "La fecha de fin no puede ser anterior a la fecha de creación",
      400
    );
  }

  const updated = await projectsDao.update(id, changes);
  return presentProject(updated, usersDao);
}

export default updateProject;
