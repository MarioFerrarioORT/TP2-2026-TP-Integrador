import AppError from "../../errors/AppError.js";

/**
 * Caso de uso: actualizar un usuario (parcial).
 * Reglas: debe existir; si cambia el email, no puede pertenecer a otro usuario;
 * si llega una contraseña nueva, se guarda hasheada.
 */
async function updateUser(id, changes, dao, hasher) {
  const user = await dao.getById(id);
  if (!user) {
    throw new AppError(
      "USER_NOT_FOUND",
      "No existe un usuario con ese id",
      404
    );
  }

  if (changes.email && changes.email !== user.email) {
    const owner = await dao.getByEmail(changes.email);
    if (owner) {
      throw new AppError(
        "EMAIL_DUPLICATED",
        "Ese email ya está registrado",
        409
      );
    }
  }

  const { password, ...toSave } = changes;
  if (password) {
    toSave.passwordHash = await hasher.hash(password);
  }

  return dao.update(id, toSave);
}

export default updateUser;
