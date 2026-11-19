import AppError from "../../errors/AppError.js";

/**
 * Caso de uso: eliminar un usuario (lo permite solo el admin, desde el router).
 * Reglas: el usuario debe existir, nadie puede borrarse a sí mismo, no se puede eliminar
 * a quien sea dueño de proyectos ni a quien tenga tareas asignadas.
 * Sus participaciones como colaborador se quitan al eliminarlo.
 */
async function deleteUser(id, actor, dao, projectsDao, tasksDao) {
  if (actor.id === id) {
    throw new AppError(
      "CANNOT_DELETE_SELF",
      "No podés eliminar tu propio usuario",
      409
    );
  }

  const user = await dao.getById(id);
  if (!user) {
    throw new AppError(
      "USER_NOT_FOUND",
      "No existe un usuario con ese id",
      404
    );
  }

  const ownedProjects = await projectsDao.getAll({ ownerId: id, limit: 1 });
  if (ownedProjects.length > 0) {
    throw new AppError(
      "USER_HAS_PROJECTS",
      "No se puede eliminar a un usuario que es dueño de proyectos",
      409
    );
  }

  const assignedTasks = await tasksDao.getAll({ responsableId: id, limit: 1 });
  if (assignedTasks.length > 0) {
    throw new AppError(
      "USER_HAS_TASKS",
      "No se puede eliminar a un usuario que tiene tareas asignadas",
      409
    );
  }

  await projectsDao.removeUserMemberships(id);
  await dao.delete(id);
}

export default deleteUser;
