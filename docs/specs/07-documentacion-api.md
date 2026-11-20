# 07 — Documentación de la API

## Propósito

Documentar todos los endpoints con OpenAPI 3 y publicarlos en Swagger UI.

## Reglas

- La documentación está en `openapi.yaml` (OpenAPI 3.1.0) y se publica en `/api-docs` con swagger-ui-express.
- Cubre todos los endpoints con método, ruta, descripción, parámetros, cuerpo con ejemplos y respuestas posibles (éxito y errores).
- Los schemas de las entidades y del formato de error están en `components/schemas` y se reutilizan con `$ref`.
- La seguridad se declara con el esquema `bearerAuth` (JWT); solo registro y login son públicos.
- `DOCS_ENABLED` la enciende o apaga: por defecto está encendida, salvo con `NODE_ENV=production`.
- Se puede probar con "Try it out" en ambos modos de persistencia.

## Criterios de aceptación

- Dado el servidor en marcha, cuando se abre `/api-docs`, entonces se ven los 21 endpoints agrupados por Auth, Usuarios, Proyectos y Tareas.
- Dado un token cargado en Authorize, cuando se ejecuta un endpoint protegido, entonces la petición lleva el header Authorization.
- Dado `DOCS_ENABLED=false`, entonces `/api-docs` responde 404.
- Dado cualquier pedido a la API, entonces su código de estado y la forma de su respuesta están documentados.
