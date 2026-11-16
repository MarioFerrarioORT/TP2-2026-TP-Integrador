import { Sequelize } from "sequelize";
import { SQLITE_STORAGE } from "../config/config.js";

/**
 * Conexión única a la base de datos (SQLite, guardada en un archivo).
 * Se crea una sola vez y se comparte con todos los modelos.
 * logging: false evita que Sequelize imprima cada consulta SQL en la consola.
 */
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: SQLITE_STORAGE,
  logging: false,
});

export default sequelize;
