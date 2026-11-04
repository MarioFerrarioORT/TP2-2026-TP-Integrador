/**
 * Controlador de Usuarios.
 * Traduce HTTP a llamadas de casos de uso y devuelve la respuesta.
 * No conoce ningún DAO ni contiene reglas de negocio.
 */
class UsersController {
  #useCases;

  constructor(useCases) {
    this.#useCases = useCases;
  }

  // GET /users
  list = async (req, res) => {
    res.json(await this.#useCases.getUsers(req.query));
  };

  // GET /users/:id
  get = async (req, res) => {
    res.json(await this.#useCases.getUserById(req.params.id));
  };

  // POST /users
  create = async (req, res) => {
    const user = await this.#useCases.createUser(req.body);
    res.status(201).json(user);
  };

  // PUT /users/:id
  update = async (req, res) => {
    res.json(await this.#useCases.updateUser(req.params.id, req.body));
  };

  // DELETE /users/:id
  remove = async (req, res) => {
    await this.#useCases.deleteUser(req.params.id);
    res.status(204).send();
  };
}

export default UsersController;
