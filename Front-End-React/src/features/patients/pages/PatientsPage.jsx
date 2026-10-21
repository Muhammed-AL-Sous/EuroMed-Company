// React & React Router
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

// External Library
import { Search, ShieldAlert, SquarePen, Trash2, X } from "lucide-react";
import { Card, Text } from "@radix-ui/themes";
import { notifySonner } from "./../../../lib/notifySonner";

// Api Slice
import {
  useDeletePatientMutation,
  useGetPatientsQuery,
  useUpdatePatientMutation,
} from "../PatientsApiSlice";

// Utilities Components
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import PatientsTable from "../components/common/PatientsTable";
import Pagination from "../../../components/utility/Pagination";
import DeleteConfirmModal from "../../../components/utility/DeleteConfirmModal";
import EditModal from "../../../components/utility/EditModal";

const PatientsPage = () => {
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

  const [selectedDeletePatient, setSelectedDeletePatient] = useState(null);

  // ==================================================
  // Edit State
  // ==================================================

  const [selectedEditPatient, setSelectedEditPatient] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    age: "",
    date_of_birth: "",
    gender: "",
  });

  const [formErrors, setFormErrors] = useState({});

  // ==================================================
  // Patients Query
  // ==================================================

  const { data, isLoading, isFetching, isError } = useGetPatientsQuery({
    search: normalizedSearch,
    page,
  });

  const Patients = data?.patients ?? [];
  const meta = data?.meta ?? null;

  // ==================================================
  // Delete Mutation
  // ==================================================

  const [deletePatient, { isLoading: isDeleting }] = useDeletePatientMutation();

  // ==================================================
  // Update Mutation
  // ==================================================

  const [updatePatient, { isLoading: isUpdating }] = useUpdatePatientMutation();

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

  // ==================================================
  // Edit Handlers
  // ==================================================

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
          All Patients
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
            placeholder="Search for a Patient by name..."
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
            Searching for:{" "}
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
      ) : Patients.length === 0 ? (
        <EmptyState hasSearch={hasSearch} onReset={clearSearch} />
      ) : (
        <>
          <PatientsTable
            Patients={Patients}
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
        isOpen={Boolean(selectedDeletePatient)}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeletePatient}
        isLoading={isDeleting}
        title="Delete Patient"
        message="Are you sure you want to delete this Patient ?"
        itemLabel={selectedDeletePatient?.name}
        confirmText="Delete"
        cancelText="Cancel"
        icon={Trash2}
      />

      {/* ==================================================
          Edit Modal
      ================================================== */}

      <EditModal
        isOpen={Boolean(selectedEditPatient)}
        onClose={handleCloseEditModal}
        onSubmit={handleUpdatePatient}
        isLoading={isUpdating}
        title="Edit Patient"
        itemLabel={selectedEditPatient?.name}
        submitText="Save Changes"
        cancelText="Cancel"
        icon={SquarePen}
      >
        {/* ==================================================
            Patient Name
        ================================================== */}

        <div className="space-y-1.5">
          <label
            htmlFor="Patient-name"
            className="
              text-sm
              font-semibold
              text-slate-700
              dark:text-slate-200
            "
          >
            Patient's Name
          </label>

          <input
            id="Patient-name"
            name="name"
            type="text"
            value={editForm.name}
            onChange={handleEditFormChange}
            disabled={isUpdating}
            placeholder="Enter Patient name"
            aria-invalid={Boolean(formErrors.name)}
            aria-describedby={
              formErrors.name ? "Patient-name-error" : undefined
            }
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
              id="Patient-name-error"
              role="alert"
              className="text-xs font-medium text-red-600"
            >
              {formErrors.name}
            </p>
          )}
        </div>

        {/* ==================================================
            Patient phone
        ================================================== */}
        <div className="mt-3 space-y-1.5">
          <label
            htmlFor="Patient-phone"
            className="
              text-sm
              font-semibold
              text-slate-700
              dark:text-slate-200
            "
          >
            Patient's Phone
          </label>
          <input
            id="Patient-phone"
            name="phone"
            type="text"
            value={editForm.phone}
            onChange={handleEditFormChange}
            disabled={isUpdating}
            placeholder="Enter Patient phone"
            aria-invalid={Boolean(formErrors.phone)}
            aria-describedby={
              formErrors.phone ? "Patient-phone-error" : undefined
            }
            className={`
      w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-900
      outline-none transition placeholder:text-slate-400
      disabled:cursor-not-allowed disabled:opacity-60
      dark:bg-slate-800 dark:text-slate-100
      ${
        formErrors.phone
          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
          : "border-slate-200 focus:border-[#0084d1] focus:ring-1 focus:ring-[#0084d1] dark:border-slate-700"
      }
    `}
          />
          {formErrors.phone && (
            <p
              id="Patient-phone-error"
              role="alert"
              className="text-xs font-medium text-red-600"
            >
              {formErrors.phone}
            </p>
          )}
        </div>

        {/* ==================================================
            Patient age
        ================================================== */}
        <div className="mt-3 space-y-1.5">
          <label
            htmlFor="Patient-age"
            className="
              text-sm
              font-semibold
              text-slate-700
              dark:text-slate-200
            "
          >
            Patient's Age
          </label>

          <input
            id="Patient-age"
            name="age"
            type="number"
            value={editForm.age}
            onChange={handleEditFormChange}
            disabled={isUpdating}
            placeholder="Enter Patient age"
            aria-invalid={Boolean(formErrors.age)}
            aria-describedby={formErrors.age ? "Patient-age-error" : undefined}
            className={`
      w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-900
      outline-none transition placeholder:text-slate-400
      disabled:cursor-not-allowed disabled:opacity-60
      dark:bg-slate-800 dark:text-slate-100
      ${
        formErrors.age
          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
          : "border-slate-200 focus:border-[#0084d1] focus:ring-1 focus:ring-[#0084d1] dark:border-slate-700"
      }
    `}
          />

          {formErrors.age && (
            <p
              id="Patient-age-error"
              role="alert"
              className="text-xs font-medium text-red-600"
            >
              {formErrors.age}
            </p>
          )}
        </div>

        {/* ==================================================
            Patient Date Of Birth
        ================================================== */}
        <div className="mt-3 space-y-1.5">
          <label
            htmlFor="Patient-date-of-birth"
            className="
              text-sm
              font-semibold
              text-slate-700
              dark:text-slate-200
            "
          >
            Patient's Date of Birth
          </label>
          <input
            id="Patient-date-of-birth"
            name="date_of_birth"
            type="date"
            lang="en-GB"
            dir="ltr"
            value={editForm.date_of_birth}
            onChange={handleEditFormChange}
            disabled={isUpdating}
            placeholder="Enter Patient's Date of Birth"
            aria-invalid={Boolean(formErrors.date_of_birth)}
            aria-describedby={
              formErrors.date_of_birth
                ? "Patient-date-of-birth-error"
                : undefined
            }
            className={`
      w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-900
      outline-none transition placeholder:text-slate-400
      disabled:cursor-not-allowed disabled:opacity-60
      dark:bg-slate-800 dark:text-slate-100
      ${
        formErrors.date_of_birth
          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
          : "border-slate-200 focus:border-[#0084d1] focus:ring-1 focus:ring-[#0084d1] dark:border-slate-700"
      }
    `}
          />

          {formErrors.date_of_birth && (
            <p
              id="Patient-date-of-birth-error"
              role="alert"
              className="text-xs font-medium text-red-600"
            >
              {formErrors.date_of_birth}
            </p>
          )}
        </div>

        {/* ==================================================
            Patient Gender
        ================================================== */}
        <div className="mt-3 space-y-1.5">
          <label
            htmlFor="Patient-gender"
            className="
              text-sm
              font-semibold
              text-slate-700
              dark:text-slate-200
            "
          >
            Patient's Gender
          </label>

          <select
            id="Patient-gender"
            name="gender"
            value={editForm.gender}
            onChange={handleEditFormChange}
            disabled={isUpdating}
            aria-invalid={Boolean(formErrors.gender)}
            aria-describedby={
              formErrors.gender ? "Patient-gender-error" : undefined
            }
            className={`
      w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-900
      outline-none transition placeholder:text-slate-400
      disabled:cursor-not-allowed disabled:opacity-60
      dark:bg-slate-800 dark:text-slate-100
      ${
        formErrors.gender
          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
          : "border-slate-200 focus:border-[#0084d1] focus:ring-1 focus:ring-[#0084d1] dark:border-slate-700"
      }
    `}
          >
            {/* <option value="">Select Patient type</option> */}

            <option value="male">Male</option>

            <option value="female">Female</option>
          </select>
          {formErrors.gender && (
            <p
              id="Patient-gender-error"
              role="alert"
              className="text-xs font-medium text-red-600"
            >
              {formErrors.gender}
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

const LoadingState = ({ message = "Loading Patients..." }) => {
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
        No Patients Found
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        {hasSearch
          ? "No Patients match your search criteria."
          : "There are no Patients available."}
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
        Failed to load Patients. Please try again later.
      </p>
    </div>
  );
};

export default PatientsPage;
