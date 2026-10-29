import AppError from "../errors/AppError.js";

function validate(schema, target = "body") {
  return (req, res, next) => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join(".") || "(root)",
        message: issue.message,
      }));
      return next(
        new AppError(
          "VALIDATION_ERROR",
          `Datos de ${target} inválidos`,
          400,
          details
        )
      );
    }

    if (target === "query") {
      // En Express 5 req.query se recalcula en cada acceso: hay que redefinirlo para que persista
      Object.defineProperty(req, "query", {
        value: result.data,
        writable: true,
        configurable: true,
      });
    } else {
      req[target] = result.data;
    }
    next();
  };
}

export const validateQuery = (schema) => validate(schema, "query");
export const validateParams = (schema) => validate(schema, "params");
export default validate;
