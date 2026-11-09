import { useEffect, useRef, useState } from "react";
import { useLocation, useSearchParams } from "react-router";
import { notifySonner } from "./../../../lib/notifySonner";
import {
  useGetOperationsQuery,
  useDeleteOperationMutation,
  useUpdateOperationMutation,
  useLazyGetOperationQuery,
  useDownloadOperationsTemplateMutation,
  useImportOperationsMutation,
} from "../OperationsApiSlice";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";

const useOperationsPageLogic = () => {
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
    {
      name: "doctor_id",
      label: "Doctor ID",
    },
    {
      name: "patient_id",
      label: "Patient ID",
    },
    {
      name: "hospital_id",
      label: "Hospital ID",
    },
    {
      name: "operation_type_id",
      label: "Operation Type ID",
    },
  ];

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

  const collectImportErrors = (error) => {
    const errors = error?.data?.errors;
    if (!errors || typeof errors !== "object") return [];
    return Object.entries(errors).flatMap(([field, messages]) =>
      (Array.isArray(messages) ? messages : [messages]).map(
        (message) => `${field}: ${String(message)}`,
      ),
    );
  };

  const location = useLocation();
  const topRef = useRef(null);
  const role = location.pathname.split("/")[1];
  const scope = ["admin", "staff", "doctor"].includes(role) ? role : "admin";
  const canImportOperations = scope === "admin" || scope === "staff";
  const excelInputRef = useRef(null);
  const [importErrors, setImportErrors] = useState([]);

  const [downloadOperationsTemplate, { isLoading: isDownloadingTemplate }] =
    useDownloadOperationsTemplateMutation();

  const [importOperations, { isLoading: isImporting }] =
    useImportOperationsMutation();

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedEditOperation, setSelectedEditOperation] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_EDIT_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [fetchOperation] = useLazyGetOperationQuery();
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? "",
  );
  const doctorId = searchParams.get("doctor_id") ?? "";
  const hospitalId = searchParams.get("hospital_id") ?? "";
  const operationTypeId = searchParams.get("operation_type_id") ?? "";
  const [filterEntities, setFilterEntities] = useState({
    doctor: null,
    hospital: null,
    operation_type: null,
  });
  const hasFilters = Boolean(
    (scope !== "doctor" && doctorId) || hospitalId || operationTypeId,
  );
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(searchInput, 400);
  const normalizedSearch = debouncedSearch.trim();
  const hasSearch = Boolean(normalizedSearch);
  const [selectedDeleteOperation, setSelectedDeleteOperation] = useState(null);

  const { data, isLoading, isFetching, isError } = useGetOperationsQuery({
    search: normalizedSearch,
    page,
    scope,
    doctor_id: doctorId,
    hospital_id: hospitalId,
    operation_type_id: operationTypeId,
  });

  const operations = Array.isArray(data?.operations)
    ? data.operations
    : Array.isArray(data?.data)
      ? data.data
      : [];

  const meta = data?.meta ?? null;

  const getSelectedFilterEntity = (relation, value) => {
    if (!value) return null;
    const cached = filterEntities[relation];
    if (cached && String(cached.id) === String(value)) return cached;
    return (
      operations.find(
        (operation) => String(operation[`${relation}_id`]) === String(value),
      )?.[relation] ?? null
    );
  };

  const selectedDoctor = getSelectedFilterEntity("doctor", doctorId);
  const selectedHospital = getSelectedFilterEntity("hospital", hospitalId);

  const selectedOperationType = getSelectedFilterEntity(
    "operation_type",
    operationTypeId,
  );

  const [deleteOperation, { isLoading: isDeleting }] =
    useDeleteOperationMutation();

  const [updateOperation, { isLoading: isUpdating }] =
    useUpdateOperationMutation();

  const handleDownloadExcelTemplate = async () => {
    if (!canImportOperations || isDownloadingTemplate || isImporting) {
      return;
    }
    try {
      await downloadOperationsTemplate().unwrap();
      notifySonner("Excel Template Downloaded Successfully");
    } catch (error) {
      console.error("Failed to Download Excel Template:", error);
      notifySonner(
        error?.data?.message ||
          error?.message ||
          error?.error ||
          "Failed to Download Excel Template",
        "error",
      );
    }
  };

  const handleExcelFileChange = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = ""; // Allows selecting the same file again.

    if (!file || !canImportOperations || isImporting) return;
    setImportErrors([]);
    if (!/\.xlsx$/i.test(file.name)) {
      notifySonner("Please Select an .xlsx Excel File", "error");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      notifySonner("Excel File Must Be 10 MB or Less", "error");
      return;
    }
    try {
      const result = await importOperations(file).unwrap();
      setPage(1);
      const operationsCount = result?.operations_created;
      const itemsCount = result?.items_created;
      notifySonner(
        typeof operationsCount === "number" && typeof itemsCount === "number"
          ? `Imported ${operationsCount} operations and ${itemsCount} items successfully`
          : result?.message || "Operations Imported Successfully",
      );
    } catch (error) {
      console.error("Failed to Import Operations:", error);
      const details = collectImportErrors(error);
      setImportErrors(details);
      notifySonner(
        error?.data?.message || "Failed to Import Operations",
        "error",
      );
    }
  };

  useEffect(() => {
    if (searchInput.trim() !== normalizedSearch) return;
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
      {
        replace: true,
      },
    );
  }, [normalizedSearch, searchInput, searchParams, setSearchParams]);

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

  const handleOpenEditModal = async (operation) => {
    if (!operation?.id || isUpdating) return;
    try {
      // Load the complete record (relations and operation items), not
      // the abbreviated object from the operations table.
      const fullOperation = await fetchOperation({
        id: operation.id,
        scope,
      }).unwrap();
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
      ...(itemsChanged
        ? {
            items: itemsPayload,
          }
        : {}),
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
      {
        replace: true,
      },
    );
  };

  const handleReferenceFilterChange = (field, relation, id, entity) => {
    const value = id == null ? "" : String(id);
    setFilterEntities((current) => ({
      ...current,
      [relation]: entity ?? null,
    }));
    setPage(1);
    setSearchParams(
      (previousParams) => {
        const params = new URLSearchParams(previousParams);
        if (value) params.set(field, value);
        else params.delete(field);
        return params;
      },
      {
        replace: true,
      },
    );
  };

  const clearFilters = () => {
    setFilterEntities({
      doctor: null,
      hospital: null,
      operation_type: null,
    });
    setPage(1);
    setSearchParams(
      (previousParams) => {
        const params = new URLSearchParams(previousParams);
        params.delete("doctor_id");
        params.delete("hospital_id");
        params.delete("operation_type_id");
        return params;
      },
      {
        replace: true,
      },
    );
  };

  const clearAllCriteria = () => {
    setSearchInput("");
    setFilterEntities({
      doctor: null,
      hospital: null,
      operation_type: null,
    });
    setPage(1);
    setSearchParams(
      (previousParams) => {
        const params = new URLSearchParams(previousParams);
        params.delete("search");
        params.delete("doctor_id");
        params.delete("hospital_id");
        params.delete("operation_type_id");
        return params;
      },
      {
        replace: true,
      },
    );
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

  return {
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
  };
};

export default useOperationsPageLogic;
