import { Link } from "@tanstack/react-router";
import { Card, Button } from "@heroui/react";
import { loginSchema } from "../schemas/auth.schema";
import { useLogin } from "../hooks/useLogin";
import { FormField } from "../components/FormField";

export function LoginPage() {
  const { form, apiError } = useLogin();

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-(--text-100) dark:text-(--text-100)">
            Iniciar Sesión
          </h1>
          <p className="text-xs text-(--text-200) dark:text-(--text-200) mt-1">
            Ingresá a tu cuenta para gestionar tus publicaciones
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
          {/* Email */}
          <form.Field
            name="email"
            validators={{
              onBlur: ({ value }) =>
                loginSchema.shape.email.safeParse(value).success
                  ? undefined
                  : "Email no válido",
            }}
          >
            {(field) => (
              <FormField field={field} type="email" placeholder="tu@email.com" />
            )}
          </form.Field>

          {/* Contraseña */}
          <form.Field
            name="password"
            validators={{
              onBlur: ({ value }) =>
                loginSchema.shape.password.safeParse(value).success
                  ? undefined
                  : "Ingresá tu contraseña",
            }}
          >
            {(field) => (
              <FormField field={field} type="password" placeholder="••••••••" />
            )}
          </form.Field>

          {/* Botón Submit */}
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                isDisabled={!canSubmit || isSubmitting}
                className="w-full font-medium mt-2 bg-(--primary-200) text-white hover:bg-(--primary-300)"
              >
                {isSubmitting ? "Ingresando..." : "Iniciar Sesión"}
              </Button>
            )}
          </form.Subscribe>
        </form>

        <p className="text-xs text-center text-(--text-200) dark:text-(--text-200) mt-6">
          ¿No tenés cuenta todavía?{" "}
          <Link
            to="/register"
            className="text-(--primary-200) dark:text-(--primary-200) font-semibold hover:underline"
          >
            Registrate acá
          </Link>
        </p>
      </Card>
    </div>
  );
}