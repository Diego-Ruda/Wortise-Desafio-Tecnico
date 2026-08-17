import { z } from "zod";

// Esquema para crear un artículo
export const createArticleSchema = z.object({
  title: z
    .string({ message: "El título es obligatorio" })
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(120, "El título no tiene que superar los 120 caracteres"),
  content: z
    .string({ message: "El contenido es obligatorio" })
    .min(10, "El contenido debe tener al menos 10 caracteres"),
  imageUrl: z
    .string()
    .url({ message: "Tiene que ser una URL válida" })
    .optional()
    .or(z.literal("")),
});

// Esquema para editar un artículo, usamos .partial() para poder actualizar los campos que nos envien
export const updateArticleSchema = createArticleSchema.partial();

// Zod deduce el tipo basandose lo que defini
export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
