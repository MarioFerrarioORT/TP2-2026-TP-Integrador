import getTasks from "./getTasks.js";
import getTaskById from "./getTaskById.js";
import createTask from "./createTask.js";
import updateTask from "./updateTask.js";
import deleteTask from "./deleteTask.js";

/**
 * Factory de casos de uso de Tareas.
 * Recibe las dependencias como un objeto y se las pasa a cada caso de uso.
 * "actor" es quien hace la petición ({ id, rol }), tomado del token.
 */
function makeTaskUseCases(deps) {
  return {
    getTasks: (projectId, filters, actor) =>
      getTasks(projectId, filters, actor, deps),
    getTaskById: (projectId, taskId, actor) =>
      getTaskById(projectId, taskId, actor, deps),
    createTask: (projectId, data, actor) =>
      createTask(projectId, data, actor, deps),
    updateTask: (projectId, taskId, changes, actor) =>
      updateTask(projectId, taskId, changes, actor, deps),
    deleteTask: (projectId, taskId, actor) =>
      deleteTask(projectId, taskId, actor, deps),
  };
}

export default makeTaskUseCases;
