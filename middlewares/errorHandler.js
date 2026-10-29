import AppError from "../errors/AppError.js";

function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        ...(err.details && { details: err.details }),
      },
    });
  }

  // express.json() lanza este error cuando el body no es un JSON válido
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      error: {
        code: "INVALID_JSON",
        message: "El cuerpo de la petición no es un JSON válido",
      },
    });
  }

  console.error("Error no controlado:", err);
  res.status(500).json({
    error: {
      code: "INTERNAL_ERROR",
      message: "Ocurrió un error inesperado en el servidor",
    },
  });
}

export default errorHandler;
