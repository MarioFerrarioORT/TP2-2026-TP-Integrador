import getProjects from "./getProjects.js";
import getProjectById from "./getProjectById.js";
import createProject from "./createProject.js";
import updateProject from "./updateProject.js";
import deleteProject from "./deleteProject.js";
import addMember from "./addMember.js";
import removeMember from "./removeMember.js";

/**
 * Factory de casos de uso de Proyectos.
 * Recibe las dependencias (DAOs y reloj) y las "engancha" en cada caso de uso.
 * "actor" es quien hace la petición ({ id, rol }), tomado del token.
 */
function makeProjectUseCases({
  projectsDao,
  usersDao,
  tasksDao,
  clock,
  events,
}) {
  return {
    getProjects: (filters, actor) =>
      getProjects(filters, actor, projectsDao, usersDao),
    getProjectById: (id, actor) =>
      getProjectById(id, actor, projectsDao, usersDao),
    createProject: (data, actor) =>
      createProject(data, actor, projectsDao, usersDao, clock),
    updateProject: (id, changes, actor) =>
      updateProject(id, changes, actor, projectsDao, usersDao),
    deleteProject: (id, actor) =>
      deleteProject(id, actor, projectsDao, tasksDao),
    addMember: (projectId, data, actor) =>
      addMember(projectId, data, actor, projectsDao, usersDao, events),
    removeMember: (projectId, userId, actor) =>
      removeMember(projectId, userId, actor, projectsDao, tasksDao),
  };
}

export default makeProjectUseCases;
