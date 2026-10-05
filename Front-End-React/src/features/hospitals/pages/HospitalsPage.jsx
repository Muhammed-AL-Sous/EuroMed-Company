import { useEffect, useState } from "react";
import { Search, ShieldAlert, X } from "lucide-react";
import { useSearchParams } from "react-router";
import { Card, Text } from "@radix-ui/themes";
import { useGetHospitalsQuery } from "../HospitalsApiSlice";
import HospitalsTable from "../components/common/HospitalsTable";
import Pagination from "../../../components/utility/Pagination";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";

const HospitalsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // --------------------------------------------------
  // Search
  // --------------------------------------------------

  const initialSearch = searchParams.get("search") ?? "";

  const [searchInput, setSearchInput] = useState(initialSearch);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(searchInput, 400);

  // --------------------------------------------------
  // Sync search with URL
  // --------------------------------------------------

  useEffect(() => {
    const urlSearch = searchParams.get("search") ?? "";

    if (urlSearch !== debouncedSearch) {
      setSearchParams(
        (params) => {
          if (debouncedSearch.trim()) {
            params.set("search", debouncedSearch.trim());
          } else {
            params.delete("search");
          }

          return params;
        },
        { replace: true },
      );
    }
  }, [debouncedSearch, searchParams, setSearchParams]);

  // --------------------------------------------------
  // Hospitals Query
  // --------------------------------------------------

  const { data, isLoading, isFetching, isError } = useGetHospitalsQuery({
    search: debouncedSearch.trim(),
    page,
  });

  const hospitals = data?.hospitals ?? [];
  const meta = data?.meta ?? null;

  // --------------------------------------------------
  // Derived State
  // --------------------------------------------------

  const hasSearch = Boolean(debouncedSearch.trim());

  // --------------------------------------------------
  // Handlers
  // --------------------------------------------------

  const handleSearchChange = (event) => {
    const value = event.target.value;

    setSearchInput(value);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchInput("");
    setPage(1);

    setSearchParams(
      (params) => {
        params.delete("search");
        return params;
      },
      { replace: true },
    );
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <Card variant="ghost">
      {/* Header */}
      <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
        <Text as="div" size="6" weight="bold" className="text-sky-900">
          All Hospitals
        </Text>

        <div className="relative w-full md:max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Search for a hospital by name..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-10 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />

          {searchInput && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Active Search */}
      {hasSearch && (
        <div className="flex items-center justify-between gap-4 border-t border-slate-100 px-4 py-3 text-xs">
          <span className="font-medium text-slate-500">
            Searching for:{" "}
            <span className="font-semibold text-slate-700">
              "{debouncedSearch}"
            </span>
          </span>

          <button
            type="button"
            onClick={clearSearch}
            className="flex items-center gap-1 font-bold text-red-600 transition hover:text-red-700"
          >
            <X className="h-4 w-4" />
            Reset
          </button>
        </div>
      )}

      {/* Initial Loading */}
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState />
      ) : isFetching ? (
        /*
         * أثناء البحث أو تغيير الصفحة:
         * نخفي الجدول بالكامل ونظهر loading.
         */
        <LoadingState message="Loading hospitals..." />
      ) : hospitals.length === 0 ? (
        <EmptyState hasSearch={hasSearch} onReset={clearSearch} />
      ) : (
        <>
          {/* Table */}
          <HospitalsTable hospitals={hospitals} />

          {/* Pagination */}
          <Pagination
            meta={meta}
            onPageChange={handlePageChange}
            disabled={isFetching}
          />
        </>
      )}
    </Card>
  );
};

// ==================================================
// Loading State
// ==================================================

const LoadingState = ({ message = "Loading hospitals..." }) => {
  return (
    <div className="flex min-h-75 flex-col items-center justify-center py-20">
      <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-sky-600 border-t-transparent" />

      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
};

// ==================================================
// Empty State
// ==================================================

const EmptyState = ({ hasSearch, onReset }) => {
  return (
    <div className="mx-4 rounded-2xl border border-slate-200 bg-transparent p-12 text-center">
      <ShieldAlert className="mx-auto h-12 w-12 text-slate-400" />

      <h3 className="mt-3 text-lg font-bold text-slate-800">
        No Hospitals Found
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        {hasSearch
          ? "No hospitals match your search criteria."
          : "There are no hospitals available."}
      </p>

      {hasSearch && (
        <button
          type="button"
          onClick={onReset}
          className="mt-5 rounded-xl bg-sky-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-700"
        >
          Reset Search
        </button>
      )}
    </div>
  );
};

// ==================================================
// Error State
// ==================================================

const ErrorState = () => {
  return (
    <div className="mx-4 rounded-2xl border border-red-200 bg-red-50 p-12 text-center">
      <ShieldAlert className="mx-auto h-12 w-12 text-red-400" />

      <h3 className="mt-3 text-lg font-bold text-red-800">
        Something went wrong
      </h3>

      <p className="mt-2 text-sm text-red-600">
        Failed to load hospitals. Please try again later.
      </p>
    </div>
  );
};

export default HospitalsPage;
