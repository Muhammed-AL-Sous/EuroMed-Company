import { Box, Card, Flex, Text } from "@radix-ui/themes";
import { Form } from "radix-ui";
import { Church, GlobeLock, Hospital, Landmark, Save } from "lucide-react";

import { useAddHospitalMutation } from "../HospitalsApiSlice";
import { notifySonner } from "../../../lib/notifySonner";
import { useState } from "react";

const INPUT_CLASS =
  "box-border w-full rounded-xl border-2 border-sky-700 " +
  "bg-slate-50 px-4 py-2.5 text-sm text-slate-700 " +
  "outline-none transition-colors " +
  "placeholder:text-slate-400 " +
  "focus:border-sky-400 focus:bg-white " +
  "disabled:cursor-not-allowed disabled:opacity-60";

const CreateHospitalPage = () => {
  const [createForm, setCreateForm] = useState({
    name: "",
    type: "Government",
    city: "",
  });

  const [addHospital, { isLoading: isCreating }] = useAddHospitalMutation();

  const handleCreateFormChange = (event) => {
    const { name, value } = event.target;

    setCreateForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmitHospital = async (e) => {
    e.preventDefault();

    try {
      await addHospital(createForm).unwrap();

      setCreateForm({
        name: "",
        type: "Government",
        city: "",
      });

      notifySonner("Hospital Added Successfully");
    } catch (error) {
      console.error("Failed to add hospital:", error);
      notifySonner(error?.data?.message || "Failed to add hospital", "error");
    }
  };

  return (
    <div>
      {/* ============= Header ============= */}
      <div className="flex gap-4 items-center text-sky-600">
        <Church size={55} />
        <Text className="font-bold text-2xl">Create a New Hospital</Text>
      </div>
      {/* ============= Section ============= */}
      <Box className="mx-auto border-none outline-none" maxWidth="900px">
        <Card variant="ghost" className="border-none outline-none">
          <Flex gap="3" direction="column">
            <img className="max-h-80 mx-auto" src="/images/hospital.png" />

            <Box className="max-w-full border border-slate-200 shadow-lg rounded-2xl p-5 ">
              <Form.Root className="w-full" onSubmit={handleSubmitHospital}>
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* =========== Hospital Name =========== */}
                  <Form.Field
                    className="grid content-start gap-1.5"
                    name="name"
                  >
                    <Form.Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Hospital size={16} />
                      Hospital Name
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
                        placeholder="Enter hospital name"
                      />
                    </Form.Control>

                    <Form.Message
                      className="text-xs text-red-700 font-bold mt-2"
                      match="valueMissing"
                    >
                      Please Enter The Hospital Name
                    </Form.Message>
                    <Form.Message
                      className="text-[13px] text-red-700 opacity-80"
                      match="typeMismatch"
                    >
                      Please Provide a Valid Hospital Name
                    </Form.Message>
                  </Form.Field>

                  {/* =========== Hospital Type =========== */}
                  <Form.Field
                    className="grid content-start gap-1.5"
                    name="type"
                  >
                    <Form.Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <GlobeLock size={16} />
                      Hospital Type
                    </Form.Label>
                    <select
                      id="hospital-type"
                      name="type"
                      value={createForm.type}
                      onChange={handleCreateFormChange}
                      disabled={isCreating}
                      className={INPUT_CLASS}
                    >
                      <option value="Government">Government</option>
                      <option value="Private">Private</option>
                    </select>
                    <Form.Message
                      className="text-xs text-red-700 font-bold mt-2"
                      match="valueMissing"
                    >
                      Please Enter The Hospital Name
                    </Form.Message>
                    <Form.Message
                      className="text-[13px] text-red-700 opacity-80"
                      match="typeMismatch"
                    >
                      Please Provide a Valid Hospital Name
                    </Form.Message>
                  </Form.Field>

                  {/* =========== Hospital City =========== */}
                  <Form.Field
                    className="grid content-start gap-1.5"
                    name="city"
                  >
                    <Form.Label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                      <Landmark size={16} />
                      Hospital City
                    </Form.Label>
                    <Form.Control asChild>
                      <input
                        className={INPUT_CLASS}
                        id="hospital-city"
                        name="city"
                        type="text"
                        value={createForm.city}
                        onChange={handleCreateFormChange}
                        disabled={isCreating}
                        placeholder="Enter Hospital City"
                        required
                      />
                    </Form.Control>

                    <Form.Message
                      className="text-xs text-red-700 font-bold mt-2"
                      match="valueMissing"
                    >
                      Please Enter The Hospital City
                    </Form.Message>
                    <Form.Message
                      className="text-[13px] text-red-700 opacity-80"
                      match="typeMismatch"
                    >
                      Please Provide a Valid Hospital City
                    </Form.Message>
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
                      Create a Hospital
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

export default CreateHospitalPage;
