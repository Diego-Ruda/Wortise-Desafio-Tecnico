import { ArticleCard } from "../components/ArticleCard";
import { CustomPagination } from "../components/CustomPagination";
import { BackToHomeButton } from "../components/BackToHomeButton";
import { useAuthorProfile } from "../hooks/useAuthorProfile";

export function AuthorProfilePage() {
  const {
    authorName,
    page,
    setPage,
    articles,
    totalArticles,
    totalPages,
    isLoading,
  } = useAuthorProfile();

  return (
    <div className="min-h-screen bg-(--bg-100) text-(--text-100) p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Botón Volver al inicio reutilizable */}
        <BackToHomeButton />

        {/* Banner con Perfil del Autor */}
        <div className="bg-(--bg-200) border border-(--bg-300) rounded-2xl p-6 md:p-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-3xl font-extrabold text-(--text-100)">
              {authorName}
            </h1>
            <p className="text-xs md:text-sm text-(--text-200) mt-0.5">
              Publicaciones creadas por este autor
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="block text-xl md:text-2xl font-bold text-(--primary-200)">
              {isLoading ? "-" : totalArticles}
            </span>
            <span className="text-[10px] md:text-xs uppercase tracking-wider text-(--text-200) font-semibold">
              {totalArticles === 1 ? "Artículo" : "Artículos"}
            </span>
          </div>
        </div>

        {/* Listado de Artículos */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-(--text-100)">
            Artículos de {authorName} {!isLoading && `(${totalArticles})`}
          </h2>

          {isLoading && (
            <p className="text-(--text-200) animate-pulse">
              Cargando publicaciones...
            </p>
          )}

          {!isLoading && articles.length === 0 && (
            <div className="p-8 text-center bg-(--bg-200) rounded-xl text-(--text-200) border border-(--bg-300)">
              No se encontraron publicaciones para este autor.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((art: any) => (
              <ArticleCard key={art._id || art.id} article={art} />
            ))}
          </div>

          {!isLoading && totalArticles > 0 && (
            <CustomPagination
              page={page}
              totalPages={totalPages}
              totalItems={totalArticles}
              itemLabel="artículos"
              onPageChange={setPage}
            />
          )}
        </section>
      </div>
    </div>
  );
}