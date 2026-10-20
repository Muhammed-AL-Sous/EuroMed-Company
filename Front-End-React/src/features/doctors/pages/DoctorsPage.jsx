// React & React Router
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

// External Library
import { Search, ShieldAlert, SquarePen, Trash2, X } from "lucide-react";
import { Card, Text } from "@radix-ui/themes";
import { notifySonner } from "./../../../lib/notifySonner";

// Api Slice
import {
  useGetDoctorsQuery,
  useDeleteDoctorMutation,
  useUpdateDoctorMutation,
} from "../DoctorsApiSlice";

// Components
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";

// Utilities
import DoctorsTable from "./../components/common/DoctorsTable";
import Pagination from "../../../components/utility/Pagination";
import DeleteConfirmModal from "../../../components/utility/DeleteConfirmModal";
import EditModal from "../../../components/utility/EditModal";

const DoctorsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // ==================================================
  // Search State
  // ==================================================

  const initialSearch = searchParams.get("search") ?? "";

  const [searchInput, setSearchInput] = useState(initialSearch);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(searchInput, 400);
  const normalizedSearch = debouncedSearch.trim();

  const hasSearch = Boolean(normalizedSearch);

  // ==================================================
  // Delete State
  // ==================================================

  const [selectedDeleteDoctor, setSelectedDeleteDoctor] = useState(null);

  // ==================================================
  // Edit State
  // ==================================================

  const [selectedEditDoctor, setSelectedEditDoctor] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // ==================================================
  // Doctors Query
  // ==================================================

  const { data, isLoading, isFetching, isError } = useGetDoctorsQuery({
    search: normalizedSearch,
    page,
  });

  const Doctors = data?.doctors ?? [];
  const meta = data?.meta ?? null;

  // ==================================================
  // Delete Mutation
  // ==================================================

  const [deleteDoctor, { isLoading: isDeleting }] = useDeleteDoctorMutation();

  // ==================================================
  // Update Mutation
  // ==================================================

  const [updateDoctor, { isLoading: isUpdating }] = useUpdateDoctorMutation();

  // ==================================================
  // Sync Search With URL
  // ==================================================

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
      { replace: true },
    );
  }, [normalizedSearch, searchParams, setSearchParams]);

  // ==================================================
  // Delete Handlers
  // ==================================================

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

  // ==================================================
  // Edit Handlers
  // ==================================================

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
      setEditForm({ name: "" });
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
      setEditForm({ name: "" });

      notifySonner("Doctor updated successfully");
    } catch (error) {
      console.error("Failed to update Doctor:", error);

      notifySonner(error?.data?.message || "Failed to update Doctor", "error");
    }
  };

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

    setSearchParams(
      (params) => {
        params.delete("search");
        return params;
      },
      { replace: true },
    );
  };

  // ==================================================
  // Pagination
  // ==================================================

  const handlePageChange = (newPage) => {
    setPage(newPage);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==================================================
  // Render
  // ==================================================

  return (
    <Card variant="ghost">
      {/* ==================================================
          Header
      ================================================== */}

      <div
        className="
          flex
          flex-col
          gap-4
          p-4
          md:flex-row
          md:items-center
          md:justify-between
        "
      >
        <Text as="div" size="6" weight="bold" className="text-sky-900">
          All Doctors
        </Text>

        {/* ==================================================
            Search
        ================================================== */}

        <div className="relative w-full md:max-w-md">
          <Search
            className="
              pointer-events-none
              absolute
              left-3.5
              top-1/2
              h-5
              w-5
              -translate-y-1/2
              text-slate-400
            "
          />

          <input
            type="text"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Search for a Doctor by name..."
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              py-2.5
              pl-11
              pr-10
              text-sm
              text-slate-900
              outline-none
              transition
              focus:border-sky-500
              focus:ring-1
              focus:ring-sky-500
            "
          />

          {searchInput && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              className="
                absolute
                right-3
                top-1/2
                -translate-y-1/2
                cursor-pointer
                text-slate-400
                transition
                hover:text-red-500
              "
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
        <div
          className="
            flex
            items-center
            justify-between
            gap-4
            border-t
            border-slate-100
            px-4
            py-3
            text-xs
          "
        >
          <span className="font-medium text-slate-500">
            Searching for :{" "}
            <span className="font-semibold text-slate-700">
              "{normalizedSearch}"
            </span>
          </span>

          <button
            type="button"
            onClick={clearSearch}
            className="
              flex
              cursor-pointer
              items-center
              gap-1
              font-bold
              text-red-600
              transition
              hover:text-red-700
            "
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
      ) : Doctors.length === 0 ? (
        <EmptyState hasSearch={hasSearch} onReset={clearSearch} />
      ) : (
        <>
          <DoctorsTable
            Doctors={Doctors}
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
          Delete Confirmation Modal
      ================================================== */}

      <DeleteConfirmModal
        isOpen={Boolean(selectedDeleteDoctor)}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteDoctor}
        isLoading={isDeleting}
        title="Delete Doctor"
        message="Are you sure you want to delete this Doctor ?"
        itemLabel={selectedDeleteDoctor?.name}
        confirmText="Delete"
        cancelText="Cancel"
        icon={Trash2}
      />

      {/* ==================================================
          Edit Modal
      ================================================== */}

      <EditModal
        isOpen={Boolean(selectedEditDoctor)}
        onClose={handleCloseEditModal}
        onSubmit={handleUpdateDoctor}
        isLoading={isUpdating}
        title="Edit Doctor"
        itemLabel={selectedEditDoctor?.name}
        submitText="Save Changes"
        cancelText="Cancel"
        icon={SquarePen}
      >
        {/* ==================================================
            Doctor Name
        ================================================== */}

        <div className="space-y-1.5">
          <label
            htmlFor="Doctor-name"
            className="
              text-sm
              font-semibold
              text-slate-700
              dark:text-slate-200
            "
          >
            Doctor Name
          </label>

          <input
            id="Doctor-name"
            name="name"
            type="text"
            value={editForm.name}
            onChange={handleEditFormChange}
            disabled={isUpdating}
            placeholder="Enter Doctor name"
            aria-invalid={Boolean(formErrors.name)}
            aria-describedby={formErrors.name ? "Doctor-name-error" : undefined}
            className={`
      w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-900
      outline-none transition placeholder:text-slate-400
      disabled:cursor-not-allowed disabled:opacity-60
      dark:bg-slate-800 dark:text-slate-100
      ${
        formErrors.name
          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
          : "border-slate-200 focus:border-[#0084d1] focus:ring-1 focus:ring-[#0084d1] dark:border-slate-700"
      }
    `}
          />

          {formErrors.name && (
            <p
              id="Doctor-name-error"
              role="alert"
              className="text-xs font-medium text-red-600"
            >
              {formErrors.name}
            </p>
          )}
        </div>
      </EditModal>
    </Card>
  );
};

// ==================================================
// Loading State
// ==================================================

const LoadingState = ({ message = "Loading Doctors..." }) => {
  return (
    <div
      className="
        flex
        min-h-75
        flex-col
        items-center
        justify-center
        py-20
      "
    >
      <div
        className="
          mb-4
          h-10
          w-10
          animate-spin
          rounded-full
          border-4
          border-sky-600
          border-t-transparent
        "
      />

      <p className="text-sm font-medium text-slate-500">{message}</p>
    </div>
  );
};

// ==================================================
// Empty State
// ==================================================

const EmptyState = ({ hasSearch, onReset }) => {
  return (
    <div
      className="
        mx-4
        rounded-2xl
        border
        border-slate-200
        bg-transparent
        p-12
        text-center
      "
    >
      <ShieldAlert
        className="
          mx-auto
          h-12
          w-12
          text-slate-400
        "
      />

      <h3 className="mt-3 text-lg font-bold text-slate-800">
        No Doctors Found
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        {hasSearch
          ? "No Doctors match your search criteria."
          : "There are no Doctors available."}
      </p>

      {hasSearch && (
        <button
          type="button"
          onClick={onReset}
          className="
            mt-5
            cursor-pointer
            rounded-xl
            bg-sky-600
            px-4
            py-2
            text-sm
            font-bold
            text-white
            transition
            hover:bg-sky-700
          "
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
    <div
      className="
        mx-4
        rounded-2xl
        border
        border-red-200
        bg-red-50
        p-12
        text-center
      "
    >
      <ShieldAlert
        className="
          mx-auto
          h-12
          w-12
          text-red-400
        "
      />

      <h3 className="mt-3 text-lg font-bold text-red-800">
        Something went wrong
      </h3>

      <p className="mt-2 text-sm text-red-600">
        Failed to load Doctors. Please try again later.
      </p>
    </div>
  );
};

export default DoctorsPage;
