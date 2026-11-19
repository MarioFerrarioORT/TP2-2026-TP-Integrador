import { TaskModel, syncDatabase } from "../models/index.js";

const TASK_ATTRIBUTES = [
  "id",
  "titulo",
  "descripcion",
  "estado",
  "projectId",
  "responsableId",
];

/**
 * Adaptador DAO de Tareas con Sequelize (SQLite).
 * Tiene la MISMA interfaz pública y devuelve los mismos objetos planos que TasksMemoryDao.
 */
class TasksSequelizeDao {
  // Crea las tablas si no existen (sync es idempotente)
  async init() {
    await syncDatabase();
  }

  // filters: { projectId, responsableId, estado, page, limit }
  async getAll({ projectId, responsableId, estado, page = 1, limit } = {}) {
    const where = {};
    if (projectId !== undefined) where.projectId = projectId;
    if (responsableId !== undefined) where.responsableId = responsableId;
    if (estado !== undefined) where.estado = estado;

    return TaskModel.findAll({
      where,
      attributes: TASK_ATTRIBUTES,
      order: [["id", "ASC"]],
      raw: true,
      ...(limit && { limit, offset: (page - 1) * limit }),
    });
  }

  async getById(id) {
    return TaskModel.findByPk(id, { attributes: TASK_ATTRIBUTES, raw: true });
  }

  async save({ titulo, descripcion = "", estado, projectId, responsableId }) {
    const created = await TaskModel.create({
      titulo,
      descripcion,
      estado,
      projectId,
      responsableId,
    });
    return this.getById(created.id);
  }

  async update(id, { titulo, descripcion, estado, responsableId }) {
    const changes = {};
    if (titulo !== undefined) changes.titulo = titulo;
    if (descripcion !== undefined) changes.descripcion = descripcion;
    if (estado !== undefined) changes.estado = estado;
    if (responsableId !== undefined) changes.responsableId = responsableId;

    const [affected] = await TaskModel.update(changes, { where: { id } });
    if (affected === 0) return null;
    return this.getById(id);
  }

  async delete(id) {
    const deleted = await TaskModel.destroy({ where: { id } });
    return deleted > 0;
  }
}

export { TasksSequelizeDao };
export default new TasksSequelizeDao();
