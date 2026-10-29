# 00 — Base común: errores, validación y registro de peticiones

## Propósito

Dejar listas las piezas transversales que usarán todos los recursos, para que nadie repita lógica de errores o validación.

## Piezas

| Pieza                      | Responsabilidad                                                                    |
| -------------------------- | ---------------------------------------------------------------------------------- |
| `AppError`                 | Error de dominio con `code`, `message`, `statusCode` y `details` opcional          |
| `logger`                   | Registra método y URL de cada petición                                             |
| `validate(schema, target)` | Valida `body`, `params` o `query` con Zod y reemplaza el dato por el ya convertido |
| `notFound`                 | Convierte una ruta inexistente en un `AppError` 404                                |
| `errorHandler`             | Único lugar que responde errores, con formato uniforme                             |

## Formato de error

{ "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [{ "field": "titulo", "message": "..." }] } }
`details` solo aparece cuando hay detalle (validación).

## Criterios de aceptación

- Dado una ruta que no existe, cuando se la pide, entonces responde 404 `ROUTE_NOT_FOUND`.
- Dado un body que no cumple el esquema, entonces responde 400 `VALIDATION_ERROR` con `details` por campo.
- Dado un body que no es JSON válido, entonces responde 400 `INVALID_JSON`.
- Dado un `:id` no numérico, entonces responde 400 `VALIDATION_ERROR`; si es válido, el controlador lo recibe como número.
- Dado un `AppError` lanzado en cualquier capa, entonces responde con su `statusCode`.
- Dado un error inesperado, entonces responde 500 `INTERNAL_ERROR` sin exponer detalles internos.
