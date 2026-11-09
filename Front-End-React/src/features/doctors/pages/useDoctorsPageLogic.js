import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router";
import { notifySonner } from "./../../../lib/notifySonner";
import {
  useGetDoctorsQuery,
  useDeleteDoctorMutation,
  useUpdateDoctorMutation,
} from "../DoctorsApiSlice";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";

const useDoctorsPageLogic = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const topRef = useRef(null);
  const initialSearch = searchParams.get("search") ?? "";
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(searchInput, 400);
  const normalizedSearch = debouncedSearch.trim();
  const hasSearch = Boolean(normalizedSearch);
  const [selectedDeleteDoctor, setSelectedDeleteDoctor] = useState(null);
  const [selectedEditDoctor, setSelectedEditDoctor] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const { data, isLoading, isFetching, isError } = useGetDoctorsQuery({
    search: normalizedSearch,
    page,
  });
  const Doctors = data?.doctors ?? [];
  const meta = data?.meta ?? null;
  const [deleteDoctor, { isLoading: isDeleting }] = useDeleteDoctorMutation();
  const [updateDoctor, { isLoading: isUpdating }] = useUpdateDoctorMutation();

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

  const handleOpenDeleteModal = (Doctor) => {
    setSelectedDeleteDoctor(Doctor);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) {
      return;
    }
    setSelectedDeleteDoctor(null);
  };

  const handleDeleteDoctor = async () => {
    if (!selectedDeleteDoctor) {
      return;
    }
    try {
      await deleteDoctor(selectedDeleteDoctor.id).unwrap();
      setSelectedDeleteDoctor(null);
      notifySonner("Doctor Deleted Successfully");
    } catch (error) {
      console.error("Failed to Delete Doctor:", error);
      notifySonner(error?.data?.message || "Failed to Delete Doctor", "error");
    }
  };

  const handleOpenEditModal = (Doctor) => {
    setSelectedEditDoctor(Doctor);
    setFormErrors({});
    setEditForm({
      name: Doctor.name ?? "",
    });
  };

  const handleCloseEditModal = () => {
    if (isUpdating) {
      return;
    }
    setSelectedEditDoctor(null);
    setFormErrors({});
    setEditForm({
      name: "",
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

  const handleUpdateDoctor = async () => {
    if (!selectedEditDoctor) {
      return;
    }
    const payload = {
      name: editForm.name.trim(),
    };

    // Validation
    const errors = {};
    if (!payload.name) errors.name = "The Name Field is Required";
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // No real changes
    const hasChanges = payload.name !== (selectedEditDoctor.name ?? "");
    if (!hasChanges) {
      setSelectedEditDoctor(null);
      setFormErrors({});
      setEditForm({
        name: "",
      });
      return;
    }

    // Update
    try {
      await updateDoctor({
        id: selectedEditDoctor.id,
        data: payload,
      }).unwrap();
      setSelectedEditDoctor(null);
      setFormErrors({});
      setEditForm({
        name: "",
      });
      notifySonner("Doctor updated successfully");
    } catch (error) {
      console.error("Failed to update Doctor:", error);
      notifySonner(error?.data?.message || "Failed to update Doctor", "error");
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
    selectedDeleteDoctor,
    selectedEditDoctor,
    editForm,
    formErrors,
    isLoading,
    isFetching,
    isError,
    Doctors,
    meta,
    isDeleting,
    isUpdating,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleDeleteDoctor,
    handleOpenEditModal,
    handleCloseEditModal,
    handleEditFormChange,
    handleUpdateDoctor,
    handleSearchChange,
    clearSearch,
    handlePageChange,
  };
};

export default useDoctorsPageLogic;
