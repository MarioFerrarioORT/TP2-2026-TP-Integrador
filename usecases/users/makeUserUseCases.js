import getUsers from "./getUsers.js";
import getUserById from "./getUserById.js";
import createUser from "./createUser.js";
import updateUser from "./updateUser.js";
import updateUserRole from "./updateUserRole.js";
import deleteUser from "./deleteUser.js";

/**
 * Factory de casos de uso de Usuarios.
 * Recibe las dependencias (DAO y hasher) y las "engancha" en cada caso de uso,
 * de modo que el controlador llama a createUser(data) sin saber nada de ellas.
 * "actor" es quien hace la petición ({ id, rol }), tomado del token.
 */
function makeUserUseCases(dao, hasher) {
  return {
    getUsers: (filters) => getUsers(filters, dao),
    getUserById: (id) => getUserById(id, dao),
    createUser: (data) => createUser(data, dao, hasher),
    updateUser: (id, changes) => updateUser(id, changes, dao, hasher),
    updateUserRole: (id, rol, actor) => updateUserRole(id, rol, actor, dao),
    deleteUser: (id, actor) => deleteUser(id, actor, dao),
  };
}

export default makeUserUseCases;
