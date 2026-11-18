import AppError from "../../errors/AppError.js";
import { assertOwner } from "./projectAccess.js";

/**
 * Caso de uso: quitar un colaborador del proyecto.
 * Reglas: el proyecto debe existir (404), solo el dueño puede quitar (403)
 * y el usuario debe ser colaborador (404).
 * (Más adelante se agrega: no se puede quitar a un colaborador que tenga tareas asignadas.)
 */
async function removeMember(projectId, userId, actor, projectsDao) {
  const project = await projectsDao.getById(projectId);
  if (!project) {
    throw new AppError(
      "PROJECT_NOT_FOUND",
      "No existe un proyecto con ese id",
      404
    );
  }

  assertOwner(project, actor);

  const removed = await projectsDao.removeMember(projectId, userId);
  if (!removed) {
    throw new AppError(
      "MEMBER_NOT_FOUND",
      "Ese usuario no es colaborador del proyecto",
      404
    );
  }
}

export default removeMember;
