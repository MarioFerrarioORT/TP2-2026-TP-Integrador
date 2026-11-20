const PORT = Number(process.env.PORT) || 8000;
const NODE_ENV = process.env.NODE_ENV || "development";
const PERSISTENCE_TYPE = process.env.PERSISTENCE_TYPE || "memory"; // "memory" o "sequelize"
if (!["memory", "sequelize"].includes(PERSISTENCE_TYPE)) {
  throw new Error(
    `PERSISTENCE_TYPE inválido: "${PERSISTENCE_TYPE}". Usá "memory" o "sequelize"`
  );
}
const SQLITE_STORAGE = process.env.SQLITE_STORAGE || "database.sqlite"; // archivo de la base (solo modo sequelize)
const NOTIFIER_TYPE = process.env.NOTIFIER_TYPE || "console"; // "console", "file" o "both" (consola y archivo)
if (!["console", "file", "both"].includes(NOTIFIER_TYPE)) {
  throw new Error(
    `NOTIFIER_TYPE inválido: "${NOTIFIER_TYPE}". Usá "console", "file" o "both"`
  );
}
const NOTIFICATIONS_LOG_PATH =
  process.env.NOTIFICATIONS_LOG_PATH || "notifications.log"; // archivo del notificador "file"

// Documentación: Swagger UI en /api-docs. Por defecto encendida, salvo con NODE_ENV=production.
const DOCS_ENABLED =
  (process.env.DOCS_ENABLED ??
    (NODE_ENV === "production" ? "false" : "true")) === "true";

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

// Reloj fijo para probar a mano (ej. 2026-12-01T12:00:00Z). Vacío = hora real.
const CLOCK_NOW = process.env.CLOCK_NOW || undefined;

// Administrador inicial: se crea al arrancar si no existe.
const ADMIN_EMAIL = required("ADMIN_EMAIL").trim().toLowerCase();
const ADMIN_PASSWORD = required("ADMIN_PASSWORD");

export {
  PORT,
  NODE_ENV,
  PERSISTENCE_TYPE,
  SQLITE_STORAGE,
  NOTIFIER_TYPE,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  BCRYPT_ROUNDS,
  CLOCK_NOW,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  NOTIFICATIONS_LOG_PATH,
  DOCS_ENABLED,
};
