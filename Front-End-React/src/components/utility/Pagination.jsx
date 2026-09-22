import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import clsx from "clsx";

export default function Pagination({ meta, onPageChange, disabled = false }) {
  if (!meta || meta.total_pages < 1) {
    return null;
  }

  const {
    current_page: current,
    total_pages: last,
    total_items: total,
    from,
    to,
  } = meta;

  const canPrev = current > 1;
  const canNext = current < last;

  return (
    <div className="mt-6 flex flex-col items-stretch justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center">
      {/* Results Info */}

      <p className="text-center text-sm text-slate-600 sm:text-start">
        {from != null && to != null ? (
          <>
            Showing{" "}
            <span className="font-semibold text-slate-800">
              {from}–{to}
            </span>{" "}
            of <span className="font-semibold text-slate-800">{total}</span>{" "}
            Products
          </>
        ) : (
          <>
            <span className="font-semibold text-slate-800">{total}</span>{" "}
            Products
          </>
        )}
      </p>

      {/* Navigation */}

      <div className="flex flex-wrap items-center justify-center gap-1">
        {/* First */}

        <NavIcon
          label="First Page"
          onClick={() => onPageChange(1)}
          disabled={disabled || !canPrev}
        >
          <ChevronsLeft className="size-4" aria-hidden="true" />
        </NavIcon>

        {/* Previous */}

        <NavIcon
          label="Previous Page"
          onClick={() => onPageChange(current - 1)}
          disabled={disabled || !canPrev}
        >
          <ChevronLeft className="size-4" aria-hidden="true" />
        </NavIcon>

        {/* Current Page */}

        <span className="min-w-28 px-3 text-center text-sm font-medium tabular-nums text-slate-700">
          Page <span className="font-bold text-slate-900">{current}</span> of{" "}
          <span className="font-bold text-slate-900">{last}</span>
        </span>

        {/* Next */}

        <NavIcon
          label="Next Page"
          onClick={() => onPageChange(current + 1)}
          disabled={disabled || !canNext}
        >
          <ChevronRight className="size-4" aria-hidden="true" />
        </NavIcon>

        {/* Last */}

        <NavIcon
          label="Last Page"
          onClick={() => onPageChange(last)}
          disabled={disabled || !canNext}
        >
          <ChevronsRight className="size-4" aria-hidden="true" />
        </NavIcon>
      </div>
    </div>
  );
}

function NavIcon({ children, onClick, disabled, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "inline-flex size-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition",

        disabled
          ? "cursor-not-allowed opacity-40"
          : "hover:border-sky-400 hover:bg-sky-50",
      )}
    >
      {children}
    </button>
  );
}
