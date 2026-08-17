import { Input } from "@heroui/react";

interface FormFieldProps {
  field: any;
  type?: string;
  placeholder: string;
}

export function FormField({ field, type = "text", placeholder }: FormFieldProps) {
  const hasError = field.state.meta.errors.length > 0;

  return (
    <div className="flex flex-col gap-1">
      <Input
        type={type}
        placeholder={placeholder}
        value={field.state.value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          field.handleChange(e.target.value)
        }
      />
      {hasError && (
        <span className="text-xs text-red-500">
          {field.state.meta.errors.join(", ")}
        </span>
      )}
    </div>
  );
}