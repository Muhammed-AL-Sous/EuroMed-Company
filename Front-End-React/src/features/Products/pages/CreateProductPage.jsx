// React
import { useState } from "react";

// Api Slice
import { useAddProductMutation } from "../ProductsApiSlice";

// ========== External Library ========== //
// Toast Notify
import { notifySonner } from "../../../lib/notifySonner";

// (Radix)
import { Form } from "radix-ui";
import { Box, Card, Flex, Text } from "@radix-ui/themes";
import * as Select from "@radix-ui/react-select";

// Icons
import {
  Check,
  ChevronDown,
  Hash,
  LayersMinus,
  PackageSearch,
  RobotArm,
  Box as BoxIcon,
  Blocks,
  Save,
} from "lucide-react";
import { useGetManufacturersQuery } from "../../manufacturers/ManufacturersApiSlice";
import { useGetCategoriesQuery } from "../../categories/CategoriesApiSlice";
import { useGetSubCategoriesQuery } from "../../subCategories/SubCategoriesApiSlice";

// Utility Component
import ProductImageUpload from "../components/utility/ProductImageUpload";

const INPUT_CLASS =
  "box-border w-full rounded-xl border-2 border-sky-700 " +
  "bg-slate-50 px-4 py-2.5 text-sm text-slate-700 " +
  "outline-none transition-colors " +
  "placeholder:text-slate-400 " +
  "focus:border-sky-400 focus:bg-white " +
  "disabled:cursor-not-allowed disabled:opacity-60";

const CreateProductPage = () => {
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
  // ==================================================
  // Subcategories
  // ==================================================

  const { data: subcategories = [] } = useGetSubCategoriesQuery();

  const subCategoriesResponse = subcategories?.subcategories ?? [];

  // ==================================================
  // categories
  // ==================================================

  const { data: categories = [] } = useGetCategoriesQuery();

  const categoriesResponse = categories?.categories ?? [];

  // ==================================================
  // Manufacturers
  // ==================================================

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

  return (
    <div>
      {/* ============= Header ============= */}
      <div className="flex gap-4 items-center text-sky-600">
        <LayersMinus size={55} />
        <Text className="font-bold text-2xl ">Create a New Product</Text>
      </div>
      {/* ============= Section ============= */}
      <Box className="mx-auto border-none outline-none" maxWidth="900px">
        <Card variant="ghost" className="border-none outline-none">
          <Flex direction="column">
            <img
              className="max-h-100 mx-auto"
              src="/images/create_product.png"
            />

            <Box className="max-w-full border border-slate-200 shadow-lg rounded-2xl p-5">
              <Form.Root className="w-full" onSubmit={handleSubmitProduct}>
                <ProductImageUpload
                  key={imageResetKey}
                  showIcon={true}
                  onChange={setProductImage}
                  title="Product Image"
                  subTitle="Upload an image for your product."
                />
                <div className="mt-5 grid grid-cols-1 gap-5 border-t border-slate-100 pt-5 md:grid-cols-2 lg:grid-cols-3 space-y-3">
                  {/* =========== Product Code =========== */}
                  <Form.Field
                    className="grid content-start gap-1.5"
                    name="code"
                  >
                    <Form.Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Hash size={16} />
                      Product Code
                    </Form.Label>
                    <Form.Control asChild>
                      <input
                        className={INPUT_CLASS}
                        required
                        id="hospital-code"
                        name="code"
                        type="text"
                        value={createForm.code}
                        onChange={handleCreateFormChange}
                        disabled={isCreating}
                        placeholder="Enter Product Code"
                      />
                    </Form.Control>

                    <Form.Message
                      className="text-xs text-red-700 font-bold mt-2"
                      match="valueMissing"
                    >
                      Please Enter The Product Code
                    </Form.Message>
                    <Form.Message
                      className="text-[13px] text-red-700 opacity-80"
                      match="typeMismatch"
                    >
                      Please Provide a Valid Product Code
                    </Form.Message>
                  </Form.Field>

                  {/* =========== Product Name =========== */}
                  <Form.Field
                    className="grid content-start gap-1.5"
                    name="name"
                  >
                    <Form.Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <PackageSearch size={16} />
                      Product Name
                    </Form.Label>
                    <Form.Control asChild>
                      <input
                        className={INPUT_CLASS}
                        required
                        id="hospital-name"
                        name="name"
                        type="text"
                        value={createForm.name}
                        onChange={handleCreateFormChange}
                        disabled={isCreating}
                        placeholder="Enter Product Name"
                      />
                    </Form.Control>

                    <Form.Message
                      className="text-xs text-red-700 font-bold mt-2"
                      match="valueMissing"
                    >
                      Please Enter The Product Name
                    </Form.Message>
                    <Form.Message
                      className="text-[13px] text-red-700 opacity-80"
                      match="typeMismatch"
                    >
                      Please Provide a Valid Product Name
                    </Form.Message>
                  </Form.Field>

                  {/* =========== Product Manufacturer =========== */}
                  <Form.Field
                    className="grid content-start gap-1.5"
                    name="manufacturer"
                  >
                    <Form.Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <RobotArm size={16} />
                      Product Manufacturer
                    </Form.Label>

                    <Select.Root
                      value={String(createForm.manufacturer_id || "all")}
                      onValueChange={(value) => {
                        const manufacturer_id = value === "all" ? "" : value;

                        setCreateForm((prev) => ({
                          ...prev,
                          manufacturer_id,
                        }));

                        if (manufacturer_id) {
                          setErrors((prev) => ({
                            ...prev,
                            manufacturer_id: undefined,
                          }));
                        }
                      }}
                    >
                      <Select.Trigger
                        aria-label="Filter by manufacturer"
                        className="
                                          inline-flex
                                          min-w-55
                                          items-center
                                          justify-between
                                          bg-slate-50
                                          gap-3
                                          rounded-xl
                                          px-4
                                          py-2.5
                                          text-sm
                                          text-slate-700
                                          transition-colors
                                          hover:bg-white
                                          outline-none border-2 border-sky-700 focus:border-sky-400
                                          focus:ring-1
                                          focus:ring-sky-500
                                          data-placeholder:text-slate-500"
                      >
                        <Select.Value placeholder="All Manufacturers" />

                        <Select.Icon>
                          <ChevronDown size={18} className="text-slate-500" />
                        </Select.Icon>
                      </Select.Trigger>

                      <Select.Portal>
                        <Select.Content
                          position="popper"
                          sideOffset={6}
                          className="
                z-50
                max-h-64
                min-w-55
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                shadow-lg
                animate-in
                fade-in-0
                zoom-in-95
              "
                        >
                          <Select.Viewport className="p-1.5">
                            <Select.Item
                              value="all"
                              className="
                    relative
                    flex
                    cursor-pointer
                    select-none
                    items-center
                    rounded-lg
                    py-2.5
                    pl-3
                    pr-9
                    text-sm
                  text-slate-700
                    outline-none
                  data-highlighted:bg-sky-50
                  data-highlighted:text-sky-700
                  data-[state=checked]:bg-sky-50
                    data-[state=checked]:font-medium
                  "
                            >
                              <Select.ItemText>
                                All Manufacturers
                              </Select.ItemText>

                              <Select.ItemIndicator className="absolute right-3">
                                <Check size={16} className="text-sky-600" />
                              </Select.ItemIndicator>
                            </Select.Item>

                            {/* <Select.Separator className="my-1.5 h-px bg-slate-100" /> */}

                            {(Array.isArray(manufacturersResponse)
                              ? manufacturersResponse
                              : []
                            ).map((manufacturer) => (
                              <Select.Item
                                key={manufacturer.id}
                                value={String(manufacturer.id)}
                                className="
                      relative
                      flex
                      cursor-pointer
                      select-none
                      items-center
                      rounded-lg
                      py-2.5
                      pl-3
                      pr-9
                      text-sm
                    text-slate-700
                      outline-none
                    data-highlighted:bg-sky-50
                    data-highlighted:text-sky-700
                    data-[state=checked]:bg-sky-50
                      data-[state=checked]:font-medium
                    "
                              >
                                <Select.ItemText>
                                  {manufacturer.name}
                                </Select.ItemText>

                                <Select.ItemIndicator className="absolute right-3">
                                  <Check size={16} className="text-sky-600" />
                                </Select.ItemIndicator>
                              </Select.Item>
                            ))}
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>

                    {errors.manufacturer_id && (
                      <p className="mt-2 text-xs font-bold text-red-700">
                        {errors.manufacturer_id}
                      </p>
                    )}
                  </Form.Field>

                  {/* =========== Product SubCategory =========== */}
                  <Form.Field
                    className="grid content-start gap-1.5"
                    name="subcategory"
                  >
                    <Form.Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <BoxIcon size={16} />
                      Product SubCategory
                    </Form.Label>

                    <Select.Root
                      value={String(createForm.subcategory_id || "all")}
                      onValueChange={(value) => {
                        const subcategory_id = value === "all" ? "" : value;

                        setCreateForm((prev) => ({
                          ...prev,
                          subcategory_id,
                        }));

                        if (subcategory_id) {
                          setErrors((prev) => ({
                            ...prev,
                            subcategory_id: undefined,
                          }));
                        }
                      }}
                    >
                      <Select.Trigger
                        aria-label="Filter by subcategory"
                        className="
                                          inline-flex
                                          min-w-55
                                          items-center
                                          justify-between
                                          bg-slate-50
                                          gap-3
                                          rounded-xl
                                          px-4
                                          py-2.5
                                          text-sm
                                          text-slate-700
                                          transition-colors
                                          hover:bg-white
                                          outline-none border-2 border-sky-700 focus:border-sky-400
                                          focus:ring-1
                                          focus:ring-sky-500
                                          data-placeholder:text-slate-500"
                      >
                        <Select.Value placeholder="All Subcategories" />

                        <Select.Icon>
                          <ChevronDown size={18} className="text-slate-500" />
                        </Select.Icon>
                      </Select.Trigger>

                      <Select.Portal>
                        <Select.Content
                          position="popper"
                          sideOffset={6}
                          className="
                z-50
                max-h-64
                min-w-55
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                shadow-lg
                animate-in
                fade-in-0
                zoom-in-95
              "
                        >
                          <Select.Viewport className="p-1.5">
                            <Select.Item
                              value="all"
                              className="
                    relative
                    flex
                    cursor-pointer
                    select-none
                    items-center
                    rounded-lg
                    py-2.5
                    pl-3
                    pr-9
                    text-sm
                  text-slate-700
                    outline-none
                  data-highlighted:bg-sky-50
                  data-highlighted:text-sky-700
                  data-[state=checked]:bg-sky-50
                    data-[state=checked]:font-medium
                  "
                            >
                              <Select.ItemText>
                                All Subcategories
                              </Select.ItemText>

                              <Select.ItemIndicator className="absolute right-3">
                                <Check size={16} className="text-sky-600" />
                              </Select.ItemIndicator>
                            </Select.Item>

                            {/* <Select.Separator className="my-1.5 h-px bg-slate-100" /> */}

                            {(Array.isArray(subCategoriesResponse)
                              ? subCategoriesResponse
                              : []
                            ).map((subcategory) => (
                              <Select.Item
                                key={subcategory.id}
                                value={String(subcategory.id)}
                                className="
                      relative
                      flex
                      cursor-pointer
                      select-none
                      items-center
                      rounded-lg
                      py-2.5
                      pl-3
                      pr-9
                      text-sm
                    text-slate-700
                      outline-none
                    data-highlighted:bg-sky-50
                    data-highlighted:text-sky-700
                    data-[state=checked]:bg-sky-50
                      data-[state=checked]:font-medium
                    "
                              >
                                <Select.ItemText>
                                  {subcategory.name}
                                </Select.ItemText>

                                <Select.ItemIndicator className="absolute right-3">
                                  <Check size={16} className="text-sky-600" />
                                </Select.ItemIndicator>
                              </Select.Item>
                            ))}
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>

                    {errors.subcategory_id && (
                      <p className="mt-2 text-xs font-bold text-red-700">
                        {errors.subcategory_id}
                      </p>
                    )}
                  </Form.Field>

                  {/* =========== Product Category =========== */}
                  <Form.Field
                    className="grid content-start gap-1.5"
                    name="category"
                  >
                    <Form.Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Blocks size={16} />
                      Product Category
                    </Form.Label>

                    <Select.Root
                      value={String(createForm.category_id || "all")}
                      onValueChange={(value) => {
                        const category_id = value === "all" ? "" : value;

                        setCreateForm((prev) => ({
                          ...prev,
                          category_id,
                        }));

                        if (category_id) {
                          setErrors((prev) => ({
                            ...prev,
                            category_id: undefined,
                          }));
                        }
                      }}
                    >
                      <Select.Trigger
                        aria-label="Filter by category"
                        className="
                                          inline-flex
                                          min-w-55
                                          items-center
                                          justify-between
                                          bg-slate-50
                                          gap-3
                                          rounded-xl
                                          px-4
                                          py-2.5
                                          text-sm
                                          text-slate-700
                                          transition-colors
                                          hover:bg-white
                                          outline-none border-2 border-sky-700 focus:border-sky-400
                                          focus:ring-1
                                          focus:ring-sky-500
                                          data-placeholder:text-slate-500"
                      >
                        <Select.Value placeholder="All Categories" />

                        <Select.Icon>
                          <ChevronDown size={18} className="text-slate-500" />
                        </Select.Icon>
                      </Select.Trigger>

                      <Select.Portal>
                        <Select.Content
                          position="popper"
                          sideOffset={6}
                          className="
                z-50
                max-h-64
                min-w-55
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                shadow-lg
                animate-in
                fade-in-0
                zoom-in-95
              "
                        >
                          <Select.Viewport className="p-1.5">
                            <Select.Item
                              value="all"
                              className="
                    relative
                    flex
                    cursor-pointer
                    select-none
                    items-center
                    rounded-lg
                    py-2.5
                    pl-3
                    pr-9
                    text-sm
                  text-slate-700
                    outline-none
                  data-highlighted:bg-sky-50
                  data-highlighted:text-sky-700
                  data-[state=checked]:bg-sky-50
                    data-[state=checked]:font-medium
                  "
                            >
                              <Select.ItemText>All Categories</Select.ItemText>

                              <Select.ItemIndicator className="absolute right-3">
                                <Check size={16} className="text-sky-600" />
                              </Select.ItemIndicator>
                            </Select.Item>

                            {/* <Select.Separator className="my-1.5 h-px bg-slate-100" /> */}

                            {(Array.isArray(categoriesResponse)
                              ? categoriesResponse
                              : []
                            ).map((category) => (
                              <Select.Item
                                key={category.id}
                                value={String(category.id)}
                                className="
                      relative
                      flex
                      cursor-pointer
                      select-none
                      items-center
                      rounded-lg
                      py-2.5
                      pl-3
                      pr-9
                      text-sm
                    text-slate-700
                      outline-none
                    data-highlighted:bg-sky-50
                    data-highlighted:text-sky-700
                    data-[state=checked]:bg-sky-50
                      data-[state=checked]:font-medium
                    "
                              >
                                <Select.ItemText>
                                  {category.name}
                                </Select.ItemText>

                                <Select.ItemIndicator className="absolute right-3">
                                  <Check size={16} className="text-sky-600" />
                                </Select.ItemIndicator>
                              </Select.Item>
                            ))}
                          </Select.Viewport>
                        </Select.Content>
                      </Select.Portal>
                    </Select.Root>

                    {errors.category_id && (
                      <p className="mt-2 text-xs font-bold text-red-700">
                        {errors.category_id}
                      </p>
                    )}
                  </Form.Field>
                </div>

                {/* =============== Submit Button =============== */}
                {isCreating ? (
                  <div
                    role="status"
                    aria-label="Creating hospital"
                    className="mx-auto mt-2.5 h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600"
                  />
                ) : (
                  <Form.Submit asChild>
                    <button
                      disabled={isCreating}
                      className="flex mx-auto mt-6 cursor-pointer min-h-10 min-w-44 items-center justify-center gap-2 rounded-lg bg-sky-700 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Save size={18} />
                      Create a Product
                    </button>
                  </Form.Submit>
                )}
              </Form.Root>
            </Box>
          </Flex>
        </Card>
      </Box>
    </div>
  );
};

export default CreateProductPage;
