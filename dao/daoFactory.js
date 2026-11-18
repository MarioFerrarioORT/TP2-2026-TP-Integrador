import { PERSISTENCE_TYPE } from "../config/config.js";
import usersMemoryDao from "./users/UsersMemoryDao.js";
import usersSequelizeDao from "./users/UsersSequelizeDao.js";
import projectsMemoryDao from "./projects/ProjectsMemoryDao.js";
import projectsSequelizeDao from "./projects/ProjectsSequelizeDao.js";

/**
 * Factory de DAOs: decide qué implementación usa la aplicación según PERSISTENCE_TYPE.
 * Es el único lugar donde se elige; los casos de uso solo reciben el DAO ya elegido.
 */
const useSequelize = PERSISTENCE_TYPE === "sequelize";

function getUsersDao() {
  if (useSequelize) {
    console.log("[Persistencia] Usando Sequelize (SQLite)");
    return usersSequelizeDao;
  }
  console.log("[Persistencia] Usando memoria (array de JavaScript)");
  return usersMemoryDao;
}

function getProjectsDao() {
  return useSequelize ? projectsSequelizeDao : projectsMemoryDao;
}

export { getUsersDao, getProjectsDao };
