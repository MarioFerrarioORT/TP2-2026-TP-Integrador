/**
 * Controlador de autenticación: registro, login y perfil propio.
 */
class AuthController {
  #useCases;

  constructor(useCases) {
    this.#useCases = useCases;
  }

  // POST /auth/register
  register = async (req, res) => {
    const user = await this.#useCases.register(req.body);
    res.status(201).json(user);
  };

  // POST /auth/login
  login = async (req, res) => {
    res.json(await this.#useCases.login(req.body));
  };

  // GET /auth/me
  me = async (req, res) => {
    res.json(await this.#useCases.getProfile(req.user));
  };
}

export default AuthController;
