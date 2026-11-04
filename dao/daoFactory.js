import usersMemoryDao from "./users/UsersMemoryDao.js";

/**
 * Factory de DAOs: decide qué implementación usa la aplicación.
 * Por ahora solo existe la de memoria; el adaptador Sequelize se suma en el Paso 8
 * y la elección pasará a depender de PERSISTENCE_TYPE.
 */
function getUsersDao() {
  return usersMemoryDao;
}

export { getUsersDao };
