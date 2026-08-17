import { Link } from "@tanstack/react-router";

interface BackButtonProps {
  to?: string;
  label?: string;
}

export function BackToHomeButton({ to = "/", label = "Volver al inicio" }: BackButtonProps) {
  return (
    <div className="mb-6">
      <Link
        to={to}
        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-(--text-100) bg-(--bg-200) hover:bg-(--bg-300) border border-(--bg-300) rounded-lg shadow-sm transition-all hover:-translate-x-1 group"
      >
        <span className="text-(--primary-200) group-hover:-translate-x-0.5 transition-transform font-bold">
          ←
        </span>
        <span>{label}</span>
      </Link>
    </div>
  );
}