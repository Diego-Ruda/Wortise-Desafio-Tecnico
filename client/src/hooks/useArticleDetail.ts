import { useParams } from "@tanstack/react-router";
import { useGetArticleById } from "../api/articles";

export function useArticleDetail() {
  const { id } = useParams({ strict: false });
  const { data: article, isLoading, isError } = useGetArticleById(id);

  return {
    article,
    isLoading,
    isError,
  };
}