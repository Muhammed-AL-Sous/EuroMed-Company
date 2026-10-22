// React
import { useState } from "react";

// External Library
import { Box, Card, Flex, Text } from "@radix-ui/themes";
import { Church } from "lucide-react";
import { Form } from "radix-ui";
import { notifySonner } from "../../../lib/notifySonner";

// Api Slice
import { useAddPatientMutation } from "../PatientsApiSlice";

const CreatePatientPage = () => {
  const [createForm, setCreateForm] = useState({
    name: "",
    phone: "",
    age: "",
    date_of_birth: "",
    gender: "",
  });

  const [addPatient, { isLoading: isCreating }] = useAddPatientMutation();

  const handleCreateFormChange = (event) => {
    const { name, value } = event.target;

    setCreateForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmitPatient = async (e) => {
    e.preventDefault();

    try {
      await addPatient(createForm).unwrap();

      setCreateForm({
        name: "",
        phone: "",
        age: "",
        date_of_birth: "",
        gender: "",
      });

      notifySonner("Patient Added Successfully");
    } catch (error) {
      console.error("Failed to add Patient:", error);
      notifySonner(error?.data?.message || "Failed to add Patient", "error");
    }
  };

  return (
    <div>
      {/* ============= Header ============= */}
      <div className="flex gap-4 items-center text-sky-600">
        <Church size={55} />
        <Text className="font-bold text-2xl">Create a New Patient</Text>
      </div>
      {/* ============= Section ============= */}
      <Box className="mx-auto border-none outline-none" maxWidth="900px">
        <Card variant="ghost" className="border-none outline-none">
          <Flex gap="3" direction="column">
            <img
              className="max-h-80 mx-auto"
              src="/images/create_patient.png"
            />

            <Box className="max-w-full border border-slate-200 shadow-lg rounded-2xl p-5 ">
              <Form.Root className="w-full" onSubmit={handleSubmitPatient}>
                <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* =========== Patient Name =========== */}
                  <Form.Field className="mb-2.5 grid" name="name">
                    <div className="flex flex-col">
                      <Form.Label className="text-[15px] font-medium leading-8.75 text-slate-700">
                        Patient Name
                      </Form.Label>
                      <Form.Control asChild>
                        <input
                          className="box-border h-8.75 w-full rounded bg-blackA2 px-2.5 text-[14px] leading-none text-slate-700 outline-none border-2 border-sky-700 focus:border-sky-400"
                          required
                          id="Patient-name"
                          name="name"
                          type="text"
                          value={createForm.name}
                          onChange={handleCreateFormChange}
                          disabled={isCreating}
                          placeholder="Enter Patient name"
                        />
                      </Form.Control>

                      <Form.Message
                        className="text-xs text-red-700 font-bold mt-2"
                        match="valueMissing"
                      >
                        Please Enter The Patient Name
                      </Form.Message>
                      <Form.Message
                        className="text-[13px] text-red-700 opacity-80"
                        match="typeMismatch"
                      >
                        Please Provide a Valid Patient Name
                      </Form.Message>
                    </div>
                  </Form.Field>

                  {/* =========== Patient Phone =========== */}
                  <Form.Field className="mb-2.5 grid" name="phone">
                    <div className="flex flex-col">
                      <Form.Label className="text-[15px] font-medium leading-8.75 text-slate-700">
                        Patient Phone
                      </Form.Label>
                      <Form.Control asChild>
                        <input
                          className="box-border h-8.75 w-full rounded bg-blackA2 px-2.5 text-[14px] leading-none text-slate-700 outline-none border-2 border-sky-700 focus:border-sky-400"
                          id="Patient-phone"
                          name="phone"
                          type="text"
                          value={createForm.phone}
                          onChange={handleCreateFormChange}
                          disabled={isCreating}
                          placeholder="009647 ..."
                        />
                      </Form.Control>

                      <Form.Message
                        className="text-xs text-red-700 font-bold mt-2"
                        match="valueMissing"
                      >
                        Please Enter The Patient Phone
                      </Form.Message>
                      <Form.Message
                        className="text-[13px] text-red-700 opacity-80"
                        match="typeMismatch"
                      >
                        Please Provide a Valid Patient Phone
                      </Form.Message>
                    </div>
                  </Form.Field>

                  {/* =========== Patient Age =========== */}
                  <Form.Field className="mb-2.5 grid" name="age">
                    <div className="flex flex-col">
                      <Form.Label className="text-[15px] font-medium leading-8.75 text-slate-700">
                        Patient Age
                      </Form.Label>
                      <Form.Control asChild>
                        <input
                          className="box-border h-8.75 w-full rounded bg-blackA2 px-2.5 text-[14px] leading-none text-slate-700 outline-none border-2 border-sky-700 focus:border-sky-400"
                          id="Patient-age"
                          name="age"
                          type="number"
                          value={createForm.age}
                          onChange={handleCreateFormChange}
                          disabled={isCreating}
                          placeholder="Enter Patient Age"
                          max={150}
                          min={5}
                        />
                      </Form.Control>

                      <Form.Message
                        className="text-xs text-red-700 font-bold mt-2"
                        match="valueMissing"
                      >
                        Please Enter The Patient Age
                      </Form.Message>
                      <Form.Message
                        className="text-[13px] text-red-700 opacity-80"
                        match="typeMismatch"
                      >
                        Please Provide a Valid Patient Age
                      </Form.Message>
                    </div>
                  </Form.Field>

                  {/* =========== Patient Date Of Birth =========== */}
                  <Form.Field className="mb-2.5 grid" name="date_of_birth">
                    <div className="flex flex-col">
                      <Form.Label className="text-[15px] font-medium leading-8.75 text-slate-700">
                        Patient Date Of Birth
                      </Form.Label>
                      <Form.Control asChild>
                        <input
                          className="box-border h-8.75 w-full rounded bg-blackA2 px-2.5 text-[14px] leading-none text-slate-700 outline-none border-2 border-sky-700 focus:border-sky-400"
                          id="Patient_date_of_birth"
                          name="date_of_birth"
                          type="date"
                          value={createForm.date_of_birth}
                          onChange={handleCreateFormChange}
                          disabled={isCreating}
                        />
                      </Form.Control>

                      <Form.Message
                        className="text-xs text-red-700 font-bold mt-2"
                        match="valueMissing"
                      >
                        Please Enter The Patient Date Of Birth
                      </Form.Message>
                      <Form.Message
                        className="text-[13px] text-red-700 opacity-80"
                        match="typeMismatch"
                      >
                        Please Provide a Valid Patient Date Of Birth
                      </Form.Message>
                    </div>
                  </Form.Field>

                  {/* =========== Patient Gender =========== */}
                  <Form.Field className="mb-2.5 grid" name="gender">
                    <div className="flex flex-col">
                      <Form.Label className="text-[15px] font-medium leading-8.75 text-slate-700">
                        Patient Gender
                      </Form.Label>
                      <select
                        id="Patient-gender"
                        name="gender"
                        value={createForm.gender}
                        onChange={handleCreateFormChange}
                        disabled={isCreating}
                        className="box-border h-8.75 w-full rounded px-2.5 text-[14px] leading-none text-slate-700 outline-none border-2 border-sky-700 focus:border-sky-400"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      <Form.Message
                        className="text-xs text-red-700 font-bold mt-2"
                        match="valueMissing"
                      >
                        Please Enter The Patient Gender
                      </Form.Message>
                      <Form.Message
                        className="text-[13px] text-red-700 opacity-80"
                        match="typeMismatch"
                      >
                        Please Provide a Valid Patient Gender
                      </Form.Message>
                    </div>
                  </Form.Field>
                </div>

                {/* =============== Submit Button =============== */}
                {isCreating ? (
                  <div
                    role="status"
                    aria-label="Creating Patient"
                    className="mx-auto mt-2.5 h-10 w-10 animate-spin rounded-full border-4 border-sky-200 border-t-sky-600"
                  />
                ) : (
                  <Form.Submit asChild>
                    <button
                      disabled={isCreating}
                      className="mt-4.5 cursor-pointer box-border mx-auto flex h-8.75 items-center justify-center rounded bg-white px-3.75 font-medium leading-none text-sky-700 shadow-[0_2px_10px] shadow-blackA4 hover:bg-sky-200 transition-colors focus:shadow-sky-700"
                    >
                      Create a Patient
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

export default CreatePatientPage;
