const useOperationEditFormLogic = (hookProps0) => {
  const { setEditForm, setFormErrors } = hookProps0;

  const clearError = (field) => {
    setFormErrors((previous) => {
      const updated = {
        ...previous,
      };
      delete updated[field];
      return updated;
    });
  };

  const handleRelationChange = (name, relation, id, entity) => {
    setEditForm((previous) => ({
      ...previous,
      [name]: id,
      [relation]: entity,
    }));
    clearError(name);
  };

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setEditForm((previous) => ({
      ...previous,
      [name]: value,
    }));
    clearError(name);
  };

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

  return {
    handleRelationChange,
    handleFieldChange,
    handleItemChange,
    handleAddItem,
    handleRemoveItem,
  };
};

export default useOperationEditFormLogic;
