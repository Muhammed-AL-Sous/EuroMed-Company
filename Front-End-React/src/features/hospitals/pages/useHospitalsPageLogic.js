import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router";
import {
  useDeleteHospitalMutation,
  useGetHospitalsQuery,
  useUpdateHospitalMutation,
} from "../HospitalsApiSlice";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { notifySonner } from "./../../../lib/notifySonner";

const useHospitalsPageLogic = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const topRef = useRef(null);
  const initialSearch = searchParams.get("search") ?? "";
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(searchInput, 400);
  const normalizedSearch = debouncedSearch.trim();
  const hasSearch = Boolean(normalizedSearch);
  const [selectedDeleteHospital, setSelectedDeleteHospital] = useState(null);
  const [selectedEditHospital, setSelectedEditHospital] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    type: "",
    city: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const { data, isLoading, isFetching, isError } = useGetHospitalsQuery({
    search: normalizedSearch,
    page,
  });
  const hospitals = data?.hospitals ?? [];
  const meta = data?.meta ?? null;
  const [deleteHospital, { isLoading: isDeleting }] =
    useDeleteHospitalMutation();
  const [updateHospital, { isLoading: isUpdating }] =
    useUpdateHospitalMutation();

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

  const handleOpenDeleteModal = (hospital) => {
    setSelectedDeleteHospital(hospital);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) {
      return;
    }
    setSelectedDeleteHospital(null);
  };

  const handleDeleteHospital = async () => {
    if (!selectedDeleteHospital) {
      return;
    }
    try {
      await deleteHospital(selectedDeleteHospital.id).unwrap();
      setSelectedDeleteHospital(null);
      notifySonner("Hospital Deleted Successfully");
    } catch (error) {
      console.error("Failed to Delete Hospital:", error);
      notifySonner(
        error?.data?.message || "Failed to Delete Hospital",
        "error",
      );
    }
  };

  const handleOpenEditModal = (hospital) => {
    setSelectedEditHospital(hospital);
    setFormErrors({});
    setEditForm({
      name: hospital.name ?? "",
      type: hospital.type || "Government",
      city: hospital.city ?? "",
    });
  };

  const handleCloseEditModal = () => {
    if (isUpdating) {
      return;
    }
    setSelectedEditHospital(null);
    setFormErrors({});
    setEditForm({
      name: "",
      type: "",
      city: "",
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

  const handleUpdateHospital = async () => {
    if (!selectedEditHospital) {
      return;
    }
    const payload = {
      name: editForm.name.trim(),
      type: editForm.type,
      city: editForm.city.trim(),
    };

    // Validation
    const errors = {};
    if (!payload.name) errors.name = "The Name Field is Required";
    if (!payload.type) errors.type = "The Type Field is Required";
    if (!payload.city) errors.city = "The City Field is Required";
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // No real changes
    const hasChanges =
      payload.name !== (selectedEditHospital.name ?? "") ||
      payload.type !== (selectedEditHospital.type ?? "") ||
      payload.city !== (selectedEditHospital.city ?? "");
    if (!hasChanges) {
      setSelectedEditHospital(null);
      setFormErrors({});
      setEditForm({
        name: "",
        type: "",
        city: "",
      });
      return;
    }

    // Update
    try {
      await updateHospital({
        id: selectedEditHospital.id,
        data: payload,
      }).unwrap();
      setSelectedEditHospital(null);
      setFormErrors({});
      setEditForm({
        name: "",
        type: "",
        city: "",
      });
      notifySonner("Hospital updated successfully");
    } catch (error) {
      console.error("Failed to update hospital:", error);
      notifySonner(
        error?.data?.message || "Failed to update hospital",
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
    selectedDeleteHospital,
    selectedEditHospital,
    editForm,
    formErrors,
    isLoading,
    isFetching,
    isError,
    hospitals,
    meta,
    isDeleting,
    isUpdating,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleDeleteHospital,
    handleOpenEditModal,
    handleCloseEditModal,
    handleEditFormChange,
    handleUpdateHospital,
    handleSearchChange,
    clearSearch,
    handlePageChange,
  };
};

export default useHospitalsPageLogic;
