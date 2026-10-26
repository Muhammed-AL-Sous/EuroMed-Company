import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";

// Radix UI
import { Form } from "radix-ui";
import { Box, Card, Flex, Text } from "@radix-ui/themes";

// Icons
import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  ClipboardPlus,
  FileText,
  KeyRound,
  Layers3,
  LoaderCircle,
  Package,
  Plus,
  Save,
  Trash2,
  Users,
} from "lucide-react";

// API
import { useAddOperationMutation } from "../OperationsApiSlice";

// Components
import OperationReferenceSelect from "../components/utility/OperationReferenceSelect";

// Notifications
import { notifySonner } from "../../../lib/notifySonner";

// ======================================================
// Constants
// ======================================================

const INPUT_CLASS =
  "box-border w-full rounded-xl border-2 border-sky-700 " +
  "bg-slate-50 px-4 py-2.5 text-sm text-slate-700 " +
  "outline-none transition-colors " +
  "placeholder:text-slate-400 " +
  "focus:border-sky-400 focus:bg-white " +
  "disabled:cursor-not-allowed disabled:opacity-60";

const createInitialForm = () => ({
  doctor_id: "",
  patient_id: "",
  hospital_id: "",
  operation_type_id: "",

  doctor: null,
  patient: null,
  hospital: null,
  operation_type: null,

  operation_date: "",
  side: "",
  patient_access_code: "",
  description: "",

  items: [
    {
      clientKey: 0,
      product_id: "",
      product: null,
      quantity: "1",
    },
  ],
});

// ======================================================
// Helpers
// ======================================================

const isValidId = (value) => {
  const id = Number(value);

  return Number.isSafeInteger(id) && id > 0;
};

const isValidQuantity = (value) => {
  if (String(value).trim() === "") return false;

  const quantity = Number(value);

  return Number.isSafeInteger(quantity) && quantity > 0;
};

const validateForm = (form) => {
  const errors = {};

  // Required references
  if (!isValidId(form.doctor_id)) {
    errors.doctor_id = "Please select a doctor.";
  }

  if (!isValidId(form.patient_id)) {
    errors.patient_id = "Please select a patient.";
  }

  if (!isValidId(form.hospital_id)) {
    errors.hospital_id = "Please select a hospital.";
  }

  if (!isValidId(form.operation_type_id)) {
    errors.operation_type_id = "Please select an operation type.";
  }

  // Operation details
  if (!/^\d{4}-\d{2}-\d{2}$/.test(form.operation_date)) {
    errors.operation_date = "Please select an operation date.";
  }

  if (!form.patient_access_code.trim()) {
    errors.patient_access_code = "Please enter the patient access code.";
  }

  // Materials
  if (!Array.isArray(form.items) || form.items.length === 0) {
    errors.items = "Add at least one material.";
    return errors;
  }

  const selectedProducts = new Set();

  form.items.forEach((item, index) => {
    const productKey = `items.${index}.product_id`;
    const quantityKey = `items.${index}.quantity`;

    if (!isValidId(item.product_id)) {
      errors[productKey] = "Please select a product.";
    } else {
      const productId = String(Number(item.product_id));

      if (selectedProducts.has(productId)) {
        errors[productKey] = "This product has already been selected.";
      } else {
        selectedProducts.add(productId);
      }
    }

    if (!isValidQuantity(item.quantity)) {
      errors[quantityKey] = "Quantity must be a positive whole number.";
    }
  });

  return errors;
};

const normalizeServerErrors = (serverErrors) => {
  if (!serverErrors || typeof serverErrors !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(serverErrors).map(([field, messages]) => [
      field,
      Array.isArray(messages) ? messages[0] : String(messages),
    ]),
  );
};

// ======================================================
// Reusable UI
// ======================================================

const SectionHeader = ({ icon: Icon, title, subtitle, action }) => (
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
        <Icon size={20} />
      </div>

      <div>
        <h2 className="text-base font-bold text-slate-800">{title}</h2>

        {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
      </div>
    </div>

    {action}
  </div>
);

const FormSection = ({ children }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
    {children}
  </div>
);

const FieldError = ({ message }) => {
  if (!message) return null;

  return (
    <p role="alert" className="mt-1.5 text-xs font-semibold text-red-700">
      {message}
    </p>
  );
};

// ======================================================
// Main Component
// ======================================================

const CreateOperationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const nextItemKey = useRef(1);

  const [createForm, setCreateForm] = useState(createInitialForm);

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const [addOperation, { isLoading: isCreating }] = useAddOperationMutation();

  // ====================================================
  // Clear Validation Errors
  // ====================================================

  const clearFieldError = (field) => {
    setErrors((previous) => {
      if (!previous[field]) return previous;

      const updated = { ...previous };
      delete updated[field];

      return updated;
    });

    setSubmitError("");
  };

  const clearItemErrors = () => {
    setErrors((previous) =>
      Object.fromEntries(
        Object.entries(previous).filter(
          ([field]) => !field.startsWith("items"),
        ),
      ),
    );

    setSubmitError("");
  };

  // ====================================================
  // Normal Inputs
  // ====================================================

  const handleCreateFormChange = (event) => {
    const { name, value } = event.target;

    setCreateForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    clearFieldError(name);
  };

  // ====================================================
  // Reference Selects
  // ====================================================

  const handleRelationChange = (field, relation, id, entity) => {
    setCreateForm((previous) => ({
      ...previous,
      [field]: id,
      [relation]: entity ?? null,
    }));

    clearFieldError(field);
  };

  // ====================================================
  // Operation Items
  // ====================================================

  const handleAddItem = () => {
    const clientKey = nextItemKey.current++;

    setCreateForm((previous) => ({
      ...previous,
      items: [
        ...previous.items,
        {
          clientKey,
          product_id: "",
          product: null,
          quantity: "1",
        },
      ],
    }));

    clearItemErrors();
  };

  const handleRemoveItem = (clientKey) => {
    setCreateForm((previous) => {
      if (previous.items.length <= 1) {
        return previous;
      }

      return {
        ...previous,
        items: previous.items.filter((item) => item.clientKey !== clientKey),
      };
    });

    clearItemErrors();
  };

  const handleItemChange = (clientKey, field, value, entity = null) => {
    setCreateForm((previous) => ({
      ...previous,
      items: previous.items.map((item) => {
        if (item.clientKey !== clientKey) {
          return item;
        }

        if (field === "product_id") {
          return {
            ...item,
            product_id: value,
            product: entity,
          };
        }

        return {
          ...item,
          [field]: value,
        };
      }),
    }));

    clearItemErrors();
  };

  // ====================================================
  // Submit
  // ====================================================

  const handleSubmitOperation = async (event) => {
    event.preventDefault();

    if (isCreating) return;

    const validationErrors = validateForm(createForm);

    setErrors(validationErrors);
    setSubmitError("");

    if (Object.keys(validationErrors).length > 0) {
      notifySonner("Please complete all required fields correctly.", "error");
      return;
    }

    const payload = {
      doctor_id: Number(createForm.doctor_id),
      patient_id: Number(createForm.patient_id),
      hospital_id: Number(createForm.hospital_id),
      operation_type_id: Number(createForm.operation_type_id),

      operation_date: createForm.operation_date,

      side: createForm.side || null,

      patient_access_code: createForm.patient_access_code.trim(),

      description: createForm.description.trim() || null,

      items: createForm.items.map((item) => ({
        product_id: Number(item.product_id),
        quantity: Number(item.quantity),
      })),
    };

    const isDoctor =
      location.pathname === "/doctor" ||
      location.pathname.startsWith("/doctor/");

    const scope = isDoctor ? "doctor" : "admin";
    try {
      const response = await addOperation({
        scope,
        data: payload,
      }).unwrap();

      notifySonner("Operation Created Successfully");

      const createdOperation = response?.data ?? response;

      const operationId = createdOperation?.id;

      const basePath = isDoctor ? "/doctor" : "/admin";

      if (operationId) {
        navigate(`${basePath}/operations/${operationId}`, {
          replace: true,
        });
      } else {
        navigate(`${basePath}/operations`, {
          replace: true,
        });
      }
    } catch (error) {
      const serverErrors = normalizeServerErrors(error?.data?.errors);

      setErrors(serverErrors);

      const message =
        error?.data?.message || "Failed to create operation. Please try again.";

      setSubmitError(message);
      notifySonner(message, "error");
    }
  };

  // ====================================================
  // Totals
  // ====================================================

  const selectedItems = createForm.items.filter((item) =>
    isValidId(item.product_id),
  );

  const totalQuantity = selectedItems.reduce(
    (total, item) =>
      total + (isValidQuantity(item.quantity) ? Number(item.quantity) : 0),
    0,
  );

  // ====================================================
  // JSX
  // ====================================================

  return (
    <div className="w-full space-y-6 pb-8">
      {/* Page Header */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-sky-600">
          <ClipboardPlus size={50} strokeWidth={1.7} className="shrink-0" />

          <div>
            <Text as="div" className="text-2xl font-bold text-sky-700">
              Create a New Operation
            </Text>

            <Text as="p" size="2" className="mt-1 text-slate-500">
              Register operation information and materials.
            </Text>
          </div>
        </div>

        <Link
          to="/admin/operations"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <ArrowLeft size={17} />
          Back to Operations
        </Link>
      </header>

      {/* Main Container */}
      <Box className="mx-auto w-full" maxWidth="1100px">
        <Card variant="ghost" className="border-none outline-none">
          <Flex direction="column" gap="4">
            <Form.Root
              noValidate
              onSubmit={handleSubmitOperation}
              className="space-y-5"
            >
              {/* ========================================
                  Patient & Medical Team
              ======================================== */}
              <FormSection>
                <SectionHeader
                  icon={Users}
                  title="Patient & Medical Team"
                  subtitle="Select the patient, doctor and medical facility."
                />

                <div className="mt-5 grid grid-cols-1 gap-5 border-t border-slate-100 pt-5 md:grid-cols-2">
                  {/* Patient */}
                  <OperationReferenceSelect
                    type="patient"
                    label="Patient"
                    value={createForm.patient_id}
                    selectedEntity={createForm.patient}
                    disabled={isCreating}
                    error={errors.patient_id}
                    onChange={(id, entity) =>
                      handleRelationChange("patient_id", "patient", id, entity)
                    }
                  />

                  {/* Doctor */}
                  <OperationReferenceSelect
                    type="doctor"
                    label="Doctor"
                    value={createForm.doctor_id}
                    selectedEntity={createForm.doctor}
                    disabled={isCreating}
                    error={errors.doctor_id}
                    onChange={(id, entity) =>
                      handleRelationChange("doctor_id", "doctor", id, entity)
                    }
                  />

                  {/* Hospital */}
                  <OperationReferenceSelect
                    type="hospital"
                    label="Hospital"
                    value={createForm.hospital_id}
                    selectedEntity={createForm.hospital}
                    disabled={isCreating}
                    error={errors.hospital_id}
                    onChange={(id, entity) =>
                      handleRelationChange(
                        "hospital_id",
                        "hospital",
                        id,
                        entity,
                      )
                    }
                  />

                  {/* Operation Type */}
                  <OperationReferenceSelect
                    type="operation_type"
                    label="Operation Type"
                    value={createForm.operation_type_id}
                    selectedEntity={createForm.operation_type}
                    disabled={isCreating}
                    error={errors.operation_type_id}
                    onChange={(id, entity) =>
                      handleRelationChange(
                        "operation_type_id",
                        "operation_type",
                        id,
                        entity,
                      )
                    }
                  />
                </div>
              </FormSection>

              {/* ========================================
                  Operation Information
              ======================================== */}
              <FormSection>
                <SectionHeader
                  icon={ClipboardPlus}
                  title="Operation Information"
                  subtitle="Enter the date, operation side and access details."
                />

                <div className="mt-5 grid grid-cols-1 gap-5 border-t border-slate-100 pt-5 md:grid-cols-2 lg:grid-cols-3">
                  {/* Operation Date */}
                  <Form.Field
                    name="operation_date"
                    className="grid content-start gap-1.5"
                  >
                    <Form.Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <CalendarDays size={16} />
                      Operation Date
                      <span className="text-red-600">*</span>
                    </Form.Label>

                    <Form.Control asChild>
                      <input
                        id="operation-date"
                        type="date"
                        name="operation_date"
                        value={createForm.operation_date}
                        onChange={handleCreateFormChange}
                        disabled={isCreating}
                        aria-invalid={Boolean(errors.operation_date)}
                        required
                        className={INPUT_CLASS}
                      />
                    </Form.Control>

                    <FieldError message={errors.operation_date} />
                  </Form.Field>

                  {/* Operation Side */}
                  <Form.Field
                    name="side"
                    className="grid content-start gap-1.5"
                  >
                    <Form.Label
                      htmlFor="operation-side"
                      className="flex items-center gap-2 text-sm font-medium text-slate-700"
                    >
                      <Layers3 size={16} />
                      Operation Side
                    </Form.Label>

                    <select
                      id="operation-side"
                      name="side"
                      value={createForm.side}
                      onChange={handleCreateFormChange}
                      disabled={isCreating}
                      className={INPUT_CLASS}
                    >
                      <option value="">Select Operation Side</option>

                      <option value="Left">Left</option>
                      <option value="Right">Right</option>
                      <option value="Bilateral">Bilateral</option>
                    </select>

                    <FieldError message={errors.side} />
                  </Form.Field>

                  {/* Patient Access Code */}
                  <Form.Field
                    name="patient_access_code"
                    className="grid content-start gap-1.5"
                  >
                    <Form.Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <KeyRound size={16} />
                      Patient Access Code
                      <span className="text-red-600">*</span>
                    </Form.Label>

                    <Form.Control asChild>
                      <input
                        id="patient-access-code"
                        name="patient_access_code"
                        type="text"
                        autoComplete="off"
                        maxLength={255}
                        value={createForm.patient_access_code}
                        onChange={handleCreateFormChange}
                        disabled={isCreating}
                        required
                        aria-invalid={Boolean(errors.patient_access_code)}
                        placeholder="Enter Patient Access Code"
                        className={INPUT_CLASS}
                      />
                    </Form.Control>

                    <FieldError message={errors.patient_access_code} />
                  </Form.Field>
                </div>

                {/* Description */}
                <Form.Field name="description" className="mt-5 grid gap-1.5">
                  <Form.Label
                    htmlFor="operation-description"
                    className="flex items-center gap-2 text-sm font-medium text-slate-700"
                  >
                    <FileText size={16} />
                    Operation Description
                  </Form.Label>

                  <Form.Control asChild>
                    <textarea
                      id="operation-description"
                      name="description"
                      rows={4}
                      value={createForm.description}
                      onChange={handleCreateFormChange}
                      disabled={isCreating}
                      placeholder="Enter additional details about the operation..."
                      className={`${INPUT_CLASS} resize-y leading-6`}
                    />
                  </Form.Control>

                  <FieldError message={errors.description} />
                </Form.Field>
              </FormSection>

              {/* ========================================
                  Operation Materials
              ======================================== */}
              <FormSection>
                <SectionHeader
                  icon={Package}
                  title="Operation Materials"
                  subtitle="Add products and specify the quantity of each material."
                  action={
                    <button
                      type="button"
                      onClick={handleAddItem}
                      disabled={isCreating}
                      className="inline-flex items-center cursor-pointer gap-2 rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Plus size={17} />
                      Add Material
                    </button>
                  }
                />

                <div className="mt-5 space-y-4 border-t border-slate-100 pt-5">
                  {createForm.items.map((item, index) => (
                    <div
                      key={item.clientKey}
                      className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
                    >
                      {/* Material Header */}
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <Package size={18} className="text-sky-700" />

                          <h3 className="text-sm font-bold text-slate-800">
                            Material #{index + 1}
                          </h3>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.clientKey)}
                          disabled={isCreating || createForm.items.length === 1}
                          title="Remove Material"
                          aria-label={`Remove material ${index + 1}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>

                      {/* Product & Quantity */}
                      <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
                        {/* Product */}
                        <OperationReferenceSelect
                          type="product"
                          label="Material / Product"
                          value={item.product_id}
                          selectedEntity={item.product}
                          disabled={isCreating}
                          error={errors[`items.${index}.product_id`]}
                          onChange={(id, entity) =>
                            handleItemChange(
                              item.clientKey,
                              "product_id",
                              id,
                              entity,
                            )
                          }
                        />

                        {/* Quantity */}
                        <div className="grid gap-1.5">
                          <label
                            htmlFor={`item-quantity-${item.clientKey}`}
                            className="text-sm font-medium text-slate-700"
                          >
                            Quantity
                            <span className="ml-1 text-red-600">*</span>
                          </label>

                          <input
                            id={`item-quantity-${item.clientKey}`}
                            type="number"
                            min="1"
                            step="1"
                            inputMode="numeric"
                            value={item.quantity}
                            onChange={(event) =>
                              handleItemChange(
                                item.clientKey,
                                "quantity",
                                event.target.value,
                              )
                            }
                            disabled={isCreating}
                            required
                            aria-invalid={Boolean(
                              errors[`items.${index}.quantity`],
                            )}
                            className={INPUT_CLASS}
                          />

                          <FieldError
                            message={errors[`items.${index}.quantity`]}
                          />
                        </div>
                      </div>

                      {/* Selected Product Details */}
                      {item.product && (
                        <div className="mt-4 rounded-lg border border-sky-100 bg-white px-3 py-2">
                          <p className="text-xs font-medium text-slate-600">
                            Selected Product
                          </p>

                          <p className="mt-1 text-sm font-semibold text-sky-800">
                            {item.product.name}
                          </p>

                          {item.product.code && (
                            <p className="mt-1 font-mono text-xs text-slate-500">
                              Code: {item.product.code}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <FieldError message={errors.items} />

                {/* Materials Summary */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-sky-100 bg-sky-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-sky-800">
                    <Package size={18} />
                    Materials Summary
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <span className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-700">
                      Selected Materials: {selectedItems.length}
                    </span>

                    <span className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-700">
                      Total Quantity: {totalQuantity}
                    </span>
                  </div>
                </div>
              </FormSection>

              {/* ========================================
                  Server Error
              ======================================== */}
              {submitError && (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
                >
                  <AlertCircle size={19} className="mt-0.5 shrink-0" />

                  <div>
                    <p className="font-semibold">Failed to Create Operation</p>

                    <p className="mt-1">{submitError}</p>
                  </div>
                </div>
              )}

              {/* ========================================
                  Submit Actions
              ======================================== */}
              <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-200 pt-5">
                <Link
                  to="/admin/operations"
                  aria-disabled={isCreating}
                  onClick={(event) => {
                    if (isCreating) event.preventDefault();
                  }}
                  className={`inline-flex min-h-10 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 ${
                    isCreating ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  Cancel
                </Link>

                <Form.Submit asChild>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="inline-flex min-h-10 min-w-44 items-center justify-center gap-2 rounded-lg bg-sky-700 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isCreating ? (
                      <>
                        <LoaderCircle size={18} className="animate-spin" />
                        Creating Operation...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Create Operation
                      </>
                    )}
                  </button>
                </Form.Submit>
              </div>
            </Form.Root>
          </Flex>
        </Card>
      </Box>
    </div>
  );
};

export default CreateOperationPage;
