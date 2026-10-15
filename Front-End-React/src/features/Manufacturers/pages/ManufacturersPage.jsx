// React & React Router
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

// =========== External Library =========== //
// Radix
import { Card, Text } from "@radix-ui/themes";

// Lucide Icons
import { Search, ShieldAlert, SquarePen, Trash2, X } from "lucide-react";

// Notify Sonner
import { notifySonner } from "./../../../lib/notifySonner";

// Api Slice
import {
  useGetManufacturersQuery,
  useUpdateManufacturerMutation,
  useDeleteManufacturerMutation,
} from "../ManufacturersApiSlice";

// Utilities
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import Pagination from "../../../components/utility/Pagination";
import EditModal from "../../../components/utility/EditModal";
import DeleteConfirmModal from "../../../components/utility/DeleteConfirmModal";

// Components
import ManufacturersTable from "../components/common/ManufacturersTable";

const ManufacturersPage = () => {
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

  const [selectedDeleteManufacturer, setSelectedDeleteManufacturer] =
    useState(null);

  // ==================================================
  // Edit State
  // ==================================================

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

  // ==================================================
  // Manufacturers Query
  // ==================================================

  const { data, isLoading, isFetching, isError } = useGetManufacturersQuery({
    search: normalizedSearch,
    page,
  });

  const manufacturers = data?.manufacturers ?? [];
  const meta = data?.meta ?? null;

  // ==================================================
  // Delete Mutation
  // ==================================================

  const [deleteManufacturer, { isLoading: isDeleting }] =
    useDeleteManufacturerMutation();

  // ==================================================
  // Update Mutation
  // ==================================================

  const [updateManufacturer, { isLoading: isUpdating }] =
    useUpdateManufacturerMutation();

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

  // ==================================================
  // Edit Handlers
  // ==================================================

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
      [name]: name === "is_active" ? value === "true" : value,
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
          All Manufacturers
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
            placeholder="Search for a manufacturer by name..."
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
      ) : manufacturers.length === 0 ? (
        <EmptyState hasSearch={hasSearch} onReset={clearSearch} />
      ) : (
        <>
          <ManufacturersTable
            manufacturers={manufacturers}
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
        isOpen={!!selectedDeleteManufacturer}
        onClose={() => setSelectedDeleteManufacturer(null)}
        onConfirm={handleDeleteManufacturer}
        isLoading={isDeleting}
        title="Delete Manufacturer"
        message="Are You Sure You Want to Delete This Manufacturer ?"
        itemLabel={selectedDeleteManufacturer?.name}
        confirmText="Delete"
        cancelText="Cancel"
        icon={Trash2}
      />

      {/* ==================================================
          Edit Modal
      ================================================== */}

      <EditModal
        isOpen={Boolean(selectedEditManufacturer)}
        onClose={handleCloseEditModal}
        onSubmit={handleUpdateManufacturer}
        isLoading={isUpdating}
        title="Edit Manufacturer"
        itemLabel={selectedEditManufacturer?.name}
        submitText="Save Changes"
        cancelText="Cancel"
        icon={SquarePen}
      >
        {/* ==================================================
            Manufacturer Name
        ================================================== */}

        <div className="space-y-1.5">
          <label
            htmlFor="manufacturer-name"
            className="
              text-sm
              font-semibold
              text-slate-700
              dark:text-slate-200
            "
          >
            Manufacturer Name
          </label>

          <input
            id="manufacturer-name"
            name="name"
            type="text"
            value={editForm.name}
            onChange={handleEditFormChange}
            disabled={isUpdating}
            placeholder="Enter manufacturer name"
            aria-invalid={Boolean(formErrors.name)}
            aria-describedby={
              formErrors.name ? "manufacturer-name-error" : undefined
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
              id="manufacturer-name-error"
              role="alert"
              className="text-xs font-medium text-red-600"
            >
              {formErrors.name}
            </p>
          )}
        </div>

        {/* ==================================================
            Manufacturer origin
        ================================================== */}

        <div className="mt-5 space-y-1.5">
          <label
            htmlFor="manufacturer-origin"
            className="
              text-sm
              font-semibold
              text-slate-700
              dark:text-slate-200
            "
          >
            Manufacturer Origin
          </label>

          <input
            type="text"
            id="manufacturer-origin"
            name="origin"
            value={editForm.origin}
            onChange={handleEditFormChange}
            disabled={isUpdating}
            placeholder="Enter manufacturer origin"
            aria-invalid={Boolean(formErrors.origin)}
            aria-describedby={
              formErrors.origin ? "manufacturer-origin-error" : undefined
            }
            className={`
      w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-900
      outline-none transition placeholder:text-slate-400
      disabled:cursor-not-allowed disabled:opacity-60
      dark:bg-slate-800 dark:text-slate-100
      ${
        formErrors.origin
          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
          : "border-slate-200 focus:border-[#0084d1] focus:ring-1 focus:ring-[#0084d1] dark:border-slate-700"
      }
    `}
          />
          {formErrors.origin && (
            <p
              id="manufacturer-origin-error"
              role="alert"
              className="text-xs font-medium text-red-600"
            >
              {formErrors.origin}
            </p>
          )}
        </div>

        {/* ==================================================
            Manufacturer logo_text
        ================================================== */}

        <div className="mt-5 space-y-1.5">
          <label
            htmlFor="manufacturer-logo_text"
            className="
              text-sm
              font-semibold
              text-slate-700
              dark:text-slate-200
            "
          >
            Manufacturer Logo Text
          </label>

          <input
            type="text"
            id="manufacturer-logo_text"
            name="logo_text"
            value={editForm.logo_text}
            onChange={handleEditFormChange}
            disabled={isUpdating}
            placeholder="Enter manufacturer logo text"
            aria-invalid={Boolean(formErrors.logo_text)}
            aria-describedby={
              formErrors.logo_text ? "manufacturer-logo_text-error" : undefined
            }
            className={`
      w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-900
      outline-none transition placeholder:text-slate-400
      disabled:cursor-not-allowed disabled:opacity-60
      dark:bg-slate-800 dark:text-slate-100
      ${
        formErrors.logo_text
          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
          : "border-slate-200 focus:border-[#0084d1] focus:ring-1 focus:ring-[#0084d1] dark:border-slate-700"
      }
    `}
          />
          {formErrors.logo_text && (
            <p
              id="manufacturer-logo_text-error"
              role="alert"
              className="text-xs font-medium text-red-600"
            >
              {formErrors.logo_text}
            </p>
          )}
        </div>

        {/* ==================================================
            Manufacturer website
        ================================================== */}

        <div className="mt-5 space-y-1.5">
          <label
            htmlFor="manufacturer-website"
            className="
              text-sm
              font-semibold
              text-slate-700
              dark:text-slate-200
            "
          >
            Manufacturer Website
          </label>

          <input
            type="text"
            id="manufacturer-website"
            name="website"
            value={editForm.website}
            onChange={handleEditFormChange}
            disabled={isUpdating}
            placeholder="Enter manufacturer website"
            aria-invalid={Boolean(formErrors.website)}
            aria-describedby={
              formErrors.website ? "manufacturer-website-error" : undefined
            }
            className={`
      w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-900
      outline-none transition placeholder:text-slate-400
      disabled:cursor-not-allowed disabled:opacity-60
      dark:bg-slate-800 dark:text-slate-100
      ${
        formErrors.website
          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
          : "border-slate-200 focus:border-[#0084d1] focus:ring-1 focus:ring-[#0084d1] dark:border-slate-700"
      }
    `}
          />
          {formErrors.website && (
            <p
              id="manufacturer-website-error"
              role="alert"
              className="text-xs font-medium text-red-600"
            >
              {formErrors.website}
            </p>
          )}
        </div>

        {/* ==================================================
            Manufacturer is_active
        ================================================== */}

        <div className="mt-5 space-y-1.5">
          <label
            htmlFor="manufacturer-is_active"
            className="
              text-sm
              font-semibold
              text-slate-700
              dark:text-slate-200
            "
          >
            Is Active
          </label>

          <select
            id="manufacturer-is_active"
            name="is_active"
            value={String(editForm.is_active)}
            onChange={handleEditFormChange}
            disabled={isUpdating}
            aria-invalid={Boolean(formErrors.is_active)}
            className={`
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
              disabled:cursor-not-allowed
              disabled:opacity-60
              dark:bg-slate-800
              dark:text-slate-100
              ${
                formErrors.is_active
                  ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                  : "border-slate-200 focus:border-[#0084d1] focus:ring-1 focus:ring-[#0084d1] dark:border-slate-700"
              }
            `}
          >
            <option value="">Select Is Active</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          {formErrors.is_active && (
            <p
              role="alert"
              className="
                text-xs
                font-medium
                text-red-600
              "
            >
              {formErrors.is_active}
            </p>
          )}
        </div>

        {/* ==================================================
            Manufacturer description
        ================================================== */}

        <div className="mt-5 space-y-1.5">
          <label
            htmlFor="manufacturer-description"
            className="
              text-sm
              font-semibold
              text-slate-700
              dark:text-slate-200
            "
          >
            Manufacturer Description
          </label>

          <textarea
            id="manufacturer-description"
            name="description"
            value={editForm.description}
            onChange={handleEditFormChange}
            disabled={isUpdating}
            placeholder="Enter manufacturer description"
            aria-invalid={Boolean(formErrors.description)}
            aria-describedby={
              formErrors.description
                ? "manufacturer-description-error"
                : undefined
            }
            className={`
      w-full rounded-xl border bg-slate-50 px-4 py-2.5 text-sm text-slate-900
      outline-none transition placeholder:text-slate-400
      disabled:cursor-not-allowed disabled:opacity-60
      dark:bg-slate-800 dark:text-slate-100
      ${
        formErrors.description
          ? "border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500"
          : "border-slate-200 focus:border-[#0084d1] focus:ring-1 focus:ring-[#0084d1] dark:border-slate-700"
      }
    `}
          />
          {formErrors.description && (
            <p
              id="manufacturer-description-error"
              role="alert"
              className="text-xs font-medium text-red-600"
            >
              {formErrors.description}
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

const LoadingState = ({ message = "Loading manufacturers..." }) => {
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
        No Manufacturers Found
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        {hasSearch
          ? "No manufacturers match your search criteria."
          : "There are no manufacturers available."}
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
        Failed to load manufacturers. Please try again later.
      </p>
    </div>
  );
};

export default ManufacturersPage;
