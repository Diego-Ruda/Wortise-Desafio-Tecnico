import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { registerUser } from "../lib/auth";

export function useRegister() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { name: "", email: "", password: "" },
    onSubmit: async ({ value }) => {
      setApiError(null);
      try {
        await registerUser(value.name, value.email, value.password);
        navigate({ to: "/dashboard" });
      } catch (err: any) {
        setApiError(err?.message || "Error al crear la cuenta");
      }
    },
  });

  return { form, apiError };
}