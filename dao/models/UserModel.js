import { Model, DataTypes } from "sequelize";
import { sequelize } from "../../connection/index.js";

/**
 * Modelo de Usuario: describe la tabla "users".
 * Cada instancia de esta clase representa una fila de la tabla.
 */
class UserModel extends Model {}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "El nombre es obligatorio" },
        len: {
          args: [2, 50],
          msg: "El nombre debe tener entre 2 y 50 caracteres",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: { msg: "El email es obligatorio" },
        isEmail: { msg: "Debe ser un correo electrónico válido" },
      },
    },
    rol: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "usuario", // "usuario" o "admin"
      validate: {
        isIn: {
          args: [["usuario", "admin"]],
          msg: "El rol debe ser 'usuario' o 'admin'",
        },
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: false, // no agregar las columnas createdAt y updatedAt
  }
);

export default UserModel;
