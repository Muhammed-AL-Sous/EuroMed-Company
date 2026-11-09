import { notifySonner } from "../../../lib/notifySonner";
import { useState } from "react";
import { useAddCategoryMutation } from "../CategoriesApiSlice";

const useCreateCategoryPageLogic = () => {
  const [createForm, setCreateForm] = useState({
    code: "",
    name: "",
    description: "",
  });
  const [addCategory, { isLoading: isCreating }] = useAddCategoryMutation();

  const handleCreateFormChange = (event) => {
    const { name, value } = event.target;
    setCreateForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    try {
      await addCategory(createForm).unwrap();
      setCreateForm({
        code: "",
        name: "",
        description: "",
      });
      notifySonner("Category Added Successfully");
    } catch (error) {
      console.error("Failed to add category:", error);
      notifySonner(error?.data?.message || "Failed to add category", "error");
    }
  };

  return {
    createForm,
    isCreating,
    handleCreateFormChange,
    handleSubmitCategory,
  };
};

export default useCreateCategoryPageLogic;
