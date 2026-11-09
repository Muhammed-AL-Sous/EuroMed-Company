import {
  Download,
  LoaderCircle,
  Search,
  ShieldAlert,
  SquarePen,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { Card, Text } from "@radix-ui/themes";
import Pagination from "../../../components/utility/Pagination";
import DeleteConfirmModal from "../../../components/utility/DeleteConfirmModal";
import EditModal from "../../../components/utility/EditModal";
import OperationsTable from "../components/common/OperationsTable";
import OperationEditForm from "../components/utility/OperationEditForm";
import OperationReferenceSelect from "../components/utility/OperationReferenceSelect";
import useOperationsPageLogic from "./useOperationsPageLogic.js";

const getOperationLabel = (operation) => {
  if (!operation) return "";

  return operation.invoice_number
    ? `Invoice: ${operation.invoice_number}`
    : `Operation #${operation.id}`;
};

// ==================================================
// Operations Page
// ==================================================

const OperationsPage = () => {
  const {
    topRef,
    scope,
    canImportOperations,
    excelInputRef,
    importErrors,
    setImportErrors,
    isDownloadingTemplate,
    isImporting,
    selectedEditOperation,
    editForm,
    setEditForm,
    formErrors,
    setFormErrors,
    searchInput,
    doctorId,
    hospitalId,
    operationTypeId,
    hasFilters,
    normalizedSearch,
    hasSearch,
    selectedDeleteOperation,
    isLoading,
    isFetching,
    isError,
    operations,
    meta,
    selectedDoctor,
    selectedHospital,
    selectedOperationType,
    isDeleting,
    isUpdating,
    handleDownloadExcelTemplate,
    handleExcelFileChange,
    handleOpenDeleteModal,
    handleCloseDeleteModal,
    handleDeleteOperation,
    handleOpenEditModal,
    handleCloseEditModal,
    handleUpdateOperation,
    handleSearchChange,
    clearSearch,
    handleReferenceFilterChange,
    clearFilters,
    clearAllCriteria,
    handlePageChange,
  } = useOperationsPageLogic();

  // ==================================================
  // Render
  // ==================================================

  return (
    <Card variant="ghost">
      <div ref={topRef} className="scroll-mt-24" />
      {/* Header */}
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <Text as="div" size="6" weight="bold" className="text-sky-900">
            All Operations
          </Text>

          {canImportOperations && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleDownloadExcelTemplate}
                disabled={isDownloadingTemplate || isImporting}
                className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-xl border border-sky-200 bg-white px-2.5 py-2.5 text-xs sm:text-sm font-semibold text-sky-700 transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDownloadingTemplate ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                {isDownloadingTemplate ? "Downloading..." : "Download Excel"}
              </button>

              <input
                ref={excelInputRef}
                type="file"
                accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={handleExcelFileChange}
                aria-label="Choose Excel file to import operations"
                className="sr-only"
              />

              <button
                type="button"
                onClick={() => excelInputRef.current?.click()}
                disabled={isImporting || isDownloadingTemplate}
                className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-xl bg-sky-600 px-2.5 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isImporting ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {isImporting ? "Importing..." : "Import Operations"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Show Laravel row-level import validation errors */}
      {canImportOperations && importErrors.length > 0 && (
        <div
          role="alert"
          className="mx-4 mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold">Excel Import Failed</p>
              <p className="mt-1 text-red-700">
                Please correct these errors and upload the file again:
              </p>
            </div>
            <button
              type="button"
              onClick={() => setImportErrors([])}
              aria-label="Dismiss import errors"
              className="cursor-pointer rounded p-1 transition hover:bg-red-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <ul className="mt-3 list-inside list-disc space-y-1 wrap-break-word">
            {importErrors.slice(0, 10).map((message, index) => (
              <li key={`${index}-${message}`}>{message}</li>
            ))}
          </ul>
          {importErrors.length > 10 && (
            <p className="mt-2 font-medium">
              +{importErrors.length - 10} more errors
            </p>
          )}
        </div>
      )}

      {/* Filters: selections immediately update the URL and query arguments. */}
      <div className="grid grid-cols-1 gap-4 border-t border-slate-100 p-4 md:grid-cols-2 xl:grid-cols-4">
        {/* Search */}
        <div>
          <span className="text-sm font-semibold text-slate-700 ">
            {" "}
            Global Search
          </span>
          <span className="text-red-500 font-semibold px-1">*</span>
          <div className="relative w-full md:max-w-md md:self-end">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-slate-400" />

            <input
              type="text"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder="Search operations..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-10 pl-11 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            />

            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                aria-label="Clear search"
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-slate-400 transition hover:text-red-500"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {scope !== "doctor" && (
          <OperationReferenceSelect
            type="doctor"
            label="Doctor"
            value={doctorId}
            selectedEntity={selectedDoctor}
            onChange={(id, entity) =>
              handleReferenceFilterChange("doctor_id", "doctor", id, entity)
            }
          />
        )}

        <OperationReferenceSelect
          type="hospital"
          label="Hospital"
          value={hospitalId}
          selectedEntity={selectedHospital}
          onChange={(id, entity) =>
            handleReferenceFilterChange("hospital_id", "hospital", id, entity)
          }
        />

        <OperationReferenceSelect
          type="operation_type"
          label="Operation Type"
          value={operationTypeId}
          selectedEntity={selectedOperationType}
          onChange={(id, entity) =>
            handleReferenceFilterChange(
              "operation_type_id",
              "operation_type",
              id,
              entity,
            )
          }
        />

        {hasFilters && (
          <div className="flex items-end">
            <button
              type="button"
              onClick={clearFilters}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:border-red-200 hover:text-red-600"
            >
              <X className="h-4 w-4" />
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Active Search */}
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

      {/* Operations Content */}
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <ErrorState />
      ) : operations.length === 0 ? (
        <EmptyState
          hasSearch={hasSearch || hasFilters}
          onReset={clearAllCriteria}
        />
      ) : (
        <>
          <OperationsTable
            scope={scope}
            operations={operations}
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

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(selectedDeleteOperation)}
        onClose={handleCloseDeleteModal}
        onConfirm={handleDeleteOperation}
        isLoading={isDeleting}
        title="Delete Operation"
        message="Are you sure you want to delete this operation?"
        itemLabel={getOperationLabel(selectedDeleteOperation)}
        confirmText="Delete"
        cancelText="Cancel"
        icon={Trash2}
      />

      {/* Edit Modal */}

      <EditModal
        isOpen={Boolean(selectedEditOperation)}
        onClose={handleCloseEditModal}
        onSubmit={handleUpdateOperation}
        isLoading={isUpdating}
        title="Edit Operation"
        itemLabel={selectedEditOperation?.invoice_number}
        submitText="Save Changes"
        cancelText="Cancel"
        icon={SquarePen}
      >
        {selectedEditOperation && (
          <OperationEditForm
            editForm={editForm}
            setEditForm={setEditForm}
            formErrors={formErrors}
            setFormErrors={setFormErrors}
            isUpdating={isUpdating}
          />
        )}
      </EditModal>
    </Card>
  );
};

// ==================================================
// Loading State
// ==================================================

const LoadingState = ({ message = "Loading Operations..." }) => (
  <div className="flex min-h-75 flex-col items-center justify-center py-20">
    <div className="mb-4 h-10 w-10 animate-spin rounded-full border-4 border-sky-600 border-t-transparent" />

    <p className="text-sm font-medium text-slate-500">{message}</p>
  </div>
);

// ==================================================
// Empty State
// ==================================================

const EmptyState = ({ hasSearch, onReset }) => (
  <div className="mx-4 rounded-2xl border border-slate-200 bg-transparent p-12 text-center">
    <ShieldAlert className="mx-auto h-12 w-12 text-slate-400" />

    <h3 className="mt-3 text-lg font-bold text-slate-800">
      No Operations Found
    </h3>

    <p className="mt-2 text-sm text-slate-500">
      {hasSearch
        ? "No operations match your search criteria."
        : "There are no operations available."}
    </p>

    {hasSearch && (
      <button
        type="button"
        onClick={onReset}
        className="mt-5 cursor-pointer rounded-xl bg-sky-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-sky-700"
      >
        Reset Search and Filters
      </button>
    )}
  </div>
);

// ==================================================
// Error State
// ==================================================

const ErrorState = () => (
  <div className="mx-4 rounded-2xl border border-red-200 bg-red-50 p-12 text-center">
    <ShieldAlert className="mx-auto h-12 w-12 text-red-400" />

    <h3 className="mt-3 text-lg font-bold text-red-800">
      Something Went Wrong
    </h3>

    <p className="mt-2 text-sm text-red-600">
      Failed to load operations. Please try again later.
    </p>
  </div>
);

export default OperationsPage;
