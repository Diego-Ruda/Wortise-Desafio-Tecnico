import { useArticleDetail } from "../hooks/useArticleDetail";
import { BackToHomeButton } from "../components/BackToHomeButton";

export function ArticleDetailPage() {
  const { article, isLoading, isError } = useArticleDetail();

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10 text-center text-(--text-200) animate-pulse">
        Cargando artículo...
      </div>
    );
  }

  if (isError || !article) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10">
        <BackToHomeButton />
        <div className="p-6 bg-(--bg-200) rounded-xl border border-(--bg-300) text-center text-(--text-200)">
          No se pudo cargar el artículo o no existe.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 text-(--text-100)">
      <BackToHomeButton />

      <article className="space-y-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center gap-3 text-xs text-(--text-200) border-b border-(--bg-300) pb-4">
          <span>
            Autor:{" "}
            <strong className="text-(--text-100)">
              {article.authorName || "Autor desconocido"}
            </strong>
          </span>
          <span>•</span>
          <span>
            Publicado el:{" "}
            {article.createdAt
              ? new Date(article.createdAt).toLocaleDateString()
              : "Recientemente"}
          </span>
        </div>

        {article.imageUrl && (
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full max-h-96 object-cover rounded-2xl shadow-md"
          />
        )}

        <div className="pt-2 text-base leading-relaxed whitespace-pre-line">
          {article.content}
        </div>
      </article>
    </div>
  );
}