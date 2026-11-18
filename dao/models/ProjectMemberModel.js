import { Model } from "sequelize";
import { sequelize } from "../../connection/index.js";

/**
 * Tabla intermedia de la relación N a N entre proyectos y usuarios colaboradores.
 * No declara columnas propias: projectId y userId las crea la asociación belongsToMany
 * (models/index.js) y, juntas, forman la clave primaria. Por eso la base impide
 * que el mismo usuario sea colaborador dos veces del mismo proyecto.
 */
class ProjectMemberModel extends Model {}

ProjectMemberModel.init(
  {},
  {
    sequelize,
    modelName: "ProjectMember",
    tableName: "project_members",
    timestamps: false,
  }
);

export default ProjectMemberModel;
