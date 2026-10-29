import express from "express";
import { PORT } from "./config/config.js";

async function startServer() {
  const app = express();

  app.use(express.json());

  // Ruta temporal para comprobar que el servidor anda. La borramos cuando exista el contenedor.
  app.get("/health", (req, res) => res.json({ status: "ok" }));

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}

startServer();
