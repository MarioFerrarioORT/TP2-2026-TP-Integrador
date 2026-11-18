import AppError from "../../errors/AppError.js";
import presentProject from "./presentProject.js";

/**
 * Caso de uso: crear un proyecto.
 * El dueño es quien hace la petición (sale del token, no del body) y la fecha de creación es hoy.
 * Regla: la fecha de fin no puede ser anterior a la de creación.
 * Se valida acá y no en Zod porque necesita el reloj (un dato que Zod no tiene).
 */
async function createProject(data, actor, projectsDao, usersDao, clock) {
  const today = clock.today();
  if (data.fechaFin < today) {
    throw new AppError(
      "INVALID_DATE_RANGE",
      "La fecha de fin no puede ser anterior a la fecha de creación",
      400
    );
  }

  const project = await projectsDao.save({
    ...data,
    ownerId: actor.id,
    fechaCreacion: today,
  });
  return presentProject(project, usersDao);
}

export default createProject;
