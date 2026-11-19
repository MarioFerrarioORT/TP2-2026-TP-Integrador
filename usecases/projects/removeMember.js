import AppError from "../../errors/AppError.js";
import { assertOwner } from "./projectAccess.js";

/**
 * Caso de uso: quitar un colaborador del proyecto.
 * Reglas: el proyecto debe existir (404), solo el dueño puede quitar (403),
 * el usuario debe ser colaborador (404) y no puede tener tareas asignadas en ese proyecto (409).
 */
async function removeMember(projectId, userId, actor, projectsDao, tasksDao) {
  const project = await projectsDao.getById(projectId);
  if (!project) {
    throw new AppError(
      "PROJECT_NOT_FOUND",
      "No existe un proyecto con ese id",
      404
    );
  }

  assertOwner(project, actor);

  if (!project.colaboradorIds.includes(userId)) {
    throw new AppError(
      "MEMBER_NOT_FOUND",
      "Ese usuario no es colaborador del proyecto",
      404
    );
  }

  const tasks = await tasksDao.getAll({
    projectId: project.id,
    responsableId: userId,
    limit: 1,
  });
  if (tasks.length > 0) {
    throw new AppError(
      "MEMBER_HAS_TASKS",
      "No se puede quitar a un colaborador que tiene tareas asignadas en este proyecto",
      409
    );
  }

  await projectsDao.removeMember(projectId, userId);
}

export default removeMember;
