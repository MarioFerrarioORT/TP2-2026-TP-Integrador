import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../connection/index.js";
import { TASK_STATES, DEFAULT_TASK_STATE } from "../../utils/taskStates.js";

/**
 * Modelo de Tarea: tabla "tasks".
 * Las columnas projectId y responsableId (claves foráneas) las crean las asociaciones de models/index.js.
 */
class TaskModel extends Model {}

TaskModel.init(
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
        notEmpty: { msg: "La descripción no puede estar vacía" },
        len: {
          args: [0, 500],
          msg: "La descripción no puede superar los 500 caracteres",
        },
      },
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: DEFAULT_TASK_STATE,
      // Sequelize rechaza cualquier valor fuera de la lista antes de llegar a la base
      validate: { isIn: [TASK_STATES] },
    },
  },
  {
    sequelize,
    modelName: "Task",
    tableName: "tasks",
    timestamps: false,
  }
);

export default TaskModel;
