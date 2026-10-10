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
import { Check, ChevronDown, LayersMinus } from "lucide-react";
import { useGetManufacturersQuery } from "../../manufacturers/ManufacturersApiSlice";
import { useGetCategoriesQuery } from "../../categories/CategoriesApiSlice";
import { useGetSubCategoriesQuery } from "../../subCategories/SubCategoriesApiSlice";

const CreateProductPage = () => {
  const [createForm, setCreateForm] = useState({
    code: "",
    name: "",
    manufacturer_id: "",
    subcategory_id: "",
    category_id: "",
    image_url: "",
    medical_usage: "",
    specifications: [
      {
        Material: "",
        Fixation: "",
        Sizes: "",
        Flexion_Range: "",
      },
    ],
    available_sizes: [],
  });

  const [errors, setErrors] = useState({});

  const [addProduct, { isLoading: isCreating }] = useAddProductMutation();

  // ==================================================
  // Subcategories
  // ==================================================

  const { data: subCategories = [] } = useGetSubCategoriesQuery();

  // ==================================================
  // categories
  // ==================================================

  const { data: categories = [] } = useGetCategoriesQuery();

  // ==================================================
  // Manufacturers
  // ==================================================

  const { data: manufacturers = [] } = useGetManufacturersQuery();

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

    try {
      await addProduct(createForm).unwrap();

      setCreateForm({
        code: "",
        name: "",
        manufacturer_id: "",
        subcategory_id: "",
        category_id: "",
        image_url: "",
        medical_usage: "",
        specifications: [
          {
            Material: "",
            Fixation: "",
            Sizes: "",
            Flexion_Range: "",
          },
        ],
        available_sizes: [],
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
        <Text className="font-bold text-2xl">Create a New Product</Text>
      </div>
      {/* ============= Section ============= */}
      <Box className="mx-auto border-none outline-none" maxWidth="900px">
        <Card variant="ghost" className="border-none outline-none">
          <Flex gap="3" direction="column">
            <img
              className="max-h-100 mx-auto"
              src="/images/create_product.png"
            />

            <Box className="max-w-full border border-slate-200 shadow-lg rounded-2xl p-5 ">
              <Form.Root className="w-full" onSubmit={handleSubmitProduct}>
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* =========== Product Code =========== */}
                  <Form.Field className="mb-2.5 grid" name="code">
                    <div className="flex flex-col">
                      <Form.Label className="text-[15px] font-medium leading-8.75 text-slate-700">
                        Product Code
                      </Form.Label>
                      <Form.Control asChild>
                        <input
                          className="box-border rounded-xl px-4 py-2 w-full bg-blackA2 text-sm leading-none text-slate-700 outline-none border-2 border-sky-700 focus:border-sky-400"
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
                    </div>
                  </Form.Field>

                  {/* =========== Product Name =========== */}
                  <Form.Field className="mb-2.5 grid" name="name">
                    <div className="flex flex-col">
                      <Form.Label className="text-[15px] font-medium leading-8.75 text-slate-700">
                        Product Name
                      </Form.Label>
                      <Form.Control asChild>
                        <input
                          className="box-border rounded-xl px-4 py-2 w-full bg-blackA2 text-sm leading-none text-slate-700 outline-none border-2 border-sky-700 focus:border-sky-400"
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
                    </div>
                  </Form.Field>

                  {/* =========== Product Manufacturer =========== */}
                  <Form.Field className="mb-2.5 grid" name="manufacturer">
                    <div className="flex flex-col">
                      <Form.Label className="text-[15px] font-medium leading-8.75 text-slate-700">
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
                                          py-2
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

                              {manufacturers.map((manufacturer) => (
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
                    </div>
                  </Form.Field>

                  {/* =========== Product SubCategory =========== */}
                  <Form.Field className="mb-2.5 grid" name="subcategory">
                    <div className="flex flex-col">
                      <Form.Label className="text-[15px] font-medium leading-8.75 text-slate-700">
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
                                          py-2
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

                              {subCategories.map((subcategory) => (
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
                    </div>
                  </Form.Field>

                  {/* =========== Product Category =========== */}
                  <Form.Field className="mb-2.5 grid" name="category">
                    <div className="flex flex-col">
                      <Form.Label className="text-[15px] font-medium leading-8.75 text-slate-700">
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
                                          py-2
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
                                <Select.ItemText>
                                  All Categories
                                </Select.ItemText>

                                <Select.ItemIndicator className="absolute right-3">
                                  <Check size={16} className="text-sky-600" />
                                </Select.ItemIndicator>
                              </Select.Item>

                              {/* <Select.Separator className="my-1.5 h-px bg-slate-100" /> */}

                              {categories.map((category) => (
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
                    </div>
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
                      className="mt-2.5 cursor-pointer box-border mx-auto flex h-8.75 items-center justify-center rounded bg-white px-3.75 font-medium leading-none text-sky-700 shadow-[0_2px_10px] shadow-blackA4 hover:bg-sky-200 transition-colors focus:shadow-sky-700"
                    >
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
