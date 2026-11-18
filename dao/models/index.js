import { sequelize } from "../../connection/index.js";
import UserModel from "./UserModel.js";
import ProjectModel from "./ProjectModel.js";
import ProjectMemberModel from "./ProjectMemberModel.js";

// -----------------------------------------------------------------------------
// RELACIONES (ASOCIACIONES) ENTRE MODELOS
// Se definen acá, en un solo lugar. Los DAO solo importan los modelos desde este archivo.
// -----------------------------------------------------------------------------

// 1 a N: un usuario es dueño de muchos proyectos; cada proyecto tiene un único dueño.
// Crea la columna projects.ownerId. RESTRICT: la base no permite borrar un usuario que sea dueño de proyectos.
UserModel.hasMany(ProjectModel, {
  foreignKey: { name: "ownerId", allowNull: false },
  as: "proyectosPropios",
  onDelete: "RESTRICT",
});
ProjectModel.belongsTo(UserModel, {
  foreignKey: { name: "ownerId", allowNull: false },
  as: "owner",
  onDelete: "RESTRICT",
});

// N a N: un proyecto tiene muchos colaboradores y un usuario colabora en muchos proyectos.
// La tabla intermedia es project_members (clave primaria compuesta projectId + userId).
ProjectModel.belongsToMany(UserModel, {
  through: ProjectMemberModel,
  foreignKey: "projectId",
  otherKey: "userId",
  as: "colaboradores",
});
UserModel.belongsToMany(ProjectModel, {
  through: ProjectMemberModel,
  foreignKey: "userId",
  otherKey: "projectId",
  as: "proyectosColaborados",
});

/**
 * Crea en la base las tablas que todavía no existan, a partir de los modelos.
 * Ojo: sync() NO modifica tablas que ya existen (solo crea las que faltan).
 */
async function syncDatabase() {
  await sequelize.sync();
}

export { sequelize, UserModel, ProjectModel, ProjectMemberModel, syncDatabase };
