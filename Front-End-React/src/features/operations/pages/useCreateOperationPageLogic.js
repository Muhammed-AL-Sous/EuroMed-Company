import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useAddOperationMutation } from "../OperationsApiSlice";
import { notifySonner } from "../../../lib/notifySonner";

const useCreateOperationPageLogic = () => {
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

  const navigate = useNavigate();
  const location = useLocation();
  const nextItemKey = useRef(1);
  const [createForm, setCreateForm] = useState(createInitialForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [addOperation, { isLoading: isCreating }] = useAddOperationMutation();

  const clearFieldError = (field) => {
    setErrors((previous) => {
      if (!previous[field]) return previous;
      const updated = {
        ...previous,
      };
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

  const handleCreateFormChange = (event) => {
    const { name, value } = event.target;
    setCreateForm((previous) => ({
      ...previous,
      [name]: value,
    }));
    clearFieldError(name);
  };

  const handleRelationChange = (field, relation, id, entity) => {
    setCreateForm((previous) => ({
      ...previous,
      [field]: id,
      [relation]: entity ?? null,
    }));
    clearFieldError(field);
  };

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

  const selectedItems = createForm.items.filter((item) =>
    isValidId(item.product_id),
  );

  const totalQuantity = selectedItems.reduce(
    (total, item) =>
      total + (isValidQuantity(item.quantity) ? Number(item.quantity) : 0),
    0,
  );

  return {
    createForm,
    errors,
    submitError,
    isCreating,
    handleCreateFormChange,
    handleRelationChange,
    handleAddItem,
    handleRemoveItem,
    handleItemChange,
    handleSubmitOperation,
    selectedItems,
    totalQuantity,
  };
};

export default useCreateOperationPageLogic;
