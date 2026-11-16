import { Op } from "sequelize";
import { UserModel, syncDatabase } from "../models/index.js";

// Columnas que se pueden devolver. passwordHash NO está: sin "attributes", Sequelize hace SELECT *
// y el hash saldría en las respuestas. Todas las lecturas de este DAO usan esta lista.
const USER_ATTRIBUTES = ["id", "nombre", "email", "rol"];

/**
 * Adaptador DAO de Usuarios con Sequelize (SQLite).
 * Tiene la MISMA interfaz pública que UsersMemoryDao y devuelve objetos planos de JavaScript.
 */
class UsersSequelizeDao {
  // Lo llama el contenedor al arrancar: crea las tablas si no existen
  async init() {
    await syncDatabase();
  }

  // filters: { nombre, email, page, limit }
  async getAll({ nombre, email, page = 1, limit } = {}) {
    const where = {};
    if (nombre !== undefined) where.nombre = { [Op.like]: `%${nombre}%` };
    if (email !== undefined) where.email = email;

    return UserModel.findAll({
      where,
      attributes: USER_ATTRIBUTES,
      order: [["id", "ASC"]],
      ...(limit && { limit, offset: (page - 1) * limit }),
      raw: true,
    });
  }

  async getById(id) {
    const user = await UserModel.findByPk(id, { attributes: USER_ATTRIBUTES });
    return user ? user.get({ plain: true }) : null;
  }

  async getByEmail(email) {
    const user = await UserModel.findOne({
      where: { email },
      attributes: USER_ATTRIBUTES,
    });
    return user ? user.get({ plain: true }) : null;
  }

  // Único método que devuelve el hash: existe solo para el login
  async getCredentialsByEmail(email) {
    const user = await UserModel.findOne({
      where: { email },
      attributes: [...USER_ATTRIBUTES, "passwordHash"],
    });
    return user ? user.get({ plain: true }) : null;
  }

  async save(data) {
    const { id: _ignored, ...userData } = data;
    const created = await UserModel.create(userData);
    // Se vuelve a leer con las columnas permitidas, para no devolver el hash
    return this.getById(created.id);
  }

  async update(id, changes) {
    const { id: _ignored, ...allowedChanges } = changes;
    const [affected] = await UserModel.update(allowedChanges, {
      where: { id },
    });
    if (affected === 0) return null;
    return this.getById(id);
  }

  async delete(id) {
    const deleted = await UserModel.destroy({ where: { id } });
    return deleted > 0;
  }
}

export { UsersSequelizeDao };
export default new UsersSequelizeDao();
