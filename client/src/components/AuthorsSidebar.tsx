import { Link } from "@tanstack/react-router";

interface Author {
  _id: string;
  name: string;
  articleCount: number;
}

interface AuthorsSidebarProps {
  authors: Author[];
  isLoading: boolean;
  title?: string;
}

export function AuthorsSidebar({
  authors,
  isLoading,
  title = "Autores destacados",
}: AuthorsSidebarProps) {
  if (isLoading) {
    return (
      <div className="bg-(--bg-200) border border-(--bg-300) rounded-2xl p-6 text-sm text-(--text-200)">
        Cargando autores...
      </div>
    );
  }

  if (authors.length === 0) {
    return null;
  }

  return (
    <div className="bg-(--bg-200) border border-(--bg-300) rounded-2xl p-6 space-y-4">
      <h2 className="text-xs font-bold tracking-wider text-(--text-200) uppercase">
        {title}
      </h2>

      <div className="flex flex-col gap-2">
        {authors.map((author) => {
          const count = author.articleCount;
          const authorId = author._id;

          return (
            <Link
              key={authorId}
              to="/author/$authorId"
              params={{ authorId }}
              search={{ name: author.name }}
              className="flex items-center justify-between p-3 rounded-xl bg-(--bg-100)/50 hover:bg-(--bg-300) border border-transparent hover:border-(--bg-300) transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-(--primary-200)/20 border border-(--primary-200)/30 text-(--primary-200) font-bold text-sm flex items-center justify-center shrink-0">
                  {author.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-(--text-100) group-hover:text-(--primary-200) transition-colors">
                  {author.name}
                </span>
              </div>

              {/* Texto destacado y bien visible */}
              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-(--primary-200)">
                  {count} {count === 1 ? "ARTÍCULO" : "ARTÍCULOS"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}