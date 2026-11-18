import AppError from "../../errors/AppError.js";
import { assertParticipant } from "./projectAccess.js";
import presentProject from "./presentProject.js";

/**
 * Caso de uso: obtener un proyecto por id.
 * Reglas: debe existir (404) y el actor debe participar en él (403).
 */
async function getProjectById(id, actor, projectsDao, usersDao) {
  const project = await projectsDao.getById(id);
  if (!project) {
    throw new AppError(
      "PROJECT_NOT_FOUND",
      "No existe un proyecto con ese id",
      404
    );
  }

  assertParticipant(project, actor);
  return presentProject(project, usersDao);
}

export default getProjectById;
