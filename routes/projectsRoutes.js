import express from "express";
import validate, {
  validateQuery,
  validateParams,
} from "../middlewares/validate.js";
import {
  createProjectSchema,
  updateProjectSchema,
  queryProjectsSchema,
  addMemberSchema,
  projectIdParamSchema,
  memberParamsSchema,
} from "../schemas/projectSchema.js";

/**
 * Factory de router de Proyectos.
 * Todas las rutas exigen estar autenticado. Los permisos finos (dueño, colaborador)
 * dependen del proyecto concreto, por eso se aplican dentro de los casos de uso y no con authorize.
 */
function createProjectsRouter(controller, auth) {
  const router = express.Router();

  router.use(auth.authenticate);

  router.get("/", validateQuery(queryProjectsSchema), controller.list);
  router.post("/", validate(createProjectSchema), controller.create);
  router.get("/:id", validateParams(projectIdParamSchema), controller.get);
  router.put(
    "/:id",
    validateParams(projectIdParamSchema),
    validate(updateProjectSchema),
    controller.update
  );
  router.delete(
    "/:id",
    validateParams(projectIdParamSchema),
    controller.remove
  );

  router.post(
    "/:id/members",
    validateParams(projectIdParamSchema),
    validate(addMemberSchema),
    controller.addMember
  );
  router.delete(
    "/:id/members/:userId",
    validateParams(memberParamsSchema),
    controller.removeMember
  );

  return router;
}

export default createProjectsRouter;
