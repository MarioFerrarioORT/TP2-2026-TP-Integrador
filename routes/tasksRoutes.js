import express from "express";
import validate, {
  validateQuery,
  validateParams,
} from "../middlewares/validate.js";
import {
  createTaskSchema,
  updateTaskSchema,
  queryTasksSchema,
  projectParamSchema,
  taskParamsSchema,
} from "../schemas/taskSchema.js";

/**
 * Factory de router de Tareas. Se monta en /projects/:id/tasks.
 * mergeParams: true hace que este router también vea el parámetro :id definido en la ruta donde se monta.
 * Los permisos (participante, dueño) dependen del proyecto, por eso se aplican en los casos de uso.
 */
function createTasksRouter(controller, auth) {
  const router = express.Router({ mergeParams: true });

  router.use(auth.authenticate);

  router.get(
    "/",
    validateParams(projectParamSchema),
    validateQuery(queryTasksSchema),
    controller.list
  );
  router.post(
    "/",
    validateParams(projectParamSchema),
    validate(createTaskSchema),
    controller.create
  );
  router.get("/:taskId", validateParams(taskParamsSchema), controller.get);
  router.put(
    "/:taskId",
    validateParams(taskParamsSchema),
    validate(updateTaskSchema),
    controller.update
  );
  router.delete(
    "/:taskId",
    validateParams(taskParamsSchema),
    controller.remove
  );

  return router;
}

export default createTasksRouter;
