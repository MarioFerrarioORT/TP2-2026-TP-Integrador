import { z } from "zod";

const fields = {
  nombre: z
    .string({ error: "El nombre es obligatorio" })
    .trim()
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z
    .string({ error: "El email es obligatorio" })
    .trim()
    .toLowerCase()
    .pipe(z.email({ error: "Debe ser un correo electrónico válido" })),
  password: z
    .string({ error: "La contraseña es obligatoria" })
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(72, "La contraseña no puede superar los 72 caracteres"),
};

// POST /users
const createUserSchema = z.object({
  nombre: fields.nombre,
  email: fields.email,
  password: fields.password,
});

// PUT /users/:id (actualización parcial: todos los campos son opcionales)
const updateUserSchema = z
  .object({
    nombre: fields.nombre.optional(),
    email: fields.email.optional(),
    password: fields.password.optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "Debe enviar al menos un campo para actualizar"
  );

// GET /users?nombre=&email=&page=&limit=
const queryUsersSchema = z.object({
  nombre: z.string().optional(),
  email: z.string().optional(),
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

// /users/:id
const userIdParamSchema = z.object({
  id: z.coerce
    .number()
    .int("El ID debe ser un número entero")
    .positive("El ID debe ser un número positivo"),
});

export {
  createUserSchema,
  updateUserSchema,
  queryUsersSchema,
  userIdParamSchema,
};
