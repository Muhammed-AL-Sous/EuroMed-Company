/**
 * Normalizes API envelope `{ data, meta, links }` from ApiResponse::success + paginator.
 */
export function normalizeProductsListResponse(response) {
  const rows = response?.data;
  const meta = response?.meta ?? null;
  const links = response?.links ?? null;
  // Laravel paginated response
  if (Array.isArray(rows) && meta && typeof meta.current_page === "number") {
    return { products: rows, meta, links };
  }
  // Non-paginated response fallback
  if (Array.isArray(rows)) {
    return {
      products: rows,
      meta: {
        total_items: rows.length,
        items_per_page: rows.length || 1,
        current_page: 1,
        total_pages: 1,
        from: rows.length ? 1 : null,
        to: rows.length ? rows.length : null,
      },
      links: null,
    };
  }
  // Invalid / empty response
  return { products: [], meta: null, links: null };
}
