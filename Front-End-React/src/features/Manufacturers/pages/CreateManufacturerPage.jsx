// React
import { useState } from "react";

// External Libraries
// Radix UI
import { Box, Card, Flex, Text } from "@radix-ui/themes";
import { Form } from "radix-ui";

// Lucide React Library
import {
  Activity,
  BuildingComplex,
  BuildingComplexPlus,
  Church,
  FileText,
  GlobeCode,
  RobotArm,
  Save,
} from "lucide-react";

// Notify Sonner
import { notifySonner } from "../../../lib/notifySonner";

// Api Slice
import { useAddManufacturerMutation } from "../ManufacturersApiSlice";

const INPUT_CLASS =
  "box-border w-full rounded-xl border-2 border-sky-700 " +
  "bg-slate-50 px-4 py-2.5 text-sm text-slate-700 " +
  "outline-none transition-colors " +
  "placeholder:text-slate-400 " +
  "focus:border-sky-400 focus:bg-white " +
  "disabled:cursor-not-allowed disabled:opacity-60";

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
                  <Form.Field
                    className="grid content-start gap-1.5"
                    name="name"
                  >
                    <Form.Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <RobotArm size={16} />
                      Manufacturer Name
                    </Form.Label>
                    <Form.Control asChild>
                      <input
                        className={INPUT_CLASS}
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
                  </Form.Field>

                  {/* =========== Manufacturer Origin =========== */}
                  <Form.Field
                    className="grid content-start gap-1.5"
                    name="origin"
                  >
                    <Form.Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <BuildingComplexPlus size={16} />
                      Manufacturer Origin
                    </Form.Label>
                    <Form.Control asChild>
                      <input
                        className={INPUT_CLASS}
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
                  </Form.Field>

                  {/* =========== Manufacturer website =========== */}
                  <Form.Field
                    className="grid content-start gap-1.5"
                    name="website"
                  >
                    <Form.Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <GlobeCode size={16} />
                      Manufacturer Website
                    </Form.Label>
                    <Form.Control asChild>
                      <input
                        className={INPUT_CLASS}
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
                  </Form.Field>

                  {/* =========== Manufacturer logo_text =========== */}
                  <Form.Field
                    className="grid content-start gap-1.5"
                    name="logo_text"
                  >
                    <Form.Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <BuildingComplex size={16} />
                      Manufacturer Logo Text
                    </Form.Label>
                    <Form.Control asChild>
                      <input
                        className={INPUT_CLASS}
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
                  </Form.Field>

                  {/* =========== Manufacturer Is Active =========== */}
                  <Form.Field
                    className="grid content-start gap-1.5"
                    name="is_active"
                  >
                    <Form.Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Activity size={16} />
                      Manufacturer Activity Status
                    </Form.Label>
                    <select
                      id="manufacturer-is-active"
                      name="is_active"
                      value={createForm.is_active}
                      onChange={handleCreateFormChange}
                      disabled={isCreating}
                      className={INPUT_CLASS}
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
                  </Form.Field>

                  {/* =========== Manufacturer Description =========== */}
                  <Form.Field
                    className="grid content-start gap-1.5"
                    name="description"
                  >
                    <Form.Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <FileText size={16} />
                      Manufacturer Description
                    </Form.Label>
                    <Form.Control asChild>
                      <textarea
                        className="box-border w-full overflow-hidden rounded-xl px-4 py-2 text-[14px] leading-none text-slate-700 outline-none selection:text-slate-700 border-2 border-sky-700 focus:border-sky-400"
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
                      className="flex mx-auto mt-6 cursor-pointer min-h-10 min-w-44 items-center justify-center gap-2 rounded-lg bg-sky-700 px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <Save size={18} />
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
