import { Box, Card, Flex, Text } from "@radix-ui/themes";
import { Form } from "radix-ui";
import { Church } from "lucide-react";

import { notifySonner } from "../../../lib/notifySonner";
import { useState } from "react";
import { useAddCategoryMutation } from "../CategoriesApiSlice";

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
                <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
                  {/* =========== Category Name =========== */}
                  <Form.Field className="mb-2.5 grid" name="name">
                    <div className="flex flex-col">
                      <Form.Label className="text-[15px] font-medium leading-8.75 text-slate-700">
                        Category Name
                      </Form.Label>
                      <Form.Control asChild>
                        <input
                          className="box-border h-8.75 w-full rounded bg-blackA2 px-2.5 text-[15px] leading-none text-slate-700 outline-none border-2 border-sky-700 focus:border-sky-400"
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
                    </div>
                  </Form.Field>
                  {/* =========== Category Description =========== */}
                  <Form.Field className="mb-2.5 grid" name="description">
                    <div className="flex flex-col">
                      <Form.Label className="text-[15px] font-medium leading-8.75 text-slate-700">
                        Category Description
                      </Form.Label>
                      <Form.Control asChild>
                        <input
                          className="box-border h-8.75 w-full rounded px-2.5 text-[15px] leading-none text-slate-700 outline-none selection:text-slate-700 border-2 border-sky-700 focus:border-sky-400"
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
                    </div>
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
                      className="mt-4.5 cursor-pointer box-border mx-auto flex h-8.75 items-center justify-center rounded bg-white px-3.75 font-medium leading-none text-sky-700 shadow-[0_2px_10px] shadow-blackA4 hover:bg-sky-200 transition-colors focus:shadow-sky-700"
                    >
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
