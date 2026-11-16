import { PERSISTENCE_TYPE } from "../config/config.js";
import usersMemoryDao from "./users/UsersMemoryDao.js";
import usersSequelizeDao from "./users/UsersSequelizeDao.js";

/**
 * Factory de DAOs: decide qué implementación usa la aplicación según PERSISTENCE_TYPE.
 * Es el único lugar donde se elige; los casos de uso solo reciben el DAO ya elegido.
 */
function getUsersDao() {
  if (PERSISTENCE_TYPE === "sequelize") {
    console.log("[Persistencia] Usando Sequelize (SQLite)");
    return usersSequelizeDao;
  }
  console.log("[Persistencia] Usando memoria (array de JavaScript)");
  return usersMemoryDao;
}

export { getUsersDao };
