import registerUser from "./registerUser.js";
import loginUser from "./loginUser.js";
import getUserById from "../users/getUserById.js";

/**
 * Factory de casos de uso de autenticación.
 * Recibe el DAO de usuarios y los servicios de seguridad (hasher y tokens).
 */
function makeAuthUseCases({ usersDao, hasher, tokens }) {
  return {
    register: (data) => registerUser(data, usersDao, hasher),
    login: (credentials) => loginUser(credentials, usersDao, hasher, tokens),
    getProfile: (actor) => getUserById(actor.id, usersDao),
  };
}

export default makeAuthUseCases;
