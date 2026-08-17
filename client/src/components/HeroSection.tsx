interface HeroSectionProps {
  onSearch: (term: string) => void;
}

export function HeroSection({ onSearch }: HeroSectionProps) {
  return (
    <div className="bg-(--bg-200) dark:bg-(--bg-200) border border-(--bg-300) dark:border-(--bg-300) rounded-2xl p-6 sm:p-10 text-center space-y-4 sm:space-y-6 shadow-sm transition-colors">
      
      {/* Título en Verde Verde Primary y Bajada Neutra */}
      <div className="space-y-2 max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-(--primary-200) dark:text-(--primary-100) tracking-tight">
          Explorá los artículos
        </h1>

        <p className="text-(--text-200) dark:text-(--text-200) text-xs sm:text-sm leading-relaxed">
          Descubrí publicaciones de tus autores favoritos. Filtrá por título,
          contenido o autor.
        </p>
      </div>

      {/* Buscador Neutro */}
      <div className="max-w-xl mx-auto relative flex items-center w-full">
        <input
          type="text"
          placeholder="Buscar artículos o autores..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full bg-(--bg-100) dark:bg-(--bg-100) border border-(--bg-300) dark:border-(--bg-300) focus:border-(--primary-200) dark:focus:border-(--primary-100) rounded-xl py-3 pl-11 pr-4 text-base sm:text-sm text-(--text-100) dark:text-(--text-100) placeholder:text-(--text-200)/60 focus:outline-none transition-colors shadow-xs appearance-none"
        />
      </div>
    </div>
  );
}