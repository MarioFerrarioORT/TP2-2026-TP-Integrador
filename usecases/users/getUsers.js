/**
 * Caso de uso: listar usuarios con filtros y paginación opcionales.
 */
async function getUsers(filters = {}, dao) {
  return dao.getAll(filters);
}

export default getUsers;
