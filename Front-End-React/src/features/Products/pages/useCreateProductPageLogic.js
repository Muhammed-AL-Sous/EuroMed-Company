import { useState } from "react";
import { useAddProductMutation } from "../ProductsApiSlice";
import { notifySonner } from "../../../lib/notifySonner";
import { useGetManufacturersQuery } from "../../manufacturers/ManufacturersApiSlice";
import { useGetCategoriesQuery } from "../../categories/CategoriesApiSlice";
import { useGetSubCategoriesQuery } from "../../subCategories/SubCategoriesApiSlice";

const useCreateProductPageLogic = () => {
  const [createForm, setCreateForm] = useState({
    code: "",
    name: "",
    manufacturer_id: "",
    subcategory_id: "",
    category_id: "",
    image_url: "",
  });

  const [errors, setErrors] = useState({});
  const [addProduct, { isLoading: isCreating }] = useAddProductMutation();
  const [productImage, setProductImage] = useState(null);
  const [imageResetKey, setImageResetKey] = useState(0);
  const { data: subcategories = [] } = useGetSubCategoriesQuery();
  const subCategoriesResponse = subcategories?.subcategories ?? [];
  const { data: categories = [] } = useGetCategoriesQuery();
  const categoriesResponse = categories?.categories ?? [];
  const { data: manufacturers = [] } = useGetManufacturersQuery();
  const manufacturersResponse = manufacturers?.manufacturers ?? [];

  const validateSelectFields = () => {
    const newErrors = {};
    if (!createForm.manufacturer_id) {
      newErrors.manufacturer_id = "Please Select The Product Manufacturer";
    }
    if (!createForm.subcategory_id) {
      newErrors.subcategory_id = "Please Select The Product Subcategory";
    }
    if (!createForm.category_id) {
      newErrors.category_id = "Please Select The Product Category";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateFormChange = (event) => {
    const { name, value } = event.target;

    setCreateForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    const isValid = validateSelectFields();
    if (!isValid) {
      return;
    }
    const formData = new FormData();
    formData.append("code", createForm.code.trim());
    formData.append("name", createForm.name.trim());
    formData.append(
      "manufacturer_id",
      String(Number(createForm.manufacturer_id)),
    );
    formData.append(
      "subcategory_id",
      String(Number(createForm.subcategory_id)),
    );
    formData.append("category_id", String(Number(createForm.category_id)));
    if (productImage) {
      formData.append("image", productImage);
    }
    try {
      await addProduct(formData).unwrap();
      setProductImage(null);

      // Reset ProductImageUpload
      setImageResetKey((prev) => prev + 1);
      setCreateForm({
        code: "",
        name: "",
        manufacturer_id: "",
        subcategory_id: "",
        category_id: "",
        image_url: "",
      });
      setErrors({});
      notifySonner("Product Added Successfully");
    } catch (error) {
      console.error("Failed To Add Product:", error);
      notifySonner(error?.data?.message || "Failed to Add Product", "error");
    }
  };

  return {
    createForm,
    setCreateForm,
    errors,
    setErrors,
    isCreating,
    setProductImage,
    imageResetKey,
    subCategoriesResponse,
    categoriesResponse,
    manufacturersResponse,
    handleCreateFormChange,
    handleSubmitProduct,
  };
};

export default useCreateProductPageLogic;
