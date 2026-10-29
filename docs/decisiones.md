# Decisiones de diseño

## D1 — Un único formato de error

Contexto: varias capas pueden fallar (validación, reglas, base).
Decisión: todos los errores se responden desde errorHandler con { error: { code, message, details? } }.
Consecuencia: los casos de uso lanzan AppError y no conocen HTTP.

## D2 — JWT_SECRET sin valor por defecto

Decisión: la app falla al arrancar si falta.
Consecuencia: evita llegar a producción con un secreto conocido.
