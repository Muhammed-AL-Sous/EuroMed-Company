import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router";
import { notifySonner } from "./../../../lib/notifySonner";
import {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "../CategoriesApiSlice";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";

const useCategoriesPageLogic = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const topRef = useRef(null);
  const initialSearch = searchParams.get("search") ?? "";
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(searchInput, 400);
  const normalizedSearch = debouncedSearch.trim();
  const hasSearch = Boolean(normalizedSearch);
  const [selectedDeleteCategory, setSelectedDeleteCategory] = useState(null);
  const [selectedEditCategory, setSelectedEditCategory] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const { data, isLoading, isFetching, isError } = useGetCategoriesQuery({
    search: normalizedSearch,
    page,
  });
  const categories = data?.categories ?? [];
  const meta = data?.meta ?? null;
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();

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

  const handleOpenDeleteModal = (category) => {
    setSelectedDeleteCategory(category);
  };

  const handleDeleteCategory = async () => {
    if (!selectedDeleteCategory || isDeleting) return;
    try {
      await deleteCategory(selectedDeleteCategory.id).unwrap();
      setSelectedDeleteCategory(null);
      notifySonner("Category Deleted Successfully");
    } catch (error) {
      console.error("Failed to Delete Category:", error);
      notifySonner(
        error?.data?.message || "Failed to Delete Category",
        "error",
      );
    }
  };

  const handleOpenEditModal = (category) => {
    setSelectedEditCategory(category);
    setFormErrors({});
    setEditForm({
      name: category.name ?? "",
      description: category.description || "",
    });
  };

  const handleCloseEditModal = () => {
    if (isUpdating) {
      return;
    }
    setSelectedEditCategory(null);
    setFormErrors({});
    setEditForm({
      name: "",
      description: "",
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

  const handleUpdateCategory = async () => {
    if (!selectedEditCategory) {
      return;
    }
    const payload = {
      name: editForm.name.trim(),
      description: editForm.description.trim(),
    };

    // Validation
    const errors = {};
    if (!payload.name) errors.name = "The Name Field is Required";
    if (!payload.description)
      errors.description = "The Description Field is Required";
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // No real changes
    const hasChanges =
      payload.name !== (selectedEditCategory.name ?? "") ||
      payload.description !== (selectedEditCategory.description ?? "");
    if (!hasChanges) {
      setSelectedEditCategory(null);
      setFormErrors({});
      setEditForm({
        name: "",
        description: "",
      });
      return;
    }

    // Update
    try {
      await updateCategory({
        id: selectedEditCategory.id,
        data: payload,
      }).unwrap();
      setSelectedEditCategory(null);
      setFormErrors({});
      setEditForm({
        name: "",
        description: "",
        type: "",
      });
      notifySonner("Category Updated Successfully");
    } catch (error) {
      console.error("Failed to Update Category:", error);
      notifySonner(
        error?.data?.message || "Failed to Update Category",
        "error",
      );
    }
  };

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
    topRef,
    searchInput,
    normalizedSearch,
    hasSearch,
    selectedDeleteCategory,
    setSelectedDeleteCategory,
    selectedEditCategory,
    editForm,
    formErrors,
    isLoading,
    isFetching,
    isError,
    categories,
    meta,
    isDeleting,
    isUpdating,
    handleOpenDeleteModal,
    handleDeleteCategory,
    handleOpenEditModal,
    handleCloseEditModal,
    handleEditFormChange,
    handleUpdateCategory,
    handleSearchChange,
    clearSearch,
    handlePageChange,
  };
};

export default useCategoriesPageLogic;
