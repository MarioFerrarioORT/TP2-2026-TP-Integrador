import AppError from "../../errors/AppError.js";

/**
 * Caso de uso: eliminar un usuario.
 * Regla: debe existir.
 * (Más adelante se agregan las reglas "no tener proyectos ni tareas" y "no borrarse a sí mismo".)
 */
async function deleteUser(id, dao) {
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
