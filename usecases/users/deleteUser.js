import AppError from "../../errors/AppError.js";

/**
 * Caso de uso: eliminar un usuario (lo permite solo el admin, desde el router).
 * Reglas: el usuario debe existir y nadie puede borrarse a sí mismo.
 * (Más adelante se agrega: no se puede borrar un usuario con proyectos o tareas asignadas.)
 */
async function deleteUser(id, actor, dao) {
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

  await dao.delete(id);
}

export default deleteUser;
