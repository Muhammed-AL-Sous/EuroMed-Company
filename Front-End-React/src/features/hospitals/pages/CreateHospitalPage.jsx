import { Box, Card, Flex, Text } from "@radix-ui/themes";
import { Form } from "radix-ui";
import { Church } from "lucide-react";

import { useAddHospitalMutation } from "../HospitalsApiSlice";
import { notifySonner } from "../../../lib/notifySonner";
import { useState } from "react";

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
                <div className="grid grid-cols-3 gap-4">
                  {/* =========== Hospital Name =========== */}
                  <Form.Field className="mb-2.5 grid" name="name">
                    <div className="flex flex-col">
                      <Form.Label className="text-[15px] font-medium leading-8.75 text-slate-700">
                        Hospital Name
                      </Form.Label>
                      <Form.Control asChild>
                        <input
                          className="box-border h-8.75 w-full rounded bg-blackA2 px-2.5 text-[15px] leading-none text-slate-700 outline-none border-2 border-sky-700 focus:border-sky-400"
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
                    </div>
                  </Form.Field>

                  {/* =========== Hospital Type =========== */}
                  <Form.Field className="mb-2.5 grid" name="type">
                    <div className="flex flex-col">
                      <Form.Label className="text-[15px] font-medium leading-8.75 text-slate-700">
                        Hospital Type
                      </Form.Label>
                      <select
                        id="hospital-type"
                        name="type"
                        value={createForm.type}
                        onChange={handleCreateFormChange}
                        disabled={isCreating}
                        className="box-border h-8.75 w-full rounded px-2.5 text-[15px] leading-none text-slate-700 outline-none border-2 border-sky-700 focus:border-sky-400"
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
                    </div>
                  </Form.Field>

                  {/* =========== Hospital City =========== */}
                  <Form.Field className="mb-2.5 grid" name="city">
                    <div className="flex flex-col">
                      <Form.Label className="text-[15px] font-medium leading-8.75 text-slate-700">
                        Hospital City
                      </Form.Label>
                      <Form.Control asChild>
                        <input
                          className="box-border h-8.75 w-full rounded px-2.5 text-[15px] leading-none text-slate-700 outline-none selection:text-slate-700 border-2 border-sky-700 focus:border-sky-400"
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
                    </div>
                  </Form.Field>
                </div>

                {/* =============== Submit Button =============== */}
                {isCreating ? (
                  <div
                    className="h-10 w-10 animate-spin rounded-full border-4 border-sky-600 mt-2.5 cursor-pointer box-border mx-auto
                    flex items-center justify-center bg-white px-3.75 font-medium leading-none"
                  />
                ) : (
                  <Form.Submit asChild>
                    <button
                      disabled={isCreating}
                      className="mt-2.5 cursor-pointer box-border mx-auto flex h-8.75 items-center justify-center rounded bg-white px-3.75 font-medium leading-none text-sky-700 shadow-[0_2px_10px] shadow-blackA4 hover:bg-sky-200 transition-colors focus:shadow-sky-700 "
                    >
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
