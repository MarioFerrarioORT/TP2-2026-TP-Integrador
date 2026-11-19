import { sequelize } from "../../connection/index.js";
import UserModel from "./UserModel.js";
import ProjectModel from "./ProjectModel.js";
import ProjectMemberModel from "./ProjectMemberModel.js";
import TaskModel from "./TaskModel.js";

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

// 1 a N: un proyecto tiene muchas tareas; cada tarea pertenece a un proyecto (columna tasks.projectId).
// RESTRICT: la base no permite borrar un proyecto que todavía tiene tareas.
ProjectModel.hasMany(TaskModel, {
  foreignKey: { name: "projectId", allowNull: false },
  as: "tareas",
  onDelete: "RESTRICT",
});
TaskModel.belongsTo(ProjectModel, {
  foreignKey: { name: "projectId", allowNull: false },
  as: "proyecto",
  onDelete: "RESTRICT",
});

// 1 a N: un usuario es responsable de muchas tareas; cada tarea tiene un único responsable (tasks.responsableId).
// RESTRICT: la base no permite borrar un usuario que tenga tareas asignadas.
UserModel.hasMany(TaskModel, {
  foreignKey: { name: "responsableId", allowNull: false },
  as: "tareasAsignadas",
  onDelete: "RESTRICT",
});
TaskModel.belongsTo(UserModel, {
  foreignKey: { name: "responsableId", allowNull: false },
  as: "responsable",
  onDelete: "RESTRICT",
});

/**
 * Crea en la base las tablas que todavía no existan, a partir de los modelos.
 * Ojo: sync() NO modifica tablas que ya existen (solo crea las que faltan).
 */
async function syncDatabase() {
  await sequelize.sync();
}

export {
  sequelize,
  UserModel,
  ProjectModel,
  ProjectMemberModel,
  syncDatabase,
  TaskModel,
};
