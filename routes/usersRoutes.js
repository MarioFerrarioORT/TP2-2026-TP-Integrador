import express from "express";
import validate, {
  validateQuery,
  validateParams,
} from "../middlewares/validate.js";
import {
  createUserSchema,
  updateUserSchema,
  queryUsersSchema,
  userIdParamSchema,
} from "../schemas/userSchema.js";

/**
 * Factory de router de Usuarios.
 * Recibe el controlador ya armado y define qué ruta valida qué y llama a qué método.
 */
function createUsersRouter(controller) {
  const router = express.Router();

  router.get("/", validateQuery(queryUsersSchema), controller.list);
  router.get("/:id", validateParams(userIdParamSchema), controller.get);
  router.post("/", validate(createUserSchema), controller.create);
  router.put(
    "/:id",
    validateParams(userIdParamSchema),
    validate(updateUserSchema),
    controller.update
  );
  router.delete("/:id", validateParams(userIdParamSchema), controller.remove);

  return router;
}

export default createUsersRouter;
