import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import YAML from "yaml";
import swaggerUi from "swagger-ui-express";

/**
 * Documentación de la API (OpenAPI 3 + Swagger UI).
 * Lee el archivo openapi.yaml de la raíz del proyecto y lo publica en la ruta donde se monte (/api-docs).
 * La ruta del archivo se calcula desde este módulo, así funciona sin importar desde qué carpeta se inicie el servidor.
 */
const SPEC_PATH = fileURLToPath(new URL("../openapi.yaml", import.meta.url));

function createSwaggerRouter() {
  const spec = YAML.parse(readFileSync(SPEC_PATH, "utf8"));
  return [
    swaggerUi.serve,
    swaggerUi.setup(spec, { customSiteTitle: "API Gestor de Proyectos" }),
  ];
}

export default createSwaggerRouter;
