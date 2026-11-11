import { Router } from "express";
import {
  BCRYPT_ROUNDS,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
} from "../config/config.js";
import createPasswordHasher from "../security/passwordHasher.js";
import createTokenService from "../security/tokenService.js";
import createAuthMiddlewares from "../middlewares/auth.js";
import { getUsersDao } from "../dao/daoFactory.js";
import makeUserUseCases from "../usecases/users/makeUserUseCases.js";
import UsersController from "../controllers/UsersController.js";
import createUsersRouter from "../routes/usersRoutes.js";
import makeAuthUseCases from "../usecases/auth/makeAuthUseCases.js";
import seedAdmin from "../usecases/auth/seedAdmin.js";
import AuthController from "../controllers/AuthController.js";
import createAuthRouter from "../routes/authRoutes.js";

/**
 * Composition Root: el único lugar donde se crean y conectan las piezas.
 * Orden de armado: servicios -> DAOs -> casos de uso -> controladores -> routers.
 */
async function buildContainer() {
  // 1. Servicios de seguridad
  const hasher = createPasswordHasher({ rounds: BCRYPT_ROUNDS });
  const tokens = createTokenService({
    secret: JWT_SECRET,
    expiresIn: JWT_EXPIRES_IN,
  });
  const auth = createAuthMiddlewares(tokens);

  // 2. DAOs (si el adaptador necesita prepararse, por ejemplo Sequelize, tiene un método init)
  const usersDao = getUsersDao();
  if (typeof usersDao.init === "function") {
    await usersDao.init();
  }

  // 3. Administrador inicial: va DESPUÉS de inicializar los DAOs (la tabla ya tiene que existir)
  await seedAdmin(
    { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    usersDao,
    hasher
  );

  // 4. Casos de uso -> controladores
  const usersController = new UsersController(
    makeUserUseCases(usersDao, hasher)
  );
  const authController = new AuthController(
    makeAuthUseCases({ usersDao, hasher, tokens })
  );

  // 5. Routers
  const router = Router();
  router.use("/auth", createAuthRouter(authController, auth));
  router.use("/users", createUsersRouter(usersController, auth));

  return router;
}

export default buildContainer;
