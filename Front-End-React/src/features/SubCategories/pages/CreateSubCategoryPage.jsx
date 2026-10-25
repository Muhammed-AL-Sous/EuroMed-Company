import { Box, Card, Flex, Text } from "@radix-ui/themes";
import { Form } from "radix-ui";
import { Church, FileText, Box as BoxIcon, Save } from "lucide-react";

import { notifySonner } from "../../../lib/notifySonner";
import { useState } from "react";
import { useAddSubCategoryMutation } from "../SubCategoriesApiSlice";

// Utility Component
import ProductImageUpload from "../../products/components/utility/ProductImageUpload";

const INPUT_CLASS =
  "box-border w-full rounded-xl border-2 border-sky-700 " +
  "bg-slate-50 px-4 py-2.5 text-sm text-slate-700 " +
  "outline-none transition-colors " +
  "placeholder:text-slate-400 " +
  "focus:border-sky-400 focus:bg-white " +
  "disabled:cursor-not-allowed disabled:opacity-60";

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
                  showIcon={true}
                  onChange={setSubCategoryImage}
                  title="SubCategory Image"
                  subTitle="Upload an image for your SubCategory."
                />

                <div className="mt-5 grid grid-cols-1 gap-5 border-t border-slate-100 pt-5 md:grid-cols-2">
                  {/* =========== SubCategory Name =========== */}
                  <Form.Field
                    className="grid content-start gap-1.5"
                    name="name"
                  >
                    <Form.Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <BoxIcon size={16} />
                      SubCategory Name
                    </Form.Label>
                    <Form.Control asChild>
                      <input
                        className={INPUT_CLASS}
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
                  </Form.Field>
                  {/* =========== SubCategory Description =========== */}
                  <Form.Field
                    className="grid content-start gap-1.5"
                    name="description"
                  >
                    <Form.Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <FileText size={16} />
                      SubCategory Description
                    </Form.Label>
                    <Form.Control asChild>
                      <input
                        className={INPUT_CLASS}
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
                      className="flex mx-auto mt-6 cursor-pointer min-h-10 min-w-44 items-center justify-center gap-2 rounded-lg bg-sky-700 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Save size={18} />
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
