import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { notifySonner } from "../../../lib/notifySonner";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../UsersApiSlice";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";

const useUsersPageLogic = () => {
  const createEmptyEditForm = () => ({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "",
    doctor: {
      name: "",
    },
  });

  const getUserRole = (user) => {
    return user?.role?.role_name ?? "";
  };

  const getDoctorName = (user) => {
    const doctorName = user?.doctor_profile?.profile?.name;
    return typeof doctorName === "string" ? doctorName : "";
  };

  const normalizeLaravelErrors = (errors = {}) => {
    return Object.fromEntries(
      Object.entries(errors).map(([field, messages]) => [
        field,
        Array.isArray(messages) ? messages[0] : String(messages),
      ]),
    );
  };

  const [searchParams, setSearchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const topRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordConfirmationRef = useRef(null);

  const togglePassword = useCallback((e) => {
    e.preventDefault();
    const input = passwordRef.current;
    if (!input) return;

    const start = input.selectionStart;
    const end = input.selectionEnd;
    setShowPassword((prev) => !prev);

    requestAnimationFrame(() => {
      input.setSelectionRange(start, end);
      input.focus();
    });
  }, []);

  const togglePasswordConfirmation = useCallback((e) => {
    e.preventDefault();
    const input = passwordConfirmationRef.current;
    if (!input) return;

    const start = input.selectionStart;
    const end = input.selectionEnd;
    setShowPasswordConfirmation((prev) => !prev);

    requestAnimationFrame(() => {
      input.setSelectionRange(start, end);
      input.focus();
    });
  }, []);

  const [searchInput, setSearchInput] = useState(
    () => searchParams.get("search") ?? "",
  );

  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(searchInput, 400);
  const normalizedSearch = debouncedSearch.trim();
  const hasSearch = Boolean(normalizedSearch);
  const [selectedDeleteUser, setSelectedDeleteUser] = useState(null);
  const [selectedEditUser, setSelectedEditUser] = useState(null);
  const [editForm, setEditForm] = useState(createEmptyEditForm);
  const [formErrors, setFormErrors] = useState({});

  const { data, isLoading, isFetching, isError } = useGetUsersQuery({
    search: normalizedSearch,
    page,
  });

  const users = Array.isArray(data?.users) ? data.users : [];
  const meta = data?.meta ?? null;
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  useEffect(() => {
    const currentSearch = searchParams.get("search") ?? "";
    if (currentSearch === normalizedSearch) {
      return;
    }
    setSearchParams(
      (previousParams) => {
        const nextParams = new URLSearchParams(previousParams);
        if (normalizedSearch) {
          nextParams.set("search", normalizedSearch);
        } else {
          nextParams.delete("search");
        }
        return nextParams;
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

  const handleOpenDeleteModal = (user) => {
    setSelectedDeleteUser(user);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) return;
    setSelectedDeleteUser(null);
  };

  const handleDeleteUser = async () => {
    if (!selectedDeleteUser || isDeleting) return;
    try {
      await deleteUser(selectedDeleteUser.id).unwrap();
      setSelectedDeleteUser(null);
      notifySonner("User Deleted Successfully");
    } catch (error) {
      console.error("Failed to Delete User:", error);
      notifySonner(error?.data?.message || "Failed to Delete User", "error");
    }
  };

  const resetEditModal = () => {
    setSelectedEditUser(null);
    setEditForm(createEmptyEditForm());
    setFormErrors({});
  };

  const handleOpenEditModal = (user) => {
    const userRole = getUserRole(user);
    setSelectedEditUser(user);
    setFormErrors({});
    setEditForm({
      name: user.name ?? "",
      email: user.email ?? "",
      password: "",
      password_confirmation: "",
      role: userRole,
      doctor: {
        name: userRole === "doctor" ? getDoctorName(user) : "",
      },
    });
  };

  const handleCloseEditModal = () => {
    if (isUpdating) return;
    resetEditModal();
  };

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditForm((currentForm) => {
      // Nested Doctor Field
      if (name === "doctor.name") {
        return {
          ...currentForm,
          doctor: {
            ...currentForm.doctor,
            name: value,
          },
        };
      }

      // Normal User Fields
      return {
        ...currentForm,
        [name]: value,
      };
    });

    // Clear field validation error
    setFormErrors((currentErrors) => {
      const nextErrors = {
        ...currentErrors,
      };
      delete nextErrors[name];
      return nextErrors;
    });
  };

  const handleUpdateUser = async () => {
    if (!selectedEditUser || isUpdating) return;

    // ----------------------------------------------
    // Normalize Input
    // ----------------------------------------------

    const name = editForm.name.trim();
    const email = editForm.email.trim();
    const role = editForm.role;
    const password = editForm.password;
    const passwordConfirmation = editForm.password_confirmation;
    const doctorName = editForm.doctor.name.trim();

    // ----------------------------------------------
    // Validation
    // ----------------------------------------------

    const errors = {};
    if (!name) {
      errors.name = "The Name Field is Required";
    }
    if (!email) {
      errors.email = "The Email Field is Required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!role) {
      errors.role = "The User Role Field is Required";
    }

    // Password is optional
    if (password || passwordConfirmation) {
      if (!password) {
        errors.password = "The Password Field is Required";
      } else if (password !== passwordConfirmation) {
        errors.password_confirmation =
          "The Password Confirmation does not match";
      }
    }

    // Doctor name is required only for an existing profile
    const hasDoctorProfile =
      selectedEditUser.doctor_profile?.has_profile === true;
    if (role === "doctor" && hasDoctorProfile && !doctorName) {
      errors["doctor.name"] = "The Doctor Name Field is Required";
    }
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // ----------------------------------------------
    // Original Values
    // ----------------------------------------------

    const originalName = selectedEditUser.name ?? "";
    const originalEmail = selectedEditUser.email ?? "";
    const originalDoctorName = getDoctorName(selectedEditUser);

    // ----------------------------------------------
    // Detect Changes
    // ----------------------------------------------

    const nameChanged = name !== originalName;
    const emailChanged = email !== originalEmail;
    const passwordChanged = Boolean(password);
    const doctorNameChanged =
      role === "doctor" && doctorName !== originalDoctorName;
    const hasChanges =
      nameChanged || emailChanged || passwordChanged || doctorNameChanged;
    if (!hasChanges) {
      resetEditModal();
      return;
    }

    // ----------------------------------------------
    // Build Payload
    // ----------------------------------------------

    const payload = {};
    if (nameChanged) {
      payload.name = name;
    }
    if (emailChanged) {
      payload.email = email;
    }

    // Send password only if provided
    if (passwordChanged) {
      payload.password = password;
      payload.password_confirmation = passwordConfirmation;
    }

    // Send Doctor Profile only when needed
    if (doctorNameChanged && doctorName) {
      payload.doctor = {
        name: doctorName,
      };
    }

    // ----------------------------------------------
    // Update Request
    // ----------------------------------------------

    try {
      await updateUser({
        id: selectedEditUser.id,
        data: payload,
      }).unwrap();
      resetEditModal();
      notifySonner("User Updated Successfully");
    } catch (error) {
      console.error("Failed to Update User:", error);

      // Laravel Validation Errors
      if (error?.status === 422 && error?.data?.errors) {
        setFormErrors(normalizeLaravelErrors(error.data.errors));
      }
      notifySonner(error?.data?.message || "Failed to Update User", "error");
    }
  };

  return {
    showPassword,
    showPasswordConfirmation,
    topRef,
    passwordRef,
    passwordConfirmationRef,
    togglePassword,
    togglePasswordConfirmation,
    searchInput,
    normalizedSearch,
    hasSearch,
    selectedDeleteUser,
    selectedEditUser,
    editForm,
    formErrors,
    isLoading,
    isFetching,
    isError,
    users,
    meta,
    isDeleting,
    isUpdating,
    handleSearchChange,
    clearSearch,
    handlePageChange,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleDeleteUser,
    handleOpenEditModal,
    handleCloseEditModal,
    handleEditFormChange,
    handleUpdateUser,
  };
};

export default useUsersPageLogic;
