import { Pagination } from "@heroui/react";

// Helper interno para calcular las páginas visibles con "..."
function getVisiblePages(current: number, total: number) {
  const maxVisible = 5;
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  let start = Math.max(1, current - 2);
  let end = Math.min(total, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  const pages: (number | string)[] = [];

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push("...");
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < total) {
    if (end < total - 1) pages.push("...");
    pages.push(total);
  }

  return pages;
}

interface CustomPaginationProps {
  page: number;
  totalPages: number;
  totalItems?: number;
  itemLabel?: string;
  onPageChange: (page: number) => void;
}

export function CustomPagination({
  page,
  totalPages,
  totalItems,
  itemLabel = "elementos",
  onPageChange,
}: CustomPaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center justify-center w-full gap-3 pt-6 mt-4 border-t border-(--bg-300)">
      {totalItems !== undefined && (
        <span className="text-xs text-(--text-200) text-center">
          Página <strong className="text-(--text-100)">{page}</strong> de{" "}
          <strong className="text-(--text-100)">{totalPages}</strong> (
          {totalItems} {itemLabel})
        </span>
      )}

      <div className="w-full flex justify-center items-center">
        <Pagination className="mx-auto flex justify-center">
          <Pagination.Content className="flex! justify-center! items-center! mx-auto! flex-wrap">
            <Pagination.Item>
              <Pagination.Previous
                onPress={() => onPageChange(Math.max(page - 1, 1))}
                isDisabled={page === 1}
              >
                <Pagination.PreviousIcon />
              </Pagination.Previous>
            </Pagination.Item>

            {getVisiblePages(page, totalPages).map((pageNum, index) => (
              <Pagination.Item key={index}>
                {typeof pageNum === "number" ? (
                  <Pagination.Link
                    isActive={pageNum === page}
                    onPress={() => onPageChange(pageNum)}
                  >
                    {pageNum}
                  </Pagination.Link>
                ) : (
                  <span className="px-2 text-xs text-(--text-200) select-none">
                    ...
                  </span>
                )}
              </Pagination.Item>
            ))}

            <Pagination.Item>
              <Pagination.Next
                onPress={() => onPageChange(Math.min(page + 1, totalPages))}
                isDisabled={page === totalPages}
              >
                <Pagination.NextIcon />
              </Pagination.Next>
            </Pagination.Item>
          </Pagination.Content>
        </Pagination>
      </div>
    </div>
  );
}