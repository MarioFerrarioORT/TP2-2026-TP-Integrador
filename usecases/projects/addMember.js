import AppError from "../../errors/AppError.js";
import { assertOwner } from "./projectAccess.js";
import presentProject from "./presentProject.js";

/**
 * Caso de uso: agregar un colaborador al proyecto, indicándolo por email.
 * Reglas: el proyecto debe existir (404), solo el dueño puede agregar (403),
 * el usuario debe existir (404), no puede ser el dueño (409) ni estar ya agregado (409).
 * La tabla intermedia tiene clave única (projectId, userId): aunque dos pedidos lleguen a la vez,
 * la base impide el duplicado. El chequeo de acá da el mensaje claro.
 */
async function addMember(projectId, { email }, actor, projectsDao, usersDao) {
  const project = await projectsDao.getById(projectId);
  if (!project) {
    throw new AppError(
      "PROJECT_NOT_FOUND",
      "No existe un proyecto con ese id",
      404
    );
  }

  assertOwner(project, actor);

  const user = await usersDao.getByEmail(email);
  if (!user) {
    throw new AppError(
      "USER_NOT_FOUND",
      "No existe un usuario con ese email",
      404
    );
  }

  if (user.id === project.ownerId) {
    throw new AppError(
      "OWNER_CANNOT_BE_COLLABORATOR",
      "El dueño del proyecto ya participa en él",
      409
    );
  }

  const added = await projectsDao.addMember(projectId, user.id);
  if (!added) {
    throw new AppError(
      "ALREADY_COLLABORATOR",
      "Ese usuario ya es colaborador del proyecto",
      409
    );
  }

  return presentProject(await projectsDao.getById(projectId), usersDao);
}

export default addMember;
