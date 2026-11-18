import AppError from "../../errors/AppError.js";

/**
 * Reglas de acceso a un proyecto, compartidas por varios casos de uso.
 * Recibe el proyecto (con colaboradorIds) y el actor ({ id, rol }) tomado del token.
 */

// Debe ser el dueño o un colaborador (para ver el proyecto)
function assertParticipant(project, actor) {
  const isParticipant =
    project.ownerId === actor.id || project.colaboradorIds.includes(actor.id);
  if (!isParticipant) {
    throw new AppError(
      "NOT_PROJECT_MEMBER",
      "No participás en este proyecto",
      403
    );
  }
}

// Debe ser el dueño (para modificar o eliminar el proyecto y gestionar colaboradores)
function assertOwner(project, actor) {
  if (project.ownerId !== actor.id) {
    throw new AppError(
      "NOT_PROJECT_OWNER",
      "Solo el dueño del proyecto puede hacer esto",
      403
    );
  }
}

export { assertParticipant, assertOwner };
