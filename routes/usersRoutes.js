import express from "express";
import validate, {
  validateQuery,
  validateParams,
} from "../middlewares/validate.js";
import {
  createUserSchema,
  updateUserSchema,
  updateRoleSchema,
  queryUsersSchema,
  userIdParamSchema,
} from "../schemas/userSchema.js";

/**
 * Factory de router de Usuarios.
 * Recibe el controlador ya armado y los middlewares de seguridad.
 * Todo /users es solo para administradores.
 */
function createUsersRouter(controller, auth) {
  const router = express.Router();

  // Se aplica a TODAS las rutas de este router: primero autenticar, después autorizar
  router.use(auth.authenticate, auth.authorize("admin"));

  router.get("/", validateQuery(queryUsersSchema), controller.list);
  router.get("/:id", validateParams(userIdParamSchema), controller.get);
  router.post("/", validate(createUserSchema), controller.create);
  router.put(
    "/:id",
    validateParams(userIdParamSchema),
    validate(updateUserSchema),
    controller.update
  );
  router.patch(
    "/:id/rol",
    validateParams(userIdParamSchema),
    validate(updateRoleSchema),
    controller.updateRole
  );
  router.delete("/:id", validateParams(userIdParamSchema), controller.remove);

  return router;
}

export default createUsersRouter;
