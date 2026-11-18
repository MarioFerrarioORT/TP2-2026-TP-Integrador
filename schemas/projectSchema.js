import { z } from "zod";

// Un día con formato AAAA-MM-DD (por ejemplo 2026-12-15). Las fechas se manejan como texto en este formato.
const dateOnly = z.iso.date({
  error: "La fecha debe tener formato AAAA-MM-DD y ser válida",
});

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
  fechaFin: dateOnly,
};

// POST /projects (el dueño sale del token y la fecha de creación la pone el servidor: no vienen en el body)
const createProjectSchema = z.object({
  titulo: fields.titulo,
  descripcion: fields.descripcion.default(""),
  fechaFin: fields.fechaFin,
});

// PUT /projects/:id (actualización parcial)
const updateProjectSchema = z
  .object({
    titulo: fields.titulo.optional(),
    descripcion: fields.descripcion.optional(),
    fechaFin: fields.fechaFin.optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "Debe enviar al menos un campo para actualizar"
  );

// GET /projects?titulo=&page=&limit=
const queryProjectsSchema = z.object({
  titulo: z.string().optional(),
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

// POST /projects/:id/members: el colaborador se agrega por email
const addMemberSchema = z.object({
  email: z
    .string({ error: "El email es obligatorio" })
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: "Debe ser un correo electrónico válido" })),
});

const id = (label) =>
  z.coerce
    .number()
    .int(`${label} debe ser un número entero`)
    .positive(`${label} debe ser un número positivo`);

// /projects/:id
const projectIdParamSchema = z.object({ id: id("El ID") });

// /projects/:id/members/:userId
const memberParamsSchema = z.object({
  id: id("El ID del proyecto"),
  userId: id("El ID del usuario"),
});

export {
  createProjectSchema,
  updateProjectSchema,
  queryProjectsSchema,
  addMemberSchema,
  projectIdParamSchema,
  memberParamsSchema,
};
