import { Router } from "express";
import {
  BCRYPT_ROUNDS,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  CLOCK_NOW,
} from "../config/config.js";
import createClock from "../utils/clock.js";
import createPasswordHasher from "../security/passwordHasher.js";
import createTokenService from "../security/tokenService.js";
import createAuthMiddlewares from "../middlewares/auth.js";
import { getUsersDao, getProjectsDao, getTasksDao } from "../dao/daoFactory.js";
import makeUserUseCases from "../usecases/users/makeUserUseCases.js";
import UsersController from "../controllers/UsersController.js";
import createUsersRouter from "../routes/usersRoutes.js";
import makeAuthUseCases from "../usecases/auth/makeAuthUseCases.js";
import seedAdmin from "../usecases/auth/seedAdmin.js";
import AuthController from "../controllers/AuthController.js";
import createAuthRouter from "../routes/authRoutes.js";
import makeProjectUseCases from "../usecases/projects/makeProjectUseCases.js";
import ProjectsController from "../controllers/ProjectsController.js";
import createProjectsRouter from "../routes/projectsRoutes.js";
import makeTaskUseCases from "../usecases/tasks/makeTaskUseCases.js";
import TasksController from "../controllers/TasksController.js";
import createTasksRouter from "../routes/tasksRoutes.js";
import createEventBus from "../events/eventBus.js";
import { getNotifier } from "../notifications/notifierFactory.js";
import registerAlertListeners from "../alerts/registerAlertListeners.js";

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

  const projectsDao = getProjectsDao();
  if (typeof projectsDao.init === "function") {
    await projectsDao.init();
  }

  const tasksDao = getTasksDao();
  if (typeof tasksDao.init === "function") {
    await tasksDao.init();
  }

  // Reloj: hora real, o fija si CLOCK_NOW está definida (para probar a mano)
  const clock = createClock({ fixedNow: CLOCK_NOW });
  if (CLOCK_NOW)
    console.log(`[Reloj] Fijo en ${CLOCK_NOW} (hoy = ${clock.today()})`);

  // Eventos: el bus conecta a quien emite (casos de uso) con quien escucha (alertas).
  // El notificador (consola, archivo...) se elige acá; ni los casos de uso ni el listener lo conocen.
  const events = createEventBus();
  registerAlertListeners(events, getNotifier());

  // 3. Administrador inicial: va DESPUÉS de inicializar los DAOs (la tabla ya tiene que existir)
  await seedAdmin(
    { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    usersDao,
    hasher
  );

  // 4. Casos de uso -> controladores
  const usersController = new UsersController(
    makeUserUseCases(usersDao, hasher, projectsDao, tasksDao)
  );
  const authController = new AuthController(
    makeAuthUseCases({ usersDao, hasher, tokens })
  );
  const projectsController = new ProjectsController(
    makeProjectUseCases({ projectsDao, usersDao, tasksDao, clock, events })
  );
  const tasksController = new TasksController(
    makeTaskUseCases({ projectsDao, tasksDao, usersDao, events })
  );

  // 5. Routers
  const router = Router();
  router.use("/auth", createAuthRouter(authController, auth));
  router.use("/users", createUsersRouter(usersController, auth));
  router.use("/projects/:id/tasks", createTasksRouter(tasksController, auth));
  router.use("/projects", createProjectsRouter(projectsController, auth));

  return router;
}

export default buildContainer;
