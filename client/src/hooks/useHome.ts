import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../api/client";
import { useSearchArticles } from "../api/articles";

export function useHome() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const limit = 9;

  // Hook paginado de artículos públicos
  const { data: articlesData, isLoading: loadingArticles } = useSearchArticles(
    searchQuery,
    page,
    limit
  );

  const articles = articlesData?.articles || [];
  const totalArticles = articlesData?.total || 0;
  const totalPages = articlesData?.totalPages || 1;

  // Carga de autores
  const { data: authorsData, isLoading: loadingAuthors } = useQuery({
    queryKey: ["authors", "stats"],
    queryFn: async () => {
      const res = await apiFetch<any[]>("/api/articles/public/authors");
      return Array.isArray(res)
        ? res.map((a) => ({
            _id: a.authorId || a._id,
            name: a.authorName || "Anónimo",
            articleCount: a.totalArticles || a.articleCount || 0,
          }))
        : [];
    },
  });

  // Filtrado y ordenamiento de autores
  const filteredAuthors = (authorsData || []).filter((author) =>
    author.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const displayedAuthors = [...filteredAuthors]
    .sort((a, b) => b.articleCount - a.articleCount)
    .slice(0, 5);

  const handleSearch = (term: string) => {
    setSearchQuery(term);
    setPage(1);
  };

  return {
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
  };
}