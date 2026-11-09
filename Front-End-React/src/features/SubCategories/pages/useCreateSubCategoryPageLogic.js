import { notifySonner } from "../../../lib/notifySonner";
import { useState } from "react";
import { useAddSubCategoryMutation } from "../SubCategoriesApiSlice";

const useCreateSubCategoryPageLogic = () => {
  const [createForm, setCreateForm] = useState({
    code: "",
    name: "",
    description: "",
  });

  const [subCategoryImage, setSubCategoryImage] = useState(null);
  const [imageResetKey, setImageResetKey] = useState(0);
  const [addSubCategory, { isLoading: isCreating }] =
    useAddSubCategoryMutation();

  const handleCreateFormChange = (event) => {
    const { name, value } = event.target;
    setCreateForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmitCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("code", createForm.code.trim());
    formData.append("name", createForm.name.trim());
    formData.append("description", createForm.description.trim());
    if (subCategoryImage) {
      formData.append("image", subCategoryImage);
    }
    try {
      await addSubCategory(formData).unwrap();
      setSubCategoryImage(null);

      // Reset ProductImageUpload
      setImageResetKey((prev) => prev + 1);
      setCreateForm({
        code: "",
        name: "",
        description: "",
        image_url: "",
      });
      notifySonner("SubCategory Added Successfully");
    } catch (error) {
      console.error("Failed to add subcategory:", error);
      notifySonner(
        error?.data?.message || "Failed to add subcategory",
        "error",
      );
    }
  };

  return {
    createForm,
    setSubCategoryImage,
    imageResetKey,
    isCreating,
    handleCreateFormChange,
    handleSubmitCategory,
  };
};

export default useCreateSubCategoryPageLogic;
