import presentProject from "./presentProject.js";

/**
 * Caso de uso: listar los proyectos del usuario (donde es dueño o colaborador).
 * Un usuario nunca ve proyectos en los que no participa.
 */
async function getProjects(filters, actor, projectsDao, usersDao) {
  const projects = await projectsDao.getAll({
    ...filters,
    participantId: actor.id,
  });
  return Promise.all(projects.map((p) => presentProject(p, usersDao)));
}

export default getProjects;
