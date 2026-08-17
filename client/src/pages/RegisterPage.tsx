import { Link } from "@tanstack/react-router";
import { Card, Button } from "@heroui/react";
import { registerSchema } from "../schemas/auth.schema";
import { useRegister } from "../hooks/useRegister";
import { FormField } from "../components/FormField";

export function RegisterPage() {
  const { form, apiError } = useRegister();

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-(--text-100) dark:text-(--text-100)">
            Crear Cuenta
          </h1>
          <p className="text-xs text-(--text-200) dark:text-(--text-200) mt-1">
            Completá tus datos para empezar a publicar
          </p>
        </div>

        {apiError && (
          <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg">
            {apiError}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {/* Nombre */}
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) =>
                registerSchema.shape.name.safeParse(value).success
                  ? undefined
                  : "Ingresá tu nombre completo (mínimo 2 caracteres)",
            }}
          >
            {(field) => <FormField field={field} placeholder="Ej. Juan Pérez" />}
          </form.Field>

          {/* Email */}
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) =>
                registerSchema.shape.email.safeParse(value).success
                  ? undefined
                  : "Email no válido",
            }}
          >
            {(field) => <FormField field={field} type="email" placeholder="tu@email.com" />}
          </form.Field>

          {/* Contraseña */}
          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) =>
                registerSchema.shape.password.safeParse(value).success
                  ? undefined
                  : "Mínimo 6 caracteres",
            }}
          >
            {(field) => <FormField field={field} type="password" placeholder="••••••••" />}
          </form.Field>

          {/* Botón Submit */}
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                isDisabled={!canSubmit || isSubmitting}
                className="w-full font-medium mt-2 bg-(--primary-200) text-white hover:bg-(--primary-300)"
              >
                {isSubmitting ? "Registrando..." : "Crear Cuenta"}
              </Button>
            )}
          </form.Subscribe>
        </form>

        <p className="text-xs text-center text-(--text-200) dark:text-(--text-200) mt-6">
          ¿Ya tenés cuenta?{" "}
          <Link
            to="/login"
            className="text-(--primary-200) dark:text-(--primary-200) font-semibold hover:underline"
          >
            Iniciá sesión
          </Link>
        </p>
      </Card>
    </div>
  );
}