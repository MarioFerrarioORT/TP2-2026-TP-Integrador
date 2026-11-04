import { Router } from "express";
import { BCRYPT_ROUNDS } from "../config/config.js";
import createPasswordHasher from "../security/passwordHasher.js";
import { getUsersDao } from "../dao/daoFactory.js";
import makeUserUseCases from "../usecases/users/makeUserUseCases.js";
import UsersController from "../controllers/UsersController.js";
import createUsersRouter from "../routes/usersRoutes.js";

/**
 * Composition Root: el único lugar donde se crean y conectan las piezas.
 * Orden de armado: servicios -> DAOs -> casos de uso -> controladores -> routers.
 */
async function buildContainer() {
  // 1. Servicios
  const hasher = createPasswordHasher({ rounds: BCRYPT_ROUNDS });

  // 2. DAOs (si el adaptador necesita prepararse, por ejemplo Sequelize, tiene un método init)
  const usersDao = getUsersDao();
  if (typeof usersDao.init === "function") {
    await usersDao.init();
  }

  // 3. Casos de uso -> 4. Controladores
  const usersController = new UsersController(
    makeUserUseCases(usersDao, hasher)
  );

  // 5. Routers
  const router = Router();
  router.use("/users", createUsersRouter(usersController));

  return router;
}

export default buildContainer;
