import express from "express";
import { PORT } from "./config/config.js";
import logger from "./middlewares/logger.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import buildContainer from "./container/container.js";

async function startServer() {
  const app = express();

  app.use(logger);
  app.use(express.json());

  // El contenedor arma todas las dependencias y devuelve el router principal
  try {
    app.use(await buildContainer());
  } catch (err) {
    console.error("Error al inicializar el contenedor:", err);
    process.exit(1);
  }

  app.use(notFound);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

startServer();
