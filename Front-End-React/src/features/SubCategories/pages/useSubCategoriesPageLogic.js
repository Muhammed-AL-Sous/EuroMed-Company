import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router";
import { notifySonner } from "./../../../lib/notifySonner";
import {
  useGetSubCategoriesQuery,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} from "../SubCategoriesApiSlice";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";

const useSubCategoriesPageLogic = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedImage, setSelectedImage] = useState(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const topRef = useRef(null);
  const initialSearch = searchParams.get("search") ?? "";
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(searchInput, 400);
  const normalizedSearch = debouncedSearch.trim();
  const hasSearch = Boolean(normalizedSearch);
  const [selectedDeleteSubCategory, setSelectedDeleteSubCategory] =
    useState(null);
  const [selectedEditSubCategory, setSelectedEditSubCategory] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState({});

  const { data, isLoading, isFetching, isError } = useGetSubCategoriesQuery({
    search: normalizedSearch,
    page,
  });

  const subcategories = data?.subcategories ?? [];
  const meta = data?.meta ?? null;

  const [deleteSubCategory, { isLoading: isDeleting }] =
    useDeleteSubCategoryMutation();

  const [updateSubCategory, { isLoading: isUpdating }] =
    useUpdateSubCategoryMutation();

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
    setSelectedDeleteSubCategory(category);
  };

  const handleDeleteSubCategory = async () => {
    if (!selectedDeleteSubCategory || isDeleting) return;
    try {
      await deleteSubCategory(selectedDeleteSubCategory.id).unwrap();
      setSelectedDeleteSubCategory(null);
      notifySonner("SubCategory Deleted Successfully");
    } catch (error) {
      console.error("Failed to Delete SubCategory:", error);
      notifySonner(
        error?.data?.message || "Failed to Delete SubCategory",
        "error",
      );
    }
  };

  const handleOpenEditModal = (subcategory) => {
    setSelectedEditSubCategory(subcategory);
    setFormErrors({});
    setSelectedImage(null);
    setRemoveExistingImage(false);
    setEditForm({
      name: subcategory.name ?? "",
      description: subcategory.description || "",
    });
  };

  const handleCloseEditModal = () => {
    if (isUpdating) {
      return;
    }
    setSelectedEditSubCategory(null);
    setFormErrors({});
    setSelectedImage(null);
    setRemoveExistingImage(false);
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

  const handleUpdateSubCategory = async () => {
    if (!selectedEditSubCategory || isUpdating) return;
    const payload = {
      name: editForm.name.trim(),
      description: editForm.description.trim(),
    };

    // Validation
    const errors = {};
    if (!payload.name) {
      errors.name = "The Name Field is Required";
    }
    if (!payload.description) {
      errors.description = "The Description Field is Required";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Check for changes
    const hasChanges =
      payload.name !== (selectedEditSubCategory.name ?? "") ||
      payload.description !== (selectedEditSubCategory.description ?? "") ||
      Boolean(selectedImage) ||
      removeExistingImage;
    if (!hasChanges) {
      handleCloseEditModal();
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", payload.name);
      formData.append("description", payload.description);

      // Upload a new image if selected
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      // Remove existing image if requested
      formData.append(
        "remove_image",
        removeExistingImage && !selectedImage ? "1" : "0",
      );

      // Laravel method spoofing
      formData.append("_method", "PUT");
      await updateSubCategory({
        id: selectedEditSubCategory.id,
        data: formData,
      }).unwrap();
      setSelectedEditSubCategory(null);
      setFormErrors({});
      setSelectedImage(null);
      setRemoveExistingImage(false);
      setEditForm({
        name: "",
        description: "",
      });
      notifySonner("SubCategory Updated Successfully");
    } catch (error) {
      console.error("Failed to Update SubCategory:", error);

      // Laravel validation errors
      if (error?.status === 422 && error?.data?.errors) {
        const validationErrors = {};
        Object.entries(error.data.errors).forEach(([field, messages]) => {
          validationErrors[field] = Array.isArray(messages)
            ? messages[0]
            : messages;
        });
        setFormErrors(validationErrors);
      }
      notifySonner(
        error?.data?.message || "Failed to Update SubCategory",
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
    setSelectedImage,
    setRemoveExistingImage,
    topRef,
    searchInput,
    normalizedSearch,
    hasSearch,
    selectedDeleteSubCategory,
    setSelectedDeleteSubCategory,
    selectedEditSubCategory,
    editForm,
    formErrors,
    isLoading,
    isFetching,
    isError,
    subcategories,
    meta,
    isDeleting,
    isUpdating,
    handleOpenDeleteModal,
    handleDeleteSubCategory,
    handleOpenEditModal,
    handleCloseEditModal,
    handleEditFormChange,
    handleUpdateSubCategory,
    handleSearchChange,
    clearSearch,
    handlePageChange,
  };
};

export default useSubCategoriesPageLogic;
