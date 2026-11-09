import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router";
import { notifySonner } from "./../../../lib/notifySonner";
import {
  useDeletePatientMutation,
  useGetPatientsQuery,
  useUpdatePatientMutation,
} from "../PatientsApiSlice";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";

const usePatientsPageLogic = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const topRef = useRef(null);
  const initialSearch = searchParams.get("search") ?? "";
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(searchInput, 400);
  const normalizedSearch = debouncedSearch.trim();
  const hasSearch = Boolean(normalizedSearch);
  const [selectedDeletePatient, setSelectedDeletePatient] = useState(null);
  const [selectedEditPatient, setSelectedEditPatient] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    age: "",
    date_of_birth: "",
    gender: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const { data, isLoading, isFetching, isError } = useGetPatientsQuery({
    search: normalizedSearch,
    page,
  });

  const Patients = data?.patients ?? [];
  const meta = data?.meta ?? null;
  const [deletePatient, { isLoading: isDeleting }] = useDeletePatientMutation();
  const [updatePatient, { isLoading: isUpdating }] = useUpdatePatientMutation();

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

  const handleOpenDeleteModal = (Patient) => {
    setSelectedDeletePatient(Patient);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) {
      return;
    }
    setSelectedDeletePatient(null);
  };

  const handleDeletePatient = async () => {
    if (!selectedDeletePatient) {
      return;
    }
    try {
      await deletePatient(selectedDeletePatient.id).unwrap();
      setSelectedDeletePatient(null);
      notifySonner("Patient Deleted Successfully");
    } catch (error) {
      console.error("Failed to Delete Patient:", error);
      notifySonner(error?.data?.message || "Failed to Delete Patient", "error");
    }
  };

  const handleOpenEditModal = (Patient) => {
    setSelectedEditPatient(Patient);
    setFormErrors({});
    setEditForm({
      name: Patient.name ?? "",
      phone: Patient.phone ?? "",
      age: Patient.age ?? "",
      date_of_birth: Patient.date_of_birth ?? "",
      gender: Patient.gender ?? "",
    });
  };

  const handleCloseEditModal = () => {
    if (isUpdating) {
      return;
    }
    setSelectedEditPatient(null);
    setFormErrors({});
    setEditForm({
      name: "",
      phone: "",
      age: "",
      date_of_birth: "",
      gender: "",
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

  const handleUpdatePatient = async () => {
    if (!selectedEditPatient) {
      return;
    }
    const payload = {
      name: editForm.name.trim(),
      phone: String(editForm.phone ?? "").trim(),
      age: String(editForm.age ?? "").trim(),
      date_of_birth: editForm.date_of_birth,
      gender: editForm.gender,
    };

    // Validation
    const errors = {};
    if (!payload.name) errors.name = "The Name Field is Required";
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // No real changes
    const hasChanges =
      payload.name !== (selectedEditPatient.name ?? "") ||
      payload.phone !== String(selectedEditPatient.phone ?? "") ||
      payload.age !== String(selectedEditPatient.age ?? "") ||
      payload.date_of_birth !== (selectedEditPatient.date_of_birth ?? "") ||
      payload.gender !== (selectedEditPatient.gender ?? "");
    if (!hasChanges) {
      setSelectedEditPatient(null);
      setFormErrors({});
      setEditForm({
        name: "",
        phone: "",
        age: "",
        date_of_birth: "",
        gender: "",
      });
      return;
    }

    // Update
    try {
      await updatePatient({
        id: selectedEditPatient.id,
        data: payload,
      }).unwrap();
      setSelectedEditPatient(null);
      setFormErrors({});
      setEditForm({
        name: "",
        phone: "",
        age: "",
        date_of_birth: "",
        gender: "",
      });
      notifySonner("Patient updated successfully");
    } catch (error) {
      console.error("Failed to update Patient:", error);
      notifySonner(error?.data?.message || "Failed to update Patient", "error");
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
    selectedDeletePatient,
    selectedEditPatient,
    editForm,
    formErrors,
    isLoading,
    isFetching,
    isError,
    Patients,
    meta,
    isDeleting,
    isUpdating,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleDeletePatient,
    handleOpenEditModal,
    handleCloseEditModal,
    handleEditFormChange,
    handleUpdatePatient,
    handleSearchChange,
    clearSearch,
    handlePageChange,
  };
};

export default usePatientsPageLogic;
