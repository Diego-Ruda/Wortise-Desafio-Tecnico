// Re-exportar schemas desde shared para compatibilidad con código existente
export {
  createArticleSchema,
  updateArticleSchema,
  type CreateArticleInput,
  type UpdateArticleInput,
} from "wortise-shared/schemas/articles";
