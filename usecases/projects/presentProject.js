/**
 * Arma la respuesta de un proyecto: reemplaza la lista de ids de colaboradores
 * por los datos públicos de cada colaborador ({ id, nombre, email, rol }).
 * Lo hace el caso de uso (y no el DAO) para que los DAO de proyectos no dependan de los de usuarios.
 */
async function presentProject(project, usersDao) {
  const { colaboradorIds, ...data } = project;
  const users = await Promise.all(
    colaboradorIds.map((id) => usersDao.getById(id))
  );
  return { ...data, colaboradores: users.filter(Boolean) };
}

export default presentProject;
