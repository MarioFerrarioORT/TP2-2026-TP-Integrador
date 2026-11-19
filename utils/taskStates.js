/**
 * Estados posibles de una tarea. Se define en un solo lugar para que lo usen
 * el esquema de validación (Zod) y el modelo de Sequelize sin repetir los valores.
 */
const TASK_STATES = ["Pendiente", "En proceso", "Finalizado"];
const DEFAULT_TASK_STATE = "Pendiente";

export { TASK_STATES, DEFAULT_TASK_STATE };
