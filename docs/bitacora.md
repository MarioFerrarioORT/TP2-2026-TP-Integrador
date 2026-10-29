# Bitácora

## Paso 1 — Setup

- Proyecto Express con ES Modules, configuración centralizada y variables de seguridad.
- JWT_SECRET sin valor por defecto: la app no arranca si falta.

## Paso 2 — Base común

- AppError, logger, notFound, errorHandler y validate (Zod).
- Aprendí: los errores se responden en un solo lugar; en Express 5 los errores de funciones async llegan solos al errorHandler.
