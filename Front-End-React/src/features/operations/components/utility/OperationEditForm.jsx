import { Plus, Trash2, Package } from "lucide-react";

import OperationReferenceSelect from "../utility/OperationReferenceSelect";

import { getEntityName } from "../utility/OperationEntityUtils";

const relationFields = [
  { name: "doctor_id", relation: "doctor", label: "Doctor", type: "doctor" },
  {
    name: "patient_id",
    relation: "patient",
    label: "Patient",
    type: "patient",
  },
  {
    name: "hospital_id",
    relation: "hospital",
    label: "Hospital",
    type: "hospital",
  },
  {
    name: "operation_type_id",
    relation: "operation_type",
    label: "Operation Type",
    type: "operation_type",
  },
];

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:opacity-60";

const OperationEditForm = ({
  editForm,
  setEditForm,
  formErrors,
  setFormErrors,
  isUpdating,
}) => {
  const clearError = (field) => {
    setFormErrors((previous) => {
      const updated = { ...previous };
      delete updated[field];
      return updated;
    });
  };

  // Update Relation
  const handleRelationChange = (name, relation, id, entity) => {
    setEditForm((previous) => ({
      ...previous,
      [name]: id,
      [relation]: entity,
    }));

    clearError(name);
  };

  // Update Normal Field
  const handleFieldChange = (event) => {
    const { name, value } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    clearError(name);
  };

  // Update Item
  const handleItemChange = (index, field, value, entity = null) => {
    setEditForm((previous) => ({
      ...previous,
      items: previous.items.map((item, itemIndex) => {
        if (itemIndex !== index) return item;

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

    clearError(`items.${index}.${field}`);
  };

  // Add Item
  const handleAddItem = () => {
    setEditForm((previous) => ({
      ...previous,
      items: [
        ...previous.items,
        {
          clientKey: crypto.randomUUID(),
          product_id: "",
          quantity: "1",
          product: null,
        },
      ],
    }));

    clearError("items");
  };

  // Remove Item
  const handleRemoveItem = (index) => {
    setEditForm((previous) => ({
      ...previous,
      items: previous.items.filter((_, itemIndex) => itemIndex !== index),
    }));

    setFormErrors((previous) =>
      Object.fromEntries(
        Object.entries(previous).filter(([key]) => !key.startsWith("items.")),
      ),
    );
  };

  return (
    <div className="space-y-5">
      {/* Operation Relations */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {relationFields.map((field) => (
          <OperationReferenceSelect
            key={field.name}
            type={field.type}
            label={field.label}
            value={editForm[field.name]}
            selectedEntity={editForm[field.relation]}
            disabled={isUpdating}
            error={formErrors[field.name]}
            onChange={(id, entity) =>
              handleRelationChange(field.name, field.relation, id, entity)
            }
          />
        ))}
      </div>

      {/* Operation Date and Side */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label
            htmlFor="edit-operation-date"
            className="text-sm font-semibold text-slate-700"
          >
            Operation Date
          </label>

          <input
            id="edit-operation-date"
            name="operation_date"
            type="date"
            value={editForm.operation_date}
            onChange={handleFieldChange}
            disabled={isUpdating}
            className={inputClass}
          />

          {formErrors.operation_date && (
            <p className="text-xs text-red-600">{formErrors.operation_date}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="edit-operation-side"
            className="text-sm font-semibold text-slate-700"
          >
            Operation Side
          </label>

          <select
            id="edit-operation-side"
            name="side"
            value={editForm.side}
            onChange={handleFieldChange}
            disabled={isUpdating}
            className={inputClass}
          >
            <option value="">Not Specified</option>
            <option value="Left">Left</option>
            <option value="Right">Right</option>
            <option value="Bilateral">Bilateral</option>
          </select>

          {formErrors.side && (
            <p className="text-xs text-red-600">{formErrors.side}</p>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label
          htmlFor="edit-operation-description"
          className="text-sm font-semibold text-slate-700"
        >
          Description
        </label>

        <textarea
          id="edit-operation-description"
          name="description"
          value={editForm.description}
          onChange={handleFieldChange}
          disabled={isUpdating}
          rows={3}
          className={`${inputClass} resize-y`}
          placeholder="Enter operation description..."
        />

        {formErrors.description && (
          <p className="text-xs text-red-600">{formErrors.description}</p>
        )}
      </div>

      {/* Operation Materials */}
      <div className="border-t border-slate-200 pt-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Package size={18} className="text-sky-700" />

            <h3 className="text-sm font-bold text-slate-800">
              Operation Materials
            </h3>

            <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700">
              {editForm.items.length}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddItem}
            disabled={isUpdating}
            className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sky-700 disabled:opacity-60"
          >
            <Plus size={15} />
            Add Material
          </button>
        </div>

        {formErrors.items && (
          <p role="alert" className="mb-3 text-xs text-red-600">
            {formErrors.items}
          </p>
        )}

        {editForm.items.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">
            No Materials Added
          </p>
        )}

        <div className="space-y-3">
          {editForm.items.map((item, index) => {
            const product = item.product;

            const productName = getEntityName(product);

            const productCode = product?.code ?? product?.sku;

            const manufacturer = getEntityName(product?.manufacturer);

            const category = getEntityName(product?.category);

            return (
              <div
                key={item.clientKey}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                {/* Material Header */}
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package size={16} className="text-sky-600" />

                    <span className="text-sm font-bold text-slate-700">
                      Material #{index + 1}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    disabled={isUpdating}
                    aria-label={`Remove material ${index + 1}`}
                    className="cursor-pointer rounded-lg border border-red-400 p-1.5 text-red-500 transition hover:bg-red-50 disabled:opacity-60"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_110px]">
                  {/* Product Selector */}
                  <OperationReferenceSelect
                    type="product"
                    label="Product"
                    value={item.product_id}
                    selectedEntity={item.product}
                    disabled={isUpdating}
                    error={formErrors[`items.${index}.product_id`]}
                    onChange={(id, entity) =>
                      handleItemChange(index, "product_id", id, entity)
                    }
                  />

                  {/* Quantity */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor={`material-quantity-${index}`}
                      className="text-sm font-semibold text-slate-700"
                    >
                      Quantity
                    </label>

                    <input
                      id={`material-quantity-${index}`}
                      type="number"
                      min="1"
                      step="1"
                      value={item.quantity}
                      onChange={(event) =>
                        handleItemChange(index, "quantity", event.target.value)
                      }
                      disabled={isUpdating}
                      className={inputClass}
                    />

                    {formErrors[`items.${index}.quantity`] && (
                      <p className="text-xs text-red-600">
                        {formErrors[`items.${index}.quantity`]}
                      </p>
                    )}
                  </div>
                </div>

                {/* Selected Product Details */}
                {product && (
                  <div className="mt-4 rounded-lg border border-sky-100 bg-sky-50 p-3">
                    <p className="text-sm font-bold text-sky-900">
                      {productName || "Selected Product"}
                    </p>

                    <div className="mt-2 grid grid-cols-1 gap-2 text-xs text-slate-600 sm:grid-cols-2">
                      {productCode && (
                        <p>
                          <span className="font-semibold">Code:</span>{" "}
                          {productCode}
                        </p>
                      )}

                      {manufacturer && (
                        <p>
                          <span className="font-semibold">Manufacturer:</span>{" "}
                          {manufacturer}
                        </p>
                      )}

                      {category && (
                        <p>
                          <span className="font-semibold">Category:</span>{" "}
                          {category}
                        </p>
                      )}

                      {product.model && (
                        <p>
                          <span className="font-semibold">Model:</span>{" "}
                          {product.model}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OperationEditForm;
