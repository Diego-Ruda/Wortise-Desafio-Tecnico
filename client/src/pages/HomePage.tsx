import { HeroSection } from "../components/HeroSection";
import { ArticleCard } from "../components/ArticleCard";
import { AuthorsSidebar } from "../components/AuthorsSidebar";
import { CustomPagination } from "../components/CustomPagination";
import { useHome } from "../hooks/useHome";

export function HomePage() {
  const {
    searchQuery,
    page,
    setPage,
    articles,
    totalArticles,
    totalPages,
    loadingArticles,
    loadingAuthors,
    displayedAuthors,
    handleSearch,
  } = useHome();

  return (
    <div className="min-h-screen bg-(--bg-100) text-(--text-100) p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* 1. Hero / Buscador */}
        <HeroSection onSearch={handleSearch} />

        {/* 2. Autores Destacados / Filtrados */}
        <section className="w-full">
          <AuthorsSidebar
            authors={displayedAuthors}
            isLoading={loadingAuthors}
            title={
              searchQuery.trim() !== ""
                ? `Autores filtrados con "${searchQuery}"`
                : "Autores destacados"
            }
          />
        </section>

        {/* 3. Listado de Artículos */}
        <section className="w-full flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-(--text-100)">
              {searchQuery ? `Artículos de "${searchQuery}"` : "Artículos"}
            </h2>

            {searchQuery && (
              <button
                type="button"
                onClick={() => handleSearch("")}
                className="text-xs text-(--primary-200) hover:underline cursor-pointer"
              >
                Limpiar filtro
              </button>
            )}
          </div>

          {loadingArticles && (
            <p className="text-(--text-200) animate-pulse">
              Cargando publicaciones...
            </p>
          )}

          {!loadingArticles && articles.length === 0 && (
            <div className="p-8 text-center bg-(--bg-200) rounded-xl text-(--text-200) border border-(--bg-300)">
              No encontramos publicaciones para tu búsqueda.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((art) => (
              <ArticleCard key={art._id || art.id} article={art as any} />
            ))}
          </div>

          {!loadingArticles && articles.length > 0 && (
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