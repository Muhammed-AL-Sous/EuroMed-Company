import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";

// UI & Icons
import { Card, Text } from "@radix-ui/themes";
import {
  Search,
  ShieldAlert,
  SquarePen,
  Trash2,
  X,
  Eye,
  EyeOff,
} from "lucide-react";

// Notifications
import { notifySonner } from "../../../lib/notifySonner";

// RTK Query
import {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "../UsersApiSlice";

// Hooks
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";

// Components
import UsersTable from "../components/common/UsersTable";
import Pagination from "../../../components/utility/Pagination";
import DeleteConfirmModal from "../../../components/utility/DeleteConfirmModal";
import EditModal from "../../../components/utility/EditModal";

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

// ==================================================
// Utilities
// ==================================================

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

const getInputClass = (error) => `
  w-full
  rounded-xl
  border
  bg-slate-50
  px-4
  py-2.5
  text-sm
  text-slate-900
  outline-none
  transition
  placeholder:text-slate-400
  disabled:cursor-not-allowed
  disabled:opacity-60
  dark:bg-slate-800
  dark:text-slate-100
  ${
    error
      ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
      : "border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 dark:border-slate-700"
  }
`;

// ==================================================
// Users Page
// ==================================================

const UsersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);

  // ========= Refs ========= //
  const passwordRef = useRef(null);
  const passwordConfirmationRef = useRef(null);

  // =============================
  // Toggle Password (Professional Fix)
  // =============================
  const togglePassword = useCallback((e) => {
    // منع سحب التركيز (يمنع اختفاء الكيبورد)
    e.preventDefault();

    const input = passwordRef.current;
    if (!input) return;

    // حفظ مكان المؤشر بدقة قبل التغيير
    const start = input.selectionStart;
    const end = input.selectionEnd;

    setShowPassword((prev) => !prev);

    // إعادة التركيز والمؤشر فوراً (بدون setTimeout إذا استخدمت onMouseDown)
    requestAnimationFrame(() => {
      input.setSelectionRange(start, end);
      input.focus();
    });
  }, []);

  // =============================
  // Toggle Password Confirmation (Professional Fix)
  // =============================
  const togglePasswordConfirmation = useCallback((e) => {
    // منع سحب التركيز (يمنع اختفاء الكيبورد)
    e.preventDefault();

    const input = passwordConfirmationRef.current;
    if (!input) return;

    // حفظ مكان المؤشر بدقة قبل التغيير
    const start = input.selectionStart;
    const end = input.selectionEnd;

    setShowPasswordConfirmation((prev) => !prev);

    // إعادة التركيز والمؤشر فوراً (بدون setTimeout إذا استخدمت onMouseDown)
    requestAnimationFrame(() => {
      input.setSelectionRange(start, end);
      input.focus();
    });
  }, []);

  // ==================================================
  // Search State
  // ==================================================

  const [searchInput, setSearchInput] = useState(
    () => searchParams.get("search") ?? "",
  );

  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(searchInput, 400);

  const normalizedSearch = debouncedSearch.trim();

  const hasSearch = Boolean(normalizedSearch);

  // ==================================================
  // Delete State
  // ==================================================

  const [selectedDeleteUser, setSelectedDeleteUser] = useState(null);

  // ==================================================
  // Edit State
  // ==================================================

  const [selectedEditUser, setSelectedEditUser] = useState(null);

  const [editForm, setEditForm] = useState(createEmptyEditForm);

  const [formErrors, setFormErrors] = useState({});

  // ==================================================
  // Users Query
  // ==================================================

  const { data, isLoading, isFetching, isError } = useGetUsersQuery({
    search: normalizedSearch,
    page,
  });

  const users = Array.isArray(data?.users) ? data.users : [];

  const meta = data?.meta ?? null;

  // ==================================================
  // Mutations
  // ==================================================

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  // ==================================================
  // Sync Search With URL
  // ==================================================

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
      { replace: true },
    );
  }, [normalizedSearch, searchParams, setSearchParams]);

  // ==================================================
  // Search Handlers
  // ==================================================

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
    setPage(1);
  };

  const clearSearch = () => {
    setSearchInput("");
    setPage(1);
  };

  // ==================================================
  // Pagination Handler
  // ==================================================

  const handlePageChange = (newPage) => {
    setPage(newPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==================================================
  // Delete Handlers
  // ==================================================

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

  // ==================================================
  // Edit Handlers
  // ==================================================

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

  // ==================================================
  // Edit Form Change
  // ==================================================

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
      const nextErrors = { ...currentErrors };

      delete nextErrors[name];

      return nextErrors;
    });
  };

  // ==================================================
  // Update User
  // ==================================================

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

  // ==================================================
  // Render
  // ==================================================

  return (
    <Card variant="ghost">
      {/* ==================================================
          Header
      ================================================== */}

      <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
        <Text as="div" size="6" weight="bold" className="text-sky-900">
          All Users
        </Text>

        {/* Search */}

        <div className="relative w-full md:max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Search for a user by name..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-11 pr-10 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />

          {searchInput && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-400 transition hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* ==================================================
          Active Search
      ================================================== */}

      {hasSearch && (
        <div className="flex items-center justify-between gap-4 border-t border-slate-100 px-4 py-3 text-xs">
          <span className="font-medium text-slate-500">
            Searching for:{" "}
            <span className="font-semibold text-slate-700">
              "{normalizedSearch}"
            </span>
          </span>

          <button
            type="button"
            onClick={clearSearch}
            className="flex cursor-pointer items-center gap-1 font-bold text-red-600 transition hover:text-red-700"
          >
            <X className="h-4 w-4" />
            Reset
          </button>
        </div>
      )}

      {/* ==================================================
          Content
      ================================================== */}

      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState />
      ) : users.length === 0 ? (
        <EmptyState hasSearch={hasSearch} onReset={clearSearch} />
      ) : (
        <>
          <UsersTable
            users={users}
            onDelete={handleOpenDeleteModal}
            onEdit={handleOpenEditModal}
          />

          <Pagination
            meta={meta}
            onPageChange={handlePageChange}
            disabled={isFetching}
          />
        </>
      )}

      {/* ==================================================
          Delete Modal
      ================================================== */}

      <DeleteConfirmModal
        isOpen={Boolean(selectedDeleteUser)}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteUser}
        isLoading={isDeleting}
        title="Delete User"
        message="Are you sure you want to delete this user?"
        itemLabel={selectedDeleteUser?.name}
        confirmText="Delete"
        cancelText="Cancel"
        icon={Trash2}
      />

      {/* ==================================================
          Edit Modal
      ================================================== */}

      <EditModal
        isOpen={Boolean(selectedEditUser)}
        onClose={handleCloseEditModal}
        onSubmit={handleUpdateUser}
        isLoading={isUpdating}
        title="Edit User"
        itemLabel={selectedEditUser?.name}
        submitText="Save Changes"
        cancelText="Cancel"
        icon={SquarePen}
      >
        <div className="space-y-5">
          {/* User Name */}

          <EditField
            id="user-name"
            label="User Name"
            name="name"
            value={editForm.name}
            onChange={handleEditFormChange}
            disabled={isUpdating}
            error={formErrors.name}
            placeholder="Enter user name"
            autoComplete="name"
          />

          {/* Email */}

          <EditField
            id="user-email"
            label="Email Address"
            name="email"
            type="email"
            value={editForm.email}
            onChange={handleEditFormChange}
            disabled={isUpdating}
            error={formErrors.email}
            placeholder="Enter email address"
            autoComplete="email"
          />

          {/* ==================================================
            User Role - Read Only
          ================================================== */}

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              User Role
            </label>

            <div className="w-full rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {editForm.role === "doctor"
                ? "Doctor"
                : editForm.role === "admin"
                  ? "Admin"
                  : editForm.role === "staff"
                    ? "Staff"
                    : "No Role Assigned"}
            </div>
          </div>

          {/* ==================================================
    Doctor Profile
================================================== */}

          {editForm.role === "doctor" && (
            <div className="rounded-xl border border-sky-100 bg-sky-50/50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
              <h3 className="mb-4 text-sm font-bold text-sky-900 dark:text-sky-300">
                Doctor Profile Information
              </h3>

              <EditField
                id="doctor-name"
                label="Doctor Name"
                name="doctor.name"
                type="text"
                value={editForm.doctor.name}
                onChange={handleEditFormChange}
                disabled={isUpdating}
                error={formErrors["doctor.name"]}
                placeholder="Enter doctor name"
              />

              {!selectedEditUser?.doctor_profile?.has_profile && (
                <p className="mt-2 text-xs text-slate-500">
                  The doctor has not completed their profile yet.
                </p>
              )}
            </div>
          )}

          {/* New Password */}

          <div className="relative">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              New Password
            </label>
            <div className="relative">
              <input
                ref={passwordRef}
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                inputMode="text"
                style={{
                  letterSpacing:
                    !showPassword && editForm.password.length > 0
                      ? "0.2em"
                      : "normal",
                }}
                value={editForm.password}
                onChange={handleEditFormChange}
                placeholder="••••••••"
                className={`w-full outline-none rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200
        ${
          formErrors.password
            ? "border-red-500 focus:border-red-500"
            : "border-slate-200 focus:border-sky-500"
        }`}
              />
              {/* ======= Errors password ======= */}
              {formErrors.password && (
                <div className="absolute left-0 right-0 top-[calc(100%+6px)] w-full">
                  <p className="text-red-500 text-xs font-semibold px-1">
                    {formErrors.password}
                  </p>
                </div>
              )}
              <button
                type="button"
                onMouseDown={togglePassword}
                className="absolute top-1/2 -translate-y-1/2 right-4 outline-none"
                style={{
                  cursor: "pointer",
                  zIndex: 10,
                  color: "#6c757d",
                  fontSize: "18px",
                }}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}

          <div className="relative">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                ref={passwordConfirmationRef}
                name="password_confirmation"
                type={showPasswordConfirmation ? "text" : "password"}
                autoComplete="password_confirmation"
                inputMode="text"
                style={{
                  letterSpacing:
                    !showPasswordConfirmation &&
                    editForm.password_confirmation.length > 0
                      ? "0.2em"
                      : "normal",
                }}
                value={editForm.password_confirmation}
                onChange={handleEditFormChange}
                placeholder="••••••••"
                className={`w-full outline-none rounded-xl border border-slate-200 bg-slate-100 px-4 py-2.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200
        ${
          formErrors.password_confirmation
            ? "border-red-500 focus:border-red-500"
            : "border-slate-200 focus:border-sky-500"
        }`}
              />
              {/* ======= Errors password Confirmation ======= */}
              {formErrors.password_confirmation && (
                <div className="absolute left-0 right-0 top-[calc(100%+6px)] w-full">
                  <p className="text-red-500 text-xs font-semibold px-1">
                    {formErrors.password_confirmation}
                  </p>
                </div>
              )}
              <button
                type="button"
                onMouseDown={togglePasswordConfirmation}
                className="absolute top-1/2 -translate-y-1/2 right-4 outline-none"
                style={{
                  cursor: "pointer",
                  zIndex: 10,
                  color: "#6c757d",
                  fontSize: "18px",
                }}
              >
                {showPasswordConfirmation ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>
        </div>
      </EditModal>
    </Card>
  );
};

// ==================================================
// Shared Edit Field
// ==================================================

const EditField = ({
  id,
  label,
  name,
  type = "text",
  value,
  onChange,
  disabled = false,
  error,
  placeholder,
  autoComplete,
}) => {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="text-sm font-semibold text-slate-700 dark:text-slate-200"
      >
        {label}
      </label>

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={getInputClass(error)}
      />

      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs font-medium text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
};

// ==================================================
// Loading State
// ==================================================

const LoadingState = ({ message = "Loading Users..." }) => {
  return (
    <div className="flex min-h-10 flex-col items-center justify-center py-20">
      <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-sky-600 border-t-transparent" />

      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
};

// ==================================================
// Empty State
// ==================================================

const EmptyState = ({ hasSearch, onReset }) => {
  return (
    <div className="mx-4 rounded-2xl border border-slate-200 bg-transparent p-12 text-center">
      <ShieldAlert className="mx-auto h-12 w-12 text-slate-400" />

      <h3 className="mt-3 text-lg font-bold text-slate-800">No Users Found</h3>

      <p className="mt-2 text-sm text-slate-500">
        {hasSearch
          ? "No users match your search criteria."
          : "There are no users available."}
      </p>

      {hasSearch && (
        <button
          type="button"
          onClick={onReset}
          className="mt-5 cursor-pointer rounded-xl bg-sky-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-700"
        >
          Reset Search
        </button>
      )}
    </div>
  );
};

// ==================================================
// Error State
// ==================================================

const ErrorState = () => {
  return (
    <div className="mx-4 rounded-2xl border border-red-200 bg-red-50 p-12 text-center">
      <ShieldAlert className="mx-auto h-12 w-12 text-red-400" />

      <h3 className="mt-3 text-lg font-bold text-red-800">
        Something went wrong
      </h3>

      <p className="mt-2 text-sm text-red-600">
        Failed to load users. Please try again later.
      </p>
    </div>
  );
};

// ==================================================
// Export
// ==================================================

export default UsersPage;
