import { useEffect, useState } from "react";
import { Search, ShieldAlert, SquarePen, Trash2, X } from "lucide-react";
import { useSearchParams } from "react-router";
import { Card, Text } from "@radix-ui/themes";

import {
  useDeleteHospitalMutation,
  useGetHospitalsQuery,
  useUpdateHospitalMutation,
} from "../HospitalsApiSlice";

import { useDebouncedValue } from "../../../hooks/useDebouncedValue";

import HospitalsTable from "../components/common/HospitalsTable";
import Pagination from "../../../components/utility/Pagination";
import DeleteConfirmModal from "../../../components/utility/DeleteConfirmModal";
import EditModal from "../../../components/utility/EditModal";

const HospitalsPage = () => {
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

  const [selectedDeleteHospital, setSelectedDeleteHospital] = useState(null);

  // ==================================================
  // Edit State
  // ==================================================

  const [selectedEditHospital, setSelectedEditHospital] = useState(null);

  const [editForm, setEditForm] = useState({
    name: "",
    type: "",
    city: "",
  });

  // ==================================================
  // Hospitals Query
  // ==================================================

  const { data, isLoading, isFetching, isError } = useGetHospitalsQuery({
    search: normalizedSearch,
    page,
  });

  const hospitals = data?.hospitals ?? [];
  const meta = data?.meta ?? null;

  // ==================================================
  // Delete Mutation
  // ==================================================

  const [deleteHospital, { isLoading: isDeleting }] =
    useDeleteHospitalMutation();

  // ==================================================
  // Update Mutation
  // ==================================================

  const [updateHospital, { isLoading: isUpdating }] =
    useUpdateHospitalMutation();

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
    } catch (error) {
      console.error("Failed to delete hospital:", error);
    }
  };

  // ==================================================
  // Edit Handlers
  // ==================================================

  const handleOpenEditModal = (hospital) => {
    setSelectedEditHospital(hospital);

    setEditForm({
      name: hospital.name ?? "",
      type: hospital.type ?? "",
      city: hospital.city ?? "",
    });
  };

  const handleCloseEditModal = () => {
    if (isUpdating) {
      return;
    }

    setSelectedEditHospital(null);

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

    if (!payload.name || !payload.type || !payload.city) {
      return;
    }

    try {
      await updateHospital({
        id: selectedEditHospital.id,
        data: payload,
      }).unwrap();

      setSelectedEditHospital(null);

      setEditForm({
        name: "",
        type: "",
        city: "",
      });
    } catch (error) {
      console.error("Failed to update hospital:", error);
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
          All Hospitals
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
            placeholder="Search for a hospital by name..."
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
      ) : hospitals.length === 0 ? (
        <EmptyState hasSearch={hasSearch} onReset={clearSearch} />
      ) : (
        <>
          <HospitalsTable
            hospitals={hospitals}
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
        isOpen={Boolean(selectedDeleteHospital)}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteHospital}
        isLoading={isDeleting}
        title="Delete Hospital"
        message="Are you sure you want to delete this hospital?"
        itemLabel={selectedDeleteHospital?.name}
        confirmText="Delete"
        cancelText="Cancel"
        icon={Trash2}
      />

      {/* ==================================================
          Edit Modal
      ================================================== */}

      <EditModal
        isOpen={Boolean(selectedEditHospital)}
        onClose={handleCloseEditModal}
        onSubmit={handleUpdateHospital}
        isLoading={isUpdating}
        title="Edit Hospital"
        itemLabel={selectedEditHospital?.name}
        submitText="Save Changes"
        cancelText="Cancel"
        icon={SquarePen}
      >
        {/* ==================================================
            Hospital Name
        ================================================== */}

        <div className="space-y-1.5">
          <label
            htmlFor="hospital-name"
            className="
              text-sm
              font-semibold
              text-slate-700
              dark:text-slate-200
            "
          >
            Hospital Name
          </label>

          <input
            id="hospital-name"
            name="name"
            type="text"
            value={editForm.name}
            onChange={handleEditFormChange}
            disabled={isUpdating}
            placeholder="Enter hospital name"
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              px-4
              py-2.5
              text-sm
              text-slate-900
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-[#0084d1]
              focus:ring-1
              focus:ring-[#0084d1]
              disabled:cursor-not-allowed
              disabled:opacity-60
              dark:border-slate-700
              dark:bg-slate-800
              dark:text-slate-100
            "
          />
        </div>

        {/* ==================================================
            Hospital Type
        ================================================== */}

        <div className="mt-5 space-y-1.5">
          <label
            htmlFor="hospital-type"
            className="
              text-sm
              font-semibold
              text-slate-700
              dark:text-slate-200
            "
          >
            Hospital Type
          </label>

          <select
            id="hospital-type"
            name="type"
            value={editForm.type}
            onChange={handleEditFormChange}
            disabled={isUpdating}
            className="
              w-full
              cursor-pointer
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              px-4
              py-2.5
              text-sm
              text-slate-900
              outline-none
              transition
              focus:border-[#0084d1]
              focus:ring-1
              focus:ring-[#0084d1]
              disabled:cursor-not-allowed
              disabled:opacity-60
              dark:border-slate-700
              dark:bg-slate-800
              dark:text-slate-100
            "
          >
            <option value="">Select hospital type</option>

            <option value="Government">Government</option>

            <option value="Private">Private</option>
          </select>
        </div>

        {/* ==================================================
            Hospital City
        ================================================== */}

        <div className="mt-5 space-y-1.5">
          <label
            htmlFor="hospital-city"
            className="
              text-sm
              font-semibold
              text-slate-700
              dark:text-slate-200
            "
          >
            Hospital City
          </label>

          <input
            id="hospital-city"
            name="city"
            type="text"
            value={editForm.city}
            onChange={handleEditFormChange}
            disabled={isUpdating}
            placeholder="Enter hospital city"
            className="
              w-full
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              px-4
              py-2.5
              text-sm
              text-slate-900
              outline-none
              transition
              placeholder:text-slate-400
              focus:border-[#0084d1]
              focus:ring-1
              focus:ring-[#0084d1]
              disabled:cursor-not-allowed
              disabled:opacity-60
              dark:border-slate-700
              dark:bg-slate-800
              dark:text-slate-100
            "
          />
        </div>
      </EditModal>
    </Card>
  );
};

// ==================================================
// Loading State
// ==================================================

const LoadingState = ({ message = "Loading hospitals..." }) => {
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
        No Hospitals Found
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        {hasSearch
          ? "No hospitals match your search criteria."
          : "There are no hospitals available."}
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
        Failed to load hospitals. Please try again later.
      </p>
    </div>
  );
};

export default HospitalsPage;
