// Radix
import { Card, Text } from "@radix-ui/themes";

// Lucide Icons
import { Search, ShieldAlert, SquarePen, Trash2, X } from "lucide-react";

// Utilities
import Pagination from "../../../components/utility/Pagination";
import EditModal from "../../../components/utility/EditModal";
import DeleteConfirmModal from "../../../components/utility/DeleteConfirmModal";

// Components
import ManufacturersTable from "../components/common/ManufacturersTable";
import useManufacturersPageLogic from "./useManufacturersPageLogic.js";

const ManufacturersPage = () => {
  const {
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
  } = useManufacturersPageLogic();

  // ==================================================
  // Render
  // ==================================================

  return (
    <Card variant="ghost">
      <div ref={topRef} className="scroll-mt-24" />
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
            sm:text-sm
              text-xs
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
