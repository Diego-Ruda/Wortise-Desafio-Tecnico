import { Link } from "@tanstack/react-router";

interface ArticleCardProps {
  article: {
    _id?: string;
    id?: string;
    title: string;
    content: string;
    imageUrl?: string;
    authorName?: string;
    authorId?: string;
    author?: { name?: string };
    createdAt: string;
  };
  actions?: React.ReactNode;
}

export function ArticleCard({ article, actions }: ArticleCardProps) {
  const name = article.authorName || article.author?.name || "Anónimo";
  const articleId = article._id || article.id || "";

  return (
    <article className="bg-(--bg-200) border border-(--bg-300) rounded-xl overflow-hidden hover:border-(--primary-200)/50 transition-all shadow-sm flex flex-col h-full group relative">
      <Link
        to="/article/$id"
        params={{ id: articleId }}
        className="flex flex-col h-full cursor-pointer flex-1"
      >
        {/* IMAGEN O LOGO DEL NAVBAR */}
        <div className="w-full h-48 bg-(--bg-300) shrink-0 overflow-hidden relative flex items-center justify-center">
          {article.imageUrl ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            /* BRAND / LOGO PLACEHOLDER */
            <div className="flex items-center justify-center w-full h-full bg-linear-to-br from-(--bg-300) to-(--bg-200) group-hover:scale-105 transition-transform duration-300">
              <span className="text-2xl font-black tracking-tight text-(--text-200)/60 select-none">
                BlogApp
              </span>
            </div>
          )}
        </div>

        {/* CONTENIDO DE LA TARJETA */}
        <div className="p-4 md:p-5 flex flex-col flex-1 justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-(--text-100) group-hover:text-(--primary-200) transition-colors line-clamp-2">
              {article.title}
            </h3>
            <p className="text-(--text-200) text-sm mt-2 line-clamp-3">
              {article.content}
            </p>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between text-xs text-(--text-200) pt-3 border-t border-(--bg-300) mt-auto">
            <span>
              Por <strong className="text-(--primary-200)">{name}</strong>
            </span>
            <time>
              {article.createdAt
                ? new Date(article.createdAt).toLocaleDateString()
                : ""}
            </time>
          </div>
        </div>
      </Link>

      {/* BOTONES DE ACCIÓN (PANEL DE GESTIÓN) */}
      {actions && (
        <div 
          className="p-3 bg-(--bg-100) dark:bg-(--bg-300)/50 border-t border-(--bg-300) flex justify-end gap-2"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          {actions}
        </div>
      )}
    </article>
  );
}