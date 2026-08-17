import { Button } from "@heroui/react";
import { ArticleCard } from "../components/ArticleCard";
import { CustomPagination } from "../components/CustomPagination";
import { ArticleModal } from "../components/ArticleModal";
import { BackToHomeButton } from "../components/BackToHomeButton";
import { useDashboard } from "../hooks/useDashboard";

export function DashboardPage() {
  const {
    session,
    isPending,
    page,
    setPage,
    articles,
    totalArticles,
    totalPages,
    isLoadingArticles,
    isError,
    isModalOpen,
    editingArticle,
    isSaving,
    isDeleting,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleSubmitArticle,
    handleDelete,
  } = useDashboard();

  if (isPending) {
    return (
      <div className="flex justify-center items-center p-12">
        <p className="text-sm text-(--text-200) animate-pulse">
          Verificando sesión...
        </p>
      </div>
    );
  }

  if (!session?.user) return null;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      {/* Botón para volver al sitio público */}
      <BackToHomeButton label="Ver sitio público" />

      {/* Encabezado */}
      <div className="flex justify-between items-center border-b border-(--bg-300) pb-4">
        <div>
          <h1 className="text-2xl font-bold text-(--text-100)">
            Panel de Gestión
          </h1>
          <p className="text-sm text-(--text-200)">
            Bienvenido,{" "}
            <strong className="text-(--primary-200)">
              {session.user.name}
            </strong>
          </p>
        </div>
        <Button
          onClick={handleOpenCreate}
          className="bg-(--primary-200) text-white font-medium hover:bg-(--primary-300)"
        >
          + Nuevo Artículo
        </Button>
      </div>

      {/* Estados de carga / error */}
      {isLoadingArticles && (
        <div className="flex justify-center p-8">
          <p className="text-sm text-(--text-200) animate-pulse">
            Cargando tus artículos...
          </p>
        </div>
      )}

      {isError && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
          No se pudieron cargar las publicaciones. Verificá la conexión con la API.
        </div>
      )}

      {/* Contenido principal */}
      {!isLoadingArticles && !isError && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.length === 0 ? (
              <p className="text-(--text-200) col-span-2 text-center py-8">
                Todavía no tenés artículos publicados. ¡Creá uno nuevo!
              </p>
            ) : (
              articles.map((article) => {
                const id = article._id || article.id || "";
                return (
                  <ArticleCard
                    key={id}
                    article={article}
                    actions={
                      <>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(article)}
                          className="px-3 py-1.5 text-xs font-medium bg-(--bg-200) hover:bg-(--bg-300) text-(--text-100) rounded-md transition-colors cursor-pointer"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(id)}
                          disabled={isDeleting}
                          className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </>
                    }
                  />
                );
              })
            )}
          </div>

          <CustomPagination
            page={page}
            totalPages={totalPages}
            totalItems={totalArticles}
            itemLabel="artículos"
            onPageChange={setPage}
          />
        </>
      )}

      {/* Modal */}
      <ArticleModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitArticle}
        editingArticle={editingArticle}
        isSaving={isSaving}
      />
    </div>
  )
}