import AppError from "../errors/AppError.js";

/**
 * Crea los dos middlewares de seguridad:
 *  - authenticate: ¿quién sos? (401 si no hay token o es inválido)
 *  - authorize(...roles): ¿tenés permiso? (403 si tu rol no está permitido)
 */
function createAuthMiddlewares(tokens) {
  function authenticate(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return next(
        new AppError(
          "TOKEN_MISSING",
          "Falta el token. Enviá el header Authorization: Bearer <token>",
          401
        )
      );
    }

    try {
      const payload = tokens.verify(header.slice("Bearer ".length));
      req.user = { id: Number(payload.sub), rol: payload.rol };
      next();
    } catch (err) {
      next(err);
    }
  }

  const authorize =
    (...roles) =>
    (req, res, next) => {
      if (!roles.includes(req.user.rol)) {
        return next(
          new AppError(
            "FORBIDDEN",
            "No tenés permiso para realizar esta acción",
            403
          )
        );
      }
      next();
    };

  return { authenticate, authorize };
}

export default createAuthMiddlewares;
