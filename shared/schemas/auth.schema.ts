import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({ message: "El nombre es obligatorio" })
    .min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z
    .string({ message: "El email es obligatorio" })
    .email("Ingresá un email válido"),
  password: z
    .string({ message: "La contraseña es obligatoria" })
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const loginSchema = z.object({
  email: z
    .string({ message: "El email es obligatorio" })
    .email("Ingresá un email válido"),
  password: z
    .string({ message: "La contraseña es obligatoria" })
    .min(1, "La contraseña no puede estar vacía"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
