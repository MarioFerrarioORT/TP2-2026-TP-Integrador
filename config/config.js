const PORT = Number(process.env.PORT) || 8000;
const NODE_ENV = process.env.NODE_ENV || "development";
const PERSISTENCE_TYPE = process.env.PERSISTENCE_TYPE || "memory"; // "memory" o "sequelize"
const NOTIFIER_TYPE = process.env.NOTIFIER_TYPE || "console"; // "console" o "file"

// Seguridad
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error(
    "Falta la variable de entorno JWT_SECRET. Definila en el archivo .env"
  );
}
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 10;

export {
  PORT,
  NODE_ENV,
  PERSISTENCE_TYPE,
  NOTIFIER_TYPE,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  BCRYPT_ROUNDS,
};
