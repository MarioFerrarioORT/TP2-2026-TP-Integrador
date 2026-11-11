import AppError from "../../errors/AppError.js";

/**
 * Caso de uso: cambiar el rol de un usuario (lo permite solo el admin, desde el router).
 * Reglas: el usuario debe existir y nadie puede cambiarse el rol a sí mismo
 * (evita que el sistema se quede sin administradores).
 */
async function updateUserRole(id, rol, actor, dao) {
  if (actor.id === id) {
    throw new AppError(
      "CANNOT_CHANGE_OWN_ROLE",
      "No podés cambiar tu propio rol",
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

  return dao.update(id, { rol });
}

export default updateUserRole;
