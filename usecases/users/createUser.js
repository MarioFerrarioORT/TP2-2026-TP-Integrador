import AppError from "../../errors/AppError.js";

/**
 * Caso de uso: crear un usuario.
 * Reglas: el email no puede estar duplicado; la contraseña se guarda siempre hasheada.
 * El rol por defecto es "usuario". El esquema Zod no acepta "rol" desde el body:
 * solo el código del servidor (por ejemplo el seed del admin) puede indicarlo.
 */
async function createUser(data, dao, hasher) {
  const existing = await dao.getByEmail(data.email);
  if (existing) {
    throw new AppError("EMAIL_DUPLICATED", "Ese email ya está registrado", 409);
  }

  const { password, rol = "usuario", ...rest } = data;
  const passwordHash = await hasher.hash(password);

  return dao.save({ ...rest, rol, passwordHash });
}

export default createUser;
