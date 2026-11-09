import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router";
import { notifySonner } from "./../../../lib/notifySonner";
import {
  useGetManufacturersQuery,
  useUpdateManufacturerMutation,
  useDeleteManufacturerMutation,
} from "../ManufacturersApiSlice";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";

const useManufacturersPageLogic = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const topRef = useRef(null);
  const initialSearch = searchParams.get("search") ?? "";
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(searchInput, 400);
  const normalizedSearch = debouncedSearch.trim();
  const hasSearch = Boolean(normalizedSearch);
  const [selectedDeleteManufacturer, setSelectedDeleteManufacturer] =
    useState(null);
  const [selectedEditManufacturer, setSelectedEditManufacturer] =
    useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    origin: "",
    logo_text: "",
    website: "",
    is_active: false,
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const { data, isLoading, isFetching, isError } = useGetManufacturersQuery({
    search: normalizedSearch,
    page,
  });
  const manufacturers = data?.manufacturers ?? [];
  const meta = data?.meta ?? null;
  const [deleteManufacturer, { isLoading: isDeleting }] =
    useDeleteManufacturerMutation();
  const [updateManufacturer, { isLoading: isUpdating }] =
    useUpdateManufacturerMutation();

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

  const handleOpenDeleteModal = (manufacturer) => {
    setSelectedDeleteManufacturer(manufacturer);
  };

  const handleDeleteManufacturer = async () => {
    if (!selectedDeleteManufacturer || isDeleting) return;
    try {
      await deleteManufacturer(selectedDeleteManufacturer.id).unwrap();
      setSelectedDeleteManufacturer(null);
      notifySonner("Manufacturer Deleted Successfully");
    } catch (error) {
      console.error("Failed to Delete Manufacturer:", error);
      notifySonner(
        error?.data?.message || "Failed to Delete Manufacturer",
        "error",
      );
    }
  };

  const handleOpenEditModal = (manufacturer) => {
    setSelectedEditManufacturer(manufacturer);
    setFormErrors({});
    setEditForm({
      name: (manufacturer.name ?? "").trim(),
      origin: (manufacturer.origin ?? "").trim(),
      logo_text: (manufacturer.logo_text ?? "").trim(),
      website: (manufacturer.website ?? "").trim(),
      is_active: Boolean(manufacturer.is_active),
      description: (manufacturer.description ?? "").trim(),
    });
  };

  const handleCloseEditModal = () => {
    if (isUpdating) {
      return;
    }
    setSelectedEditManufacturer(null);
    setFormErrors({});
    setEditForm({
      name: "",
      origin: "",
      logo_text: "",
      website: "",
      is_active: false,
      description: "",
    });
  };

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditForm((currentForm) => ({
      ...currentForm,
      [name]:
        name === "is_active"
          ? value === "true"
          : name === "origin"
            ? value.toUpperCase()
            : value,
    }));
    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [name]: undefined,
    }));
  };

  const handleUpdateManufacturer = async () => {
    if (!selectedEditManufacturer || isUpdating) {
      return;
    }
    const payload = {
      name: editForm.name.trim(),
      origin: editForm.origin.trim(),
      logo_text: editForm.logo_text.trim(),
      website: editForm.website.trim() || null,
      is_active: editForm.is_active,
      description: editForm.description.trim(),
    };

    // ==========================================
    // Validation
    // ==========================================

    const errors = {};
    if (!payload.name) {
      errors.name = "The Name Field is Required";
    }
    if (!payload.origin) {
      errors.origin = "The Origin Field is Required";
    }
    if (!payload.logo_text) {
      errors.logo_text = "The Logo Text Field is Required";
    }
    if (typeof payload.is_active !== "boolean") {
      errors.is_active = "The Active Field is Required";
    }
    if (!payload.description) {
      errors.description = "The Description Field is Required";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // ==========================================
    // Check Changes
    // ==========================================

    const hasChanges =
      payload.name !== (selectedEditManufacturer.name ?? "").trim() ||
      payload.origin !== (selectedEditManufacturer.origin ?? "").trim() ||
      payload.logo_text !== (selectedEditManufacturer.logo_text ?? "").trim() ||
      payload.website !== (selectedEditManufacturer.website?.trim() || null) ||
      payload.description !==
        (selectedEditManufacturer.description ?? "").trim() ||
      payload.is_active !== Boolean(selectedEditManufacturer.is_active);
    if (!hasChanges) {
      handleCloseEditModal();
      return;
    }

    // ==========================================
    // Update Manufacturer
    // ==========================================

    try {
      await updateManufacturer({
        id: selectedEditManufacturer.id,
        data: payload,
      }).unwrap();
      setSelectedEditManufacturer(null);
      setFormErrors({});
      setEditForm({
        name: "",
        origin: "",
        logo_text: "",
        website: "",
        is_active: false,
        description: "",
      });
      notifySonner("Manufacturer Updated Successfully");
    } catch (error) {
      console.error("Failed to Update Manufacturer:", error);
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
        error?.data?.message || "Failed to Update Manufacturer",
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
    selectedDeleteManufacturer,
    setSelectedDeleteManufacturer,
    selectedEditManufacturer,
    editForm,
    formErrors,
    isLoading,
    isFetching,
    isError,
    manufacturers,
    meta,
    isDeleting,
    isUpdating,
    handleOpenDeleteModal,
    handleDeleteManufacturer,
    handleOpenEditModal,
    handleCloseEditModal,
    handleEditFormChange,
    handleUpdateManufacturer,
    handleSearchChange,
    clearSearch,
    handlePageChange,
  };
};

export default useManufacturersPageLogic;
