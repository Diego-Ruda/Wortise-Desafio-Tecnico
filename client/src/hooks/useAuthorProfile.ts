import { useState } from "react";
import { useParams, useSearch } from "@tanstack/react-router";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiFetch } from "../api/client";

export function useAuthorProfile() {
  const { authorId } = useParams({ from: "/author/$authorId" });
  const search = useSearch({ from: "/author/$authorId" }) as { name?: string };

  const [page, setPage] = useState(1);
  const limit = 9;

  const { data, isLoading } = useQuery({
    queryKey: ["articles", "author", authorId, page],
    queryFn: async () => {
      const res = await apiFetch<any>(
        `/api/articles/public/author/${authorId}?page=${page}&limit=${limit}`
      );
      return res;
    },
    placeholderData: keepPreviousData,
  });

  const articles = data?.articles || [];
  const totalArticles = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  const authorName =
    articles[0]?.authorName ||
    articles[0]?.author?.name ||
    search?.name ||
    "Autor";

  return {
    authorName,
    page,
    setPage,
    articles,
    totalArticles,
    totalPages,
    isLoading,
  };
}