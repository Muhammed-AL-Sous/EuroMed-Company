import { Box, Card, Flex, Text } from "@radix-ui/themes";
import { Form } from "radix-ui";
import { Blocks, Church, FileText, Save } from "lucide-react";

import { notifySonner } from "../../../lib/notifySonner";
import { useState } from "react";
import { useAddCategoryMutation } from "../CategoriesApiSlice";

const INPUT_CLASS =
  "box-border w-full rounded-xl border-2 border-sky-700 " +
  "bg-slate-50 px-4 py-2.5 text-sm text-slate-700 " +
  "outline-none transition-colors " +
  "placeholder:text-slate-400 " +
  "focus:border-sky-400 focus:bg-white " +
  "disabled:cursor-not-allowed disabled:opacity-60";

const CreateCategoryPage = () => {
  const [createForm, setCreateForm] = useState({
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
        name: "",
        description: "",
      });

      notifySonner("Category Added Successfully");
    } catch (error) {
      console.error("Failed to add category:", error);
      notifySonner(error?.data?.message || "Failed to add category", "error");
    }
  };

  return (
    <div>
      {/* ============= Header ============= */}
      <div className="flex gap-4 items-center text-sky-600">
        <Church size={55} />
        <Text className="font-bold text-2xl">Create a New Category</Text>
      </div>
      {/* ============= Section ============= */}
      <Box className="mx-auto border-none outline-none" maxWidth="900px">
        <Card variant="ghost" className="border-none outline-none">
          <Flex gap="3" direction="column">
            <img className="max-h-100 mx-auto" src="/images/categories.png" />

            <Box className="max-w-full border border-slate-200 shadow-lg rounded-2xl p-5 ">
              <Form.Root className="w-full" onSubmit={handleSubmitCategory}>
                <div className="mt-5 grid grid-cols-1 gap-5 border-t border-slate-100 pt-5 md:grid-cols-2">
                  {/* =========== Category Name =========== */}
                  <Form.Field
                    className="grid content-start gap-1.5"
                    name="name"
                  >
                    <Form.Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Blocks size={16} />
                      Category Name
                    </Form.Label>
                    <Form.Control asChild>
                      <input
                        className={INPUT_CLASS}
                        required
                        id="category-name"
                        name="name"
                        type="text"
                        value={createForm.name}
                        onChange={handleCreateFormChange}
                        disabled={isCreating}
                        placeholder="Enter category name"
                      />
                    </Form.Control>

                    <Form.Message
                      className="text-xs text-red-700 font-bold mt-2"
                      match="valueMissing"
                    >
                      Please Enter The Category Name
                    </Form.Message>
                    <Form.Message
                      className="text-[13px] text-red-700 opacity-80"
                      match="typeMismatch"
                    >
                      Please Provide a Valid Category Name
                    </Form.Message>
                  </Form.Field>
                  {/* =========== Category Description =========== */}
                  <Form.Field
                    className="grid content-start gap-1.5"
                    name="description"
                  >
                    <Form.Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <FileText size={16} />
                      Category Description
                    </Form.Label>
                    <Form.Control asChild>
                      <input
                        className={INPUT_CLASS}
                        id="category-description"
                        name="description"
                        type="text"
                        value={createForm.description}
                        onChange={handleCreateFormChange}
                        disabled={isCreating}
                        placeholder="Enter Category Description"
                        required
                      />
                    </Form.Control>

                    <Form.Message
                      className="text-xs text-red-700 font-bold mt-2"
                      match="valueMissing"
                    >
                      Please Enter The Category Description
                    </Form.Message>
                    <Form.Message
                      className="text-[13px] text-red-700 opacity-80"
                      match="typeMismatch"
                    >
                      Please Provide a Valid Category Description
                    </Form.Message>
                  </Form.Field>
                </div>

                {/* =============== Submit Button =============== */}
                {isCreating ? (
                  <div
                    role="status"
                    aria-label="Creating category"
                    className="mx-auto mt-2.5 h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600"
                  />
                ) : (
                  <Form.Submit asChild>
                    <button
                      disabled={isCreating}
                      className="flex mx-auto mt-4 cursor-pointer min-h-10 min-w-44 items-center justify-center gap-2 rounded-lg bg-sky-700 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Save size={18} />
                      Create a Category
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

export default CreateCategoryPage;
