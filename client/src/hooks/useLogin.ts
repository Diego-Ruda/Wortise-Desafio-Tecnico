import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { loginUser } from "../lib/auth";
import { loginSchema } from "../schemas/auth.schema";

export function useLogin() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { email: "", password: "" },
    onSubmit: async ({ value }) => {
      setApiError(null);
      try {
        loginSchema.parse(value);
        await loginUser(value.email, value.password);
        navigate({ to: "/dashboard" });
      } catch (err: any) {
        setApiError(err?.message || "Credenciales inválidas");
      }
    },
  });

  return { form, apiError };
}