import { useState } from "react";
import { Search, ShieldAlert, X } from "lucide-react";
import { useSearchParams } from "react-router";

import { useGetProductsQuery } from "../features/Products/ProductsApiSlice";
import { useGetSubCategoriesQuery } from "../features/SubCategories/SubCategoriesApiSlice";
import { useGetManufacturersQuery } from "../features/Manufacturers/ManufacturersApiSlice";

import Pagination from "../components/utility/Pagination";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedProduct, setSelectedProduct] = useState(null);

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );

  const [page, setPage] = useState(1);

  // --------------------------------------------------
  // URL Filters
  // --------------------------------------------------

  const search = searchParams.get("search") || "";
  const subCategoryId = searchParams.get("subcategory_id") || "";
  const manufacturerId = searchParams.get("manufacturer_id") || "";

  // --------------------------------------------------
  // Debounced Search
  // --------------------------------------------------

  const debouncedSearch = useDebouncedValue(searchInput, 400);

  // --------------------------------------------------
  // Subcategories
  // --------------------------------------------------

  const { data: subCategories = [] } = useGetSubCategoriesQuery();

  // --------------------------------------------------
  // Manufacturers
  // --------------------------------------------------

  const { data: manufacturers = [] } = useGetManufacturersQuery();

  // --------------------------------------------------
  // Products
  // --------------------------------------------------

  const {
    data: productsResponse,
    isLoading,
    isFetching,
  } = useGetProductsQuery({
    search: debouncedSearch,
    subcategory_id: subCategoryId,
    manufacturer_id: manufacturerId,
    page,
  });

  const products = productsResponse?.products ?? [];
  const meta = productsResponse?.meta ?? null;

  // --------------------------------------------------
  // Search Handler
  // --------------------------------------------------

  const handleSearchChange = (value) => {
    setSearchInput(value);
    setPage(1);

    setSearchParams((params) => {
      if (value.trim()) {
        params.set("search", value);
      } else {
        params.delete("search");
      }

      return params;
    });
  };

  // --------------------------------------------------
  // Subcategory Handler
  // --------------------------------------------------

  const handleSubCategoryChange = (value) => {
    setPage(1);

    setSearchParams((params) => {
      if (value) {
        params.set("subcategory_id", value);
      } else {
        params.delete("subcategory_id");
      }

      return params;
    });
  };

  // --------------------------------------------------
  // Manufacturer Handler
  // --------------------------------------------------

  const handleManufacturerChange = (value) => {
    setPage(1);

    setSearchParams((params) => {
      if (value) {
        params.set("manufacturer_id", value);
      } else {
        params.delete("manufacturer_id");
      }

      return params;
    });
  };

  // --------------------------------------------------
  // Clear Filters
  // --------------------------------------------------

  const clearFilters = () => {
    setSearchInput("");
    setPage(1);
    setSearchParams({});
  };

  // --------------------------------------------------
  // Active Filters
  // --------------------------------------------------

  const hasActiveFilters =
    Boolean(search) || Boolean(subCategoryId) || Boolean(manufacturerId);

  const handlePageChange = (newPage) => {
    setPage(newPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* ==================================================
            Page Header
        ================================================== */}

        <div className="bg-slate-900 text-white p-8 sm:p-10 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-sky-400 bg-sky-500/20 px-3 py-1 rounded-full border border-sky-400/30">
              Orthopedic Product Catalog
            </span>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-3">
              Surgical Implants & Hardware
            </h1>

            <p className="text-slate-300 text-sm mt-2 max-w-xl">
              Browse total knee and hip arthroplasty systems, trauma locking
              plates, cannulated screws, and intramedullary nails.
            </p>
          </div>

          <div className="text-right">
            <span className="text-3xl font-black text-sky-400 font-mono">
              {meta?.total_items ?? products.length}
            </span>

            <span className="block text-xs text-slate-400 uppercase font-semibold">
              Products Available
            </span>
          </div>
        </div>

        {/* ==================================================
            Filters
        ================================================== */}

        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}

            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

              <input
                type="text"
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search Product Name..."
                className="w-full bg-slate-50 text-slate-900 pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none transition"
              />
            </div>

            {/* Subcategory */}

            <div>
              <select
                value={subCategoryId}
                onChange={(e) => handleSubCategoryChange(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none transition"
              >
                <option value="">All Subcategories</option>

                {subCategories.map((subCategory) => (
                  <option key={subCategory.id} value={subCategory.id}>
                    {subCategory.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Manufacturer */}

            <div>
              <select
                value={manufacturerId}
                onChange={(e) => handleManufacturerChange(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none transition"
              >
                <option value="">All Manufacturers</option>

                {manufacturers.map((manufacturer) => (
                  <option key={manufacturer.id} value={manufacturer.id}>
                    {manufacturer.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters */}

          {hasActiveFilters && (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4 text-xs">
              <span className="text-slate-500 font-medium">
                Active filters applied
              </span>

              <button
                type="button"
                onClick={clearFilters}
                className="text-red-600 hover:text-red-700 font-bold flex items-center gap-1 transition"
              >
                <X className="w-4 h-4" />
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* ==================================================
            Loading
        ================================================== */}

        {isLoading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />

            <p className="text-slate-500 text-sm font-medium">
              Loading EuroMed product catalog from API...
            </p>
          </div>
        ) : products.length === 0 ? (
          /* ==================================================
              Empty State
          ================================================== */

          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <ShieldAlert className="w-12 h-12 text-slate-400 mx-auto" />

            <h3 className="text-lg font-bold text-slate-800">
              No products match your filter criteria
            </h3>

            <p className="text-slate-500 text-sm">
              Try clearing your search query or selecting a different
              manufacturer or subcategory.
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-sm font-bold mt-2 transition"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          /* ==================================================
              Products
          ================================================== */

          <div className="relative">
            {/* Fetching Indicator */}

            {isFetching && !isLoading && (
              <div className="absolute right-2 -top-6 text-xs text-slate-400">
                Updating...
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col h-full"
                >
                  {/* Product Content */}

                  <div className="flex flex-col flex-1">
                    {/* Image */}

                    <div className="relative h-48 bg-slate-100 overflow-hidden shrink-0">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />

                      {/* Product Code */}

                      {product.code && (
                        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-md font-mono font-bold">
                          {product.code}
                        </div>
                      )}

                      {/* Manufacturer */}

                      {product.brand_name && (
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-900 text-xs px-2.5 py-1 rounded-md font-bold border border-slate-200">
                          {product.brand_name}
                        </div>
                      )}
                    </div>

                    {/* Product Information */}

                    <div className="p-5 space-y-3 flex flex-col flex-1">
                      <div className="flex items-center justify-between gap-3 text-xs font-semibold text-sky-600">
                        <span>{product.category_name}</span>

                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono whitespace-nowrap">
                          {product.status === "available"
                            ? "In Stock"
                            : "Low Stock"}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 leading-snug">
                        {product.name}
                      </h3>

                      <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                        {product.description || "No description available."}
                      </p>

                      <div className="pt-2 text-xs text-slate-500 border-t border-slate-100 mt-auto">
                        <strong className="text-slate-700">Usage:</strong>{" "}
                        {product.medical_usage || "Not specified"}
                      </div>
                    </div>
                  </div>

                  {/* Button */}

                  <div className="p-5 pt-0">
                    <button
                      type="button"
                      onClick={() => setSelectedProduct(product)}
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
                    >
                      View Specifications & Sizes
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ==================================================
                Pagination
            ================================================== */}

            <Pagination
              meta={meta}
              onPageChange={handlePageChange}
              disabled={isFetching}
            />
          </div>
        )}

        {/* ==================================================
            Product Detail Modal
        ================================================== */}

        {selectedProduct && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedProduct(null)}
          >
            <div
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}

              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Product Header */}

              <div className="flex items-center gap-3 pr-10">
                {selectedProduct.code && (
                  <span className="px-3 py-1 rounded-md bg-sky-100 text-sky-700 text-xs font-bold font-mono">
                    {selectedProduct.code}
                  </span>
                )}

                <span className="text-xs font-bold text-slate-500 uppercase">
                  {selectedProduct.brand_name || "Unknown Manufacturer"}
                  {" • "}
                  {selectedProduct.category_name || "Uncategorized"}
                </span>
              </div>

              {/* Product Name */}

              <h2 className="text-2xl font-black text-slate-900">
                {selectedProduct.name}
              </h2>

              {/* Description */}

              <p className="text-slate-600 text-sm leading-relaxed">
                {selectedProduct.description || "No description available."}
              </p>

              {/* Medical Indication */}

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Medical Indication
                </h4>

                <p className="text-xs text-slate-600">
                  {selectedProduct.medical_usage || "Not specified."}
                </p>
              </div>

              {/* Technical Specifications */}

              {selectedProduct.specifications &&
                Object.keys(selectedProduct.specifications).length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Technical Specifications
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {Object.entries(selectedProduct.specifications).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="bg-white p-2.5 rounded-lg border border-slate-200"
                          >
                            <span className="block font-semibold text-slate-500">
                              {key}
                            </span>

                            <span className="font-bold text-slate-900">
                              {String(value)}
                            </span>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {/* Available Sizes */}

              {Array.isArray(selectedProduct.available_sizes) &&
                selectedProduct.available_sizes.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Available Sizes in Stock
                    </h4>

                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.available_sizes.map((size, index) => (
                        <span
                          key={`${size}-${index}`}
                          className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-800 text-xs font-mono font-bold border border-sky-200"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {/* Footer */}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <span className="text-xs text-slate-500">
                  Distributed by EuroMed Erbil HQ
                </span>

                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
