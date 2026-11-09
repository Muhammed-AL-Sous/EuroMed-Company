// External Library
import { Search, ShieldAlert, SquarePen, Trash2, X } from "lucide-react";
import { Card, Text } from "@radix-ui/themes";

// Utilities
import DoctorsTable from "./../components/common/DoctorsTable";
import Pagination from "../../../components/utility/Pagination";
import DeleteConfirmModal from "../../../components/utility/DeleteConfirmModal";
import EditModal from "../../../components/utility/EditModal";
import useDoctorsPageLogic from "./useDoctorsPageLogic.js";

const DoctorsPage = () => {
  const {
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
  } = useDoctorsPageLogic();

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
