import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_URL = `${API_BASE_URL}/api/articles`;

// Tipo básico para un Artículo
export interface Article {
  id?: string;
  _id?: string;
  title: string;
  content: string;
  imageUrl?: string;
  authorId?: string;
  authorName?: string;
  createdAt: string;
}

// Tipo de respuesta paginada desde el backend
export interface ArticlesPaginatedResponse {
  articles: Article[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// 1. Fetch de artículos propios (Dashboard) con soporte de Paginación
export function useGetArticles(page = 1, limit = 4) {
  return useQuery({
    queryKey: ["articles", page, limit],
    queryFn: async (): Promise<ArticlesPaginatedResponse> => {
      const res = await fetch(`${API_URL}?page=${page}&limit=${limit}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error al obtener artículos");

      const responseData = await res.json();

      // Si el backend devuelve el objeto completo con total
      if (responseData && Array.isArray(responseData.articles)) {
        const total =
          Number(responseData.total) || responseData.articles.length;
        const currentLimit = Number(responseData.limit) || limit;

        return {
          articles: responseData.articles,
          total,
          page: Number(responseData.page) || page,
          limit: currentLimit,
          totalPages:
            responseData.totalPages || Math.ceil(total / currentLimit) || 1,
        };
      }

      // Fallback por si la respuesta fuera un array directo (retrocompatibilidad)
      if (Array.isArray(responseData)) {
        const total = responseData.length;
        return {
          articles: responseData,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        };
      }

      return { articles: [], total: 0, page, limit, totalPages: 1 };
    },
    // Retiene los datos anteriores mientras descarga la nueva página (evita parpadeos UI)
    placeholderData: keepPreviousData,
  });
}

// 2. Crear un nuevo artículo
export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newArticle: {
      title: string;
      content: string;
      imageUrl?: string;
    }) => {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newArticle),
      });
      if (!res.ok) throw new Error("Error al crear el artículo");
      return res.json();
    },
    // Invalidamos cualquier query cuyo key empiece con 'articles' o 'public-articles'
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["public-articles"] });
    },
  });
}

// 3. Eliminar un artículo
export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (articleId: string) => {
      const res = await fetch(`${API_URL}/${articleId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error al eliminar el artículo");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["public-articles"] });
    },
  });
}

// 4. Actualizar / Editar un artículo
export function useUpdateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      content,
      imageUrl,
    }: {
      id: string;
      title: string;
      content: string;
      imageUrl?: string;
    }) => {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, content, imageUrl }),
      });
      if (!res.ok) throw new Error("Error al actualizar el artículo");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
      queryClient.invalidateQueries({ queryKey: ["public-articles"] });
    },
  });
}

// 5. Fetch de un solo artículo por ID
export function useGetArticleById(id?: string) {
  return useQuery({
    queryKey: ["article", id],
    queryFn: async (): Promise<Article> => {
      const res = await fetch(`${API_URL}/${id}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Error al obtener el detalle del artículo");

      const responseData = await res.json();
      return responseData.article || responseData.data || responseData;
    },
    enabled: !!id,
  });
}

// 6. Fetch de artículos PÚBLICOS (Inicio) con buscador y paginación
export function useSearchArticles(searchQuery = "", page = 1, limit = 4) {
  return useQuery({
    queryKey: ["public-articles", searchQuery, page, limit],
    queryFn: async (): Promise<ArticlesPaginatedResponse> => {
      const res = await fetch(
        `${API_URL}/public/search?q=${encodeURIComponent(searchQuery)}&page=${page}&limit=${limit}`,
      );
      if (!res.ok) throw new Error("Error al buscar artículos públicos");

      const responseData = await res.json();

      if (responseData && Array.isArray(responseData.articles)) {
        const total =
          Number(responseData.total) || responseData.articles.length;
        const currentLimit = Number(responseData.limit) || limit;

        return {
          articles: responseData.articles,
          total,
          page: Number(responseData.page) || page,
          limit: currentLimit,
          totalPages:
            responseData.totalPages || Math.ceil(total / currentLimit) || 1,
        };
      }

      if (Array.isArray(responseData)) {
        const total = responseData.length;
        return {
          articles: responseData,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        };
      }

      return { articles: [], total: 0, page, limit, totalPages: 1 };
    },
    placeholderData: keepPreviousData,
  });
}

// 7. Fetch de artículos de un AUTOR ESPECÍFICO con paginación (5 por página)
export function useGetArticlesByAuthor(authorId?: string, page = 1, limit = 5) {
  return useQuery({
    queryKey: ["author-articles", authorId, page, limit],
    queryFn: async (): Promise<ArticlesPaginatedResponse> => {
      const res = await fetch(
        `${API_URL}/public/author/${authorId}?page=${page}&limit=${limit}`,
      );
      if (!res.ok) throw new Error("Error al cargar artículos del autor");

      const responseData = await res.json();

      if (responseData && Array.isArray(responseData.articles)) {
        const total =
          Number(responseData.total) || responseData.articles.length;
        const currentLimit = Number(responseData.limit) || limit;

        return {
          articles: responseData.articles,
          total,
          page: Number(responseData.page) || page,
          limit: currentLimit,
          totalPages:
            responseData.totalPages || Math.ceil(total / currentLimit) || 1,
        };
      }

      if (Array.isArray(responseData)) {
        const total = responseData.length;
        return {
          articles: responseData,
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit) || 1,
        };
      }

      return { articles: [], total: 0, page, limit, totalPages: 1 };
    },
    enabled: !!authorId,
    placeholderData: keepPreviousData,
  });
}
