import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../connection/index.js";

/**
 * Modelo de Proyecto: tabla "projects".
 * La columna ownerId (el dueño) la crea la asociación definida en models/index.js.
 * Las fechas son DATEONLY: guardan solo el día (AAAA-MM-DD), sin hora ni zona horaria.
 */
class ProjectModel extends Model {}

ProjectModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "El título es obligatorio" },
        len: {
          args: [2, 100],
          msg: "El título debe tener entre 2 y 100 caracteres",
        },
      },
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: "",
      validate: {
        len: {
          args: [0, 500],
          msg: "La descripción no puede superar los 500 caracteres",
        },
      },
    },
    fechaCreacion: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fechaFin: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Project",
    tableName: "projects",
    timestamps: false,
  }
);

export default ProjectModel;
