# 03 — Persistencia intercambiable: Sequelize para usuarios

## Propósito

Agregar un segundo adaptador DAO (Sequelize + SQLite) para usuarios, con la misma interfaz que el de memoria, y elegirlo con la variable PERSISTENCE_TYPE.

## Reglas

- PERSISTENCE_TYPE admite "memory" (por defecto) o "sequelize"; cualquier otro valor impide arrancar.
- Los dos DAO tienen los mismos métodos y devuelven objetos planos.
- Ningún método devuelve passwordHash, salvo getCredentialsByEmail.
- Cambiar de modo no requiere tocar casos de uso, controladores, rutas ni el contenedor.
- En modo sequelize los datos persisten entre reinicios (archivo SQLITE_STORAGE).

## Criterios de aceptación

- Dadas las mismas peticiones en ambos modos, las respuestas (código y forma) son idénticas.
- Dado un reinicio en modo sequelize, los usuarios siguen existiendo y el admin no se duplica.
- Dado un PERSISTENCE_TYPE inválido, la aplicación no arranca y explica el error.
- Dada la tabla users, la columna passwordHash guarda un hash bcrypt, no la contraseña.
