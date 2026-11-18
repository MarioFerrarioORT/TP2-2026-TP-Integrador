/**
 * Controlador de Proyectos.
 * Traduce HTTP a llamadas de casos de uso. req.user ({ id, rol }) lo dejó el middleware authenticate
 * y se pasa a los casos de uso como "actor".
 */
class ProjectsController {
  #useCases;

  constructor(useCases) {
    this.#useCases = useCases;
  }

  // GET /projects
  list = async (req, res) => {
    res.json(await this.#useCases.getProjects(req.query, req.user));
  };

  // GET /projects/:id
  get = async (req, res) => {
    res.json(await this.#useCases.getProjectById(req.params.id, req.user));
  };

  // POST /projects
  create = async (req, res) => {
    const project = await this.#useCases.createProject(req.body, req.user);
    res.status(201).json(project);
  };

  // PUT /projects/:id
  update = async (req, res) => {
    res.json(
      await this.#useCases.updateProject(req.params.id, req.body, req.user)
    );
  };

  // DELETE /projects/:id
  remove = async (req, res) => {
    await this.#useCases.deleteProject(req.params.id, req.user);
    res.status(204).send();
  };

  // POST /projects/:id/members
  addMember = async (req, res) => {
    const project = await this.#useCases.addMember(
      req.params.id,
      req.body,
      req.user
    );
    res.status(201).json(project);
  };

  // DELETE /projects/:id/members/:userId
  removeMember = async (req, res) => {
    await this.#useCases.removeMember(
      req.params.id,
      req.params.userId,
      req.user
    );
    res.status(204).send();
  };
}

export default ProjectsController;
