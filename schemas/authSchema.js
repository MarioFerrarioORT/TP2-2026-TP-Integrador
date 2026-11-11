import { z } from "zod";
import { fields, createUserSchema } from "./userSchema.js";

// POST /auth/register: mismos datos que crear un usuario. No incluye "rol": nadie se registra como admin.
const registerSchema = createUserSchema;

// POST /auth/login
const loginSchema = z.object({
  email: fields.email,
  password: z
    .string({ error: "La contraseña es obligatoria" })
    .min(1, "La contraseña es obligatoria"),
});

export { registerSchema, loginSchema };
