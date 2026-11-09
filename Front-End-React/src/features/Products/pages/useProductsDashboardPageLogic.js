import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import {
  useGetProductsQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../ProductsApiSlice";
import { useGetSubCategoriesQuery } from "../../subCategories/SubCategoriesApiSlice";
import { useGetManufacturersQuery } from "../../manufacturers/ManufacturersApiSlice";
import { useGetCategoriesQuery } from "../../categories/CategoriesApiSlice";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { notifySonner } from "../../../lib/notifySonner";

const useProductsDashboardPageLogic = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const topRef = useRef(null);
  const initialSearch = searchParams.get("search") ?? "";
  const [searchInput, setSearchInput] = useState(initialSearch);
  const search = searchParams.get("search") || "";
  const manufacturerId = searchParams.get("manufacturer_id") || "";
  const subCategoryId = searchParams.get("subcategory_id") || "";
  const categoryId = searchParams.get("category_id") || "";
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(searchInput, 400);
  const normalizedSearch = debouncedSearch.trim();
  const hasSearch = Boolean(normalizedSearch);
  const { data: subcategories = [] } = useGetSubCategoriesQuery();
  const subCategoriesResponse = subcategories?.subcategories ?? [];
  const { data: categories = [] } = useGetCategoriesQuery();
  const categoriesResponse = categories?.categories ?? [];
  const { data: manufacturers = [] } = useGetManufacturersQuery();
  const manufacturersResponse = manufacturers?.manufacturers ?? [];

  const {
    data: productsResponse,
    isLoading,
    isFetching,
    isError,
  } = useGetProductsQuery({
    search: normalizedSearch,
    manufacturer_id: manufacturerId,
    subcategory_id: subCategoryId,
    category_id: categoryId,
    page,
  });

  const products = productsResponse?.products ?? [];
  const meta = productsResponse?.meta ?? null;
  const [selectedDeleteProduct, setSelectedDeleteProduct] = useState(null);
  const [selectedEditProduct, setSelectedEditProduct] = useState(null);

  const [editForm, setEditForm] = useState({
    code: "",
    name: "",
    description: "",
    manufacturer_id: "",
    subcategory_id: "",
    category_id: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  useEffect(() => {
    const urlSearch = searchParams.get("search") ?? "";
    if (urlSearch === normalizedSearch) {
      return;
    }
    setSearchParams(
      (params) => {
        if (normalizedSearch) {
          params.set("search", normalizedSearch);
        } else {
          params.delete("search");
        }
        return params;
      },
      {
        replace: true,
      },
    );
  }, [normalizedSearch, searchParams, setSearchParams]);

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
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
      {
        replace: true,
      },
    );
  };

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

  const clearFilters = () => {
    setSearchInput("");
    setPage(1);
    setSearchParams({});
  };

  const hasActiveFilters =
    Boolean(search) ||
    Boolean(subCategoryId) ||
    Boolean(manufacturerId) ||
    Boolean(categoryId);

  const handleOpenDeleteModal = (product) => {
    setSelectedDeleteProduct(product);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) {
      return;
    }
    setSelectedDeleteProduct(null);
  };

  const handleDeleteProduct = async () => {
    if (!selectedDeleteProduct) {
      return;
    }
    try {
      await deleteProduct(selectedDeleteProduct.id).unwrap();
      setSelectedDeleteProduct(null);
      notifySonner("Product Deleted Successfully");
    } catch (error) {
      console.error("Failed to Delete Product :", error);
      notifySonner(error?.data?.message || "Failed to Delete Product", "error");
    }
  };

  const handleOpenEditModal = (product) => {
    setSelectedEditProduct(product);
    setFormErrors({});
    setSelectedImage(null);
    setRemoveExistingImage(false);
    setEditForm({
      code: product.code ?? "",
      name: product.name ?? "",
      description: product.description ?? "",
      manufacturer_id: String(
        product.manufacturer_id ?? product.manufacturer?.id ?? "",
      ),
      subcategory_id: String(
        product.subcategory_id ?? product.subcategory?.id ?? "",
      ),
      category_id: String(product.category_id ?? product.category?.id ?? ""),
    });
  };

  const handleCloseEditModal = () => {
    if (isUpdating) {
      return;
    }
    setSelectedEditProduct(null);
    setFormErrors({});
    setSelectedImage(null);
    setRemoveExistingImage(false);
    setEditForm({
      code: "",
      name: "",
      description: "",
      manufacturer_id: "",
      subcategory_id: "",
      category_id: "",
    });
  };

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
    }));
  };

  const handleUpdateProduct = async () => {
    if (!selectedEditProduct) {
      return;
    }
    const payload = {
      code: editForm.code.trim(),
      name: editForm.name.trim(),
      description: editForm.description.trim(),
      manufacturer_id: editForm.manufacturer_id,
      subcategory_id: editForm.subcategory_id,
      category_id: editForm.category_id,
    };

    // ==================================================
    // Validation
    // ==================================================

    const errors = {};
    if (!payload.code) {
      errors.code = "The Product Code Field is Required";
    }
    if (!payload.name) {
      errors.name = "The Product Name Field is Required";
    }
    if (!payload.manufacturer_id) {
      errors.manufacturer_id = "The Manufacturer Field is Required";
    }
    if (!payload.subcategory_id) {
      errors.subcategory_id = "The SubCategory Field is Required";
    }
    if (!payload.category_id) {
      errors.category_id = "The Category Field is Required";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // ==================================================
    // Check Changes
    // ==================================================

    const originalManufacturerId =
      selectedEditProduct.manufacturer_id ??
      selectedEditProduct.manufacturer?.id ??
      "";
    const originalSubcategoryId =
      selectedEditProduct.subcategory_id ??
      selectedEditProduct.subcategory?.id ??
      "";
    const originalCategoryId =
      selectedEditProduct.category_id ?? selectedEditProduct.category?.id ?? "";
    const hasChanges =
      payload.code !== (selectedEditProduct.code ?? "").trim() ||
      payload.name !== (selectedEditProduct.name ?? "").trim() ||
      payload.description !== (selectedEditProduct.description ?? "").trim() ||
      String(payload.manufacturer_id ?? "") !==
        String(originalManufacturerId) ||
      String(payload.subcategory_id ?? "") !== String(originalSubcategoryId) ||
      String(payload.category_id ?? "") !== String(originalCategoryId) ||
      Boolean(selectedImage) ||
      removeExistingImage;
    if (!hasChanges) {
      handleCloseEditModal();
      return;
    }

    // ==================================================
    // Update
    // ==================================================

    try {
      const formData = new FormData();
      formData.append("code", payload.code);
      formData.append("name", payload.name);
      formData.append("description", payload.description);
      formData.append("manufacturer_id", payload.manufacturer_id);
      formData.append("subcategory_id", payload.subcategory_id);
      formData.append("category_id", payload.category_id);

      // صورة جديدة، إن وُجدت
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      // حذف الصورة الحالية فقط إذا طلب المستخدم ذلك
      formData.append(
        "remove_image",
        removeExistingImage && !selectedImage ? "1" : "0",
      );

      // Laravel method spoofing لتحديث multipart/form-data
      formData.append("_method", "PUT");
      await updateProduct({
        id: selectedEditProduct.id,
        data: formData,
      }).unwrap();
      setSelectedEditProduct(null);
      setFormErrors({});
      setSelectedImage(null);
      setRemoveExistingImage(false);
      setEditForm({
        code: "",
        name: "",
        description: "",
        manufacturer_id: "",
        subcategory_id: "",
        category_id: "",
      });
      notifySonner("Product Updated Successfully");
    } catch (error) {
      console.error("Failed to Update Product:", error);
      notifySonner(error?.data?.message || "Failed to Update Product", "error");
    }
  };
  const handlePageChange = (newPage) => {
    if (newPage === page) return;
    setPage(newPage);
    requestAnimationFrame(() => {
      topRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  return {
    setSelectedImage,
    setRemoveExistingImage,
    topRef,
    searchInput,
    manufacturerId,
    subCategoryId,
    categoryId,
    normalizedSearch,
    hasSearch,
    subCategoriesResponse,
    categoriesResponse,
    manufacturersResponse,
    isLoading,
    isFetching,
    isError,
    products,
    meta,
    selectedDeleteProduct,
    selectedEditProduct,
    editForm,
    formErrors,
    isDeleting,
    isUpdating,
    handleSearchChange,
    clearSearch,
    handleSubCategoryChange,
    handleManufacturerChange,
    clearFilters,
    hasActiveFilters,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleDeleteProduct,
    handleOpenEditModal,
    handleCloseEditModal,
    handleEditFormChange,
    handleUpdateProduct,
    handlePageChange,
  };
};

export default useProductsDashboardPageLogic;
