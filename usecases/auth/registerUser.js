import createUser from "../users/createUser.js";

/**
 * Caso de uso: registro público.
 * Reutiliza createUser (email único, contraseña hasheada) pero FUERZA el rol "usuario".
 */
async function registerUser(data, dao, hasher) {
  return createUser({ ...data, rol: "usuario" }, dao, hasher);
}

export default registerUser;
