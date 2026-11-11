const PORT = Number(process.env.PORT) || 8000;
const NODE_ENV = process.env.NODE_ENV || "development";
const PERSISTENCE_TYPE = process.env.PERSISTENCE_TYPE || "memory"; // "memory" o "sequelize"
const NOTIFIER_TYPE = process.env.NOTIFIER_TYPE || "console"; // "console" o "file"

// Variable obligatoria: si falta, la aplicación no arranca y avisa cuál es.
function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Falta la variable de entorno ${name}. Definila en el archivo .env`
    );
  }
  return value;
}

// Seguridad. Sin valores por defecto: un secreto o una contraseña "de desarrollo" que llegan a producción son un riesgo.
const JWT_SECRET = required("JWT_SECRET");
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS) || 10;

// Administrador inicial: se crea al arrancar si no existe.
const ADMIN_EMAIL = required("ADMIN_EMAIL").trim().toLowerCase();
const ADMIN_PASSWORD = required("ADMIN_PASSWORD");

export {
  PORT,
  NODE_ENV,
  PERSISTENCE_TYPE,
  NOTIFIER_TYPE,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  BCRYPT_ROUNDS,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
};
