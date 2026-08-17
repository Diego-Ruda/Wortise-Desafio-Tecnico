import { useEffect, useRef } from "react";
import { useForm } from "@tanstack/react-form";
import {
  Button,
  Description,
  FieldError,
  FieldGroup,
  Fieldset,
  Form,
  Input,
  Label,
  TextArea,
  TextField,
} from "@heroui/react";
import {
  createArticleSchema,
  type CreateArticleInput,
} from "../schemas/articles.schema";
import type { Article } from "../api/articles";

export type ArticleFormValues = CreateArticleInput;

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: ArticleFormValues) => Promise<void>;
  editingArticle: Article | null;
  isSaving: boolean;
}

export function ArticleModal({
  isOpen,
  onClose,
  onSubmit,
  editingArticle,
  isSaving,
}: ArticleModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const form = useForm({
    defaultValues: {
      title: "",
      content: "",
      imageUrl: "",
    },
    onSubmit: async ({ value }) => {
      const parsed = createArticleSchema.safeParse(value);
      if (!parsed.success) return;

      await onSubmit({
        title: parsed.data.title.trim(),
        content: parsed.data.content.trim(),
        imageUrl: parsed.data.imageUrl?.trim() || "",
      });
    },
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
      if (editingArticle) {
        form.setFieldValue("title", editingArticle.title);
        form.setFieldValue("content", editingArticle.content);
        form.setFieldValue("imageUrl", editingArticle.imageUrl || "");
      } else {
        form.reset();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen, editingArticle]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="m-auto rounded-xl p-6 w-[92%] max-w-2xl backdrop:bg-black/50 border shadow-xl bg-(--bg-100) dark:bg-(--bg-200)"
    >
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <Fieldset>
          <Fieldset.Legend className="text-xl font-bold text-(--text-100) dark:text-(--text-100)">
            {editingArticle ? "Editar Artículo" : "Crear Artículo"}
          </Fieldset.Legend>
          <Description>
            {editingArticle
              ? "Modificá los campos necesarios de tu publicación."
              : "Completá la información para publicar un nuevo artículo."}
          </Description>

          <FieldGroup className="mt-4 gap-4">
            {/* Título */}
            <form.Field
              name="title"
              validators={{
                onChange: ({ value }) =>
                  createArticleSchema.shape.title.safeParse(value).success
                    ? undefined
                    : "El título debe tener entre 3 y 120 caracteres",
              }}
            >
              {(field) => {
                const hasError = field.state.meta.errors.length > 0;
                return (
                  <TextField isInvalid={hasError}>
                    <Label>Título *</Label>
                    <Input
                      placeholder="Escribí un título..."
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {hasError && (
                      <FieldError>
                        {field.state.meta.errors.join(", ")}
                      </FieldError>
                    )}
                  </TextField>
                );
              }}
            </form.Field>

            {/* Contenido */}
            <form.Field
              name="content"
              validators={{
                onChange: ({ value }) =>
                  createArticleSchema.shape.content.safeParse(value).success
                    ? undefined
                    : "El contenido debe tener al menos 10 caracteres",
              }}
            >
              {(field) => {
                const hasError = field.state.meta.errors.length > 0;
                return (
                  <TextField isInvalid={hasError}>
                    <Label>Contenido *</Label>
                    <TextArea
                      rows={6}
                      placeholder="Escribí el contenido de la publicación..."
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <Description>Mínimo 10 caracteres</Description>
                    {hasError && (
                      <FieldError>
                        {field.state.meta.errors.join(", ")}
                      </FieldError>
                    )}
                  </TextField>
                );
              }}
            </form.Field>

            {/* URL de Imagen */}
            <form.Field
              name="imageUrl"
              validators={{
                onChange: ({ value }) =>
                  !value ||
                  createArticleSchema.shape.imageUrl.safeParse(value).success
                    ? undefined
                    : "La URL de la imagen no es válida",
              }}
            >
              {(field) => {
                const hasError = field.state.meta.errors.length > 0;
                return (
                  <TextField isInvalid={hasError}>
                    <Label>URL de la imagen (opcional)</Label>
                    <Input
                      type="url"
                      placeholder="https://..."
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {hasError && (
                      <FieldError>
                        {field.state.meta.errors.join(", ")}
                      </FieldError>
                    )}
                  </TextField>
                );
              }}
            </form.Field>
          </FieldGroup>

          {/* Botones de acción */}
          <Fieldset.Actions className="mt-6 flex justify-end gap-2">
            <Button type="button" onClick={onClose} variant="ghost">
              Cancelar
            </Button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
            >
              {([canSubmit, isSubmitting]) => (
                <Button
                  className="bg-(--primary-200) text-white font-medium"
                  type="submit"
                  isDisabled={!canSubmit || isSubmitting || isSaving}
                >
                  {isSubmitting || isSaving
                    ? "Guardando..."
                    : editingArticle
                    ? "Actualizar"
                    : "Publicar"}
                </Button>
              )}
            </form.Subscribe>
          </Fieldset.Actions>
        </Fieldset>
      </Form>
    </dialog>
  );
}

