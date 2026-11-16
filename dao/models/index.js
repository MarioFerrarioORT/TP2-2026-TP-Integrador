import { sequelize } from "../../connection/index.js";
import UserModel from "./UserModel.js";

/**
 * Punto central de los modelos.
 * Acá se definirán las asociaciones entre modelos (relaciones) cuando existan proyectos y tareas,
 * y es lo único que importan los DAO de Sequelize.
 */

/**
 * Crea en la base las tablas que todavía no existan, a partir de los modelos.
 * Ojo: sync() NO modifica tablas que ya existen.
 */
async function syncDatabase() {
  await sequelize.sync();
}

export { UserModel, syncDatabase };
