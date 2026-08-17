// Re-exportar schemas desde shared para compatibilidad con código existente
export {
  registerSchema,
  loginSchema,
  type RegisterInput,
  type LoginInput,
} from "wortise-shared/schemas/auth";
