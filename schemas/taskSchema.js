import { z } from "zod";
import { TASK_STATES } from "../utils/taskStates.js";

const fields = {
  titulo: z
    .string({ error: "El título es obligatorio" })
    .trim()
    .min(2, "El título debe tener al menos 2 caracteres")
    .max(100, "El título no puede superar los 100 caracteres"),
  descripcion: z
    .string({ error: "La descripción debe ser texto" })
    .trim()
    .max(500, "La descripción no puede superar los 500 caracteres"),
  estado: z.enum(TASK_STATES, {
    error: `El estado debe ser uno de: ${TASK_STATES.join(", ")}`,
  }),
  responsableId: z
    .number({ error: "El responsable debe ser un id de usuario (número)" })
    .int("El responsable debe ser un número entero")
    .positive("El responsable debe ser un número positivo"),
};

// POST /projects/:id/tasks (el proyecto sale de la URL; si no se manda estado, se usa "Pendiente" en el caso de uso)
const createTaskSchema = z.object({
  titulo: fields.titulo,
  descripcion: fields.descripcion.default(""),
  estado: fields.estado.optional(),
  responsableId: fields.responsableId,
});

// PUT /projects/:id/tasks/:taskId (actualización parcial)
const updateTaskSchema = z
  .object({
    titulo: fields.titulo.optional(),
    descripcion: fields.descripcion.optional(),
    estado: fields.estado.optional(),
    responsableId: fields.responsableId.optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "Debe enviar al menos un campo para actualizar"
  );

// GET /projects/:id/tasks?estado=&responsableId=&page=&limit=
const queryTasksSchema = z.object({
  estado: fields.estado.optional(),
  responsableId: z.coerce
    .number()
    .int("El responsable debe ser un entero")
    .positive("El responsable debe ser positivo")
    .optional(),
  page: z.coerce
    .number()
    .int("La página debe ser un entero")
    .positive("La página debe ser mayor a 0")
    .optional(),
  limit: z.coerce
    .number()
    .int("El límite debe ser un entero")
    .positive("El límite debe ser mayor a 0")
    .max(100, "El límite máximo es 100")
    .optional(),
});

const id = (label) =>
  z.coerce
    .number()
    .int(`${label} debe ser un número entero`)
    .positive(`${label} debe ser un número positivo`);

// /projects/:id/tasks (solo el proyecto)
const projectParamSchema = z.object({ id: id("El ID del proyecto") });

// /projects/:id/tasks/:taskId
const taskParamsSchema = z.object({
  id: id("El ID del proyecto"),
  taskId: id("El ID de la tarea"),
});

export {
  createTaskSchema,
  updateTaskSchema,
  queryTasksSchema,
  projectParamSchema,
  taskParamsSchema,
};
