import AppError from "../../errors/AppError.js";

/**
 * Caso de uso: obtener un usuario por id.
 * Regla: si no existe, 404.
 */
async function getUserById(id, dao) {
  const user = await dao.getById(id);
  if (!user) {
    throw new AppError(
      "USER_NOT_FOUND",
      "No existe un usuario con ese id",
      404
    );
  }
  return user;
}

export default getUserById;
