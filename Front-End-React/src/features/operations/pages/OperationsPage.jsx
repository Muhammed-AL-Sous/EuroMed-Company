import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";

import { Search, ShieldAlert, SquarePen, Trash2, X } from "lucide-react";
import { Card, Text } from "@radix-ui/themes";
import { notifySonner } from "./../../../lib/notifySonner";

import {
  useGetOperationsQuery,
  useDeleteOperationMutation,
  useUpdateOperationMutation,
  useGetOperationQuery,
} from "../OperationsApiSlice";

import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import Pagination from "../../../components/utility/Pagination";
import DeleteConfirmModal from "../../../components/utility/DeleteConfirmModal";
import EditModal from "../../../components/utility/EditModal";
import OperationsTable from "../components/common/OperationsTable";
import OperationEditForm from "../components/utility/OperationEditForm";
// ==================================================
// Constants
// ==================================================

const EMPTY_EDIT_FORM = {
  doctor_id: "",
  patient_id: "",
  hospital_id: "",
  operation_type_id: "",
  operation_date: "",
  side: "",
  description: "",
  items: [],
};

const RELATION_FIELDS = [
  { name: "doctor_id", label: "Doctor ID" },
  { name: "patient_id", label: "Patient ID" },
  { name: "hospital_id", label: "Hospital ID" },
  {
    name: "operation_type_id",
    label: "Operation Type ID",
  },
];

// ==================================================
// Helpers
// ==================================================

const createEditForm = (operation) => ({
  doctor_id: operation.doctor_id?.toString() ?? "",
  patient_id: operation.patient_id?.toString() ?? "",
  hospital_id: operation.hospital_id?.toString() ?? "",
  operation_type_id: operation.operation_type_id?.toString() ?? "",

  // Relations for displaying names
  doctor: operation.doctor ?? null,
  patient: operation.patient ?? null,
  hospital: operation.hospital ?? null,
  operation_type: operation.operation_type ?? null,

  operation_date: operation.operation_date ?? "",
  side: operation.side ?? "",
  description: operation.description ?? "",

  items: Array.isArray(operation.items)
    ? operation.items.map((item, index) => ({
        id: item.id,
        clientKey: `existing-${item.id ?? index}`,
        product_id: item.product_id?.toString() ?? "",
        quantity: item.quantity?.toString() ?? "",

        // Product details for display
        product: item.product ?? null,
      }))
    : [],
});

const buildUpdatePayload = (form) => ({
  doctor_id: Number(form.doctor_id),
  patient_id: Number(form.patient_id),
  hospital_id: Number(form.hospital_id),
  operation_type_id: Number(form.operation_type_id),
  operation_date: form.operation_date,
  side: form.side || null,
  description: form.description.trim() || null,
});

const validateEditForm = (form) => {
  const errors = {};

  RELATION_FIELDS.forEach(({ name, label }) => {
    const value = String(form[name]).trim();

    if (!/^[1-9]\d*$/.test(value)) {
      errors[name] = `${label} must be a valid positive ID`;
    }
  });

  if (!form.operation_date) {
    errors.operation_date = "Operation Date is Required";
  } else {
    const date = form.operation_date;
    const parsedDate = new Date(`${date}T00:00:00Z`);

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== date
    ) {
      errors.operation_date = "Enter a Valid Date";
    }
  }

  if (form.side && !["Left", "Right", "Bilateral"].includes(form.side)) {
    errors.side = "Invalid Operation Side";
  }

  return errors;
};

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
  const [searchParams, setSearchParams] = useSearchParams();
  // ==================================================
  // Edit State
  // ==================================================

  const [selectedEditOperation, setSelectedEditOperation] = useState(null);

  const [editForm, setEditForm] = useState(EMPTY_EDIT_FORM);

  const [formErrors, setFormErrors] = useState({});
  const { data: getOperation } = useGetOperationQuery();

  // ==================================================
  // Search State
  // ==================================================

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? "",
  );

  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(searchInput, 400);
  const normalizedSearch = debouncedSearch.trim();
  const hasSearch = Boolean(normalizedSearch);

  // ==================================================
  // Delete State
  // ==================================================

  const [selectedDeleteOperation, setSelectedDeleteOperation] = useState(null);

  // ==================================================
  // Operations Query
  // ==================================================

  const { data, isLoading, isFetching, isError } = useGetOperationsQuery({
    search: normalizedSearch,
    page,
  });

  const operations = Array.isArray(data?.operations)
    ? data.operations
    : Array.isArray(data?.data)
      ? data.data
      : [];

  const meta = data?.meta ?? null;

  // ==================================================
  // Mutations
  // ==================================================

  const [deleteOperation, { isLoading: isDeleting }] =
    useDeleteOperationMutation();

  const [updateOperation, { isLoading: isUpdating }] =
    useUpdateOperationMutation();

  // ==================================================
  // Sync Search With URL
  // ==================================================

  useEffect(() => {
    const urlSearch = searchParams.get("search") ?? "";

    if (urlSearch === normalizedSearch) return;

    setSearchParams(
      (previousParams) => {
        const params = new URLSearchParams(previousParams);

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

  const handleOpenDeleteModal = (operation) => {
    setSelectedDeleteOperation(operation);
  };

  const handleCloseDeleteModal = () => {
    if (isDeleting) return;

    setSelectedDeleteOperation(null);
  };

  const handleDeleteOperation = async () => {
    if (!selectedDeleteOperation || isDeleting) return;

    try {
      await deleteOperation(selectedDeleteOperation.id).unwrap();

      setSelectedDeleteOperation(null);

      if (operations.length === 1 && page > 1) {
        setPage((current) => Math.max(1, current - 1));
      }

      notifySonner("Operation Deleted Successfully");
    } catch (error) {
      console.error("Failed to Delete Operation:", error);

      notifySonner(
        error?.data?.message || "Failed to Delete Operation",
        "error",
      );
    }
  };

  // ==================================================
  // Edit Handlers
  // ==================================================

  const handleOpenEditModal = async (operation) => {
    if (!operation?.id || isUpdating) return;

    try {
      // Load the complete record (relations and operation items), not
      // the abbreviated object from the operations table.
      const fullOperation = await getOperation(operation.id).unwrap();

      setFormErrors({});
      setEditForm(createEditForm(fullOperation));
      setSelectedEditOperation(fullOperation);
    } catch (error) {
      console.error("Failed to Load Operation Details:", error);
      notifySonner(
        error?.data?.message || "Failed to Load Operation Details",
        "error",
      );
    }
  };

  const resetEditState = () => {
    setSelectedEditOperation(null);
    setEditForm(EMPTY_EDIT_FORM);
    setFormErrors({});
  };

  const handleCloseEditModal = () => {
    if (isUpdating) return;

    resetEditState();
  };

  // ==================================================
  // Update Operation
  // ==================================================

  const handleUpdateOperation = async () => {
    if (!selectedEditOperation || isUpdating) return;

    // Validate main operation fields
    const errors = validateEditForm(editForm);

    // Validate operation items
    if (!editForm.items.length) {
      errors.items = "Add at least one operation item";
    }

    const productIds = new Set();

    editForm.items.forEach((item, index) => {
      const productId = Number(item.product_id);
      const quantity = Number(item.quantity);

      if (
        String(item.product_id).trim() === "" ||
        !Number.isSafeInteger(productId) ||
        productId <= 0
      ) {
        errors[`items.${index}.product_id`] = "Select a valid product";
      } else if (productIds.has(productId)) {
        errors[`items.${index}.product_id`] = "This product is already added";
      } else {
        productIds.add(productId);
      }

      if (
        String(item.quantity).trim() === "" ||
        !Number.isSafeInteger(quantity) ||
        quantity <= 0
      ) {
        errors[`items.${index}.quantity`] =
          "Quantity must be a positive integer";
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Prepare operation data
    const operationPayload = buildUpdatePayload(editForm);

    // Prepare items using backend format
    const itemsPayload = editForm.items.map((item) => ({
      product_id: Number(item.product_id),
      quantity: Number(item.quantity),
    }));

    // Original operation data
    const originalForm = createEditForm(selectedEditOperation);

    const originalOperationPayload = buildUpdatePayload(originalForm);

    const originalItemsPayload = originalForm.items.map((item) => ({
      product_id: Number(item.product_id),
      quantity: Number(item.quantity),
    }));

    // Check operation fields changes
    const operationChanged =
      JSON.stringify(operationPayload) !==
      JSON.stringify(originalOperationPayload);

    // Check items changes
    const itemsChanged =
      JSON.stringify(itemsPayload) !== JSON.stringify(originalItemsPayload);

    // No changes
    if (!operationChanged && !itemsChanged) {
      resetEditState();
      return;
    }

    // Send only modified sections
    const payload = {
      ...(operationChanged ? operationPayload : {}),
      ...(itemsChanged ? { items: itemsPayload } : {}),
    };

    try {
      await updateOperation({
        id: selectedEditOperation.id,
        data: payload,
      }).unwrap();

      resetEditState();

      notifySonner("Operation Updated Successfully");
    } catch (error) {
      console.error("Failed to Update Operation:", error);

      if (error?.status === 422 && error?.data?.errors) {
        const backendErrors = {};

        Object.entries(error.data.errors).forEach(([field, messages]) => {
          backendErrors[field] = Array.isArray(messages)
            ? messages[0]
            : String(messages);
        });

        setFormErrors(backendErrors);

        notifySonner("Please Check the Form Fields", "error");

        return;
      }

      notifySonner(
        error?.data?.message || "Failed to Update Operation",
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
      (previousParams) => {
        const params = new URLSearchParams(previousParams);
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
      {/* Header */}
      <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between">
        <Text as="div" size="6" weight="bold" className="text-sky-900">
          All Operations
        </Text>

        {/* Search */}
        <div className="relative w-full md:max-w-md">
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
        <EmptyState hasSearch={hasSearch} onReset={clearSearch} />
      ) : (
        <>
          <OperationsTable
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
        Reset Search
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
