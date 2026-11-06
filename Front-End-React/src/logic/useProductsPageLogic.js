// React & React Router
import { useState } from "react";
import { useSearchParams } from "react-router";

// Products API Slice
import { useGetProductsQuery } from "../features/products/ProductsApiSlice";
import { useGetSubCategoriesQuery } from "../features/subCategories/SubCategoriesApiSlice";
import { useGetManufacturersQuery } from "../features/manufacturers/ManufacturersApiSlice";

// utils
import { useDebouncedValue } from "../hooks/useDebouncedValue";

const useProductsPageLogic = () => {
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

  const subcategoriesResponse = subCategories?.subcategories ?? [];
  // --------------------------------------------------
  // Manufacturers
  // --------------------------------------------------

  const { data: manufacturers = [] } = useGetManufacturersQuery();

  const manufacturersResponse = manufacturers?.manufacturers ?? [];

  // --------------------------------------------------
  // Products
  // --------------------------------------------------

  const {
    currentData: productsResponse,
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

  return {
    products,
    meta,
    isLoading,
    isFetching,
    searchInput,
    handleSearchChange,
    subcategoriesResponse,
    subCategoryId,
    handleSubCategoryChange,
    manufacturersResponse,
    manufacturerId,
    handleManufacturerChange,
    clearFilters,
    hasActiveFilters,
    handlePageChange,
    selectedProduct,
    setSelectedProduct,
  };
};

export default useProductsPageLogic;
