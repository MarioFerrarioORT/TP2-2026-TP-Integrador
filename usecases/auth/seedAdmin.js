import createUser from "../users/createUser.js";

/**
 * Caso de uso: crear el administrador inicial si todavía no existe.
 * Se ejecuta al arrancar (desde el contenedor), después de inicializar los DAOs.
 * Es idempotente: si ya existe, no hace nada (con el DAO en memoria se vuelve a crear en cada arranque).
 */
async function seedAdmin({ email, password }, dao, hasher) {
  const existing = await dao.getByEmail(email);
  if (existing) return existing;

  return createUser(
    { nombre: "Administrador", email, password, rol: "admin" },
    dao,
    hasher
  );
}

export default seedAdmin;
