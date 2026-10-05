export function normalizeHospitalsListResponse(response) {
  const rows = response?.data;
  const meta = response?.meta ?? null;
  const links = response?.links ?? null;

  if (Array.isArray(rows) && meta && typeof meta.current_page === "number") {
    return { hospitals: rows, meta, links };
  }

  if (Array.isArray(rows)) {
    return {
      hospitals: rows,
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

  return { hospitals: [], meta: null, links: null };
}
