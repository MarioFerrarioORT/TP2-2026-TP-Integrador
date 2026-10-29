import express from "express";
import { PORT } from "./config/config.js";
import logger from "./middlewares/logger.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";

async function startServer() {
  const app = express();

  app.use(logger);
  app.use(express.json());

  // Acá se montará el router del contenedor (Paso 3 en adelante)

  app.use(notFound);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

startServer();
