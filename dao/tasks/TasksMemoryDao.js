/**
 * Adaptador DAO en memoria para Tareas.
 * Debe respetar la misma interfaz pública que TasksSequelizeDao.
 *
 * Contrato de lo que devuelve: un objeto plano { id, titulo, descripcion, estado, projectId, responsableId }.
 */
class TasksMemoryDao {
  #tasks = [];
  #nextId = 1;

  // filters: { projectId, responsableId, estado, page, limit }
  async getAll({ projectId, responsableId, estado, page = 1, limit } = {}) {
    let tasks = this.#tasks.filter(
      (t) =>
        (projectId === undefined || t.projectId === projectId) &&
        (responsableId === undefined || t.responsableId === responsableId) &&
        (estado === undefined || t.estado === estado)
    );

    if (limit) tasks = tasks.slice((page - 1) * limit, page * limit);

    return tasks.map((t) => ({ ...t }));
  }

  async getById(id) {
    const task = this.#tasks.find((t) => t.id === Number(id));
    return task ? { ...task } : null;
  }

  async save({ titulo, descripcion = "", estado, projectId, responsableId }) {
    const task = {
      id: this.#nextId++,
      titulo,
      descripcion,
      estado,
      projectId,
      responsableId,
    };
    this.#tasks.push(task);
    return { ...task };
  }

  async update(id, { titulo, descripcion, estado, responsableId }) {
    const task = this.#tasks.find((t) => t.id === Number(id));
    if (!task) return null;

    if (titulo !== undefined) task.titulo = titulo;
    if (descripcion !== undefined) task.descripcion = descripcion;
    if (estado !== undefined) task.estado = estado;
    if (responsableId !== undefined) task.responsableId = responsableId;
    return { ...task };
  }

  async delete(id) {
    const index = this.#tasks.findIndex((t) => t.id === Number(id));
    if (index === -1) return false;

    this.#tasks.splice(index, 1);
    return true;
  }
}

export { TasksMemoryDao };
export default new TasksMemoryDao();
