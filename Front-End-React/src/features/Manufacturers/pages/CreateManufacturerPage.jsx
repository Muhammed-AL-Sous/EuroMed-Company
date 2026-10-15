// React
import { useState } from "react";

// External Libraries
// Radix UI
import { Box, Card, Flex, Text } from "@radix-ui/themes";
import { Form } from "radix-ui";

// Lucide React Library
import { Church } from "lucide-react";

// Notify Sonner
import { notifySonner } from "../../../lib/notifySonner";

// Api Slice
import { useAddManufacturerMutation } from "../ManufacturersApiSlice";

const CreateManufacturerPage = () => {
  const [createForm, setCreateForm] = useState({
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

  return (
    <div>
      {/* ============= Header ============= */}
      <div className="flex gap-4 items-center text-sky-600">
        <Church size={55} />
        <Text className="font-bold text-2xl">Create a New Manufacturer</Text>
      </div>
      {/* ============= Section ============= */}
      <Box className="mx-auto border-none outline-none" maxWidth="900px">
        <Card variant="ghost" className="border-none outline-none">
          <Flex gap="3" direction="column">
            <img className="max-h-80 mx-auto" src="/images/Manufacturer.png" />

            <Box className="max-w-full border border-slate-200 shadow-lg rounded-2xl p-5 ">
              <Form.Root className="w-full" onSubmit={handleSubmitManufacturer}>
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* =========== Manufacturer Name =========== */}
                  <Form.Field className="mb-2.5 grid" name="name">
                    <div className="flex flex-col">
                      <Form.Label className="text-[15px] font-medium leading-8.75 text-slate-700">
                        Manufacturer Name
                      </Form.Label>
                      <Form.Control asChild>
                        <input
                          className="box-border h-8.75 w-full rounded bg-blackA2 px-2.5 text-[15px] leading-none text-slate-700 outline-none border-2 border-sky-700 focus:border-sky-400"
                          required
                          id="manufacturer-name"
                          name="name"
                          type="text"
                          value={createForm.name}
                          onChange={handleCreateFormChange}
                          disabled={isCreating}
                          placeholder="Enter manufacturer name"
                        />
                      </Form.Control>

                      <Form.Message
                        className="text-xs text-red-700 font-bold mt-2"
                        match="valueMissing"
                      >
                        Please Enter The Manufacturer Name
                      </Form.Message>
                      <Form.Message
                        className="text-[13px] text-red-700 opacity-80"
                        match="typeMismatch"
                      >
                        Please Provide a Valid Manufacturer Name
                      </Form.Message>
                    </div>
                  </Form.Field>

                  {/* =========== Manufacturer Origin =========== */}
                  <Form.Field className="mb-2.5 grid" name="origin">
                    <div className="flex flex-col">
                      <Form.Label className="text-[15px] font-medium leading-8.75 text-slate-700">
                        Manufacturer Origin
                      </Form.Label>
                      <Form.Control asChild>
                        <input
                          className="box-border h-8.75 w-full rounded px-2.5 text-[15px] leading-none text-slate-700 outline-none selection:text-slate-700 border-2 border-sky-700 focus:border-sky-400"
                          id="manufacturer-origin"
                          name="origin"
                          type="text"
                          value={createForm.origin}
                          onChange={handleCreateFormChange}
                          disabled={isCreating}
                          placeholder="Enter Manufacturer Origin"
                          required
                        />
                      </Form.Control>

                      <Form.Message
                        className="text-xs text-red-700 font-bold mt-2"
                        match="valueMissing"
                      >
                        Please Enter The Manufacturer Origin
                      </Form.Message>
                      <Form.Message
                        className="text-[13px] text-red-700 opacity-80"
                        match="typeMismatch"
                      >
                        Please Provide a Valid Manufacturer Origin
                      </Form.Message>
                    </div>
                  </Form.Field>

                  {/* =========== Manufacturer website =========== */}
                  <Form.Field className="mb-2.5 grid" name="website">
                    <div className="flex flex-col">
                      <Form.Label className="text-[15px] font-medium leading-8.75 text-slate-700">
                        Manufacturer Website
                      </Form.Label>
                      <Form.Control asChild>
                        <input
                          className="box-border h-8.75 w-full rounded px-2.5 text-[15px] leading-none text-slate-700 outline-none selection:text-slate-700 border-2 border-sky-700 focus:border-sky-400"
                          id="manufacturer-website"
                          name="website"
                          type="text"
                          value={createForm.website}
                          onChange={handleCreateFormChange}
                          disabled={isCreating}
                          placeholder="Enter Manufacturer Website"
                          required
                        />
                      </Form.Control>

                      <Form.Message
                        className="text-xs text-red-700 font-bold mt-2"
                        match="valueMissing"
                      >
                        Please Enter The Manufacturer Website
                      </Form.Message>
                      <Form.Message
                        className="text-[13px] text-red-700 opacity-80"
                        match="typeMismatch"
                      >
                        Please Provide a Valid Manufacturer Website
                      </Form.Message>
                    </div>
                  </Form.Field>

                  {/* =========== Manufacturer logo_text =========== */}
                  <Form.Field className="mb-2.5 grid" name="logo_text">
                    <div className="flex flex-col">
                      <Form.Label className="text-[15px] font-medium leading-8.75 text-slate-700">
                        Manufacturer Logo Text
                      </Form.Label>
                      <Form.Control asChild>
                        <input
                          className="box-border h-8.75 w-full rounded px-2.5 text-[15px] leading-none text-slate-700 outline-none selection:text-slate-700 border-2 border-sky-700 focus:border-sky-400"
                          id="manufacturer-logo-text"
                          name="logo_text"
                          type="text"
                          value={createForm.logo_text}
                          onChange={handleCreateFormChange}
                          disabled={isCreating}
                          placeholder="Enter Manufacturer Logo Text"
                          required
                        />
                      </Form.Control>

                      <Form.Message
                        className="text-xs text-red-700 font-bold mt-2"
                        match="valueMissing"
                      >
                        Please Enter The Manufacturer Logo Text
                      </Form.Message>
                      <Form.Message
                        className="text-[13px] text-red-700 opacity-80"
                        match="typeMismatch"
                      >
                        Please Provide a Valid Manufacturer Logo Text
                      </Form.Message>
                    </div>
                  </Form.Field>

                  {/* =========== Manufacturer Is Active =========== */}
                  <Form.Field className="mb-2.5 grid" name="is_active">
                    <div className="flex flex-col">
                      <Form.Label className="text-[15px] font-medium leading-8.75 text-slate-700">
                        Manufacturer Activity Status
                      </Form.Label>
                      <select
                        id="manufacturer-is-active"
                        name="is_active"
                        value={createForm.is_active}
                        onChange={handleCreateFormChange}
                        disabled={isCreating}
                        className="box-border h-8.75 w-full rounded px-2.5 text-[15px] leading-none text-slate-700 outline-none border-2 border-sky-700 focus:border-sky-400"
                      >
                        <option value="">Select Activity Status</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                      <Form.Message
                        className="text-xs text-red-700 font-bold mt-2"
                        match="valueMissing"
                      >
                        Please Enter The Manufacturer Activity Status
                      </Form.Message>
                      <Form.Message
                        className="text-[13px] text-red-700 opacity-80"
                        match="typeMismatch"
                      >
                        Please Provide a Valid Manufacturer Activity Status
                      </Form.Message>
                    </div>
                  </Form.Field>

                  {/* =========== Manufacturer Description =========== */}
                  <Form.Field className="mb-2.5 grid" name="description">
                    <div className="flex flex-col">
                      <Form.Label className="text-[15px] font-medium leading-8.75 text-slate-700">
                        Manufacturer Description
                      </Form.Label>
                      <Form.Control asChild>
                        <textarea
                          className="box-border h-8.75 w-full overflow-hidden rounded p-2.5 text-[15px] leading-none text-slate-700 outline-none selection:text-slate-700 border-2 border-sky-700 focus:border-sky-400"
                          id="manufacturer-description"
                          name="description"
                          value={createForm.description}
                          onChange={handleCreateFormChange}
                          disabled={isCreating}
                          placeholder="Enter Manufacturer Description"
                          required
                        />
                      </Form.Control>

                      <Form.Message
                        className="text-xs text-red-700 font-bold mt-2"
                        match="valueMissing"
                      >
                        Please Enter The Manufacturer Description
                      </Form.Message>
                      <Form.Message
                        className="text-[13px] text-red-700 opacity-80"
                        match="typeMismatch"
                      >
                        Please Provide a Valid Manufacturer Description
                      </Form.Message>
                    </div>
                  </Form.Field>
                </div>

                {/* =============== Submit Button =============== */}
                {isCreating ? (
                  <div
                    role="status"
                    aria-label="Creating manufacturer"
                    className="mx-auto mt-2.5 h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600"
                  />
                ) : (
                  <Form.Submit asChild>
                    <button
                      disabled={isCreating}
                      className="mt-4.5 cursor-pointer box-border mx-auto flex h-8.75 items-center justify-center rounded bg-white px-3.75 font-medium leading-none text-sky-700 shadow-[0_2px_10px] shadow-blackA4 hover:bg-sky-200 transition-colors focus:shadow-sky-700"
                    >
                      Create a Manufacturer
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

export default CreateManufacturerPage;
