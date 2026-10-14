import { Box, Card, Flex, Text } from "@radix-ui/themes";
import { Form } from "radix-ui";
import { Church } from "lucide-react";

import { notifySonner } from "../../../lib/notifySonner";
import { useState } from "react";
import { useAddSubCategoryMutation } from "../SubCategoriesApiSlice";

// Utility Component
import ProductImageUpload from "../../products/components/utility/ProductImageUpload";

const CreateSubCategoryPage = () => {
  const [createForm, setCreateForm] = useState({
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

  return (
    <div>
      {/* ============= Header ============= */}
      <div className="flex gap-4 items-center text-sky-600">
        <Church size={55} />
        <Text className="font-bold text-2xl">Create a New SubCategory</Text>
      </div>
      {/* ============= Section ============= */}
      <Box className="mx-auto border-none outline-none" maxWidth="900px">
        <Card variant="ghost" className="border-none outline-none">
          <Flex gap="3" direction="column">
            <img
              className="max-h-100 mx-auto"
              src="/images/subcategories.png"
            />

            <Box className="max-w-full border border-slate-200 shadow-lg rounded-2xl p-5 ">
              <Form.Root className="w-full" onSubmit={handleSubmitCategory}>
                <ProductImageUpload
                  key={imageResetKey}
                  onChange={setSubCategoryImage}
                  title="SubCategory Image"
                  subTitle="Upload an image for your SubCategory."
                />

                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                  {/* =========== SubCategory Name =========== */}
                  <Form.Field className="mb-2.5 grid" name="name">
                    <div className="flex flex-col">
                      <Form.Label className="text-[15px] font-medium leading-8.75 text-slate-700">
                        SubCategory Name
                      </Form.Label>
                      <Form.Control asChild>
                        <input
                          className="box-border h-8.75 w-full rounded bg-blackA2 px-2.5 text-[15px] leading-none text-slate-700 outline-none border-2 border-sky-700 focus:border-sky-400"
                          required
                          id="subcategory-name"
                          name="name"
                          type="text"
                          value={createForm.name}
                          onChange={handleCreateFormChange}
                          disabled={isCreating}
                          placeholder="Enter subcategory name"
                        />
                      </Form.Control>

                      <Form.Message
                        className="text-xs text-red-700 font-bold mt-2"
                        match="valueMissing"
                      >
                        Please Enter The SubCategory Name
                      </Form.Message>
                      <Form.Message
                        className="text-[13px] text-red-700 opacity-80"
                        match="typeMismatch"
                      >
                        Please Provide a Valid SubCategory Name
                      </Form.Message>
                    </div>
                  </Form.Field>
                  {/* =========== SubCategory Description =========== */}
                  <Form.Field className="mb-2.5 grid" name="description">
                    <div className="flex flex-col">
                      <Form.Label className="text-[15px] font-medium leading-8.75 text-slate-700">
                        SubCategory Description
                      </Form.Label>
                      <Form.Control asChild>
                        <input
                          className="box-border h-8.75 w-full rounded px-2.5 text-[15px] leading-none text-slate-700 outline-none selection:text-slate-700 border-2 border-sky-700 focus:border-sky-400"
                          id="subcategory-description"
                          name="description"
                          type="text"
                          value={createForm.description}
                          onChange={handleCreateFormChange}
                          disabled={isCreating}
                          placeholder="Enter SubCategory Description"
                          required
                        />
                      </Form.Control>

                      <Form.Message
                        className="text-xs text-red-700 font-bold mt-2"
                        match="valueMissing"
                      >
                        Please Enter The SubCategory Description
                      </Form.Message>
                      <Form.Message
                        className="text-[13px] text-red-700 opacity-80"
                        match="typeMismatch"
                      >
                        Please Provide a Valid SubCategory Description
                      </Form.Message>
                    </div>
                  </Form.Field>
                </div>

                {/* =============== Submit Button =============== */}
                {isCreating ? (
                  <div
                    role="status"
                    aria-label="Creating subcategory"
                    className="mx-auto mt-2.5 h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600"
                  />
                ) : (
                  <Form.Submit asChild>
                    <button
                      disabled={isCreating}
                      className="mt-4.5 cursor-pointer box-border mx-auto flex h-8.75 items-center justify-center rounded bg-white px-3.75 font-medium leading-none text-sky-700 shadow-[0_2px_10px] shadow-blackA4 hover:bg-sky-200 transition-colors focus:shadow-sky-700"
                    >
                      Create a SubCategory
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

export default CreateSubCategoryPage;
