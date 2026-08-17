import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useSession } from "../lib/auth";
import {
  useGetArticles,
  useCreateArticle,
  useUpdateArticle,
  useDeleteArticle,
  type Article,
} from "../api/articles";
import type { ArticleFormValues } from "../components/ArticleModal";

export function useDashboard() {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 4;

  const {
    data: responseData,
    isLoading: isLoadingArticles,
    isError,
  } = useGetArticles(page, limit);

  const articles = responseData?.articles || [];
  const totalArticles = responseData?.total || 0;
  const totalPages =
    responseData?.totalPages || Math.ceil(totalArticles / limit) || 1;

  const createArticleMutation = useCreateArticle();
  const updateArticleMutation = useUpdateArticle();
  const deleteArticleMutation = useDeleteArticle();

  // Estados del modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  // Redirección si no está autenticado
  useEffect(() => {
    if (!isPending && !session?.user) {
      navigate({ to: "/login" });
    }
  }, [session, isPending, navigate]);

  const handleOpenCreate = () => {
    setEditingArticle(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (article: Article) => {
    setEditingArticle(article);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingArticle(null);
  };

  const handleSubmitArticle = async (values: ArticleFormValues) => {
    try {
      if (editingArticle) {
        const id = editingArticle._id || editingArticle.id || "";
        await updateArticleMutation.mutateAsync({ id, ...values });
      } else {
        await createArticleMutation.mutateAsync(values);
      }
      handleCloseModal();
    } catch (err) {
      console.error("Error al guardar el artículo:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que querés eliminar este artículo?")) {
      await deleteArticleMutation.mutateAsync(id);
    }
  };

  const isSaving =
    createArticleMutation.isPending || updateArticleMutation.isPending;

  return {
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
    isDeleting: deleteArticleMutation.isPending,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseModal,
    handleSubmitArticle,
    handleDelete,
  };
}