import getUsers from "./getUsers.js";
import getUserById from "./getUserById.js";
import createUser from "./createUser.js";
import updateUser from "./updateUser.js";
import deleteUser from "./deleteUser.js";

/**
 * Factory de casos de uso de Usuarios.
 * Recibe las dependencias (DAO y hasher) y las "engancha" en cada caso de uso,
 * de modo que el controlador llama a createUser(data) sin saber nada de ellas.
 */
function makeUserUseCases(dao, hasher) {
  return {
    getUsers: (filters) => getUsers(filters, dao),
    getUserById: (id) => getUserById(id, dao),
    createUser: (data) => createUser(data, dao, hasher),
    updateUser: (id, changes) => updateUser(id, changes, dao, hasher),
    deleteUser: (id) => deleteUser(id, dao),
  };
}

export default makeUserUseCases;
