import { Op } from "sequelize";
import {
  sequelize,
  UserModel,
  ProjectModel,
  ProjectMemberModel,
  syncDatabase,
} from "../models/index.js";

const PROJECT_ATTRIBUTES = [
  "id",
  "titulo",
  "descripcion",
  "fechaCreacion",
  "fechaFin",
  "ownerId",
];

// Trae los colaboradores del proyecto (solo su id) a través de la tabla intermedia.
// through: { attributes: [] } evita traer las columnas de la tabla intermedia.
const WITH_COLLABORATORS = {
  model: UserModel,
  as: "colaboradores",
  attributes: ["id"],
  through: { attributes: [] },
};

// Convierte el resultado de Sequelize en el objeto plano del contrato:
// { ..., colaboradorIds: [ids ordenados] } en lugar de la lista de usuarios
function toPlain(project) {
  const { colaboradores, ...data } = project.get({ plain: true });
  return {
    ...data,
    colaboradorIds: colaboradores.map((c) => c.id).sort((a, b) => a - b),
  };
}

/**
 * Adaptador DAO de Proyectos con Sequelize (SQLite).
 * Tiene la MISMA interfaz pública y devuelve los mismos objetos planos que ProjectsMemoryDao.
 */
class ProjectsSequelizeDao {
  // Crea las tablas si no existen (sync es idempotente: no pasa nada si otro DAO ya lo ejecutó)
  async init() {
    await syncDatabase();
  }

  // filters: { ownerId, participantId, titulo, page, limit }
  // participantId: proyectos donde el usuario es dueño O colaborador
  async getAll({ ownerId, participantId, titulo, page = 1, limit } = {}) {
    const where = {};
    if (ownerId !== undefined) where.ownerId = ownerId;
    if (titulo !== undefined) where.titulo = { [Op.like]: `%${titulo}%` };

    if (participantId !== undefined) {
      // Primero se buscan los proyectos donde el usuario es colaborador...
      const memberships = await ProjectMemberModel.findAll({
        where: { userId: participantId },
        attributes: ["projectId"],
        raw: true,
      });
      // ...y después se piden los que son suyos O están en esa lista
      where[Op.or] = [
        { ownerId: participantId },
        { id: { [Op.in]: memberships.map((m) => m.projectId) } },
      ];
    }

    const projects = await ProjectModel.findAll({
      where,
      attributes: PROJECT_ATTRIBUTES,
      include: [WITH_COLLABORATORS],
      order: [["id", "ASC"]],
      ...(limit && { limit, offset: (page - 1) * limit }),
    });
    return projects.map(toPlain);
  }

  async getById(id) {
    const project = await ProjectModel.findByPk(id, {
      attributes: PROJECT_ATTRIBUTES,
      include: [WITH_COLLABORATORS],
    });
    return project ? toPlain(project) : null;
  }

  async save({ titulo, descripcion = "", fechaCreacion, fechaFin, ownerId }) {
    const created = await ProjectModel.create({
      titulo,
      descripcion,
      fechaCreacion,
      fechaFin,
      ownerId,
    });
    return this.getById(created.id);
  }

  async update(id, { titulo, descripcion, fechaFin }) {
    const changes = {};
    if (titulo !== undefined) changes.titulo = titulo;
    if (descripcion !== undefined) changes.descripcion = descripcion;
    if (fechaFin !== undefined) changes.fechaFin = fechaFin;

    const [affected] = await ProjectModel.update(changes, { where: { id } });
    if (affected === 0) return null;
    return this.getById(id);
  }

  // Borra el proyecto y sus colaboradores en una TRANSACCIÓN: o se hacen las dos cosas o ninguna
  async delete(id) {
    return sequelize.transaction(async (t) => {
      await ProjectMemberModel.destroy({
        where: { projectId: id },
        transaction: t,
      });
      const deleted = await ProjectModel.destroy({
        where: { id },
        transaction: t,
      });
      return deleted > 0;
    });
  }

  // Devuelve true si lo agregó, false si ya era colaborador
  async addMember(projectId, userId) {
    const [, created] = await ProjectMemberModel.findOrCreate({
      where: { projectId, userId },
    });
    return created;
  }

  // Devuelve true si lo quitó, false si no era colaborador
  async removeMember(projectId, userId) {
    const deleted = await ProjectMemberModel.destroy({
      where: { projectId, userId },
    });
    return deleted > 0;
  }

  // Quita al usuario de todos los proyectos en los que colabora (se usa al eliminar un usuario)
  async removeUserMemberships(userId) {
    await ProjectMemberModel.destroy({ where: { userId } });
  }
}

export { ProjectsSequelizeDao };
export default new ProjectsSequelizeDao();
