/**
 * Controlador de Tareas. Las tareas viven dentro de un proyecto: /projects/:id/tasks
 * req.user ({ id, rol }) lo dejó el middleware authenticate y se pasa a los casos de uso como "actor".
 */
class TasksController {
  #useCases;

  constructor(useCases) {
    this.#useCases = useCases;
  }

  // GET /projects/:id/tasks
  list = async (req, res) => {
    res.json(await this.#useCases.getTasks(req.params.id, req.query, req.user));
  };

  // GET /projects/:id/tasks/:taskId
  get = async (req, res) => {
    res.json(
      await this.#useCases.getTaskById(
        req.params.id,
        req.params.taskId,
        req.user
      )
    );
  };

  // POST /projects/:id/tasks
  create = async (req, res) => {
    const task = await this.#useCases.createTask(
      req.params.id,
      req.body,
      req.user
    );
    res.status(201).json(task);
  };

  // PUT /projects/:id/tasks/:taskId
  update = async (req, res) => {
    res.json(
      await this.#useCases.updateTask(
        req.params.id,
        req.params.taskId,
        req.body,
        req.user
      )
    );
  };

  // DELETE /projects/:id/tasks/:taskId
  remove = async (req, res) => {
    await this.#useCases.deleteTask(req.params.id, req.params.taskId, req.user);
    res.status(204).send();
  };
}

export default TasksController;
