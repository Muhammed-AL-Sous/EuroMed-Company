import { useState } from "react";
import { notifySonner } from "../../../lib/notifySonner";
import { useAddManufacturerMutation } from "../ManufacturersApiSlice";

const useCreateManufacturerPageLogic = () => {
  const [createForm, setCreateForm] = useState({
    code: "",
    name: "",
    origin: "",
    logo_text: "",
    description: "",
    website: "",
    is_active: true,
  });

  const [addManufacturer, { isLoading: isCreating }] =
    useAddManufacturerMutation();

  const handleCreateFormChange = (event) => {
    const { name, value } = event.target;
    setCreateForm((currentForm) => ({
      ...currentForm,
      [name]:
        name === "is_active"
          ? value === "true"
          : name === "origin"
            ? value.toUpperCase()
            : value,
    }));
  };

  const handleSubmitManufacturer = async (e) => {
    e.preventDefault();
    try {
      await addManufacturer(createForm).unwrap();
      setCreateForm({
        code: "",
        name: "",
        origin: "",
        logo_text: "",
        description: "",
        website: "",
        is_active: true,
      });
      notifySonner("Manufacturer Added Successfully");
    } catch (error) {
      console.error("Failed to add manufacturer:", error);
      notifySonner(
        error?.data?.message || "Failed to add manufacturer",
        "error",
      );
    }
  };

  return {
    createForm,
    isCreating,
    handleCreateFormChange,
    handleSubmitManufacturer,
  };
};

export default useCreateManufacturerPageLogic;
